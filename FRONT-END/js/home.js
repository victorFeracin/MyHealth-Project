import { logout, getVaccines } from "./services.js";

const btnLogout = document.getElementById('btn-logout');
const cardContainer = document.getElementById('home-card-container');
const getSearch = document.getElementById('input-search');

let vaccines = [];

btnLogout.addEventListener('click', async () => {
  await logout();
  localStorage.removeItem('user');
});


const loadVaccines = async (user) => {
  vaccines = await getVaccines(user.uid);

  if(vaccines.length > 0) {
    vaccines.map((vaccine) => {
      cardContainer.innerHTML += `
        <a href="editar-vacina.html#${vaccine?.id}" class="card-item">
          <h1 class="card-title">${vaccine?.data?.vaccine_name}</h1>
          <div class="card-dose-info-container">
            <h3 class="card-dose-info">${(vaccine?.data?.vaccine_dose)}</h3>
          </div>
          <span class="card-date">${(vaccine?.data?.vaccine_date)?.split('-').reverse().join('/')}</span>
          <img src="${vaccine?.data?.vaccine_img}" alt="Comprovante" class="card-img">
          <span class="card-next-dose-info">${(vaccine?.data?.vaccine_next_dose != "" ? `Próxima dose em: ${(vaccine?.data?.vaccine_next_dose)?.split('-').reverse().join('/')}` : "Não há próxima dose")}</span>
        </a>
      `;
    }); 
  } else {
    cardContainer.innerHTML += `
        <h1 style="color:#2f87bd; margin:0 auto; font-size: 2rem">Nenhuma vacina cadastrada</h1>
    `;
  }
};

window.onload = async () => {
  let user = JSON.parse(localStorage.getItem('user'));
  loadVaccines(user);
}


getSearch.addEventListener('keyup', async () => {
    try {
    const search = vaccines.filter((vaccine) => {
      return vaccine.data.vaccine_name.toLowerCase().includes(getSearch.value.toLowerCase());
    });
    console.log(search.length);
    if(search.length > 0) {
      cardContainer.innerHTML = "";
      search.map((vaccine) => {
        cardContainer.innerHTML += `
          <a href="editar-vacina.html#${vaccine?.id}" class="card-item">
            <h1 class="card-title">${vaccine?.data?.vaccine_name}</h1>
            <div class="card-dose-info-container">
              <h3 class="card-dose-info">${(vaccine?.data?.vaccine_dose)}</h3>
            </div>
            <span class="card-date">${(vaccine?.data?.vaccine_date)?.split('-').reverse().join('/')}</span>
            <img src="${vaccine?.data?.vaccine_img}" alt="Comprovante" class="card-img">
            <span class="card-next-dose-info">${(vaccine?.data?.vaccine_next_dose != "" ? `Próxima dose em: ${(vaccine?.data?.vaccine_next_dose)?.split('-').reverse().join('/')}` : "Não há próxima dose")}</span>
          </a>
        `;
      });
    } else if (search.length == 0) {
      await Toastify({
        text: "Nenhuma vacina encontrada.",
        duration: 4000,
        close: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right, #c60b0b, #cd3544)",
          fontFamily: ("Averia Libre", "sans-serif"),
        },

      }).showToast()
      cardContainer.innerHTML = "";
      loadVaccines(user);
  }
  } catch (error) {
    console.log(`Error: ${error}`);
  }
});