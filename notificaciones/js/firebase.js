// Initialize Firebase
var config = {
    apiKey: "AIzaSyDhAF_PtrVdObuD_78Qcz2BN6Ct4XYA4dA",
    authDomain: "nplus-madot.firebaseapp.com",
    databaseURL: "https://nplus-madot.firebaseio.com",
    projectId: "nplus-madot",
    storageBucket: "nplus-madot.appspot.com",
    messagingSenderId: "501045137892"
};
firebase.initializeApp(config);
var provider = new firebase.auth.GoogleAuthProvider();

const FB_AUTH = firebase.auth();

const settings = { timestampsInSnapshots: true };
firebase.firestore().settings(settings);
const FB_DB = firebase.firestore();

//firebase.messaging().usePublicVapidKey("BEdJWE7lpN5yKFsVa-Ey6ViuyIATsGipQqQ_AaylA3MlSOvWvEUF30DYZkPD8Z8hKYYqe92tGw9S9K3LTHWuy6o");
const FB_CM = firebase.messaging();

//USER OBJECT FROM DATA-BASE
var userDB;

FB_CM.onMessage(function (payload) {
    var noti = payload.notification;
    console.log('payload', payload);

    if ('serviceWorker' in navigator) {
        //console.log("Installing");
        navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/firebase-cloud-messaging-push-scope' })
            .then(function (swReg) {
                swReg.showNotification(noti.title, noti);
                FB_CM.useServiceWorker(swReg);
            });
    }
    
    msgSnack('Nueva notificacion \n Ver en inicio');

    //console.log('Message received. ', noti);

});