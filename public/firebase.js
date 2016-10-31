var config = {
  apiKey: 'AIzaSyDx3CbTgmTuS7NsUA7xBNr1P-Xx_jeUOmY',
  authDomain: 'q-tracker-a2bd5.firebaseapp.com',
  databaseURL: 'https://q-tracker-a2bd5.firebaseio.com',
  storageBucket: 'q-tracker-a2bd5.appspot.com',
  messagingSenderId: '346782923209'
};
firebase.initializeApp(config);

const messaging = firebase.messaging();

messaging.requestPermission()
.then(function() {
  console.log('Have permission');
  return messaging.getToken();
})
.then(function(token) {
  console.log("FCM TOKEN -->",token);
  $.cookie("token", token);
})
.catch(function(err) {
  console.log('ERROR',err);
})

messaging.onMessage(function(payload) {
  console.log('onMessage: ',payload);
})
