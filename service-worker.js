importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');
importScripts('./utils.js');

const { workbox } = self;
if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST ||[
    // {"revision":"a549af2a81cd9900ee897d8bc9c4b5e0","url":"templates.js"},
    // {"revision":"111","url":"styles/styles.css"},
    // {"revision":"7c33db71f543df71d2698e1caca5ec66","url":"utils.js"},
    // {"revision":"111","url":"app.js"},
  ]);


  const bgSyncPlugin = new workbox.backgroundSync.BackgroundSyncPlugin('periodic-background-sync', {
    maxRetentionTime: 6 * 1000, // Retry for max of 24 hours (specified in minutes)
  });

  // Setup a route for fetching assets
workbox.routing.registerRoute(
  ({ request }) => request.mode === 'navigate',
  new workbox.strategies.CacheFirst({
    cacheName: 'pages',
  })
);

workbox.routing.registerRoute(
  /\/api\/.*\/*.json/,
  new workbox.strategies.NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  'POST'
);


} else {
  console.log(`Boo! Workbox didn't load 😬`);
}


self.addEventListener('sync', event => {
  console.log("sync is clicked")
  if (event.tag === 'mySyncTag') {
    event.waitUntil(doSomeBackgroundSync());
  }
});
// self.addEventListener('install', (event) => {
//   console.log('Service Worker installed');
// });

// self.addEventListener('activate', (event) => {
//   console.log('Service Worker activated');
// });

// self.addEventListener('periodicsync', (event) => {
//   if (event.tag === 'content-sync') {
//     event.waitUntil(fetchAndCacheContent());
//   }
// });

// self.addEventListener('activate', (event) => {
//   event.waitUntil(
//     (async () => {
//       try {
//         // Register periodic sync
//         await self.registration.periodicSync.register(
//           'testSync',
//           { minInterval: 60 * 1000 // Minimum interval in milliseconds (1 minute)
//         });
//         console.log('Periodic Sync registered');
//       } catch (error) {
//         console.error('Periodic Sync registration failed:', error);
//       }
//     })()
//   );
// });

self.addEventListener('periodicsync', event => {
  console.log('periodic sync is clicked')
 if (event.tag === 'testSync') {
   event.waitUntil(doSomeBackgroundSync());
 }
});

async function doSomeBackgroundSync() {
  // var newsData = { "collection": "NewsData", "query": {"newsUserType.newsUserTypeName": "student", "isDeleted": 'false'}, "options": { "sort": { "$natural": -1 }, "limit": 1 } }
  var now = new Date();
  var startOfMonth = new Date(now.getFullYear(), 6, 20); // July 1st
  var endOfMonth = new Date(now.getFullYear(), 6, 25); // August 1st
  startOfMonth.setHours(0, 0, 0, 0);
  endOfMonth.setHours(0, 0, 0, 0);
  var newsData = { "collection":"NewsData","query":{"addedDate":{"$gte":{"$date":startOfMonth.toISOString()},"$lt":{"$date":endOfMonth.toISOString()}},"isDeleted":"false"},"sort":{"timeStamp":-1}}
  try {
    const response = await fetch('https://academics.cmcvellore.edu.in/api/connectApp/fetchCollectionData', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(newsData)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
   // console.log('Data synced:', data);
    if(data){
    self.registration.showNotification('New Records Available', {
      body: `You have a new record.`,
      icon: './favicon.ico', // Optional: path to notification icon
    });
  }
  } catch (error) {
    // console.error('Sync failed:', error);
  }
}


self.addEventListener('message', event => {
  const { data } = event;
  if (data && data.type === 'STORE_CREDENTIALS') {
    openDatabase().then(db => {
      const transaction = db.transaction(DB_STORE_NAME, 'readwrite');
      const store = transaction.objectStore(DB_STORE_NAME);
      const request = store.put(data);
      request.onsuccess = () => {
        console.log('Data stored successfully:');
        event.ports[0].postMessage({ success: true });
      };
      request.onerror = () => {
        console.error('Failed to store data:', request.error);
        event.ports[0].postMessage({ success: false });
      };
    }).catch(error => {
      console.error('Database open error:', error);
      event.ports[0].postMessage({ success: false });
    });
  }

  if (data && data.type === 'GET_CREDENTIALS') {
    // if (!data.id) {
    //   console.error('No id parameter provided for GET_CREDENTIALS.');
    //   event.ports[0].postMessage({ success: false });
    //   return;
    // }
    if(data.id){
    openDatabase().then(db => {
      const transaction = db.transaction(DB_STORE_NAME, 'readonly');
      const store = transaction.objectStore(DB_STORE_NAME);
      const request = store.get(data.id);
      request.onsuccess = () => {
        if(request.result !== undefined){
        request.result.success = true;
        const result = request.result || {};
        //console.log('Data retrieved successfully:',result);
          event.ports[0].postMessage(result);
        }else{
          event.ports[0].postMessage({success:false});
        }
      };
    
      request.onerror = () => {
        console.error('Failed to retrieve data:', request.error);
        event.ports[0].postMessage({ success: false });
      };

    }).catch(error => {
      console.error('Database open error:', error);
      event.ports[0].postMessage({ success: false });
    });
  }
  }
});


self.addEventListener('push', event => {
  const options = {
   // body: event.data.text(),
    body: event.data ? event.data.text() : 'No message',
    icon: './favicon.ico',
    badge: './favicon.ico',
    vibrate: [200, 100, 200],
    data: {
      url: '/link/to/open'
    }
  };
  event.waitUntil(
    self.registration.showNotification('Notification Title', options)
  );
});


if (Notification.permission === 'default') {
  Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
          new Notification('Network Status', {
              body: notificationMsg,
              icon: './favicon.ico' // Optional icon
          });
      }else {
        console.log('Notification permission denied.');
      }
   })
  }

   //Background Fetch
// self.addEventListener('backgroundfetchsuccess', event => {
//   const bgFetch = event.registration;
//   event.waitUntil(async function() {
//     const records = await bgFetch.matchAll();
//     const cache = await caches.open('bg-fetch-cache');
//     const promises = records.map(async record => {
//       const response = await record.responseReady;
//       await cache.put(record.request, response);
//     });
//     await Promise.all(promises);
//     self.registration.showNotification('Background Fetch Complete', {
//       body: `${records.length} files fetched.`,
//       icon: 'icon.png'
//     });
//   }());
// });

// self.addEventListener('backgroundfetchfail', event => {
//   self.registration.showNotification('Background Fetch Failed', {
//     body: `Failed to fetch ${event.registration.title}.`,
//     icon: 'icon.png'
//   });
// });