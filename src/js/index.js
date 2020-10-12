import _ from 'lodash';

const WORDS = [
    'Aire',
    'Atmosfera',
    'Biodiversidad',
    'Biosfera',
    'Clima',
    'Dioxido de carbono',
    'Ecosistemas',
    'Estratosfera',
    'Exosfera',
    'Hidrosfera',
    'Lagos',
    'Litosfera',
    'Mesosfera',
    'Oceanos',
    'Oxigeno',
    'Ozono',
    'Rios',
    'Termosfera',
    'Troposfera',
    'Vida'
];

const MAX_COLUMN_SIZE = 25;
const MAX_ROW_SIZE = 20;

const TABLE = document.querySelector('.soup_table');
const WORD_LIST = document.querySelector('.word_list');

const generateEmptyTable = () => {
    TABLE.innerHTML = '';
    for (let i of _.range(1, MAX_ROW_SIZE+1)) {
        for (let j of _.range(1, MAX_COLUMN_SIZE + 1)) {
            TABLE.innerHTML += `<div class="row${i} col${j}">${i};${j}</div>`
        }
    }
};

const isLeftToRightAvailable = (row, from, to) => {
    for (let i = from; i <= to; i++) {
        let cell = document.querySelector('.row' + row + '.col' + i);
        if (cell.classList.contains('marked')) {
            return false;
        }
    }
    return true;
};

const isUpToDownAvailable = (column, from, to) => {
    for (let i = from; i <= to; i++) {
        let cell = document.querySelector('.row' + i + '.col' + column);
        if (cell.classList.contains('marked')) {
            return false;
        }
    }
    return true;
};

const setWordLeftToRight = word => {
    let minimunSize = MAX_COLUMN_SIZE - word.length + 1;
    
    let column, row;
    do {
        column = _.random(1, minimunSize);
        row = _.random(1, MAX_ROW_SIZE);
    } while (!isLeftToRightAvailable(row, column, column + word.length-1));

    // console.log("Encontrado hueco para " + word + " en: (" + row + ", " + column + ")");
    for (let i = 0; i < word.length; i++) {
        let cell = document.querySelector('.row' + row + '.col' + (column + i));
        cell.textContent = word[i];
        cell.classList.add('marked');
    }
};

const setWordUpToDown = word => {
    let minimunSize = MAX_ROW_SIZE - word.length + 1;
    
    let column, row;
    do {
        column = _.random(1, MAX_COLUMN_SIZE);
        row = _.random(1, minimunSize);
    } while (!isUpToDownAvailable(column, row, row + word.length-1));

    // console.log("Encontrado hueco para " + word + " en: (" + row + ", " + column + ")");
    for (let i = 0; i < word.length; i++) {
        let cell = document.querySelector('.row' + (row + i) + '.col' + column);
        cell.textContent = word[i];
        cell.classList.add('marked');
    }
};

const setWordsIntoTable = () => {
    for (const word of WORDS) {
        const orientation = _.random(1,2);
        const formatedWord = word.replace(/\s/g, '').toUpperCase();
        if (orientation == 1) {
            setWordLeftToRight(formatedWord);
        } else {
            setWordUpToDown(formatedWord);
        }
    }
};

const setRandomOnLeftCells = () => {
    for (let i of _.range(1, MAX_ROW_SIZE + 1)) {
        for (let j of _.range(1, MAX_COLUMN_SIZE + 1)) {
            let cell = document.querySelector('.row' + i + ".col" + j);
            if (!cell.classList.contains('marked')) {
                cell.textContent = String.fromCharCode(_.random(65, 90));
            }
        }
    }
}

const removeMarkedClass = () => {
    let cells = document.querySelectorAll('.marked');
    for (let cell of cells) {
        cell.classList.remove('marked');
    }
}

const loadWordList = () => {
    WORD_LIST.innerHTML = '';
    for (let i in WORDS) {
        WORD_LIST.innerHTML += `<li id="word${i}">${WORDS[i]}</li>`;
    }
}

const loadTable = () => {
    generateEmptyTable();
    setWordsIntoTable();
    setRandomOnLeftCells();
    removeMarkedClass();
}

document.querySelector('#generate_button').addEventListener('click', loadTable);

loadTable();

loadWordList();