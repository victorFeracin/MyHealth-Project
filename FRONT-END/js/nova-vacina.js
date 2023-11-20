import { logout, createVaccine } from './services.js';

const getDataVacina = document.getElementById('input-data-vacina');
const getName = document.getElementById('input-nome-vacina');
const getDoseOptions = document.getElementsByName('dose-vacina');
const getImgUrl = document.getElementById('img-vacina');
const getNextVacina = document.getElementById('input-next-vacina');
let getDose = "";

const btnLogout = document.getElementById('btn-logout');
const getImgContainer = document.querySelector('.img-comprovante');
const btnVoltar = document.getElementById('btn-voltar');

const Form = document.getElementById('form-nova-vacina');

validate.extend(validate.validators.datetime, {
  parse: function (value) {
    return new Date(value);
  },
  format: function (value) {
    return value.toISOString();
  },
});

btnLogout.addEventListener('click', async () => {
  await logout();
  localStorage.removeItem('user');
});

btnVoltar.addEventListener('click', async () => {
  window.location.replace("home.html");
});

getDoseOptions.forEach((dose) => {
  dose.addEventListener('change', () => {
    if (dose.value === "Dose única") {
      getNextVacina.disabled = true;
      getNextVacina.value = "";
    } else {
      getNextVacina.disabled = false;
    }
  });
});

getImgUrl.addEventListener('change', () => {
  if (getImgUrl.files[0].type.startsWith('image/')) {
    getImgContainer.innerHTML = "";
    let img = document.createElement('img');
    img.src = URL.createObjectURL(getImgUrl.files[0]);
    img.alt = "Comprovante";
    getImgContainer.appendChild(img);
  } else {
    Toastify({
      text: "Formato de arquivo inválido. Insira uma imagem.",
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #c60b0b, #cd3544)",
        fontFamily: ("Averia Libre", "sans-serif"),
      },

    }).showToast();;
  }
});

let currentDate = new Date();
currentDate.setDate(currentDate.getDate() - 1);

const constraints = {
  "data-vacina": {
    presence: { allowEmpty: false, message: 'Data de vacina obrigatória' },
    datetime: {
      earliest: currentDate,
      message: 'não pode ser menor que a data atual',
    },
  },
  "nome-vacina": {
    presence: { allowEmpty: false, message: 'Nome de vacina obrigatório' },
  },
  "comprovante-vacina": {
    presence: { allowEmpty: false, message: 'Comprovante de vacina obrigatório' },
  },
  "next-vacina": {
    presence: { allowEmpty: true },
  }
}

const validateForm = () => {
  const fields = {
    "data-vacina": getDataVacina.value,
    "nome-vacina": getName.value,
    "comprovante-vacina": getImgUrl.value,
    "next-vacina": getNextVacina.value,
  }

  let errors = validate(fields, constraints);

  if(errors) {
    for(const id in errors) {
      const input = Form.querySelector(`[name="${id}"]`);
      (input.name !== 'comprovante-vacina' ?
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

      }).showToast()
      :
      Toastify({
        text: (errors[id][0]).replace('Comprovante vacina ', ""),
        duration: 3000,
        close: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right, #c60b0b, #cd3544)",
          fontFamily: ("Averia Libre", "sans-serif"),
        },

      }).showToast()
      );
    }
    return false;
  }
  return true;
}

Form.addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    if (validateForm()) {
      getDoseOptions.forEach((d) => {
        if (d.checked) {
          getDose = d.value;
        }
      });
      if(getNextVacina.value !== "") {
        if(getNextVacina.value >= getDataVacina.value) {
          let user = JSON.parse(localStorage.getItem('user'));
          await createVaccine(getDataVacina.value, getName.value, getDose,getImgUrl.files[0], getNextVacina.value, user.uid);
        } else {
          Toastify({
            text: 'Data da próxima vacina não pode ser anterior à data da vacinação',
            duration: 3000,
            close: true,
            gravity: "bottom",
            position: "right",
            stopOnFocus: true,
            style: {
              background: "linear-gradient(to right, #c60b0b, #cd3544)",
              fontFamily: ("Averia Libre", "sans-serif"),
            },
    
          }).showToast()
        }
      } else {
        let user = JSON.parse(localStorage.getItem('user'));
        await createVaccine(getDataVacina.value, getName.value, getDose,getImgUrl.files[0], getNextVacina.value, user.uid);
      }
    }
  } catch (error) {
    console.log(`Error: ${error}`);
  }
});