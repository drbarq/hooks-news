const functions = require('firebase-functions');
const admin = require('firebase-admin')
// const firebaseConfig = require('./config')
// const {LINKS_PER_PAGE} = require('../src/utils')
const LINKS_PER_PAGE = 5

// import { LINKS_PER_PAGE } from '../src/utils';
// cant use es6 language

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://udemy-hooks.firebaseio.com'
})

const db = admin.firestore()

exports.linksPagination = functions.https.onRequest((request, response) => {
    response.set('Access-Control-Allow-Origin', "*")             //CORS routing
    let linksRef = db.collection('links')
    const offset = Number(request.query.offset)
    linksRef
        .orderBy('created', 'desc')
        .limit(LINKS_PER_PAGE)
        .offset(offset)
        .get()
        .then(snapshot => {
            const links = snapshot.docs.map(doc => {
                return { id: doc.id, ...doc.data() }
            })
            response.json(links)
        })
});




// https://firebase.google.com/docs/functions/linksPagination?







// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });