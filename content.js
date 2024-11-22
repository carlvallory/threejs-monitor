function monitorThreeJSStats() {
  if (typeof THREE !== 'undefined') {
    const renderer = THREE.WebGLRenderer.prototype;
    const originalRender = renderer.render;

    renderer.render = function (...args) {
      const memory = this.info.memory;

      chrome.runtime.sendMessage({
        type: "threejs-stats",
        vertices: memory.vertices,
        geometries: memory.geometries,
        textures: memory.textures,
      });

      return originalRender.apply(this, args);
    };

    console.log("Three.js stats monitoring enabled.");
  } else {
    console.warn("Three.js is not loaded on this page.");
  }
}

function getTabMemoryStats() {
  if (performance.memory) {
    return {
      jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
      totalJSHeapSize: performance.memory.totalJSHeapSize,
      usedJSHeapSize: performance.memory.usedJSHeapSize,
    };
  } else {
    console.warn("Performance.memory is not supported.");
    return null;
  }
}

function sendMemoryStats() {
  const memoryStats = getTabMemoryStats();
  if (memoryStats) {
    chrome.runtime.sendMessage({
      type: "tab-memory-stats",
      memoryStats,
    });
  }
}

// Configura un intervalo para enviar estadísticas periódicamente
function startPeriodicStatsSending() {
  // Enviar estadísticas cada segundo
  setInterval(() => {
    sendMemoryStats();
  }, 1000);
}

// Inicializa el monitoreo
function initializeContentScript() {
  monitorThreeJSStats(); // Inicia el monitoreo de Three.js
  startPeriodicStatsSending(); // Inicia el envío periódico de estadísticas de memoria
}

// Ejecuta la inicialización
initializeContentScript();
