<script setup lang="ts">
const { state, actions } = useAccess();
const route = useRoute();
const active = computed(() => state.value.status === 'authenticating');

let resuming = false;
watch(
  [() => state.value.status, () => route.fullPath],
  () => {
    // Descope consumes its own OAuth/Magic Link parameters when the Flow mounts.
    if (
      !resuming &&
      state.value.status === 'signedOut' &&
      ('code' in route.query ||
        'descope-login-flow' in route.query ||
        't' in route.query)
    ) {
      resuming = true;
      actions.beginSignIn();
    }
  },
  { immediate: true },
);

function cancel() {
  actions.cancelSignIn();
  if (Object.keys(route.query).length)
    void navigateTo('/auth', { replace: true });
}

onBeforeRouteLeave(() => {
  if (active.value) actions.cancelSignIn();
});
</script>

<template>
  <div v-if="state.status === 'signedOut' || state.status === 'authenticating'">
    <p class="eyebrow">Tu espacio personal</p>
    <h1
      class="mt-4 text-[29px] leading-tight tracking-[-0.015em] sm:text-[32px]"
    >
      {{ active ? 'Ya casi estás dentro.' : 'Qué bueno verte.' }}
    </h1>
    <p class="mt-4 text-lg leading-relaxed">
      {{
        active
          ? 'Continúa para acceder a tu cuenta.'
          : 'Entra o crea tu cuenta para comenzar.'
      }}
    </p>

    <template v-if="state.status === 'authenticating'">
      <ClientOnly>
        <DescopeFlow :key="state.attempt" :attempt="state.attempt" />
      </ClientOnly>
      <div class="mt-6 flex justify-center">
        <button type="button" class="action-text" @click="cancel">
          Cancelar
        </button>
      </div>
    </template>
    <template v-else>
      <AppIcon name="fingerprint" class="mx-auto mt-10 mb-9 size-16" />
      <button type="button" class="action-primary" @click="actions.beginSignIn">
        <AppIcon name="arrow" class="size-5" />
        Continuar
      </button>
      <p
        v-if="state.notice"
        role="status"
        class="mt-4 text-sm leading-relaxed text-muted"
      >
        {{ state.notice }}
      </p>
    </template>

    <footer
      class="mt-10 border-t border-muted/30 pt-6 text-center text-sm text-muted"
    >
      Tu cuenta, bajo tu control.
    </footer>
  </div>
  <SessionProgress v-else />
</template>
