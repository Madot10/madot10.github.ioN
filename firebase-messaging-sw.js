importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  'messagingSenderId': '501045137892'
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const FB_CM = firebase.messaging();

FB_CM.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  //var notificationJSON = JSON.parse(payload.data.notification);
  //payload.notification.title
  var notificationTitle =  'No no';
  //payload.notification
  var notificationOptions = {body: 'Sw trabajando'};

  return self.registration.showNotification(notificationTitle,notificationOptions); 
});

self.addEventListener('notificationclick', function(event) {
  if (!event.action) {
    // Was a normal notification click
    console.log('Notification Click.');
    return;
  }

  switch (event.action) {
    case 'like':
      console.log('User LIKES');
      break;

    case 'unsubscribe':
      console.log('User UNSUSCRIBE');
      break;

    default:
      console.log('Unknown action clicked: ', event.action);
      break;
  }
});