interface PublicConfiguration {
  apiBaseUrl: string;
  descopeProjectId: string;
  descopeFlowId: string;
  descopeBaseUrl: string;
}

export function configurationProblem(
  config: PublicConfiguration,
): string | undefined {
  if (!config.descopeProjectId.trim() || !config.descopeFlowId.trim()) {
    return 'El acceso todavía no está configurado en este entorno.';
  }
  try {
    const api = new URL(config.apiBaseUrl);
    const validUrl = (url: URL) =>
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash &&
      (url.protocol === 'https:' ||
        (url.protocol === 'http:' &&
          ['localhost', '127.0.0.1'].includes(url.hostname)));
    if (!validUrl(api) || !api.pathname.endsWith('/api/v1')) {
      return 'La dirección de conexión de este entorno no es válida.';
    }
    if (config.descopeBaseUrl && !validUrl(new URL(config.descopeBaseUrl))) {
      return 'La dirección de acceso de este entorno no es válida.';
    }
  } catch {
    return 'La dirección de conexión de este entorno no es válida.';
  }
}
