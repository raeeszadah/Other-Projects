import { useEffect } from "react";

export default function useFonts() {
  useEffect(() => {
    const id = "respawnid-fonts";
    if (document.getElementById(id)) return;

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500;600&family=Poppins:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);
}
