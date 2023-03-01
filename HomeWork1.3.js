class Product {
    constructor(name, price, quantity, description) {
        this.name = name || "unknown";
        this.price = price || 0;
        this.quantity = quantity || 0;
        this.description = description || '';
    } 
}

export function getProducts(str) {
let requests = str.split('&');
let result = [];
forProducts: for (let product of arr) {
    for (let query of requests) {
        let param = query.split('-');

        switch (param[0]) {
            case 'description':
            case 'name': {
                switch(param[1]) {
                    case 'contains': {
                        if (!product[param[0]].includes(param[2])) continue forProducts;
                        break;
                    }
                    case 'starts': {
                        if (!product[param[0]].startsWith(param[2])) continue forProducts;
                        break;
                    }
                    case 'ends': {
                        if (!product[param[0]].endsWith(param[2])) continue forProducts;
                        break;
                    }
                    default: throw(`Неверный критерий поиска ${param[1]}.`);
                }
                break;
            }
            case 'price':
            case 'quantity': {
                let operators = ['<', '=', '>'];
                let comparator = '', i = 0;
                while (!isFinite(param[1][i])) {
                    if (operators.includes(param[1][i])) {
                        comparator += param[1][i];
                        i++;
                    }
                    else throw(`Неверный критерий поиска ${param[1]}.`);
                }
                if (i == 0) throw(`Неверный критерий поиска ${param[1]}.`);
                let amount = param[1].slice(i);

                if (!eval(`product[param[0]] ${comparator} amount`)) continue forProducts;
                break;
            }
            default: throw(`Поля ${param[0]} нет среди свойств товара.`);
        }
    }
    result.push(product);
}
return result;
}

let arr = [new Product("apple", 60, 115, "red apples"),
new Product("chair", 150, 24, "redwood"),
new Product("table", 230, 12, "black, square form"),
new Product("pen", 15, 210, "ballpoint blue"),
new Product("cucumber", 200, 50, "long, fresh"),
new Product("hat", 302, 48, "colorful"),
new Product("book", 1050, 4, "How to Programm"),];

//console.log(getProducts("quantity->=115&name-contains-a&description-starts-red&price-<230"));
