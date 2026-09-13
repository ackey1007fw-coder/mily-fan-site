import React from "react";
import ReactDOM from "react-dom/client";
import RadioMusicPage from "./RadioMusicPage";
import "./index.css";

const root = document.getElementById("root");
if (!root) throw new Error("root element not found");

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <RadioMusicPage />
  </React.StrictMode>,
);
