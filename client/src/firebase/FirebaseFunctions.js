import firebase from 'firebase/app';
import axios from 'axios';

async function doCreateUserWithEmailAndPassword(email, password, firstName, lastName) {
  await firebase.auth().createUserWithEmailAndPassword(email, password);
  firebase.auth().currentUser.updateProfile({firstName: firstName, lastName: lastName});
}

async function doChangePassword(email, oldPassword, newPassword) {
  let credential = firebase.auth.EmailAuthProvider.credential(
    email,
    oldPassword
  );
  await firebase.auth().currentUser.reauthenticateWithCredential(credential);
  await firebase.auth().currentUser.updatePassword(newPassword);
  await doSignOut();
}

async function doSignInWithEmailAndPassword(email, password) {
  await firebase.auth().signInWithEmailAndPassword(email, password);
}

async function doPasswordReset(email) {
  await firebase.auth().sendPasswordResetEmail(email);
}

async function doPasswordUpdate(password) {
  await firebase.auth().updatePassword(password);
}

async function doSignOut() {
  await firebase.auth().signOut();
}

export {
  doCreateUserWithEmailAndPassword,
  doSignInWithEmailAndPassword,
  doPasswordReset,
  doPasswordUpdate,
  doSignOut,
  doChangePassword
};
