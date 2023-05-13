import { app } from "./firebase-config.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";

const auth = getAuth(app);

//Functions
export const createUser = async (email, password) => {
  try {
     const userCreate = await createUserWithEmailAndPassword(auth, email, password);
     return userCreate.user;
  } catch (error) {
    console.log(`Error ${error.code}: ${error.message}`);
  }
};

export const login = async (email, password) => {
  try {
    const credentials = await signInWithEmailAndPassword(auth, email, password);
    return credentials.user;
  } catch (error) {
    console.log(`Error ${error.code}: ${error.message}`);
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.log(`Error ${error.code}: ${error.message}`);
  }
}

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.log(`Error ${error.code}: ${error.message}`);
  }
}
