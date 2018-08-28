importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  'messagingSenderId': '501045137892'
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
    
  var notificationJSON = JSON.parse(payload.data.notification);

  var notificationTitle = notificationJSON.title;
  var notificationOptions = notificationJSON;

  return self.registration.showNotification(notificationTitle,
    notificationOptions); 
});

self.addEventListener('notificationclick', function(event) {
    console.log(event);
  event.notification.close();
    event.waitUntil(self.clients.openWindow(event.notification.data.action_click));

  //... Do your stuff here.
});