export class Wallet{


    constructor(name, stock = null){
        this.name = name;
        if(!stock){
            this.stock = {
                "50E" : 0,
                "20E" : 0,
                "10E" : 0,
                "5E"  : 0,
                "2E"  : 0,
                "1E"  : 0,
                "50C" : 0,
                "20C" : 0,
                "10C" : 0,
                "5C"  : 0,
                "2C"  : 0,
                "1C"  : 0,
            }
        }
        else{
            this.stock = stock;
        }
    }

    addCash(name, quantity = 1){
        this.stock[name] += quantity;
    }

    removeCash(name, quantity = 1){
        if(this.countCash(name) >= quantity){
            this.stock[name] -= quantity;
            return true;
        }
        return false;
    }

    countCash(name){
        return this.stock[name];
    }

    getAmount(){
        let amount = 0;
        for(let key in this.stock){
            amount += this.stock[key] * this.getValueFromCashName(key);
        }
        //OU
        // amount = Object.keys(this.stock).reduce((total, key) => {
        //     return total + this.stock[key] * getValueFromCashName(key);
        // }, 0)
        return amount;
    }

    getValueFromCashName(key){
        let value = 0;
        if(key.indexOf("E") >= 0){
            value = +key.replace("E","");
        }
        else if(key.indexOf("C") >= 0){
            value = +key.replace("C","") / 100;
        }
        return value;
    }

}