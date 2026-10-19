import descope, { getSdk, getSessionToken } from '@descope/vue-sdk';
import { createAccessController } from '../services/access-controller';
import { createProfileService } from '../services/profile';
import {
  AccessFailure,
  type AccessState,
  type SessionService,
} from '../types/access';
import { configurationProblem } from '../utils/configuration';
import { accessRoute } from '../utils/access-route';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig().public;
  const state = useState<AccessState>('access', () => ({ status: 'checking' }));
  const router = useRouter();
  const problem = configurationProblem(config);
  let session: SessionService | undefined;
  let unsubscribe: (() => unknown) | undefined;
  const refreshRequests = new Set<AbortController>();

  if (!problem) {
    const options = {
      projectId: config.descopeProjectId,
      baseUrl: config.descopeBaseUrl || undefined,
      autoRefresh: true,
      // Keep persistence inside the SDK. A failed logout must still reach its
      // cleanup wrapper; turn a transport failure into a failed SDK response.
      fetch: (async (input, init) => {
        const url = new URL(
          input instanceof Request ? input.url : String(input),
        );
        const logout = url.pathname.endsWith('/auth/logout');
        const isRefresh = url.pathname.endsWith('/auth/refresh');
        const abort = new AbortController();
        if (isRefresh) refreshRequests.add(abort);
        try {
          return await fetch(input, {
            ...init,
            signal: AbortSignal.any([
              abort.signal,
              AbortSignal.timeout(logout ? 8_000 : 20_000),
              ...(init?.signal ? [init.signal] : []),
            ]),
          });
        } catch (error) {
          if (logout) return Response.json({}, { status: 503 });
          throw error;
        } finally {
          refreshRequests.delete(abort);
        }
      }) satisfies typeof fetch,
    };
    nuxtApp.vueApp.use(descope, options);
    // The distributed Vue SDK resolves this tag as a Vue component at runtime.
    // Forward its attributes and events to the actual registered custom element.
    nuxtApp.vueApp.component(
      'descope-wc',
      defineComponent({
        name: 'DescopeElement',
        inheritAttrs: false,
        setup(_, { attrs, slots }) {
          return () => h('descope-wc', attrs, slots.default?.());
        },
      }),
    );

    const sdk = getSdk();
    let refreshing: Promise<string> | undefined;

    async function refresh(tryRefresh = false) {
      const result = await sdk.refresh(undefined, tryRefresh);
      if (!result.ok) {
        if (result.code === 401) {
          throw new AccessFailure(
            'Tu sesión terminó. Vuelve a entrar.',
            'unauthenticated',
          );
        }
        throw new AccessFailure(
          'No pudimos renovar tu acceso. Inténtalo de nuevo.',
          'network',
        );
      }
      return getSessionToken();
    }

    session = {
      async restore() {
        const token = getSessionToken();
        if (token && !sdk.isJwtExpired(token)) return true;
        try {
          return Boolean(await refresh(true));
        } catch (error) {
          if (
            error instanceof AccessFailure &&
            error.kind === 'unauthenticated'
          )
            return false;
          throw error;
        }
      },
      async token(forceRefresh = false) {
        const token = getSessionToken();
        if (!forceRefresh && token && !sdk.isJwtExpired(token)) return token;
        refreshing ??= refresh();
        try {
          const updated = await refreshing;
          if (!updated)
            throw new AccessFailure(
              'Tu sesión terminó. Vuelve a entrar.',
              'unauthenticated',
            );
          return updated;
        } finally {
          refreshing = undefined;
        }
      },
      async signOut() {
        for (const request of refreshRequests) request.abort();
        refreshing = undefined;
        const result = await sdk.logout();
        if (!result.ok)
          throw new AccessFailure(
            'No pudimos confirmar el cierre remoto.',
            'network',
          );
      },
    };

    unsubscribe = sdk.onIsAuthenticatedChange((authenticated) => {
      if (!authenticated && state.value.status === 'ready') {
        state.value = {
          status: 'signedOut',
          notice: 'Tu sesión terminó. Vuelve a entrar.',
        };
      }
    });
  }

  const access = createAccessController({
    state,
    session,
    profiles: session
      ? createProfileService(config.apiBaseUrl, session)
      : undefined,
    configurationProblem: problem,
  });

  // Keep state-driven navigation after hydration; middleware handles direct URLs.
  onNuxtReady(() => {
    const stop = watch(
      state,
      (value) => {
        if (value.status === 'checking') return;
        const path = accessRoute(value);
        if (router.currentRoute.value.path !== path) void router.replace(path);
      },
      { immediate: true },
    );
    void access.start();
    if (import.meta.hot)
      import.meta.hot.dispose(() => {
        stop();
        unsubscribe?.();
      });
  });

  return { provide: { access } };
});
