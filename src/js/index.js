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
            TABLE.innerHTML += `<div data-row="${i}" data-col="${j}" class="row${i} col${j}">${i};${j}</div>`
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

const loadTableEvents = () => {
    document.querySelectorAll('.soup_table div').forEach (e => {
        e.addEventListener('click', checkWord);
    });
};

const getFormedWord = (from, to) => {
    if (from.dataset.row != to.dataset.row && from.dataset.col != to.dataset.col) {
        alert('La eleccion no es valida');
    }

    let word = '';
    let wordCells = [];

    if (from.dataset.row == to.dataset.row && parseInt(from.dataset.col) < parseInt(to.dataset.col)) {
        for (let i = parseInt(from.dataset.col); i <= parseInt(to.dataset.col); i++) {
            const cell = document.querySelector('.row' + parseInt(from.dataset.row) + '.col' + i);
            word += cell.textContent;
            wordCells.push(cell);
        }
    }

    if (from.dataset.col == to.dataset.col && parseInt(from.dataset.row) < parseInt(to.dataset.row)) {
        for (let i = parseInt(from.dataset.row); i <= parseInt(to.dataset.row); i++) {
            const cell = document.querySelector('.row' + i + '.col' + parseInt(from.dataset.col));
            word += cell.textContent;
            wordCells.push(cell);
        }
    }

    return {
        "word": word,
        "wordCells": wordCells
    };
};

const checkWord = e => {
    let checked = document.querySelectorAll('.soup_table div.checked');
    if (checked.length === 0) {
        e.target.classList.add('checked');
    } else if (checked.length === 1) {
        const wordJSON = getFormedWord(checked[0], e.target);
        const formatedWords = WORDS.map(e => {
            return e.replace(/\s/g, '').toUpperCase();
        });
        if (formatedWords.includes(wordJSON.word)) {
            wordJSON.wordCells.forEach (e => {
                e.classList.add('found');
                e.classList.remove('checked');
            });
            document.querySelectorAll('.word_list li').forEach (element => {
                if (element.textContent.replace(/\s/g, '').toUpperCase() === wordJSON.word) {
                    element.classList.add('word_found');
                }
            });
        } else {
            checked.forEach(e => {
                e.classList.remove('checked');
            });
        }
        const foundedWords = document.querySelectorAll('word_found');
        if (foundedWords.length === WORDS.length) {
            alert('Has ganado!');
        }
    }
};

const loadTable = () => {
    generateEmptyTable();
    setWordsIntoTable();
    setRandomOnLeftCells();
    removeMarkedClass();
    loadTableEvents();
    loadWordList();
};

loadTable();

document.querySelector('#generate_button').addEventListener('click', loadTable);