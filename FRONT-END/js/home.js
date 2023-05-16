import { logout, getVaccines, getVaccinesByTherm } from "./services.js";

const btnLogout = document.getElementById('btn-logout');
const cardContainer = document.getElementById('home-card-container');
const getSearch = document.getElementById('input-search');

const Form = document.getElementById('search-container');

btnLogout.addEventListener('click', async () => {
  await logout();
  localStorage.removeItem('user');
});


window.onload = async () => {

  let user = JSON.parse(localStorage.getItem('user'));
  const vaccines = await getVaccines(user.uid);

  if(vaccines.length > 0) {
    vaccines.map((vaccine) => {
      cardContainer.innerHTML += `
        <a href="editar-vacina.html#${vaccine?.id}" class="card-item">
          <h1 class="card-title">${vaccine?.data?.vaccine_name}</h1>
          <div class="card-dose-info-container">
            <h3 class="card-dose-info">${(vaccine?.data?.vaccine_dose)}</h3>
          </div>
          <span class="card-date">${(vaccine?.data?.vaccine_date).split('-').reverse().join('/')}</span>
          <img src="${vaccine?.data?.vaccine_img}" alt="Comprovante" class="card-img">
          <span class="card-next-dose-info">${(vaccine?.data?.vaccine_next_dose != "" ? `Próxima dose em: ${(vaccine?.data?.vaccine_next_dose).split('-').reverse().join('/')}` : "Não há próxima dose")}</span>
        </a>
      `;
    });
    
  }
}


Form.addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    let user = JSON.parse(localStorage.getItem('user'));
    const search = await getVaccinesByTherm(user.uid, getSearch.value);
    console.log(getSearch.value);

    if(search.length > 0) {
      cardContainer.innerHTML = "";
      search.map((vaccine) => {
        cardContainer.innerHTML += `
        <a href="editar-vacina.html#${vaccine?.id}" class="card-item">
          <h1 class="card-title">${vaccine?.data?.vaccine_name}</h1>
          <div class="card-dose-info-container">
            <h3 class="card-dose-info">${(vaccine?.data?.vaccine_dose)}</h3>
          </div>
          <span class="card-date">${(vaccine?.data?.vaccine_date).split('-').reverse().join('/')}</span>
          <img src="${vaccine?.data?.vaccine_img}" alt="Comprovante" class="card-img">
          <span class="card-next-dose-info">${(vaccine?.data?.vaccine_next_dose != "" ? `Próxima dose em: ${(vaccine?.data?.vaccine_next_dose).split('-').reverse().join('/')}` : "Não há próxima dose")}</span>
        </a>
      `;
      });
    } else {
      Toastify({
        text: "Nenhuma vacina encontrada.",
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
  } catch (error) {
    console.log(`Error: ${error}`);
  }
});