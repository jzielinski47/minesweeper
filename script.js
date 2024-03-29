
const board = {
    select: document.getElementById('board'),
    height: 0,
    width: 0,
    bombQuantity: 0,

    renderDivStructure: function () {
        for (let x = 0; x < board.height; x++) {
            for (let y = 0; y < board.width; y++) {
                let div = document.createElement('div');
                div.id = x + '-' + y;
                div.classList.add('field');

                if (x != 0) {
                    if (y == 0) div.style.clear = 'both';
                }

                this.select.append(div);
            }
        }
    }
}

const tileset = {
    default: './img/klepa.PNG',
    bomb: './img/bomb.PNG',
    pbomb: './img/pbomb.PNG',
    flag: './img/flaga.PNG',
    questionmark: './img/pyt.PNG',

    fill: function () {
        for (let x = 0; x < board.height; x++) {
            for (let y = 0; y < board.width; y++) {
                let selectedField = document.getElementById(x + '-' + y);
                let image = document.createElement("img")
                image.src = this.default;
                image.id = 'img' + x + '-' + y;
                selectedField.append(image);
            }
        }
    }
}

const render = {
    inputHolder: document.getElementById('inputHolder'),
    submit: document.getElementById('submit'),
    timer: document.getElementById('czas'),
    gameStatus: document.getElementById('status'),

    renderBombCounter: function () {
        let counter = document.createElement("div");
        counter.innerHTML = 'Remaining bombs: ' + checksum.remainingBombs
        if (document.getElementById('rbcounter') != undefined) {
            document.getElementById('rbcounter').remove()
            counter.id = 'rbcounter'
            this.inputHolder.append(counter)
        } else {
            counter.id = 'rbcounter'
            this.inputHolder.append(counter)
        }
    }
}

const defaultVal = {
    field: 0,
    bomb: 101
}

const czas = {
    start: Date.now(),
    record: 0,
    canMeasureTime: true,

    renderTime(delay) {
        let startTime = setInterval(function () {
            let time = Date.now() - czas.start;
            if (czas.canMeasureTime) {
                time = Math.floor(time / 1000)
                render.timer.innerHTML = 'time: ' + time + 's';
            } else {
                render.timer.innerHTML = 'your best score: ' + time + 'ms';
                this.record = time;
                clearInterval(startTime)
            }

            console.log(time)
        }, delay);

    },

    resetTimer() {
        this.start = Date.now()
    }
}

const checksum = {
    flagsPlaced: 0,
    remainingBombs: 0,
    gameFinished: false
}

const table = {
    tab: [],

    renderArray: function () {
        for (let x = 0; x < board.height; x++) {
            this.tab[x] = [];
            for (let y = 0; y < board.width; y++) {
                this.tab[x][y] = defaultVal.field
            }
        }
    },

    getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    },

    renderBombs: function () {

        let bombsPlaced = 0;

        while (bombsPlaced < board.bombQuantity) {

            let randomY = table.getRandomInt(0, board.height);
            let randomX = table.getRandomInt(0, board.width);

            if (this.tab[randomY]?.[randomX] != defaultVal.bomb) {
                this.tab[randomY][randomX] = defaultVal.bomb;
                bombsPlaced++;
            }

        }

    },

    renderNumbers: function () {
        for (let x = 0; x < board.height; x++) {
            for (let y = 0; y < board.width; y++) {
                let selectedField = document.getElementById(x + '-' + y);
                numberOfSurroundingBombs = 0
                if (this.tab[x]?.[y + 1] == defaultVal.bomb) {
                    numberOfSurroundingBombs++;
                }
                if (this.tab[x]?.[y - 1] == defaultVal.bomb) {
                    numberOfSurroundingBombs++;
                }
                if (this.tab[x + 1]?.[y] == defaultVal.bomb) {
                    numberOfSurroundingBombs++;
                }
                if (this.tab[x - 1]?.[y] == defaultVal.bomb) {
                    numberOfSurroundingBombs++;
                }

                //katy
                if (this.tab[x + 1]?.[y + 1] == defaultVal.bomb) {
                    numberOfSurroundingBombs++;
                }
                if (this.tab[x + 1]?.[y - 1] == defaultVal.bomb) {
                    numberOfSurroundingBombs++;
                }
                if (this.tab[x - 1]?.[y + 1] == defaultVal.bomb) {
                    numberOfSurroundingBombs++;
                }
                if (this.tab[x - 1]?.[y - 1] == defaultVal.bomb) {
                    numberOfSurroundingBombs++;
                }

                if (this.tab[x][y] != defaultVal.bomb) {
                    this.tab[x][y] = numberOfSurroundingBombs
                }

                // selectedField.innerHTML = numberOfSurroundingBombs
            }
        }
    },

    inspectTerrain: function (i, j) {
        //do okoła

        if (i >= 0 && i <= (board.height - 1) && j >= 0 && j <= (board.width - 1)) {
            if (j + 1 <= (board.width - 1)) {
                let focusedField = document.getElementById(i + '-' + (j + 1))
                if (!focusedField.classList.contains('clicked-on') && !focusedField.classList.contains('flag')) {
                    focusedField.innerHTML = this.tab[i][j + 1]
                    focusedField.classList.add('clicked-on');
                    if (this.tab[i][j + 1] == defaultVal.field) {
                        table.inspectTerrain(i, j + 1)
                    }
                }
            }
            if (j - 1 >= 0) {
                let focusedField = document.getElementById(i + '-' + (j - 1))
                if (!focusedField.classList.contains('clicked-on') && !focusedField.classList.contains('flag')) {
                    focusedField.innerHTML = this.tab[i][j - 1]
                    focusedField.classList.add('clicked-on');
                    if (this.tab[i][j - 1] == defaultVal.field) {
                        table.inspectTerrain(i, j - 1)
                    }
                }
            }
            if (i + 1 <= (board.height - 1)) {
                let focusedField = document.getElementById((i + 1) + '-' + j)
                if (!focusedField.classList.contains('clicked-on') && !focusedField.classList.contains('flag')) {
                    focusedField.innerHTML = this.tab[i + 1][j]
                    focusedField.classList.add('clicked-on');
                    if (this.tab[i + 1][j] == defaultVal.field) {
                        table.inspectTerrain(i + 1, j)
                    }
                }
            }
            if (i - 1 >= 0) {
                let focusedField = document.getElementById((i - 1) + '-' + j)
                if (!focusedField.classList.contains('clicked-on') && !focusedField.classList.contains('flag')) {
                    focusedField.innerHTML = this.tab[i - 1][j]
                    focusedField.classList.add('clicked-on');
                    if (this.tab[i - 1][j] == defaultVal.field) {
                        table.inspectTerrain(i - 1, j)
                    }
                }
            }
            if (i + 1 <= (board.height - 1) && j + 1 <= (board.width - 1)) {
                let focusedField = document.getElementById((i + 1) + '-' + (j + 1))
                if (!focusedField.classList.contains('clicked-on') && !focusedField.classList.contains('flag')) {
                    focusedField.innerHTML = this.tab[i + 1][j + 1]
                    focusedField.classList.add('clicked-on');
                    if (this.tab[i + 1][j + 1] == defaultVal.field) {
                        table.inspectTerrain(i + 1, j + 1)
                    }
                }
            }
            if (i + 1 <= (board.height - 1) && j - 1 >= 0) {
                let focusedField = document.getElementById((i + 1) + '-' + (j - 1))
                if (!focusedField.classList.contains('clicked-on') && !focusedField.classList.contains('flag')) {
                    focusedField.innerHTML = this.tab[i + 1][j - 1]
                    focusedField.classList.add('clicked-on');
                    if (this.tab[i + 1][j - 1] == defaultVal.field) {
                        table.inspectTerrain(i + 1, j - 1)
                    }
                }
            }
            if (i - 1 >= 0 && j + 1 <= (board.width - 1)) {
                let focusedField = document.getElementById((i - 1) + '-' + (j + 1))
                if (!focusedField.classList.contains('clicked-on') && !focusedField.classList.contains('flag')) {
                    focusedField.innerHTML = this.tab[i - 1][j + 1]
                    focusedField.classList.add('clicked-on');
                    if (this.tab[i - 1][j + 1] == defaultVal.field) {
                        table.inspectTerrain(i - 1, j + 1)
                    }
                }
            }
            if (i - 1 >= 0 && j - 1 >= 0) {
                let focusedField = document.getElementById((i - 1) + '-' + (j - 1))
                if (!focusedField.classList.contains('clicked-on') && !focusedField.classList.contains('flag')) {
                    focusedField.innerHTML = this.tab[i - 1][j - 1]
                    focusedField.classList.add('clicked-on');
                    if (this.tab[i - 1][j - 1] == defaultVal.field) {
                        table.inspectTerrain(i - 1, j - 1)
                    }
                }
            }
        }


    },

    trackMouseMovement: function () {

        console.table(this.tab)
        for (let x = 0; x < board.height; x++) {
            for (let y = 0; y < board.width; y++) {

                let selectedField = document.getElementById(x + '-' + y);

                //left click
                selectedField.onclick = function (event) {

                    if (!checksum.gameFinished) {
                        if (table.tab[x][y] == defaultVal.bomb) {

                            checksum.gameFinished = true;

                            for (let i = 0; i < board.height; i++) {
                                for (let j = 0; j < board.width; j++) {
                                    if (table.tab[i][j] == defaultVal.bomb) {
                                        document.getElementById(i + '-' + j).removeChild(document.getElementById(i + '-' + j).firstChild);
                                        let bomb = document.createElement("img");
                                        bomb.src = tileset.pbomb;
                                        document.getElementById(i + '-' + j).append(bomb);
                                    }
                                }
                            }

                            selectedField.removeChild(selectedField.firstChild);
                            let bomb = document.createElement("img");
                            bomb.src = tileset.bomb;
                            selectedField.append(bomb);

                            endScreen.render()

                        } else if (table.tab[x][y] == defaultVal.field) { //default value = 0 on default
                            table.inspectTerrain(x, y)

                            selectedField.innerHTML = table.tab[x][y];

                        } else {
                            selectedField.innerHTML = table.tab[x][y];
                        }

                        selectedField.classList.add('clicked-on')
                    }

                    table.inspectVictory()

                }

                //right click
                selectedField.oncontextmenu = function (event) {
                    event.preventDefault()

                    if (!checksum.gameFinished) {
                        if (!selectedField.classList.contains('clicked-on')) {

                            if (selectedField.classList.contains('flag')) {
                                selectedField.classList = 'field'

                                selectedField.removeChild(selectedField.firstChild);
                                let image = document.createElement("img");
                                image.src = tileset.questionmark;
                                selectedField.append(image);
                                selectedField.classList.add('questionmark')

                                checksum.remainingBombs++;
                                if (table.tab[x][y] == defaultVal.bomb) {
                                    checksum.flagsPlaced--
                                    console.log(checksum.flagsPlaced)
                                }
                                render.renderBombCounter()

                            } else if (selectedField.classList.contains('questionmark')) {
                                selectedField.classList = 'field'

                                selectedField.removeChild(selectedField.firstChild);
                                let image = document.createElement("img");
                                image.src = tileset.default;
                                selectedField.append(image);
                                selectedField.classList = 'field'

                            } else {
                                selectedField.classList = 'field'

                                selectedField.removeChild(selectedField.firstChild);
                                let image = document.createElement("img");
                                image.src = tileset.flag;
                                selectedField.append(image);
                                selectedField.classList.add('flag')

                                checksum.remainingBombs--;
                                if (table.tab[x][y] == defaultVal.bomb) {
                                    checksum.flagsPlaced++;
                                }

                                render.renderBombCounter()
                            }

                        }
                    }

                }

            }

        }
    },

    inspectVictory: function () {
        let surface = board.height * board.width
        let clickedOnFields = 0;

        for (let i = 0; i < board.height; i++) {
            for (let j = 0; j < board.width; j++) {
                if (document.getElementById(i + '-' + j).classList.contains('clicked-on')) {
                    clickedOnFields++;
                }
            }
        }

        let expectedRemainingBombs = surface - clickedOnFields;
        console.log('bomby', expectedRemainingBombs, board.bombQuantity)
        if (expectedRemainingBombs == parseInt(board.bombQuantity)) {
            gameFinished = true;
            czas.canMeasureTime = false;
            render.gameStatus.innerHTML = "You won";
            setTimeout(function () {
                alert('You won');
            }, 10);
        }
    }
}

const endScreen = {

    render: function () {
        czas.canMeasureTime = false;
        render.gameStatus.innerHTML = "You lost";
        setTimeout(function () {
            alert('You lost');
        }, 10);
        // render.submit.classList.remove('hidden');
    },

    renderNew: function () {
        document.getElementById('board').remove()
        let board = document.createElement('div');
        board.id = 'board';
        board.classList = 'board';
        document.getElementById('container').append(board);
    }

}

render.submit.onclick = function () {

    board.height = document.getElementById('boardHeight').value;
    board.width = document.getElementById('boardWidth').value;
    board.bombQuantity = document.getElementById('bombQuantity').value;

    console.log(board.select, board.height, board.width)

    if (parseInt(board.bombQuantity) <= board.width * board.height) {

        board.height = document.getElementById('boardHeight').value;
        board.width = document.getElementById('boardWidth').value;
        board.bombQuantity = document.getElementById('bombQuantity').value;
        // render.inputHolder.remove();
        // render.submit.remove()
        render.submit.classList.add('hidden')
        render.renderBombCounter();

        table.renderArray();

        board.renderDivStructure();
        tileset.fill();

        table.renderBombs();
        table.renderNumbers()

        table.trackMouseMovement();

        czas.start = Date.now();
        czas.renderTime(1);

        table.inspectVictory()
    } else {
        setTimeout(function () {
            alert('za dużo bomb');
        }, 10);
    }

}