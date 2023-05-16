import { app } from "./firebase-config.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { getFirestore, collection, getDocs, addDoc, query, where, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-storage.js"

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

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
      };
      await addDoc(collection(db, 'users'), userDoc);
     }

     Toastify({
      text: "Usuário criado com sucesso!",
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #06d455, #4bd17e)",
        fontFamily: ("Averia Libre", "sans-serif"),
      },

    }).showToast();

    setTimeout(() => {
      window.location.href = "./home.html"
    }, 2000); 
    return userCreate.user;
  } catch (error) {
    const errorMessage = translateError(error.code);
    Toastify({
      text: `Erro: ${errorMessage}`,
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #c60b0b, #cd3544)",
        fontFamily: ("Averia Libre", "sans-serif"),
      },

    }).showToast();
  }
};

export const login = async (email, password) => {
  try {
    const credentials = await signInWithEmailAndPassword(auth, email, password);
    window.location.href = './home.html';
    return credentials.user;
  } catch (error) {
    const errorMessage = translateError(error.code);
    Toastify({
      text: `Erro: ${errorMessage}`,
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #c60b0b, #cd3544)",
        fontFamily: ("Averia Libre", "sans-serif"),
      },

    }).showToast();
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    window.location.replace("index.html");
  } catch (error) {
    Toastify({
      text: `Erro: ${errorMessage}`,
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #c60b0b, #cd3544)",
        fontFamily: ("Averia Libre", "sans-serif"),
      },

    }).showToast();
  }
}

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    Toastify({
      text: "Email de recuperação enviado. Verifique sua caixa de entrada e spam!",
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #06d455, #4bd17e)",
        fontFamily: ("Averia Libre", "sans-serif"),
      },

    }).showToast();
  } catch (error) {
    const errorMessage = translateError(error.code);
    Toastify({
      text: `Erro: ${(error.code == 'auth/user-not-found') ? 'Email inválido' : errorMessage}`,
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #c60b0b, #cd3544)",
        fontFamily: ("Averia Libre", "sans-serif"),
      },

    }).showToast();
  }
}

/*Firestore*/
export const createVaccine = async (date, name, dose, imgUrl, nextDose, userUid) => {
  try {
    const vaccineDoc = {
      vaccine_date: date,
      vaccine_name: name,
      vaccine_dose: dose,
      vaccine_img: null,
      vaccine_next_dose: nextDose,
      user_uid: userUid,
    };

    const currentTimestamp = new Date().getTime(); //Evita que o firebase substitua a img
    const storageRef = ref(storage, `vaccine-receipts/${currentTimestamp}_${imgUrl.name}`); //Concatenar o caminho da imagem

    await uploadBytes(storageRef, imgUrl); //Upload imagem
    const getURL = await getDownloadURL(storageRef); //Pegar a URL da imagem
    vaccineDoc.vaccine_img = getURL; //Pegar o caminho da imagem

    await addDoc(collection(db, 'vaccines'), vaccineDoc);
    Toastify({
      text: "Vacina adicionada com sucesso!",
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #06d455, #4bd17e)",
        fontFamily: ("Averia Libre", "sans-serif"),
      },
  
    }).showToast();
    window.location.href = "./home.html"
  } catch(error) {
    const errorMessage = translateError(error.code);
    Toastify({
      text: `Erro: ${errorMessage}`,
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #c60b0b, #cd3544)",
        fontFamily: ("Averia Libre", "sans-serif"),
      },

    }).showToast();
  }
}

export const getVaccines = async (userUid) => {
  try {
    const vaccinesCol = collection(db, 'vaccines');
    const vaccinesSnapshot = await getDocs(query(vaccinesCol, where('user_uid', '==', userUid)));
    const vaccinesList = vaccinesSnapshot.docs.map((doc) => {
      const docId = doc.id;
      const docData = doc.data();
      return { id: docId, data: docData };
    });
    return vaccinesList;
  } catch (error) {
    const errorMessage = translateError(error.code);
    Toastify({
      text: `Erro: ${errorMessage}`,
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #c60b0b, #cd3544)",
        fontFamily: ("Averia Libre", "sans-serif"),
      },

    }).showToast();
  } 
}

export const getVaccinesByTherm = async (userUid, vaccineTherm) => {
  try {
    const vaccinesCol = collection(db, 'vaccines');
    const vaccinesSnapshot = await getDocs(query(
      vaccinesCol, 
      where('user_uid', '==', userUid), 
      where('vaccine_name', '==', vaccineTherm)
    ));
    const vaccinesList = vaccinesSnapshot.docs.map((doc) => {
      const docId = doc.id;
      const docData = doc.data();
      return { id: docId, data: docData };
    });
    return vaccinesList;
  } catch (error) {
    const errorMessage = translateError(error.code);
    Toastify({
      text: `Erro: ${errorMessage}`,
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #c60b0b, #cd3544)",
        fontFamily: ("Averia Libre", "sans-serif"),
      },

    }).showToast();
  }
}

export const getVaccineById = async (userUid, vaccineId) => {
  try {
    const vaccinesCol = collection(db, 'vaccines');
    const vaccinesSnapshot = await getDocs(query(vaccinesCol, where('user_uid', '==', userUid)));
    const vaccine = {
      id: '',
      data: {},
    };
    vaccinesSnapshot.docs.map((doc) => {
      if(doc.id === vaccineId) {
        vaccine.id = doc.id;
        vaccine.data = doc.data();
        return { id: vaccine.id, data: vaccine.data };
      }
    });
    return vaccine;
  } catch (error) {
    const errorMessage = translateError(error.code);
    Toastify({
      text: `Erro: ${errorMessage}`,
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #c60b0b, #cd3544)",
        fontFamily: ("Averia Libre", "sans-serif"),
      },

    }).showToast();
  } 
};

export const updateVaccine = async (vaccineId, vaccineData) => {
  try {
    if(vaccineData.vaccine_img) {
      const currentTimestamp = new Date().getTime();
      const storageRef = ref(storage, `vaccine-receipts/${currentTimestamp}_${vaccineData.vaccine_img.name}`);

      await uploadBytes(storageRef, vaccineData.vaccine_img);
      const getURL = await getDownloadURL(storageRef);
      vaccineData.vaccine_img = getURL;
    }
    await updateDoc(doc(db, 'vaccines', vaccineId), vaccineData);
    Toastify({
      text: "Vacina atualizada com sucesso!",
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #06d455, #4bd17e)",
        fontFamily: ("Averia Libre", "sans-serif"),
      },
  
    }).showToast();
    setTimeout(() => {
      window.location.href = "./home.html"
    }, 2000);
  } catch (error) {
    const errorMessage = translateError(error.code);
    Toastify({
      text: `Erro: ${errorMessage}`,
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #c60b0b, #cd3544)",
        fontFamily: ("Averia Libre", "sans-serif"),
      },

    }).showToast();
  }
}

/*Exceptions*/
const translateError = (error) => {
  switch (error) {
    case 'auth/email-already-in-use':
      return 'E-mail já cadastrado';

    case 'auth/wrong-password':
      const warn1 = document.querySelector('.wrong-credentials-warn');
      if(warn1 !== null) {
        warn1.setAttribute('style', 'display: block')
      }
      return 'Email e/ou senha inválidos';
    
    case 'auth/user-not-found':
      const warn2 = document.querySelector('.wrong-credentials-warn');
      if(warn2 !== null) {
        warn2.setAttribute('style', 'display: block')
      }
      return 'Email e/ou senha inválidos';

    case 'auth/too-many-requests':
      return 'Muitas tentativas de login. Tente novamente mais tarde';
    
    case 'auth/network-request-failed':
      return 'Sem conexão com a internet'; 

    case 'auth/invalid-email':
      return 'Email inválido';

    case 'storage/unknown':
      return 'Erro desconhecido. Tente novamente mais tarde.';

    case 'storage/object-not-found':
      return 'Arquivo não encontrado.';

    case 'storage/retry-limit-exceeded':
      return 'Limite de tentativas excedido. Tente novamente mais tarde.';

    case 'storage/invalid-argument':
      return 'Argumento inválido.';

    default:
      return error;
  }
}