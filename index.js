import { Caisse } from "./classes/Caisse";


const caisse = new Caisse();

// const scanArticleButton = document.getElementById('scanArticleButton');
scanArticleButton.onclick = caisse.scanArticle;

// const proceedPaymentButton = document.getElementById('proceedPaymentButton');
proceedPaymentButton.onclick = caisse.unlockPayment;

