import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Jordflix",
    short_name: "Jordflix",
    description: "Cinematic movie and series discovery with regional streaming availability.",
    start_url: "/",
    display: "standalone",
    background_color: "#080909",
    theme_color: "#ff4d30",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
