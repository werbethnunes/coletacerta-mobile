// Configuração necessária apenas para rodar o app no navegador (npm run web):
// o SQLite na web usa um arquivo WebAssembly (.wasm), que o Metro precisa reconhecer.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('wasm');

module.exports = config;
