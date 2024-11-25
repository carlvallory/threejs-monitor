let latestMemoryStats = null;
let threeJSStats = null;
let unusedMaterials = { count: 0, list: [] };
let unusedGeometries = { count: 0, list: [] };
let shaderUniforms = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "get-ram-usage") {
      try {
        chrome.system.memory.getInfo((memoryInfo) => {
          const total = memoryInfo.capacity;
          const available = memoryInfo.availableCapacity;
          const used = total - available;

          sendResponse({
            total,
            available,
            used,
          });
        });
      } catch (error) {
        console.error("Error handling get-ram-usage:", error.message);
      }
      return true; // Keeps the message channel open for async response
    }

    if (message.type === "get-threejs-stats") {
      try {
        sendResponse({
          vertices: Math.floor(Math.random() * 10000),
          geometries: Math.floor(Math.random() * 5000),
          textures: Math.floor(Math.random() * 2000),
        });
      } catch (error) {
        console.error("Error handling get-threejs-stats:", error.message);
      }
      return true;
    }

    if (message.type === "tab-memory-stats") {
      try {
        latestMemoryStats = message.memoryStats;
        sendResponse({ status: "success" });
      } catch (error) {
        console.error("Error handling tab-memory-stats:", error.message);
      }
      return true;
    }

    if (message.type === "get-tab-memory-stats") {
      try {
        // Simulación de datos de memoria del tab
        sendResponse({
          jsHeapSizeLimit: 2147483648, // 2 GB simulados
          totalJSHeapSize: 1048576000, // 1 GB simulados
          usedJSHeapSize: 524288000,   // 500 MB simulados
        });
      } catch (error) {
        console.error("Error handling get-tab-memory-stats:", error.message);
      }
      return true;
    }
    
    if (message.type === "unused-materials") {
      try {
        unusedMaterials = { count: message.count, list: message.unusedMaterials },

        console.log("[Background] Unused materials:", message.unusedMaterials);
      } catch (error) {
        console.error("Error handling unused-materials:", error.message);
      }
    }

    if (message.type === "unused-geometries") {
      try {
        unusedGeometries = { count: message.count, list: message.unusedGeometries };
        console.log("[Background] Unused geometries:", message.unusedGeometries);
      } catch (error) {
        console.error("Error handling unused-geometries:", error.message);
      }
    }

    if (message.type === "shader-uniforms") {
      try {
        shaderUniforms = message.uniforms;
        console.log("[Background] Shader uniforms:", message.uniforms);
      } catch (error) {
        console.error("Error handling shader-uniforms:", error.message);
      }
    }

    if (message.type === "get-debug-stats") {
      sendResponse({
        threeJSStats,
        latestMemoryStats,
        unusedMaterials,
        unusedGeometries,
        shaderUniforms,
      });
      return true; // Permite respuestas asíncronas
    }
 
    console.error("[Background] Unhandled message type:", message.type);
    return false;
});
