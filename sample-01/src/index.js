import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Auth0Provider } from "@auth0/auth0-react";  // Keep this one
// import Auth0Provider from "@auth0/auth0-react";  // Remove this line
import history from "./utils/history";
import { getConfig } from "./config";

const onRedirectCallback = (appState) => {
  history.push(
    appState && appState.returnTo ? appState.returnTo : window.location.pathname
  );
};

// Please see https://auth0.github.io/auth0-react/interfaces/Auth0ProviderOptions.html
// for a full list of the available properties on the provider
const config = getConfig();

const providerConfig = {
  domain: config.domain,
  clientId: config.clientId,
  onRedirectCallback,
  authorizationParams: {
    redirect_uri: "http://localhost:8000",  // Cambiar la URL de redirección aquí
    ...(config.audience ? { audience: config.audience } : null),
  },
};

const root = createRoot(document.getElementById('root'));
root.render(
  <Auth0Provider 
    domain="dev-0so22k8zakpstgu7.us.auth0.com" 
    clientId="ivsurVc3T9ExvL4JLIm3l59nCfSgSR3Z" 
    onRedirectCallback={onRedirectCallback}
    {...providerConfig}  // Desestructurando providerConfig para incluir todo lo necesario
  >
    <App />
  </Auth0Provider>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
