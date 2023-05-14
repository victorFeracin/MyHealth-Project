import { app } from "./firebase-config.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { getFirestore, collection, getDocs, addDoc } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js';

const auth = getAuth(app);
const db = getFirestore(app);

//Functions
export const createUser = async (email, password, name, sexo, dataNasc) => {
  try {
     const userCreate = await createUserWithEmailAndPassword(auth, email, password);
     if (userCreate.user !== null) {
      const userDoc = {
        user_birth: dataNasc,
        user_email: email,
        user_name: name,
        user_sex: sexo,
        user_uid: userCreate.user.uid,
        user_vaccines: {
          vac_date: null,
          vac_dose: '',
          vac_id: '',
          vac_name: '',
          vac_url_img: '',
        }
      };
      await addDoc(collection(db, 'users'), userDoc);
     }
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
    //console.log('a: ' + db);
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

/*Firestore*/
export async function getUsers(db) {
  const usersCol = collection(db, 'users');
  const userSnapshot = await getDocs(usersCol);
  const userList = userSnapshot.docs.map(doc => doc.data());
  return userList;
}