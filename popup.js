document.addEventListener("DOMContentLoaded", () => {
    window.addEventListener("message", (event) => {
      if (event.data.type === "threejs-memory") {
        const memory = event.data.memory;
        document.getElementById("vertices").textContent = memory.vertices;
        document.getElementById("geometries").textContent = memory.geometries;
        document.getElementById("textures").textContent = memory.textures;
      }
    });
  
    console.log("Popup listo para recibir datos.");
});
  