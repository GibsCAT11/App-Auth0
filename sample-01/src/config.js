import configJson from "./auth_config.json";

export function getConfig() {
  // Validación mejorada del audience
  const audience = validateAudience(configJson.audience);
  
  return {
    domain: configJson.domain,
    clientId: configJson.clientId,
    audience, // Siempre incluido (puede ser null)
    apiOrigin: configJson.apiOrigin || "http://localhost:3001", // Añadido para el API
    redirectUri: configJson.redirectUri || window.location.origin // Para redirecciones
  };
}

function validateAudience(audience) {
  if (!audience || audience === "{yourApiIdentifier}") {
    console.warn(
      "⚠️ Audience no configurado. Asegúrate de definir un valor válido en auth_config.json.\n" +
      "Guía: https://auth0.com/docs/get-started/apis"
    );
    return null;
  }
  return audience;
}