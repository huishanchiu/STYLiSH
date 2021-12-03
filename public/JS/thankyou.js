import { fbLogin } from './base.js';

const orderNumber = document.getElementById('number');
// 拿到網址參數
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const number = urlParams.get('number');

orderNumber.textContent = number;
fbLogin();
