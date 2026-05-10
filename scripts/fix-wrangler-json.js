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
    // It should be relative to the project root when deployed
    if (config.pages_build_output_dir) {
      config.pages_build_output_dir = 'dist/client';
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
  } catch (err) {
    console.error('[fix-wrangler-json] Error processing wrangler.json:', err);
  }
} else {
  console.log('[fix-wrangler-json] dist/client/wrangler.json not found, skipping.');
}
