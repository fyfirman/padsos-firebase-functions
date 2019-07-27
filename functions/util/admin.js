// Initialize firebase admin
const admin = require('firebase-admin');
var serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://padsos.firebaseio.com'
});

const db = admin.firestore();

module.exports = { admin, db };
