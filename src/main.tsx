import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "./App.css";
import { Provider } from "react-redux";
import { store } from "./app/store";
import Providers from "./app/provider.tsx";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from "./config/env.ts";
const CLIENT_ID = GOOGLE_CLIENT_ID;
createRoot(document.getElementById("root")!).render(
  
  <StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <Provider store={store}>
        <Providers>          
          <App />        
        </Providers>
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
