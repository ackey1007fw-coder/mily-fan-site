import React from "react";
import ReactDOM from "react-dom/client";
import StoryPage from "./StoryPage";
import { storyBySlug } from "./data/stories";
import "./index.css";

const pathParts = window.location.pathname.split("/").filter(Boolean);
const slug = pathParts[pathParts.length - 1] ?? "";
const story = storyBySlug(slug);

if (!story) {
  throw new Error(`Story not found: ${slug}`);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StoryPage story={story} />
  </React.StrictMode>,
);
