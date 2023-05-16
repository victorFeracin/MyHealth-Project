import { resetPassword } from './services.js';

const getEmail = document.getElementById('input-email-redefinir');

const Form = document.getElementById('form-redefinir');

Form.addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    await resetPassword(getEmail.value);
    localStorage.removeItem('user');
  } catch (error) {
    console.log(`Error: ${error}`);
  }
});