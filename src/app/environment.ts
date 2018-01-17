/** Shared Firebase configuration that will be used in every environment. */
export const firebaseConfig = {
  apiKey: "AIzaSyAe62ycK8poc_O3ZyZeypTXVf-en_j_vOM",
  authDomain: "angular-payload-size.firebaseapp.com",
  databaseURL: "https://angular-payload-size.firebaseio.com",
  projectId: "angular-payload-size",
  storageBucket: "angular-payload-size.appspot.com",
  messagingSenderId: "53322080268"
};

export const environment = {
  production: false,
  firebase: firebaseConfig
};
