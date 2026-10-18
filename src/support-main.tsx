import React from "react";
import ReactDOM from "react-dom/client";
import SupportPage from "./SupportPage";
import { ShowGlitterEntry } from "./components/ShowGlitterEntry";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ShowGlitterEntry />
    <SupportPage />
  </React.StrictMode>,
);
