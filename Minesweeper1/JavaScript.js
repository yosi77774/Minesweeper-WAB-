document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const NumberMoves = document.querySelector('#Number-moves')
    const result = document.querySelector('#result')
    const b = document.querySelector('#b').addEventListener('click', function (e) {
        window.location.reload(true)

    })
    let width = 10
    let bombAmount = 30
    let flags = 0
    let squares = []
    let isGameOver = false
    let cont = 0

    /* b.addEventListener('click', function (e){
       alert(5 + 6);
             }*/
    //יצירת לוח
    function createBoard() {
        // NumberMoves.innerHTML = bombAmount

        //יצרת מערך משחקים מעורבב עם פצצות אקראיות
        const bombsArray = Array(bombAmount).fill('bomb')
        const emptyArray = Array(width * width - bombAmount).fill('valid')
        const gameArray = emptyArray.concat(bombsArray)
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5)


        for (let i = 0; i < width * width; i++) {

            const square = document.createElement('div')
            square.setAttribute('id', i)
            square.classList.add(shuffledArray[i])
            grid.appendChild(square)
            squares.push(square)

            //לחיצה רגילה
            square.addEventListener('click', function (e) {
                cont++
                click(square)
            })

            //לחיצה על לחצן ימני ובקרה
            square.oncontextmenu = function (e) {
                e.preventDefault()
                addFlag(square)
            }

        }

        //הוספת מספר
        for (let i = 0; i < squares.length; i++) {
            let total = 0
            const isLeftEdge = (i % width === 0)
            const isRightEdge = (i % width === width - 1)

            if (squares[i].classList.contains('valid')) {

                if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++//בודק ריבוע שמאלי
                if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++//בודק ריבוע ימני עליון
                if (i > 9 && squares[i - width].classList.contains('bomb')) total++//בודק ריבוע עליון
                if (i > 10 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total++//בודק ריבוע שמאלי עליון
                if (i < 99 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++//בודק ריבוע ימני
                if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++//בודק ריבוע שמאלי מלמטה
                if (i < 89 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++//בודק ריבוע ימני מלמטה
                if (i < 90 && squares[i + width].classList.contains('bomb')) total++//בודק את הריבוע תחתון

                squares[i].setAttribute('data', total)
            }
        }
    }
    createBoard()

    //הוספת דגל עלידי לחצן ימני
    function addFlag(square) {
        if (isGameOver) return
        if (!square.classList.contains('checked') && (flags < bombAmount)) {
            if (!square.classList.contains('flag')) {
                square.classList.add('flag')
                square.innerHTML = ' 🚩'
                flags++
                /* flagsLeft.innerHTML = bombAmount - flags*/
                checkForWin()
            } else {
                square.classList.remove('flag')
                square.innerHTML = ''
                flags--
                /*flagsLeft.innerHTML = bombAmount - flags*/
            }
        }
    }

    //לחץ על פעולות מרובעות
    function click(square) {

        let currentId = square.id
        if (isGameOver) return
        if (square.classList.contains('checked') || square.classList.contains('flag')) {
            return
        }
        if (square.classList.contains('bomb')) {
            gameOver(square)
        }
        else {
            let total = square.getAttribute('data')
            if (total != 0) {

                //  NumberMoves.innerHTML = cont
                square.classList.add('checked')
                if (total == 1) square.classList.add('one')
                if (total == 2) square.classList.add('two')
                if (total == 3) square.classList.add('three')
                if (total == 4) square.classList.add('four')
                square.innerHTML = total
                return
            }
            checkSquare(currentId)
        }
        square.classList.add('checked')
    }


    //בדוק ריבועים שכנים לאחר לחיצה על ריבוע
    function checkSquare(currentId) {
        const isLeftEdge = (currentId % width === 0)
        const isRightEdge = (currentId % width === width - 1)

        setTimeout(() => {

            // אינו בעמודה השמאלית 
            // ביותר יחזיר כתובת של מרובע שלפני

            if (!isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1].id
                //const newId = parseInt(currentId) - 1   ....refactor
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            //בדיקה של מרובע אם אינו ימני ביותר ולא בשורה הראשונה
            //יחזיר תא עליון ימני
            if (currentId > 9 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 - width].id
                //const newId = parseInt(currentId) +1 -width   ....refactor
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            //אם לא בשורה הראשונה
            //יחזיר תא עליון
            if (currentId > 9) {
                const newId = squares[parseInt(currentId - width)].id
                //const newId = parseInt(currentId) -width   ....refactor
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            //אם גדול מ11 ולא בעמודה השמאלית ביותר
            //יחזיר עליון שמאלי
            if (currentId > 10 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 - width].id
                //const newId = parseInt(currentId) -1 -width   ....refactor
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            //אם לא נמצא בעמודה הימנית ביותר
            //יחזיר תא ימני
            if (!isRightEdge) {
                const newId = squares[parseInt(currentId) + 1].id
                //const newId = parseInt(currentId) +1   ....refactor
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            //אם לא מהשורה האחרונה ולא נמצא בעמודה השמאלית ביותר
            //יחזיר את התא השמאלי התחתון 
            if (currentId < 90 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 + width].id
                //const newId = parseInt(currentId) -1 +width   ....refactor
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            //אם לא בשורה האחרונה ולא בעמודה השמאלית ביותר
            //יחזיר את התא התחתון מצד ימין
            if (currentId < 89 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 + width].id
                //const newId = parseInt(currentId) +1 +width   ....refactor
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            //אם לא בשורה האחרונה 
            //יחזיר את התא התחתון
            if (currentId < 90) {
                const newId = squares[parseInt(currentId) + width].id
                //const newId = parseInt(currentId) +width   ....refactor
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
        }, 10)
    }

    //משחק נגמר
    function gameOver(square) {
        NumberMoves.innerHTML = cont
        result.innerHTML = 'BOOM! Game Over!'
        isGameOver = true

        //הראה את כל הפצצות
        squares.forEach(square => {
            if (square.classList.contains('bomb')) {
                square.innerHTML = '💣'
                square.classList.remove('bomb')
                square.classList.add('checked')
            }
        })
    }

    //בדיקת ניצחון
    function checkForWin() {

        let matches = 0

        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
                matches++

            }
            if (matches === bombAmount) {
                NumberMoves.innerHTML = cont
                result.innerHTML = 'YOU WIN!'
                isGameOver = true
            }
        }
    }

})