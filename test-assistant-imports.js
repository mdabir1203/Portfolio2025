const { loadAssistantRuntime } = require('./src/server/assistantRuntime.cjs');

loadAssistantRuntime()
  .then(() => {
    console.log('✓ Assistant runtime loaded successfully');
    process.exit(0);
  })
  .catch((e) => {
    console.error('✗ Error loading assistant runtime:', e.message);
    console.error(e.stack);
    process.exit(1);
  });
