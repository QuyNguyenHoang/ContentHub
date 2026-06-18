import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import store from "./components/layouts/store/store";
import "bootstrap/dist/css/bootstrap.min.css";
import { Auth0Provider } from "@auth0/auth0-react";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <Auth0Provider
        domain="contenthub-dev.us.auth0.com"
        clientId="kneeEsmitBAiCnuL3r8brDJdm68b0lUf"
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: "ContentHub.Api",
          scope: "openid profile email"
        }}
        cacheLocation="localstorage"
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Auth0Provider>
    </Provider>
  </React.StrictMode>,
);
