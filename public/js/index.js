/* eslint-disable*/

//import '@babel/polyfill';
import 'core-js';
//import 'regenerator-runtime';
import { login } from './login';
import { displayMap } from './mapbox';
import { logout } from './login';
import { updateData } from './updateSettings';
import { bookTour } from './stripe';

const mapBox = document.getElementById('map');
const formLogin = document.querySelector('.form--login');
const logoutBtn = document.getElementById('logoutBtn');
const saveDataBtn = document.getElementById('saveDataBtn');
const formPassword = document.querySelector('.form-user-settings');
const bookTourBtn = document.getElementById('book-tour');

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (formLogin) {
  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

if (saveDataBtn) {
  saveDataBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.querySelector('#name.form__input').value);
    form.append('email', document.querySelector('#email.form__input').value);
    form.append('photo', document.getElementById('photo').files[0]);
    updateData(form, 'data');
  });
}
if (formPassword) {
  formPassword.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-pass').vis = 'Updating...';
    document.querySelector('.btn--save-pass').disabled = true;
    const passwordCurrent = document.getElementById('password-current').value;
    const passwordNew = document.getElementById('password').value;
    const passwordNewConfirm =
      document.getElementById('password-confirm').value;
    await updateData(
      { passwordCurrent, passwordNew, passwordNewConfirm },
      'password',
    );
    document.querySelector('.btn--save-pass').textContent = 'Save password';
    document.querySelector('.btn--save-pass').disabled = false;
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (bookTourBtn) {
  bookTourBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}
