//document.addEventListener('DOMContentLoaded', () => {
    const squares = document.querySelectorAll('.grid div')
    const score = document.getElementById('score')
    let width = 20;
    let currentShooterIndex = 370;
    let currentInvaderIndex = 0;
    let aliensDead = [];
    let result = 0;
    let direction = 1;
    let invaderId

    const alienInvaders = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,
        20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,
        40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,
    ]

    //aliens
    alienInvaders.forEach(invader => {
        squares[currentInvaderIndex + invader].classList.add('invader')
    })

    //shooter
    squares[currentShooterIndex].classList.add('shooter');

    //move the shooter
    function moveShooter(event) {
        squares[currentShooterIndex].classList.remove('shooter');
        if(event.keyCode==37) {
            if(currentShooterIndex%width !== 0) {
                currentShooterIndex-=1;
            }
        } else if (event.keyCode==39) {
            if(currentShooterIndex%width < width-1) {
                currentShooterIndex+=1;
            }
        }
        squares[currentShooterIndex].classList.add('shooter');
    }

    document.addEventListener('keydown', moveShooter)

    const calculateLeftEdge = () => {
        if(false) {
            

        } else {
            return alienInvaders[0] % width === 0
        }
        
    } 
    const calculateRightEdge = () => {
        if(false) {

        } else {
            return alienInvaders[alienInvaders.length-1] % width === width-1
        }
    } 

    //move the alien invaders
    function moveInvaders() {
        leftEdge = calculateLeftEdge();
        rightEdge = calculateRightEdge();

        if ((leftEdge && direction === -1) || (rightEdge && direction === 1)) {
            direction = width
        } else if (direction === width) {
            if (leftEdge) direction = 1
            else if (rightEdge) direction = -1
        }
        //erase the aliens from current spot
        for (let i = 0; i <= alienInvaders.length -1; i++) {
            squares[alienInvaders[i]].classList.remove('invader')
        }

        //moves aliens to the newspot
        for (let i = 0; i <= alienInvaders.length -1; i++) {
            alienInvaders[i] += direction
        }

        //draw aliens on new spot
        for (let i = 0; i <= alienInvaders.length-1; i++) {
            if(!aliensDead.includes(i)) {
                squares[alienInvaders[i]].classList.add('invader')
            }
        }

        //decide a gamne over
        if(squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
            resultDisplay.textContent = "Game Over"
            squares[currentShooterIndex].classList.add('boom')
            clearInterval(invaderId)
        }

        for (let i = 0; i <= alienInvaders.length -1; i++) {
            if(alienInvaders[i] > (squares.length - (width-1))) {
                resultDisplay.textContent = "Game Over";
                clearInterval(invaderId)
            }
        }

        //decide a win
        if(aliensDead.length === alienInvaders.length) {
            resultDisplay.textContent = 'You Win!'
            clearInterval(invaderId)
        }
    }
    invaderId = setInterval(moveInvaders, 500);

    function shoot(event) {
        let laserId
        let currentLaserIndex = currentShooterIndex
        //move the laser from the shooter to the alien invader
        function moveLaser() {
            squares[currentLaserIndex].classList.remove('laser')
            currentLaserIndex -= width
            squares[currentLaserIndex].classList.add('laser')
            if(squares[currentLaserIndex].classList.contains('invader')) {
                squares[currentLaserIndex].classList.remove('laser')
                squares[currentLaserIndex].classList.remove('invader')
                squares[currentLaserIndex].classList.add('boom')
                alienInvaders[currentLaserIndex] = -1;

                setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 250)
                clearInterval(laserId)

                const alienDied = alienInvaders.indexOf(currentLaserIndex)
                aliensDead.push(alienDied)
                result++
                resultDisplay.textContent = result
            }

            //stops the laser from contonuing off screen
            if(currentLaserIndex < width) {
                clearInterval(laserId)
                setTimeout(() => squares[currentLaserIndex].classList.remove('laser'), 100)
            }
        }

        switch(event.keyCode) {
            case 32:
                laserId = setInterval(moveLaser, 100)
            break
        }
    }
    document.addEventListener('keyup', shoot)

//})