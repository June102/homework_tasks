function addingZeros(str, n) {
    for (let i = 0; i < n; i++) {
        str = '0' + str;
    }
    return str;
}

function equalizing(a, b) { 
    a = String(a);
    b = String(b);

    if (a.length > b.length) {
        b = addingZeros(b, a.length - b.length);
    } else if (a.length < b.length) {
        a = addingZeros(a, b.length - a.length);
    }
    return [a, b];
}

function firstBigger(a, b) {
    a = String(a);
    b = String(b);

    if (a.length < b.length) {
        return false;
    } else if (a.length > b.length) {
        return true;
    } else {
        for (let i = 0; i < a.length; i++) {
            if (+a[i] > +b[i]) return true;
            if (+a[i] < +b[i]) return false;
        }
        return true;
    }
}

export function add(a, b) {
    let minus = false;
    if (a[0] == '-' && b[0] == '-') {
        minus = true;
        a = a.slice(1);
        b = b.slice(1);
    } else if (a[0] == '-') {
        a = a.slice(1);
        return sub(b, a);
    } else if (b[0] == '-') {
        b = b.slice(1);
        return sub(a, b);
    }

    [a, b] = equalizing(a, b);

    let result = '';
    let accum = 0;
    for (let i = 1; i < a.length + 1; i++) {
        let sum = +a.at(-i) + +b.at(-i) + accum;
        result = String(sum).slice(-1) + result;
        accum = sum >= 10 ? 1 : 0;
    }
    if (accum != 0) result = String(accum) + result;
    if (minus) result = '-' + result;
    return result;
}

export function sub(a, b) {
    a = String(a);
    b = String(b);

    let minus = false;
    if (a[0] == '-' && b[0] == '-') {
        minus = false;
        a = a.slice(1);
        b = b.slice(1);
    } else if (a[0] == '-') {
        a = a.slice(1);
        return add(a, b);
    } else if (b[0] == '-') {
        b = b.slice(1);
        return add(a, b);
    }

    if (firstBigger(a, b)) {
        [a, b] = equalizing(a, b);
        minus = false;
    } else {
        [b, a] = equalizing(a, b);
        minus = true;
    }

    let result = '';
    let accum = 0;
    for (let i = 1; i < a.length + 1; i++) {
        let aDigit = +a.at(-i);
        let bDigit = +b.at(-i);

        let sum = aDigit - bDigit - accum;
        accum = sum < 0 ? 1 : 0;
        sum += (aDigit < (bDigit + accum)) ? 10 : 0;
        result = String(sum).slice(-1) + result;
    }

    while (result[0] == '0' && result.length != 1) result = result.slice(1);
    if (minus) result = '-' + result;
    return result;
}

export function mul (a, b) {
    let minus = false;
    if (a[0] == '-' && b[0] == '-') {
        a = a.slice(1);
        b = b.slice(1);
    } else if (a[0] == '-') {
        a = a.slice(1);
        minus = true;
    } else if (b[0] == '-') {
        b = b.slice(1);
        minus = true;
    }

    [a, b] = equalizing(a, b);
    
    if (a.length == 1) {
        //console.log(+a * +b);
        return String(+a * +b);
    }
    
    if (a.length % 2 != 0) {
        a = '0' + a;
        b = '0' + b;
    }

    let halfLength = a.length / 2;
    let power = '0'.repeat(halfLength);
    let aFirstHalf = a.slice(0, halfLength)
    let aLastHalf = a.slice(halfLength)
    let bFirstHalf = b.slice(0, halfLength)
    let bLastHalf = b.slice(halfLength)
    let firstHalfMul = mul(aFirstHalf, bFirstHalf);
    let lastHalfMul = mul(aLastHalf, bLastHalf);
    let halfSumMul = mul(add(aFirstHalf, aLastHalf), add(bFirstHalf, bLastHalf))
    let result = add(add(firstHalfMul + power.repeat(2), (sub(sub(halfSumMul, firstHalfMul), lastHalfMul)) + power), + lastHalfMul);
    while (result[0] == '0' || result[0] == 'N') result = result.slice(1);
    if (minus) result = '-' + result;
    return result;
}

export function div(a, b) {
    a = String(a);
    b = String(b);

    let minus = false;
    if (a[0] == '-' && b[0] == '-') {
        a = a.slice(1);
        b = b.slice(1);
    } else if (a[0] == '-') {
        a = a.slice(1);
        minus = true;
    } else if (b[0] == '-') {
        b = b.slice(1);
        minus = true;
    }

    if (firstBigger(b, a)) throw ("Делитель больше делимого, результат не может быть целым числом.");
    if (b == '0') throw ("Делитель равен 0.");

    let result = '';
    let i = 1;
    while (sub(a.slice(0, i), b)[0] == '-') i++;
    
    let numer = a.slice(0, i);
    while (i <= a.length) {
        let count = -1;
        let temp = numer;
        while(temp[0] != '-') {
            numer = temp;
            count++;
            temp = sub(numer, b);
        }

        result += count;
        numer += a[i++]; 
    }

    if (minus) result = '-' + result;
    return result;
}

//console.log(add("7983577598237509273059298347502798357759823750927305929834750279835345234952394529345238721948571908745082345234523452345234523452934570293452345234577598237509273052345345345929834750279835775982375092730592983475079835775982375092730592983475027983577598237509273059298347502798353452349523945293452387219485719087450823452345234523452345234529345702934523452345775982375092730523453453459298347502798357759823750927305929834750","92385482375823598236459872635923854823758235982364598726359238548237582323412345293457293745092734509273405972923453872430918723545983452435729752934579238475928345245734523645987268983592385482375823598236459872639"));

//console.log(sub(325, 355));

//console.log(mul(5, 356));

//console.log(div(125, 5));