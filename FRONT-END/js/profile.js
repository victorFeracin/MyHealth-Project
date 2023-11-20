import { getUser, logout, deleteVaccinesAndUser, updateUser} from './services.js';

const getFullName = document.getElementById('input-nome-completo');
const getSexoOptions = document.getElementsByName('user-sexo');
const getDataNasc = document.getElementById('input-data-nascimento');
const getEmail = document.getElementById('input-email');

const Form = document.getElementById('form-criar-conta');

const btnRemoveUser = document.getElementById('btn-remove-usuario-confirm');


let profileId

window.onload = async () => {
  const user = JSON.parse(localStorage.getItem('user'));

  //vaccine.data.vaccine_date
  const userData = await getUser(user.uid)
  console.log(userData[0].id)
  profileId = userData[0].id
  getFullName.value = userData[0].data.user_name
  getDataNasc.value = userData[0].data.user_birth
  getEmail.value = userData[0].data.user_email
  
  
  getSexoOptions.forEach((sex) => {
    if (sex.value === userData[0].data.user_sex) {
      sex.checked = true;      
    }
  });

}

const constraints = {
  "nome-completo": {
    presence: { allowEmpty: false, message: 'Nome obrigatório' },
    length: {
      minimum: 2,
      message: "Nome deve ter no mínimo 2 caracteres",
    }
  },
  "data-nascimento": {
    presence: { allowEmpty: false, message: 'Data de nascimento obrigatória' }
  },
  "email": {
    presence: { allowEmpty: false, message: 'Email obrigatório' },
    email: { message: 'Email inválido' }
  }
}

const validateForm = () => {
  const fields = {
    "nome-completo": getFullName.value,
    "data-nascimento": getDataNasc.value,
    "email": getEmail.value,
  }
  
  let errors = validate(fields, constraints);

  if (errors) {
    
    for (const id in errors) {
      const input = Form.querySelector(`[name="${id}"]`);
      Toastify({
        text: (errors[id][0]).replace(`${input.previousElementSibling.innerText} `, ""),
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
    return false;
  }
  return true;
}


Form.addEventListener('submit', async (event) => {
  event.preventDefault();
  console.log("Usuário alterado com sucesso")
  let sexo
  try {
    if (validateForm()) {
      getSexoOptions.forEach((s) => {
        if (s.checked) {
          sexo = s.value;
        }
      });      
    }
    const user = JSON.parse(localStorage.getItem('user'));

    const userDataOrganized = {
      user_birth: getDataNasc.value,
      user_email: getEmail.value,
      user_name: getFullName.value,
      user_sex: sexo,
      user_uid: user.uid,
    }

    let userDataToUpdate = JSON.stringify(userDataOrganized);
    await updateUser(profileId, userDataToUpdate)
  } catch (error) {
    console.log(`Error: ${error}`);
  }
});

btnRemoveUser.addEventListener('click', async () => {
  try {
    let user = JSON.parse(localStorage.getItem('user'));
    await deleteVaccinesAndUser(user.uid); //uid do auth passado como parametro
    closePopUp();
  } catch (error) {
    console.log(`Error: ${error}`);
  }
});