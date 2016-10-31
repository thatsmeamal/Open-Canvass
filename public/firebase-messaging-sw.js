importScripts('https://www.gstatic.com/firebasejs/3.4.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.5.0/firebase-messaging.js');

var config = {
  apiKey: 'AIzaSyDx3CbTgmTuS7NsUA7xBNr1P-Xx_jeUOmY',
  authDomain: 'q-tracker-a2bd5.firebaseapp.com',
  databaseURL: 'https://q-tracker-a2bd5.firebaseio.com',
  storageBucket: 'q-tracker-a2bd5.appspot.com',
  messagingSenderId: '346782923209'
};
firebase.initializeApp(config);
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function() {
  const title = 'Hello World';
  const options = {
    body: payload.data.status
  };
  return self.registration.showNotification(title, options);
});
