import fs from "fs";
import path from "path";

// 导入模块
function importModule(dir, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(dir, filename);
    // 动态导入模块
    try {
      const importedModule = require(filePath);
      resolve(importedModule.default);
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
