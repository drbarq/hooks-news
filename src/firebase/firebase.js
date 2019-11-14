import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import firebaseConfig from './config'
// import 'firebaseui'
// var firebase = require('firebase');
import firebaseui from 'firebaseui'
// var firebaseui = require('firebaseui');



class Firebase {
    constructor() {
        app.initializeApp(firebaseConfig);
        this.auth = app.auth()
        // this.gAuth = app.auth()
        // this.gAuth = app.auth.GoogleAuthProvider();
        this.db = app.firestore()
        // const ui = new firebaseui.auth.AuthUI(this.auth);
    }
    async register(name, email, password) {
        const newUser = await this.auth.createUserWithEmailAndPassword(
            email,
            password
        )
        return await newUser.user.updateProfile({
            displayName: name
        })
    }      

    async googleLogin() {
        return this.auth().signInWithRedirect(this.gAuth)
    }

    async login(email, password) {
        return await this.auth.signInWithEmailAndPassword(email, password)
    }

    async logout() {
        await this.auth.signOut()
    }

    async resetPassword(email) {
        await this.auth.sendPasswordResetEmail(email)
    }

    // async uiAuth() {
    //     ui.start('#firebaseui-auth-container', {
    //         signInOptions: [
    //           {
    //             provider: firebase.auth.EmailAuthProvider.PROVIDER_ID
    //           }
    //         ],
    //         // Other config options...
    //       });
    // }

}

const firebase = new Firebase()
export default firebase