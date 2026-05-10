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

    // Remove unexpected top-level fields
    const invalidTopLevelKeys = [
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
      "legacy_env"
    ];

    for (const key of invalidTopLevelKeys) {
      if (key in config) {
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
