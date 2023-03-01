export function firstToUpper(str) {
    if (str) {
        return str[0].toUpperCase() + str.slice(1).toLowerCase();
    }
    return str;
}

export function spacePlasement(str) {
    let marks = ['.', ',', '!', '?'];
    let result = '';

    let tokens = str.split(' ');
    for (let token of tokens) {
        if (token == '') continue;
        if (marks.includes(token)) result += token;
        else {
            for (let mark of marks) {
                let tokenCopy = token.toString().split(mark);
                token = tokenCopy.map((item, index, arr) => {
                    return index == (arr.length - 1) ? item : item + mark
                }).join(' ').trim()
            }
            result += (marks.some(item => token.startsWith(item)) ? '' : ' ') + token;
        }
    }
    return result.trim();
}

export function wordCount(str) {
    str = spacePlasement(str);
    let words = str.split(' ');
    return words.length;
}

export function uniqueWordCount(str) {
    //str = spacePlasement(str);
    let words = str.split(/[,.!? ]+/);
    let result = {};
    for (let word of words) {
        if (word == '') continue;
        word = word.toLowerCase();
        (word in result) ? result[word]++ : result[word] = 1; 
    }
    return new Map(Object.entries(result));
}

//let testStr = "Вот пример строки,в,которой     используются знаки препинания .После знаков должны стоять пробелы , а перед знаками их быть не должно .    Если есть лишние подряд идущие пробелы, они должны быть устранены.";
//console.log(spacePlasement(testStr));
//console.log(wordCount(testStr));
//console.log(uniqueWordCount("Текст, в котором слово текст несколько раз встречается и слово тоже"));