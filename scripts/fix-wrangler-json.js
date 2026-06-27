import fs from 'fs';
import path from 'path';

const configPath = path.resolve(process.cwd(), 'dist/client/wrangler.json');

if (fs.existsSync(configPath)) {
  try {
    const rawData = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(rawData);

    // Fix "triggers"
    if (config.triggers && Object.keys(config.triggers).length === 0) {
      delete config.triggers;
    }

    // Fix "dev"
    if (config.dev) {
      delete config.dev.enable_containers;
      delete config.dev.generate_types;
    }

    // Fix absolute path in pages_build_output_dir
    // Since this config is ALREADY inside the output directory (dist/client),
    // the path should be '.' relative to this config file.
    if (config.pages_build_output_dir) {
      config.pages_build_output_dir = '.';
    }

    // Remove unexpected top-level fields that cause validation errors on Cloudflare Pages
    const invalidTopLevelKeys = [
      "assets",
      "topLevelName",
      "jsx_factory",
      "jsx_fragment",
      "definedEnvironments",
      "ai_search_namespaces",
      "ai_search",
      "secrets_store_secrets",
      "unsafe_hello_world",
      "flagship",
      "worker_loaders",
      "ratelimits",
      "vpc_services",
      "vpc_networks",
      "python_modules",
      "configPath",
      "userConfigPath",
      "legacy_env",
      "rules",
      "cloudchamber",
      "pipelines",
      "logfwdr"
    ];

    for (const key of invalidTopLevelKeys) {
      delete config[key];
    }

    // Remove empty arrays and objects (except vars) to keep the config clean
    for (const key in config) {
      if (key === 'vars' || key === 'name' || key === 'compatibility_date' || key === 'compatibility_flags' || key === 'pages_build_output_dir') {
        continue;
      }
      if (Array.isArray(config[key]) && config[key].length === 0) {
        delete config[key];
      } else if (typeof config[key] === 'object' && config[key] !== null && Object.keys(config[key]).length === 0) {
        delete config[key];
      }
    }

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
    console.log('[fix-wrangler-json] Successfully sanitized dist/client/wrangler.json for Cloudflare Pages deployment.');

    // Ensure SSR Worker is in the right place for Cloudflare Pages
    const serverPath = path.resolve(process.cwd(), 'dist/server/server.js');
    const workerPath = path.resolve(process.cwd(), 'dist/client/_worker.js');
    
    if (fs.existsSync(serverPath)) {
      // _worker.js must route static assets to env.ASSETS (Cloudflare Pages advanced mode
      // sends ALL requests through the worker — without this, CSS/JS return HTML and the
      // page renders unstyled).
      const workerWrapper = `import ssrHandler from './server.js';
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    if (
      env.ASSETS &&
      (path.startsWith('/assets/') ||
        /\\.(ico|png|jpg|jpeg|webp|gif|svg|woff|woff2|ttf|eot|map|txt|pdf|html|xml|json|webmanifest|md)$/.test(path))
    ) {
      return env.ASSETS.fetch(request);
    }
    return ssrHandler.fetch(request, env, ctx);
  }
};
`;
      fs.writeFileSync(workerPath, workerWrapper, 'utf-8');
      console.log('[fix-wrangler-json] Successfully wrote static-asset-aware _worker.js to dist/client/_worker.js');

      // Also expose server.js at dist/client/server.js so client chunk imports
      // of the form `import ... from "../server.js"` resolve during Cloudflare's
      // Pages bundling pass (chunks live in dist/client/assets/, so ../server.js
      // resolves to dist/client/server.js).
      const serverJsClientPath = path.resolve(process.cwd(), 'dist/client/server.js');
      fs.copyFileSync(serverPath, serverJsClientPath);
      console.log('[fix-wrangler-json] Successfully copied dist/server/server.js to dist/client/server.js');
      
      // Copy server assets to client assets so the worker can find its chunks
      const serverAssetsDir = path.resolve(process.cwd(), 'dist/server/assets');
      const clientAssetsDir = path.resolve(process.cwd(), 'dist/client/assets');
      
      if (fs.existsSync(serverAssetsDir)) {
        if (!fs.existsSync(clientAssetsDir)) {
          fs.mkdirSync(clientAssetsDir, { recursive: true });
        }
        const assets = fs.readdirSync(serverAssetsDir);
        for (const asset of assets) {
          fs.copyFileSync(path.join(serverAssetsDir, asset), path.join(clientAssetsDir, asset));
        }
        console.log('[fix-wrangler-json] Successfully merged server assets into dist/client/assets');
      }
    }
  } catch (err) {
    console.error('[fix-wrangler-json] Error processing wrangler.json:', err);
  }
} else {
  console.log('[fix-wrangler-json] dist/client/wrangler.json not found, skipping.');
}
