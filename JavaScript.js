window.requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function (f) { return setTimeout(f, 1000 / 60) };

var ticTacToe = function () {
    var firstPlayer = []; //coordinates for the positions of all the Xs
    var secondPlayer = [];// coordinates for the positions of all the Os
    var grid = []; //shows whether a coordinate is not taken (0), or taken by "x" or "o"
    for (var i = 0; i < 3; i++) {
        grid.push([0, 0, 0]);
    }
    var turnFirst = true; //whether is X's turn
    var gameStarted = false; //whether the game has started
    var onePlayer = 0; //whether opponent is the computer (true) or another player(false)
    var computerIsFirst = 0; //whether computer goes first
    var difficulty = 0; //1-3
    var coverBoardRemoved = true; //whether animation at the end of a game is done
    var userInputAllowed = false; //stops players from adding Xs and Os while previous Xs or Os are still being drawn
    var score = [0, 0, 0];

    //coordinates drawing and adding moves to grid, firstPlayer and secondPlayer
    function addMove(x, y) {
        if (gameStarted) {
            if (turnFirst) {
                firstPlayer.push([x, y]);
                grid[x][y] = 'x';
            } else {
                secondPlayer.push([x, y]);
                grid[x][y] = 'o';
            }
            if (turnFirst) {
                graphics.drawX(x, y);
            } else {
                graphics.drawO(x, y);
            }

        }
    }

    //module contains graphic elements
    var graphics = function () {
        //checks whether one player has won or there's a draw
        function checkOutcome() {
            var first = outcomes(firstPlayer);
            var sec = outcomes(secondPlayer);
            if (!turnFirst) {
                if (sec) {
                    setScoreTable("none", "none", "none", ++score[1], "none");
                    gameStarted = false;
                    coverBoard("o", sec);
                }
            } else {
                if (first) {
                    setScoreTable("none", "none", ++score[0], "none", "none");
                    gameStarted = false;
                    coverBoard("x", first);
                }
            }
            if ((firstPlayer.length + secondPlayer.length) === 9 && !first && !sec) {
                setScoreTable("none", "none", "none", "none", ++score[2]);
                coverBoard("none", false);
            }
            //if a player wins, returns a number with the type of line (diagonal, horizontal, vertical), or false if not a win
            function outcomes(arr) {
                var outcomeType = false;
                var count1 = 0;
                var count2 = 0;
                var count3 = 0;
                var count4 = 0;
                var len = arr.length;
                for (var i = 0; i < len; i++) {
                    if (arr[i][0] === arr[i][1]) {
                        count1++;
                    }
                    if ((arr[i][0] + arr[i][1] === 2)) {
                        count2++;
                    }
                }
                if (count1 === 3) {
                    outcomeType = 1;
                }
                if (count2 === 3) {
                    outcomeType = 2;
                }
                for (i = 0; i < 3; i++) {
                    for (var j = 0; j < len; j++) {
                        if (arr[j][0] === i) {
                            count3++;
                        }
                        if (arr[j][1] === i) {
                            count4++;
                        }
                    }
                    if (count3 === 3) {
                        outcomeType = 3 + i;
                    }
                    if (count4 === 3) {
                        outcomeType = 6 + i;
                    }
                    count3 = 0;
                    count4 = 0;
                }
                return outcomeType;
            }
        }
        //switches color and size for buttons that set nr players, order, and difficulty
        function switchButtons(replacement, replaced) {
            buttonPressed(replacement);
            buttonUnPressed(replaced);
        }

        function buttonPressed(idStr) {
            $(idStr).css('background-color', 'dodgerblue').animate({ width: '125px', height: '45px' }, "slow");
        }
        //sets score table
        function setScoreTable(firstTop, secondTop, firstBottom, secondBottom, thirdBottom) {
            var myTable = document.getElementById("score");
            if (firstTop !== "none") {
                myTable.rows[0].cells[0].innerHTML = firstTop;
            }
            if (secondTop !== "none") {
                myTable.rows[0].cells[1].innerHTML = secondTop;
            }
            if (firstBottom !== "none") {
                myTable.rows[1].cells[0].innerHTML = firstBottom;
                score[0] = firstBottom;
            }
            if (secondBottom !== "none") {
                myTable.rows[1].cells[1].innerHTML = secondBottom;
                score[1] = secondBottom;
            }
            if (thirdBottom !== "none") {
                myTable.rows[1].cells[2].innerHTML = thirdBottom;
                score[2] = thirdBottom;
            }
            console.log(score + " " + firstBottom + " " + secondBottom + " " + thirdBottom);
        }
        //button goes back to default
        function buttonUnPressed(idStr) {
            $(idStr).css('background-color', 'rgb(217, 255, 102)').animate({ width: '100px', height: '35px' }, "slow");
        }
        //effects of pressing buttons on the first row- if computer is a player
        function onePlayerGraphics() {
            $("#order").slideDown("slow");
            buttonPressed("#onePlayer");
        }
        //effects of pressing buttons on the first row- if computer is not a player
        function twoPlayersGraphics() {
            $("#order").empty().append('<button type="button" id="startButton2" onclick="ticTacToe.run()">Start game</button>').slideDown("slow");
            buttonPressed("#twoPlayers");
        }

        function startGraphics(x) {
            $("#start").slideDown();
            buttonPressed("#difficultyIs" + x);
        }

        function computerFirstGraphics(isFirst) {
            $("#difficulty").slideDown("slow");
            if (isFirst) {
                buttonPressed("#second");
            } else {
                buttonPressed("#first");
            }
        }
        //clears the board and resets the grid when a game is over or when a change of settings takes place
        function refresh() {
            $("#coverCanv").addClass("invisible").addClass("hidden");
            var canv = document.getElementById("coverCanv");
            gameStarted = false;
            canv.width = canv.width;
            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    var canvas = $("#myCanvas" + i + "" + j)[0];
                    canvas.width = canvas.width;
                }
            }
            firstPlayer = [];
            secondPlayer = [];
            grid = [];
            for (var k = 0; k < 3; k++) {
                grid.push([0, 0, 0]);
            }
            turnFirst = true;

        }
        //animations at the end of the game
        function coverBoard(winner, outcomeType) {
            var str;
            var i = 0;

            if (winner === "x") {
                str = "X WINS";
            } else {
                str = (winner === "o") ? "O WINS" : "DRAW";
            }
            $("#coverCanv").removeClass("invisible").removeClass("hidden").addClass("revealed");
            //draws the line if it's not a draw
            function animate() {
                var c = document.getElementById("coverCanv");
                var ctx = c.getContext("2d");
                coverBoardRemoved = false;
                ctx.save();
                ctx.globalAlpha = 0.5;
                ctx.fillStyle = "dodgerblue";
                ctx.fillRect(0, 0, c.width, c.height);
                ctx.restore();
                if (outcomeType) {
                    drawLines();
                } else {
                    outcomeReveal();
                }
                function drawLines() {
                    if (i < 70) {
                        ctx.save();
                        ctx.lineWidth = 15;
                        ctx.lineCap = "round";
                        ctx.beginPath();
                        switch (outcomeType) {
                            case 1:
                                ctx.moveTo(173 - 2 * i, 173 - 2 * i);
                                ctx.lineTo(177 + 2 * i, 177 + 2 * i);
                                break;
                            case 2:
                                ctx.moveTo(177 + 2 * i, 173 - 2 * i);
                                ctx.lineTo(173 - 2 * i, 177 + 2 * i);
                                break;
                            case 3:
                                ctx.moveTo(173 - 2 * i, 55);
                                ctx.lineTo(177 + 2 * i, 55);
                                break;
                            case 4:
                                ctx.moveTo(173 - 2 * i, 175);
                                ctx.lineTo(177 + 2 * i, 175);
                                break;
                            case 5:
                                ctx.moveTo(173 - 2 * i, 295);
                                ctx.lineTo(177 + 2 * i, 295);
                                break;
                            case 6:
                                ctx.moveTo(55, 173 - 2 * i);
                                ctx.lineTo(55, 177 + 2 * i);
                                break;
                            case 7:
                                ctx.moveTo(175, 173 - 2 * i);
                                ctx.lineTo(175, 177 + 2 * i);
                                break;
                            case 8:
                                ctx.moveTo(295, 173 - 2 * i);
                                ctx.lineTo(295, 177 + 2 * i);
                                break;
                        }
                        ctx.stroke();
                        ctx.restore();
                    }
                    i++;
                    if (i < 120) {
                        requestAnimationFrame(drawLines);
                    } else {
                        c.width = c.width;
                        i = 0;
                        outcomeReveal();
                    }
                }
                //animation on the board
                function outcomeReveal() {
                    var fontSize;
                    if (i < 100) {
                        ctx.save();
                        ctx.fillStyle = "dodgerblue";
                        ctx.fillRect(0, 0, 350, 350);
                        ctx.globalCompositeOperation = "xor";
                        fontSize = 154 - i;
                        ctx.font = "" + fontSize + "pt Verdana";
                        ctx.fillText(str, -50 + i, 360 - i);
                        ctx.restore();
                    }
                    i++;
                    if (i < 150) {
                        requestAnimationFrame(outcomeReveal);
                    } else {
                        c.width = c.width;
                        coverBoardRemoved = true;
                        textCover();
                    }
                }
            }
            animate();
        }
        //establishes a cover that is clickable over the canvas
        function textCover() {
            if (coverBoardRemoved) {
                var c = $("#coverCanv")[0];
                $("#coverCanv").removeClass("invisible").removeClass("hidden");
                var ctx = c.getContext("2d");
                ctx.globalAlpha = 0.8;
                ctx.fillStyle = "rgb(77, 184, 255)";
                ctx.fillRect(0, 0, 350, 350);
                ctx.font = "20pt 'Bauhaus 93'";
                ctx.fillStyle = "blue";
                ctx.fillText("Click here or on the", 50, 90);
                ctx.fillText("'Start game'", 90, 140);
                ctx.fillText("button to continue", 70, 190);
            }
        }

        function drawX(x, y) {
            var strX = "myCanvas" + x + "" + y;
            var c = document.getElementById(strX);
            var ctx = c.getContext("2d");
            var i = 0;
            function locX() {
                ctx.save();
                ctx.beginPath();
                ctx.lineWidth = (i) / 3;
                ctx.lineCap = "round";
                ctx.strokeStyle = "rgb(0, 153, 153)";
                ctx.moveTo(50 - i, 50 - i);
                ctx.lineTo(60 + i, 60 + i);
                ctx.stroke();
                ctx.restore();
                ctx.beginPath();
                ctx.lineWidth = (i) / 3;
                ctx.lineCap = "round";
                ctx.strokeStyle = "rgb(0, 153, 153)";
                ctx.moveTo(60 + i, 50 - i);
                ctx.lineTo(50 - i, 60 + i);
                ctx.stroke();
                ctx.restore();
                i++;
                if (i < 30) {
                    requestAnimationFrame(locX);
                } else {
                    checkOutcome();
                    turnFirst = !turnFirst;
                    if (onePlayer && (computerIsFirst === turnFirst)) {
                        computerMove();
                    }
                    if (onePlayer && (computerIsFirst !== turnFirst)) {
                        userInputAllowed = true;
                    }
                    if (!onePlayer) {
                        userInputAllowed = true;
                    }
                }
            }
            locX();
        }

        function drawO(x, y) {
            var strO = "myCanvas" + x + "" + y;
            var c = document.getElementById(strO);
            var ctx = c.getContext("2d");
            var i = 0;
            function locY() {
                ctx.save();
                ctx.lineWidth = 10;
                ctx.strokeStyle = "rgb(0, 230, 230)";
                ctx.beginPath();
                ctx.arc(55, 55, 30, -0.5 * Math.PI, (-0.5 + i / 15) * Math.PI);
                ctx.stroke();
                ctx.restore();
                i++;
                if (i <= 30) {
                    requestAnimationFrame(locY);
                } else {
                    checkOutcome();
                    turnFirst = !turnFirst;
                    if (onePlayer && (computerIsFirst === turnFirst)) {
                        userInputAllowed = false;
                        computerMove();
                    }
                    if (onePlayer && (computerIsFirst !== turnFirst)) {
                        userInputAllowed = true;
                    }
                    if (!onePlayer) {
                        userInputAllowed = true;
                    }
                }
            }
            locY();
        }

        return {
            switchButtons: switchButtons,
            buttonPressed: buttonPressed,
            setTable: setScoreTable,
            buttonUnPressed: buttonUnPressed,
            onePlayerGraphics: onePlayerGraphics,
            twoPlayersGraphics: twoPlayersGraphics,
            startGraphics: startGraphics,
            computerFirstGraphics: computerFirstGraphics,
            refresh: refresh,
            textCover: textCover,
            drawX: drawX,
            drawO: drawO
        }
    }();

    //actions of the computer
    function computerMove() {
        const corners = [[0, 0], [0, 2], [2, 0], [2, 2]];
        const center = [[1, 1]];
        const edges = [[0, 1], [1, 0], [2, 1], [1, 2]];
        var len;
        if (computerIsFirst) {
            len = firstPlayer.length;
            if (len === 0 && difficulty === 3) {
                startFirstStep();
            } else if (len === 1 && difficulty === 3) {
                startSecondStep();
            } else {
                computerFinalMoves(firstPlayer, secondPlayer);
            }
        } else {
            len = secondPlayer.length;
            if (len === 0 && difficulty === 3) {
                reactFirstStep();
            } else {
                computerFinalMoves(secondPlayer, firstPlayer);
            }
        }
        //if computer is first, this is the first move
        function startFirstStep() {
            var rand = Math.floor(Math.random() * 5);
            var arr = corners.concat(center);
            addMove(arr[rand][0], arr[rand][1]);
        }
        //if computer is first, this is the second move
        function startSecondStep() {
            var x;
            var arr = [];
            var cent1 = includesArray(center, firstPlayer[0]);
            var edg2 = includesArray(edges, secondPlayer[0]);
            var corn2 = includesArray(corners, secondPlayer[0]);
            var corn1 = includesArray(corners, firstPlayer[0]);
            var cent2 = includesArray(center, secondPlayer[0]);
            if (cent1) {
                if (edg2) {
                    if (secondPlayer[0][0] === 0) {
                        x = (Math.floor(Math.random() * 2) < 1) ? [2, 0] : [2, 2];
                    }
                    if (secondPlayer[0][1] === 0) {
                        x = (Math.floor(Math.random() * 2) < 1) ? [0, 2] : [2, 2];
                    }
                    if (secondPlayer[0][0] === 2) {
                        x = (Math.floor(Math.random() * 2) < 1) ? [0, 2] : [0, 0];
                    }
                    if (secondPlayer[0][1] === 2) {
                        x = (Math.floor(Math.random() * 2) < 1) ? [0, 0] : [2, 0];
                    }
                } else if (corn2) {
                    if (secondPlayer[0][0] === secondPlayer[0][1]) {
                        x = secondPlayer[0][0] === 0 ? [2, 2] : [0, 0];
                    }
                    if ((secondPlayer[0][0] + secondPlayer[0][1]) === 2) {
                        x = secondPlayer[0][0] === 0 ? [2, 0] : [0, 2];
                    }
                }

            } else if (corn1) {
                if (edg2) {

                    if ((firstPlayer[0][0] !== secondPlayer[0][0]) && (firstPlayer[0][1] !== secondPlayer[0][1])) {
                        corners.forEach(function (elem) {
                            if ((elem[0] === firstPlayer[0][0]) !== (elem[1] === firstPlayer[0][1])) {
                                arr.push(elem);
                            }
                        });
                        var rand = Math.floor(Math.random() * 2);
                        x = [arr[rand][0], arr[rand][1]];
                    } else {
                        corners.forEach(function (elem) {
                            if (((elem[0] === firstPlayer[0][0]) || (elem[1] === firstPlayer[0][1])) && ((elem[0] !== secondPlayer[0][0]) && (elem[1] !== secondPlayer[0][1]))) {
                                x = elem;
                            }
                        })
                    }
                } else if (cent2) {
                    if (firstPlayer[0][0] === firstPlayer[0][1]) {
                        x = (firstPlayer[0][0] === 0) ? [2, 2] : [0, 0];
                    } else {
                        x = (firstPlayer[0][0] === 0) ? [2, 0] : [0, 2];
                    }
                } else {
                    arr = [];
                    corners.forEach(function (elem) {
                        if (grid[elem[0]][elem[1]] === 0) {
                            arr.push(elem);
                        }
                    });
                    rand = Math.floor(Math.random() * 2);
                    x = [arr[rand][0], arr[rand][0]];
                }
            }
            addMove(x[0], x[1]);
            //turnFirst = false;
        }
        //if computer is second, this is the first move of the computer
        function reactFirstStep() {
            var rand;
            var x;
            if (includesArray(center, firstPlayer[0])) {
                rand = Math.floor(Math.random() * 4);
                x = corners[rand];
            } else if (includesArray(corners, firstPlayer[0])) {
                x = [1, 1];
            } else {
                var arr = corners.concat(center);
                rand = Math.floor(Math.random() * 5);
                x = arr[rand];
            }
            addMove(x[0], x[1]);
            //turnFirst = true;
        }
        //helper function - if an array is included in an array of arrays
        function includesArray(including, included) {
            var res = false;
            including.forEach(function (elem) {
                res = res || ((elem[0] === included[0]) && (elem[1] === included[1]));
            });
            return res;
        }
        //the logic after the initial moves - a series of functions that check for threats (two aligned positions with the third available)
        //and forks (one player has
        //multiple chances of winning - two or more threats)
        function computerFinalMoves(arrOwn, arrOpp) {
            var x = killerBlowFinder(arrOwn);
            if (x) {
                addMove(x[0], x[1]);
                return;
            }
            x = killerBlowFinder(arrOpp);
            if (x) {
                addMove(x[0], x[1]);
                return;
            }
            if (difficulty === 3 || difficulty === 2) {
                x = forkFinderPotential(arrOwn);
                if (x) {
                    var rand = Math.floor(Math.random() * x.length);
                    addMove(x[rand][0], x[rand][1]);
                    return;
                }
                x = forkNeutralize(arrOwn, arrOpp);
                if (x) {
                    addMove(x[0], x[1]);
                    return;
                }
            }
            x = createThreat(arrOwn, false);
            if (x) {
                addMove(x[0], x[1]);
                return;
            }
            x = createThreat(arrOwn, true);
            if (x) {
                addMove(x[0], x[1]);
            }
            //checks whether one player can finish the game
            function killerBlowFinder(arr) {
                var len = arr.length;
                if (len > 1) {
                    for (var i = 0; i < len - 1; i++) {
                        for (var j = i + 1; j < len; j++) {
                            var x = areAligned(arr[i], arr[j]);
                            if (x) {
                                return x;
                            }
                        }
                    }
                }
                return false;
            }
            //returns true if one players has two positions in line and the other is empty
            function areAligned(x, y) {
                if (x[0] === x[1] && y[0] === y[1]) {
                    for (var i = 0; i < 3; i++) {
                        if (grid[i][i] === 0) {
                            return [].concat([i, i]);
                        }
                    }
                } else if ((x[0] + x[1] === 2) && (y[0] + y[1] === 2)) {
                    for (var i = 0; i < 3; i++) {
                        for (var j = 0; j < 3; j++) {
                            if ((i + j) === 2 && grid[i][j] === 0) {
                                return [].concat([i, j]);
                            }
                        }
                    }
                } else if (x[0] === y[0]) {
                    for (var i = 0; i < 3; i++) {
                        if (grid[x[0]][i] === 0) {
                            return [].concat([x[0], i]);
                        }
                    }
                } else if (x[1] === y[1]) {
                    for (var i = 0; i < 3; i++) {
                        if (grid[i][x[1]] === 0) {
                            return [].concat([i, x[1]]);
                        }
                    }
                }
                return false;
            }
            //returns an array of positions that could create forks with existing positions in the argument array
            function forkFinderPotential(arr) {
                var arrRes = [];
                if (arr.length > 1) {
                    for (var i = 0; i < 3; i++) {
                        for (var j = 0; j < 3; j++) {
                            if (grid[i][j] === 0) {
                                var newArray = arr.slice();
                                newArray.push([i, j]);
                                grid[i][j] = "n";
                                if (forkFinderActual(newArray)) {
                                    arrRes.push([i, j]);
                                }
                                grid[i][j] = 0;
                            }
                        }
                    }
                }
                if (arrRes.length === 0) {
                    return false;
                } else {
                    return arrRes;
                }
            }
            //determines if there are any forks in the array
            function forkFinderActual(arr) {
                var len = arr.length;
                if (len > 2) {
                    for (var i = 0; i < len - 2; i++) {
                        for (var j = i + 1; j < len - 1; j++) {
                            for (var k = j + 1; k < len; k++) {
                                var arrAB = areAligned(arr[i], arr[j]);
                                var arrAC = areAligned(arr[i], arr[k]);
                                var arrBC = areAligned(arr[j], arr[k]);
                                if (arrAB) {
                                    if (arrAC) {
                                        return true;
                                    } else if (arrBC) {
                                        return true;
                                    }
                                } else {
                                    if (arrBC) {
                                        if (arrAC) {
                                            return true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return false;
            }
            //finds positions that create threats in the arrOwn that would force opponent to move away from potential forks
            function forkNeutralize(arrOwn, arrOpp) {
                var y = [];
                var len = arrOwn.length;
                var sum = len + arrOpp.length;
                if (forkFinderPotential(arrOpp) && sum < 7) {
                    for (var i = 0; i < 3; i++) {
                        for (var j = 0; j < 3; j++) {
                            if (grid[i][j] === 0) {

                                for (var p = 0; p < len; p++) {
                                    grid[i][j] = "n";
                                    y = areAligned(arrOwn[p], [i, j]);
                                    grid[i][j] = 0;
                                    if (y) {
                                        y = [y];
                                        grid[i][j] = "n";
                                        var newArr = arrOpp.slice();
                                        var z = forkFinderActual(newArr.concat(y));
                                        grid[i][j] = 0;
                                        if (!z) {
                                            return [i, j];
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return false;
            }
            //find threats, if typeIsRand is true, just generates random moves
            function createThreat(arr, typeIsRand) {
                var arrRes = [];
                var arrRand = [];
                for (var i = 0; i < 3; i++) {
                    for (var j = 0; j < 3; j++) {
                        if (grid[i][j] === 0) {
                            if (!typeIsRand) {
                                arr.forEach(function (elem) {
                                    grid[i][j] = "n";
                                    var cond = areAligned([i, j], elem);
                                    grid[i][j] = 0;
                                    if (cond) {
                                        arrRes.push(cond);
                                    }
                                });
                            } else {
                                arrRand.push([i, j]);
                            }
                        }
                    }
                }
                if (typeIsRand) {
                    if (arrRand.length > 0) {
                        return arrRand[Math.floor(Math.random() * arrRand.length)];
                    } else {
                        return false;
                    }
                } else {
                    if (arrRes.length > 0) {
                        return arrRes[Math.floor(Math.random() * arrRes.length)];
                    } else {
                        return false;
                    }
                }
            }
        }
    }

    //input - whether the computer plays - if one option is selected already and a change is made,
    //existing buttons under this row are elevated and new ones descend
    function setNoPlayers(x) {
        if (onePlayer === 0) {
            if (x === 1) {
                onePlayer = true;
                graphics.onePlayerGraphics();
            }
            if (x === 2) {
                onePlayer = false;
                graphics.twoPlayersGraphics();
            }
        } else {
            if (x === 1 && !onePlayer) {
                onePlayer = true;
                if (computerIsFirst) {
                    graphics.setTable("Computer (X)", "Player (O)", 0, 0, 0);
                } else {
                    graphics.setTable("Player (X)", "Computer (O)", 0, 0, 0);
                }
                graphics.refresh();
                graphics.textCover();
                graphics.switchButtons("#onePlayer", "#twoPlayers");
                $("#order").slideUp("slow", function () {
                    $("#order").empty().append('<button type="button" id="first" onclick="ticTacToe.setComputerFirst(false)">Play first</button>')
                        .append('<button type="button" class="backgroundButton">Choose order</button>')
                        .append('<button type="button" id="second" onclick="ticTacToe.setComputerFirst(true)">Play second</button>').slideDown("slow");
                });
                graphics.buttonUnPressed("startButton2");
            }
            if (x === 2 && onePlayer) {
                onePlayer = false;
                graphics.refresh();
                graphics.textCover();
                graphics.switchButtons("#twoPlayers", "#onePlayer");
                $("#difficulty").slideUp("slow", function () {
                    $("#difficulty").empty().append('<button type="button" id="difficultyIs1" onclick="ticTacToe.setDifficulty(1)">Easy</button>')
                        .append('<button type="button" id="difficultyIs2" onclick="ticTacToe.setDifficulty(2)">Medium</button>')
                        .append('<button type="button" id="difficultyIs3" onclick="ticTacToe.setDifficulty(3)">Hard</button>');
                });
                $("#start").slideUp("slow", function () {
                    $("#start").empty().append('<button type="button" id="startButton" onclick="ticTacToe.run()">Start game</button>');
                });

                $("#order").slideUp("slow", function () {
                    $("#order").empty().append('<button type="button" id="startButton2" onclick="ticTacToe.run()">Start game</button>').slideDown("slow");
                });
                graphics.setTable("Player 1 (X)", "Player 2 (O)", 0, 0, 0);
                difficulty = 0;
                computerIsFirst = 0;
            }
        }

    }
    //selects whether computer plays first or not - resets board and grid if previous options are changed
    function setComputerFirst(x) {

        if (computerIsFirst === 0) {
            graphics.computerFirstGraphics(x);
            computerIsFirst = x;
            if (x) {
                graphics.setTable("Computer (X)", "Player (O)", "none", "none", "none");
            } else {
                graphics.setTable("Player (X)", "Computer (O)", "none", "none", "none");
            }
        } else {
            if (x && !computerIsFirst) {
                graphics.switchButtons("#second", "#first");
                graphics.setTable("Computer (X)", "Player (O)", 0, 0, 0);
                if (gameStarted) {
                    graphics.refresh();
                    graphics.textCover();
                }
                computerIsFirst = true;
            }
            if (!x && computerIsFirst) {
                graphics.switchButtons("#first", "#second");
                graphics.setTable("Player (X)", "Computer (O)", 0, 0, 0);
                if (gameStarted) {
                    graphics.refresh();
                    graphics.textCover();
                }
                computerIsFirst = false;
            }
        }
    }
    //selects level of difficulty, reveals start button
    function setDifficulty(x) {
        if (difficulty === 0) {
            difficulty = x;
            graphics.startGraphics(x);
        } else {
            if (x !== difficulty) {
                graphics.switchButtons("#difficultyIs" + x, "#difficultyIs" + difficulty);
                if (gameStarted) {
                    graphics.refresh();
                    graphics.textCover();
                }
                difficulty = x;
                graphics.setTable("none", "none", 0, 0, 0);
            }
        }
    }
    //it restarts the game if the canvas is clicked after the animation is over
    function canvasClick() {
        if (coverBoardRemoved) {
            graphics.refresh();
            run();
        }
    }
    //receives as input the position the player has chosen as the next step in the game
    function userInput(x, y) {
        if (gameStarted && grid[x][y] === 0 && userInputAllowed) {
            userInputAllowed = false;
            addMove(x, y);
        }
    }
    //starts the game
    function run() {
        if (!gameStarted) {
            graphics.refresh();
            gameStarted = true;
            userInputAllowed = true;
            if (onePlayer) {
                graphics.buttonPressed("#startButton");
                if (computerIsFirst) {
                    computerMove();
                }
            } else {
                graphics.buttonPressed("#startButton2");
            }
        }
    }

    return {
        run: run,
        setNoPlayers: setNoPlayers,
        setComputerFirst: setComputerFirst,
        setDifficulty: setDifficulty,
        userInput: userInput,
        canvasClick: canvasClick
    };
}();