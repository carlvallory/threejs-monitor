chrome.devtools.panels.create(
    "Three.js Monitor", // Título de la pestaña
    "icon48.png",       // Icono de la pestaña
    "panel.html",       // Página HTML que se carga en la pestaña
    function (panel) {
      console.log("Panel de Three.js Memory Monitor creado.");
    }
  );
  