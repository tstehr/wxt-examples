import { defineConfig } from "wxt";
import { Plugin } from 'vite';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    web_accessible_resources: [
      {
        resources: ["injected.js"],
        matches: ["*://*/*"],
      },
    ],
  },
  webExt: {
    startUrls: ["https://wxt.dev"],
  },
  vite: () => ({
    plugins: [wrapInIIFE('injected.js')]
  })
});


function wrapInIIFE(targetFileName: string): Plugin {
  return {
    name: 'wrap-injected-in-iife',
    generateBundle(_, bundle) {
      for (const [fileName, chunkInfo] of Object.entries(bundle)) {
        if (fileName === targetFileName && chunkInfo.type === 'chunk' && 'code' in chunkInfo) {
          chunkInfo.code = `(function(){\n${chunkInfo.code}\n})();`;
        }
      }
    }
  };
}