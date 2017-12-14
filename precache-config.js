var SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');


module.exports = {
    navigateFallback: '/index.html',
    navigateFallbackWhitelist: [/^(?!\/__)/], // <-- necessary for Firebase OAuth
    stripPrefix: 'src',
    root: 'src/',
    plugins: [
        new SWPrecacheWebpackPlugin({
          cacheId: 'firestarter',
          filename: 'service-worker.js',
          staticFileGlobs: [
            'src/index.html',
            'src/**.js',
            'src/**.css'
          ],
          stripPrefix: 'src/assets/', // stripPrefixMulti is also supported
          mergeStaticsConfig: true        
        })
      ]
  };
  