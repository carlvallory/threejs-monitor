// Function to convert bytes to MB
const toMB = (bytes) => (bytes / (1024 * 1024)).toFixed(2);

// Function to update Three.js stats
function updateThreeJSStats() {
    try {
      chrome.runtime.sendMessage({ type: "get-threejs-stats" }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error fetching Three.js stats:", chrome.runtime.lastError.message);
          return;
        }
  
        if (response) {
          document.getElementById("vertices").textContent = response.vertices || 0;
          document.getElementById("geometries").textContent = response.geometries || 0;
          document.getElementById("textures").textContent = response.textures || 0;
        } else {
          console.error("No response for Three.js stats.");
        }
      });
    } catch (error) {
      console.log(error.message)
    }
}
  

// Function to update RAM usage stats
function updateRAMUsage() {
    try {
        chrome.runtime.sendMessage({ type: "get-ram-usage" }, (response) => {
            if (chrome.runtime.lastError) {
            console.error("Error fetching RAM usage:", chrome.runtime.lastError.message);
            return;
            }

            if (response) {
            document.getElementById("total-ram").textContent = `${toMB(response.total)} MB`;
            document.getElementById("used-ram").textContent = `${toMB(response.used)} MB`;
            document.getElementById("available-ram").textContent = `${toMB(response.available)} MB`;
            } else {
            console.error("No response for RAM stats.");
            }
        });
    } catch (error) {
      console.log(error.message)
    }
}

function updateTabMemoryStats() {
    try {
      chrome.runtime.sendMessage({ type: "get-tab-memory-stats" }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error fetching tab memory stats:", chrome.runtime.lastError.message);
          return;
        }
  
        if (response) {
          document.getElementById("used-js-heap").textContent = `${(response.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`;
          document.getElementById("total-js-heap").textContent = `${(response.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`;
          document.getElementById("js-heap-limit").textContent = `${(response.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`;
        } else {
          console.error("No response for tab memory stats.");
        }
      });
    } catch (error) {
        console.log(error.message);
    }
}
  

// Update stats every second
function updateStats() {
  updateThreeJSStats();
  updateRAMUsage();
  updateTabMemoryStats();
}

function initializePanel() {
    // Initialize updates
    updateStats();
    setInterval(updateStats, 1000);
}

window.onload = () => {
    console.log("[Panel] Panel script loaded.");
    initializePanel();
  };