// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0LQ1T4PezunPfZD33LvhWzvhmqWXhFAk",
  authDomain: "adu-service.firebaseapp.com",
  projectId: "adu-service",
  storageBucket: "adu-service.appspot.com",
  messagingSenderId: "945616878232",
  appId: "1:945616878232:web:b7a3000f030c4b30816eed",
  measurementId: "G-QFC2RCMTVC"
};

// Initialize Firebase
initializeApp(firebaseConfig);

//fireauth
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
const auth = getAuth();

//firestore
import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore";
const db = getFirestore();

//other stuff
import { Organization, UserInfo } from "../interfaces";
import { personConverter } from "./converters";

/*
<authentication>
signInWithFirebase, signUpWithFirebase, signOutWithFirebase
getUser, reloadAuth
*/
export async function signInWithFirebase(
  email: string,
  password: string,
  successFunc: (user: UserInfo) => void,
  failFunc: (error: any) => void,
) {
  await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      //console.log("success ->", user);
      successFunc({
        uid: user.uid,
        email: email,
        username: user.displayName || "",  //username never is undefined or null, ""
        emailVerified: user.emailVerified,
        isAnonymous: user.isAnonymous,
        phoneNumber: user.phoneNumber || undefined,
        photoURL: user.photoURL || undefined
      })
    })
    .catch((error) => {
      //https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#signinwithemailandpassword
      /*
      Error Codes
        auth/invalid-email
          Thrown if the email address is not valid.
        auth/user-disabled
          Thrown if the user corresponding to the given email has been disabled.
        auth/user-not-found
          Thrown if there is no user corresponding to the given email.
        auth/wrong-password
          Thrown if the password is invalid for the given email, or the account corresponding to the email does not have a password set.
      */

      failFunc(error);
    });
}
export async function signUpWithFirebase(
  email: string,
  password: string,
  username: string,
  phoneNumber: string | undefined,
  successFunc: (user: UserInfo) => void,
  failFunc: (error: any) => void
) {
  await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      successFunc({
        uid: user.uid,
        email,
        username: username,
        emailVerified: user.emailVerified,
        isAnonymous: user.isAnonymous,
        phoneNumber: phoneNumber,
        photoURL: user.photoURL || undefined,
      });
    })
    .catch((error) => {
      /*
      Error Codes
        auth/email-already-in-use
          Thrown if there already exists an account with the given email address.
        auth/invalid-email
          Thrown if the email address is not valid.
        auth/operation-not-allowed
          Thrown if email/password accounts are not enabled. Enable email/password accounts in the Firebase Console, under the Auth tab.
        auth/weak-password
          Thrown if the password is not strong enough.
      */
      failFunc(error);
    });

}
export async function signOutWithFirebase(
  successFunc?: () => void
) {
  signOut(auth).then(() => {
    // Sign-out successful.
    if (successFunc) successFunc();
  }).catch((error) => {
    // An error happened.
    //there is no error code...
    //https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#signout
  });
}
export async function getUser() {
  try {
    if (auth.currentUser) {
      return auth.currentUser;
    } else {
      throw new Error("no account");
    }
  } catch (e) {
    //debug
    //console.log("getUser -> catch -> ", e);
    throw e;
  }

}
export async function reloadAuth(
  successFunc: (user: User) => void,
  failFunc: () => void
) {
  await onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      successFunc(user);
    } else {
      // User is signed out
      failFunc();
    }
  });
}

/*
<firestore>
newOrganization, getOrganizations
newPerson, updatePerson, getPerson, findPersonUsingUsername, findPersonUsingEmail
newProject,
*/
const ORGANIZATIONS = "organizations";
const PEOPLE = "people";
const PROJECTS = "projects";
export async function newOrganization(
  org: Organization
) {
  await setDoc(doc(db, ORGANIZATIONS, org.uuid), org);
}
export async function getOrganizations(userUid: string) {
  
}
export async function newPerson(
  user: UserInfo
) {
  await setDoc(doc(db, PEOPLE, user.uid), user);
}
export async function getPerson(
  uid: string,
) {
  const docRef = doc(db, PEOPLE, uid).withConverter(personConverter);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    //console.log("Document data:", docSnap.data());
    return docSnap.data();
  } else {
  }

}
export async function findPersonUsingUsername(username: string) {
  let exist = false;
  const q = query(collection(db, PEOPLE), where("username", "==", username));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    exist = true;
  }

  /* const querySnapshot = await getDocs(collection(db, "cities"));
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
  }); */

  return exist;
}
export async function findPersonUsingEmail(email: string) {
  let exist = false;
  const q = query(collection(db, PEOPLE), where("email", "==", email));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    exist = true;
  }

  /* const querySnapshot = await getDocs(collection(db, "cities"));
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
  }); */

  return exist;
}
export async function newProject() {
  await setDoc(doc(db, PROJECTS, "LA"), {
    name: "Los Angeles",
    state: "CA",
    country: "USA"
  });
}