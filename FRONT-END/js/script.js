/*POPUP*/
const popUpContainer = document.getElementById('remove-vacina-popup-container');

console.log(popUpContainer);

const openPopUp = () => {
  popUpContainer.style.display = 'block';
}

const closePopUp = () => {
  popUpContainer.style.display = 'none';
}

const deleteVacina = () => {
  closePopUp();
}