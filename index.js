import { registerRootComponent } from 'expo';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import App from './App';

if (global.ErrorUtils) {
  const origHandler = global.ErrorUtils.getGlobalHandler();
  global.ErrorUtils.setGlobalHandler((error, isFatal) => {
    console.error('=== JS RUNTIME ERROR ===\n', error?.message || error, '\nStack:\n', error?.stack);
    if (origHandler) origHandler(error, isFatal);
  });
}

const RootApp = () => (
  <SafeAreaProvider>
    <App />
  </SafeAreaProvider>
);

registerRootComponent(RootApp);
