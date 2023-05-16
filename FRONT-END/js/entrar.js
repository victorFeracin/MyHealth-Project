import { login } from './services.js';

const getEmail = document.getElementById('input-email-entrar');
const getPassword = document.getElementById('input-senha-entrar');

const Form = document.getElementById('form-entrar');

const constraints = {
  "email": {
    presence: { allowEmpty: false, message: 'Campo obrigatório' },
  },
  "senha": {
    presence: { allowEmpty: false, message: 'Campo obrigatório' },
  }
}

const validateForm = () => {
  const fields = {
    "email": getEmail.value,
    "senha": getPassword.value,
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
  try {
    if (validateForm()) {
      const userData = JSON.stringify(await login(getEmail.value, getPassword.value));
      localStorage.setItem('user', userData);
    }
  } catch (error) {
    console.log(`Error: ${error}`);
  }
});