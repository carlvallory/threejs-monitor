let latestMemoryStats = null;

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

    console.error("Unhandled message type:", message.type);
    return false;
});
