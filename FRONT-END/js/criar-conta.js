import { createUser } from './services.js';

const getFullName = document.getElementById('input-nome-completo');
const getSexoOptions = document.getElementsByName('user-sexo');
const getDataNasc = document.getElementById('input-data-nascimento');
const getEmail = document.getElementById('input-email');
const getPassword = document.getElementById('input-senha');
const getPasswordConfirm = document.getElementById('input-repetir-senha');
let getSexo = '';

const Form = document.getElementById('form-criar-conta');

const constraints = {
  "nome-completo": {
    presence: { allowEmpty: false, message: 'Campo obrigatório' },
    length: {
      minimum: 2,
      message: "Deve ter no mínimo 2 caracteres",
    },
  },
  "data-nascimento": {
    presence: { allowEmpty: false, message: 'Campo obrigatório' },
  },
  "email": {
    presence: { allowEmpty: false, message: 'Campo obrigatório' },
    email: { message: 'Email inválido' },
  },
  "senha": {
    presence: { allowEmpty: false, message: 'Campo obrigatório' },
    length: {
      minimum: 6,
      message: "Deve ter no mínimo 6 caracteres",
    },
  },
  "repetir-senha": {
    presence: { allowEmpty: false, message: 'Campo obrigatório' },
    equality: {
      attribute: 'password',
      message: 'As senhas devem ser iguais',
    },
  }
}

const validateForm = () => {
  const fields = {
    "nome-completo": getFullName.value,
    "data-nascimento": getDataNasc.value,
    "email": getEmail.value,
    "senha": getPassword.value,
    "repetir-senha": getPasswordConfirm.value,
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


Form.onsubmit = async (event) => {
  event.preventDefault();
  try {
    if (validateForm()) {
      getSexoOptions.forEach((s) => {
        if (s.checked) {
          getSexo = s.value;
        }
      });
      await createUser(getEmail.value, getPassword.value, getFullName.value, getSexo, getDataNasc.value);
      console.log('Usuário criado com sucesso!');
    }
  } catch (error) {
    console.log(`Error: ${error}`);
  }
}