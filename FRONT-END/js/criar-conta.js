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
  fullName: {
    presence: { allowEmpty: false, message: 'Campo obrigatório' },
    length: {
      minimum: 2,
      message: "Deve ter no mínimo 2 caracteres",
    },
  },
  dataNasc: {
    presence: { allowEmpty: false, message: 'Campo obrigatório' },
  },
  email: {
    presence: { allowEmpty: false, message: 'Campo obrigatório' },
    email: { message: 'Email inválido' },
  },
  password: {
    presence: { allowEmpty: false, message: 'Campo obrigatório' },
    length: {
      minimum: 6,
      message: "Deve ter no mínimo 6 caracteres",
    },
  },
  confirmPassword: {
    presence: { allowEmpty: false, message: 'Campo obrigatório' },
    equality: {
      attribute: 'password',
      message: 'As senhas devem ser iguais',
    },
  }
}

const validateForm = () => {
  const fields = {
    fullName: getFullName.value,
    dataNasc: getDataNasc.value,
    email: getEmail.value,
    password: getPassword.value,
    confirmPassword: getPasswordConfirm.value,
  }
  
  let errors = validate(fields, constraints);

  if (errors) {
    errors = Object.values(errors);
    errors.forEach((error) => {
      const errorMessage = error;
      console.log(errorMessage);
    });
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
