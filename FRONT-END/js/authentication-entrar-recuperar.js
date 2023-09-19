import { app } from "./firebase-config.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";

const loading = document.getElementById('loading-screen');
const authorizedContent = document.getElementById('authorized-content');

const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  loading.style.display = 'flex';
  if (user) {
    window.location.replace("home.html");
  } else {
    loading.remove();
    authorizedContent.style.display = 'block';
  }
});
