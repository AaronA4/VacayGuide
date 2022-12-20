import firebase from 'firebase/app';
import axios from 'axios';

async function doCreateUserWithEmailAndPassword(email, password, firstName, lastName) {
  await firebase.auth().createUserWithEmailAndPassword(email, password);
  firebase.auth().currentUser.updateProfile({ displayName: firstName + " " + lastName });
  const formData = {
    email: email,
    password: password,
    firstName: firstName,
    lastName: lastName,
    uid: firebase.auth().currentUser.uid
  };
  await axios({
    method: 'post',
    url: 'http://localhost:3001/signup',
    data: formData
  }).catch(function (error) {
    console.log(error);
  });

}

async function doChangePassword(email, oldPassword, newPassword) {
  let credential = firebase.auth.EmailAuthProvider.credential(
    email,
    oldPassword
  );
  await firebase.auth().currentUser.reauthenticateWithCredential(credential);
  await firebase.auth().currentUser.updatePassword(newPassword);
  const formData = {
    email: email,
    oldPassword: oldPassword,
    newPassword: newPassword
  };
  await axios({
    method: 'post',
    url: 'http://localhost:3001/changeUserPW',
    data: formData
  });
  await doSignOut();
}

async function doSignInWithEmailAndPassword(email, password) {
  await firebase.auth().signInWithEmailAndPassword(email, password);
  const formData = {
    email: email,
    password: password
  };
  await axios({
    method: 'post',
    url: 'http://localhost:3001/login',
    data: formData
  }).catch(function (error) {
    if (error.response.data.error === "User not found") {
      axios({
        method: 'post',
        url: 'http://localhost:3001/signup',
        data: {
          email: firebase.auth().currentUser.email, firstName: firebase.auth().currentUser.displayName, lastName: "Unkown",
          password: password, uid: firebase.auth().currentUser.uid
        }
      });
    }
  });
}

async function doPasswordReset(email) {
  await firebase.auth().sendPasswordResetEmail(email);
}

async function doPasswordUpdate(password) {
  await firebase.auth().updatePassword(password);
}

async function doSignOut() {
  await firebase.auth().signOut();
  axios({
    method: 'get',
    url: 'http://localhost:3001/logout'
  });
}

export {
  doCreateUserWithEmailAndPassword,
  doSignInWithEmailAndPassword,
  doPasswordReset,
  doPasswordUpdate,
  doSignOut,
  doChangePassword
};
