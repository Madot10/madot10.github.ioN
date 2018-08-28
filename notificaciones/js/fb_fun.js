// Initialize Firebase - https://firebase.google.com/docs/web/setup
var config = {
  apiKey: "AIzaSyDhAF_PtrVdObuD_78Qcz2BN6Ct4XYA4dA",
    authDomain: "nplus-madot.firebaseapp.com",
    databaseURL: "https://nplus-madot.firebaseio.com",
    projectId: "nplus-madot",
    storageBucket: "nplus-madot.appspot.com",
    messagingSenderId: "501045137892"
};
firebase.initializeApp(config);
var token;
const messaging = firebase.messaging();
messaging.usePublicVapidKey("BEdJWE7lpN5yKFsVa-Ey6ViuyIATsGipQqQ_AaylA3MlSOvWvEUF30DYZkPD8Z8hKYYqe92tGw9S9K3LTHWuy6o");

function Permiso(){
  messaging.requestPermission().then(function() {
    console.log('Notification permission granted.');
    // TODO(developer): Retrieve an Instance ID token for use with FCM.
    // ...
  }).catch(function(err) {
    console.log('Unable to get permission to notify.', err);
  });  
}

function getTokenMsg(){
  messaging.getToken().then(function(currentToken) {
    if (currentToken) {
      token = currentToken;
      //sendTokenToServer(currentToken);
      //updateUIForPushEnabled(currentToken);
      console.log('Current toker', currentToken);
    } else {
      // Show permission request.
      console.log('No Instance ID token available. Request permission to generate one.');
      // Show permission UI.
      //updateUIForPushPermissionRequired();
      //setTokenSentToServer(false);
    }
  }).catch(function(err) {
    console.log('An error occurred while retrieving token. ', err);
    //showToken('Error retrieving Instance ID token. ', err);
    //setTokenSentToServer(false);
  });
}

messaging.onTokenRefresh(function() {
  messaging.getToken().then(function(refreshedToken) {
    console.log('Token refreshed.');
    // Indicate that the new Instance ID token has not yet been sent to the
    // app server.
    console.log('Token', refreshedToken);
    //setTokenSentToServer(false);
    // Send Instance ID token to app server.
    //sendTokenToServer(refreshedToken);
    // ...
  }).catch(function(err) {
    console.log('Unable to retrieve refreshed token ', err);
    //showToken('Unable to retrieve refreshed token ', err);
  });
});

messaging.onMessage(function(payload) {
  console.log('Message received. ', JSON.parse(payload.data.notification));
});

function PostTheme(topicName){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
       // Typical action to be performed when the document is ready:
       console.log("xhttp.responseText",xhttp.responseText); 
    }
};
var url = "https://iid.googleapis.com/iid/v1/"+ token + "/rel/topics/"+topicName;
xhttp.open("POST", url);
xhttp.setRequestHeader("Content-Type", "application/json");
xhttp.setRequestHeader("Authorization", "key=AAAAdKieEeQ:APA91bEDPiOmOMtrH7cdMqLQXIi9CcYX1-6yKmTkyoLkYNM6Z0fPkb9AwWLyzQvxCuhZzapIxrm7GCulTTKcv6sFZ1h6v7c7YZDmTW0RiQC9-5N1VoBpumR8M_dK3RvPQBUSW8L7rv1QNywfVhCAuDzYekQHcjDANA");
xhttp.send();
}