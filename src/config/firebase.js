import firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/database';
import 'firebase/functions';

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'NAO_DISPONIVEL',
    authDomain: 'NAO_DISPONIVEL',
    databaseURL: 'NAO_DISPONIVEL',
    projectId: 'NAO_DISPONIVEL',
    storageBucket: 'NAO_DISPONIVEL',
    messagingSenderId: 'NAO_DISPONIVEL',
    appId: 'NAO_DISPONIVEL',
    measurementId: 'NAO_DISPONIVEL',
  });
}

export default firebase;
