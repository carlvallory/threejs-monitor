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

// Detectar materiales no usados en la escena
function findUnusedMaterials(scene) {
  const usedMaterials = new Set();

  scene.traverse((object) => {
    if (object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach((mat) => usedMaterials.add(mat));
      } else {
        usedMaterials.add(object.material);
      }
    }
  });

  const allMaterials = Object.values(THREE.Material.prototype);
  const unusedMaterials = allMaterials.filter((mat) => !usedMaterials.has(mat));

  chrome.runtime.sendMessage({
    type: "unused-materials",
    count: unusedMaterials.length,
    unusedMaterials,
  });
}

// Detectar geometrías no usadas en la escena
function findUnusedGeometries(scene) {
  const usedGeometries = new Set();

  scene.traverse((object) => {
    if (object.geometry) {
      usedGeometries.add(object.geometry);
    }
  });

  const allGeometries = Object.values(THREE.BufferGeometry.prototype);
  const unusedGeometries = allGeometries.filter((geom) => !usedGeometries.has(geom));

  chrome.runtime.sendMessage({
    type: "unused-geometries",
    count: unusedGeometries.length,
    unusedGeometries,
  });
}

// Monitorear uniformes de shaders
function monitorShaderUniforms(renderer) {
  const originalCompile = THREE.WebGLRenderer.prototype.compile;

  THREE.WebGLRenderer.prototype.compile = function (scene, camera) {
    scene.traverse((object) => {
      if (object.material && object.material.uniforms) {
        chrome.runtime.sendMessage({
          type: "shader-uniforms",
          uniforms: object.material.uniforms,
        });
      }
    });

    originalCompile.call(this, scene, camera);
  };
}

// Inicializar el monitoreo
function initializeContentScript() {
  monitorThreeJSStats(); // Monitorear estadísticas de Three.js
  setInterval(sendMemoryStats, 1000); // Enviar estadísticas de memoria periódicamente

  // Monitorear información de debugging si la escena está disponible
  if (typeof scene !== "undefined") {
    setInterval(() => {
      findUnusedMaterials(scene);
      findUnusedGeometries(scene);
    }, 5000);
  }

  if (typeof renderer !== "undefined") {
    monitorShaderUniforms(renderer);
  }
}

initializeContentScript();