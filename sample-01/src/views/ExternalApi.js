import React, { useState } from "react";
import { Button, Alert } from "reactstrap";
import Highlight from "../components/Highlight";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";
import Loading from "../components/Loading";

export const ExternalApiComponent = () => {
  const { apiOrigin = "http://localhost:3001", audience } = getConfig();

  const [state, setState] = useState({
    showResult: false,
    apiMessage: "",
    error: null,
  });

  const { 
    getAccessTokenSilently, 
    loginWithPopup, 
    getAccessTokenWithPopup 
  } = useAuth0();

  // Función optimizada para manejar tokens
  const handleToken = async () => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: audience, // Asegura que el audience esté incluido
          scope: "read:data", // Agrega los scopes necesarios
        },
      });
      return token;
    } catch (error) {
      if (error.error === "consent_required") {
        await getAccessTokenWithPopup({
          authorizationParams: { audience }
        });
        return await handleToken(); // Reintentar después del consentimiento
      }
      throw error;
    }
  };

  const callApi = async () => {
    try {
      const token = await handleToken(); // Usa la función optimizada

      const response = await fetch(`${apiOrigin}/api/external`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      setState({
        showResult: true,
        apiMessage: await response.json(),
        error: null,
      });
    } catch (error) {
      setState({
        ...state,
        error: error.error || "api_error",
      });
    }
  };

  return (
    <>
      <div className="mb-5">
        {state.error === "consent_required" && (
          <Alert color="warning">
            You need to{" "}
            <a
              href="#/"
              className="alert-link"
              onClick={(e) => {
                e.preventDefault();
                getAccessTokenWithPopup({ authorizationParams: { audience } })
                  .then(callApi);
              }}
            >
              consent to get access to users api
            </a>
          </Alert>
        )}

        {state.error === "login_required" && (
          <Alert color="warning">
            You need to{" "}
            <a
              href="#/"
              className="alert-link"
              onClick={(e) => {
                e.preventDefault();
                loginWithPopup().then(callApi);
              }}
            >
              log in again
            </a>
          </Alert>
        )}

        <h1>External API</h1>
        <Button
          color="primary"
          className="mt-5"
          onClick={callApi}
          disabled={!audience}
        >
          Ping API
        </Button>

        {state.showResult && (
          <div className="result-block">
            <h6 className="muted">Result</h6>
            <Highlight>
              <span>{JSON.stringify(state.apiMessage, null, 2)}</span>
            </Highlight>
          </div>
        )}
      </div>
    </>
  );
};

export default withAuthenticationRequired(ExternalApiComponent, {
  onRedirecting: () => <Loading />,
});