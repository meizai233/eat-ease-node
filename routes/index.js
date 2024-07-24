const fs = require("fs");
const path = require("path"); // 感觉这个模块应该暴露出所有routes 集中暴露

// 导入模块
function importModule(dir, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(dir, filename);
    // 动态导入模块
    try {
      const importedModule = require(filePath);
      resolve(importedModule);
    } catch (err) {
      reject(err);
    }
  });
}

const currentDir = __dirname;
const routes = {};

async function loadModules() {
  try {
    const files = fs.readdirSync(currentDir);
    for (const file of files) {
      if (file !== path.basename(__filename)) {
        const variableName = path.parse(file).name;
        const module = await importModule(currentDir, file);
        routes[variableName] = module;
        console.log(`Imported ${file} as ${variableName}`);
      }
    }
  } catch (err) {
    console.error("Error loading modules:", err);
  }
}

loadModules();

export default routes;
