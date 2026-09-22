
1. git clone 
2. cd home
3. npm install
4. git checkout test_cmc_main
5. npx serve -p 3000
6. http://localhost:3000/


# Generate the VAPID Keys for enable push notification in chrome developer tools

npx web-push generate-vapid-keys

# Generate workbox-config.js

npm install workbox-cli --global
workbox wizard
## Select the root folder by default
## for this question 
## Please enter the search parameter(s) that you would like to ignore (separated by comma): utm_

 workbox generateSW workbox-config.js 

 # To inject the workbox-config.js to sw.js --> use the name self.__WB_MANIFEST to replace the files
 workbox injectManifest workbox-config.js

## Reference
## App manifest and generating icons

* https://tools.crawlink.com/tools/pwa-icon-generator/
* https://app-manifest.firebaseapp.com/
* https://www.simicart.com/manifest-generator.html/

## Caching strategies

There are several Google Workbox caching strategies available: https://developer.chrome.com/docs/workbox/caching-strategies-overview/#caching-strategies

### Pre-caching

https://developer.chrome.com/docs/workbox/modules/workbox-precaching/

A good idea is to pre-cache certain files that are guarantee to keep working for a long time:
* Fonts
* Logo
* Some big fixed hero images on (blog / news) detail pages

### Runtime-caching

* https://developer.chrome.com/docs/workbox/modules/workbox-strategies/

## PWA install prompt

* https://web.dev/customize-install/#in-app-flow
* https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeinstallprompt_event