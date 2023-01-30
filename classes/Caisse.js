import { Wallet } from "./Wallet";

export class Caisse {
  constructor() {
    const cashFundInitializer = {
      "50E": 0,
      "20E": 5,
      "10E": 5,
      "5E": 5,
      "2E": 10,
      "1E": 10,
      "50C": 20,
      "20C": 30,
      "10C": 50,
      "5C": 50,
      "2C": 50,
      "1C": 50,
    };
    this.cashFund = new Wallet("cashFund", cashFundInitializer);
    this.cashPaid = new Wallet("cashPaid");
    this.cashBack = new Wallet("cashBack");

    this.articleCounter = 0;
    this.amountToPay = 0;

    this.amountAlreadyPaid = 0;
    this.amountNeedToPay = 0;

    this.amountToRefund = 0;
  }

  scanArticle = (event) => {
    console.log("scanArticle");
    /* Probabilité sur le prix :
     * [1c .. 1€[ -> 20%
     * [1€ .. 5€[ -> 40%
     * [5€ .. 10€[ -> 30%
     * [10€ .. 50€[ -> 10%
     */
    let aleatoire = this.getRandomNumber(0, 100);
    let price = 0;
    if (aleatoire < 10) {
      price = this.getRandomPrice(10, 50);
    } else if (aleatoire < 30) {
      price = this.getRandomPrice(0.01, 1);
    } else if (aleatoire < 60) {
      price = this.getRandomPrice(5, 10);
    } else {
      price = this.getRandomPrice(1, 5);
    }
    this.amountToPay += price;
    //UI
    amountToPayLabel.innerText = this.amountToPay.toFixed(2);
    articleCounterLabel.innerText = ++this.articleCounter;
  };

  unlockPayment = (event) => {
    console.log("unlockPayment");
    scanArticleButton.disabled = proceedPaymentButton.disabled = true;
    document.querySelectorAll(".btn-cash").forEach((btn) => {
      btn.disabled = false;
      btn.onclick = (evt) => {
        this.addCashToCashPaid(evt.target.name);
      };
    });
  };

  addCashToCashPaid(name) {
    this.cashPaid.addCash(name);
    this.cashFund.addCash(name);
    this.amountAlreadyPaid = this.cashPaid.getAmount();
    this.amountNeedToPay = this.amountToPay - this.amountAlreadyPaid;
    //UI
    amountNeedToPayLabel.innerText = this.amountNeedToPay.toFixed(2);
    amountAlreadyPaidLabel.innerText = this.amountAlreadyPaid.toFixed(2);
    
    if (this.amountNeedToPay <= 0) {
      document.querySelectorAll(".btn-cash").forEach((btn) => {
        btn.disabled = true;
        btn.onclick = null;
      });
      this.proceedCashback();
    }
  }

  proceedCashback() {
    console.log("proceedCashBack");
    this.amountToRefund = Math.abs(this.amountNeedToPay);
    let keyIndice = 0;
    let key = "50E";
    let devCpt = 0;
    while (this.amountToRefund > 0) {
      if (!this.addCashToCashBack(key)) {
        const keys = ["50E","20E", "10E", "5E", "2E", "1E", "50C", "20C", "10C", "5C", "2C", "1C"]
        key = keys[keyIndice++];
        if (!key) {
          alert("Fond de caisse insufissant !");
          break;
        }
      }
      if(devCpt++ > 100){
        break;
      }
    }
    this.displayCashBack();
  }

  addCashToCashBack(name) {
    let value = this.cashFund.getValueFromCashName(name);
    let flag = false;
    while (this.amountToRefund >= value && this.cashFund.removeCash(name)) {
      this.amountToRefund = +(this.amountToRefund - value).toFixed(2); //To avoid imprecise calculations
      this.cashBack.addCash(name);
      flag = true;
    }
    return flag;
  }

  displayCashBack() {
    let keyIndice = 0;
    let key = "50E";
    let devCpt = 0;
    const handleInterval = setInterval(() => {
      while (this.cashBack.stock[key] == 0) {
        const keys = ["50E","20E", "10E", "5E", "2E", "1E", "50C", "20C", "10C", "5C", "2C", "1C"]
        key = keys[keyIndice++];
        if (!key) {
          clearInterval(handleInterval);
          break;
        }
      }
      this.cashBack.stock[key]--;
      let template = document.querySelector(
        `#cashBackTemplates div[data-name="${key}"]`
      );
      let elementToAdd = template.cloneNode(true);
      document.getElementById("cashBackContainer").append(elementToAdd);
      if(devCpt++ > 100){
        clearInterval(handleInterval);
      }
    }, 750);
  }

  //TOOLS
  getRandomPrice = (min, max) => {
    return this.getRandomNumber(min, max, 2);
    return +(Math.random() * (max - min) + min).toFixed(2);
  };
  getRandomNumber = (min, max, precision = 0) => {
    return +(Math.random() * (max - min) + min).toFixed(precision);
  };
}
