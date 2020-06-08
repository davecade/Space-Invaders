const squares = document.querySelectorAll('.grid div')
const score = document.getElementById('score')
const result = document.getElementById('result')
let width = 20;
let currentShooterIndex = 370;
let currentInvaderIndex = 0;
let aliensDead = [];
let points = 0;
let direction = 1;
let invaderId
let gameOver = false;

// 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,
// 20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,
// 40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,
let alienInvaders = [
    {id: 0, status: 'alive'},{id: 1, status: 'alive'},{id: 2, status: 'alive'},{id: 3, status: 'alive'},
    {id: 4, status: 'alive'},{id: 5, status: 'alive'},{id: 6, status: 'alive'},{id: 7, status: 'alive'},
    {id: 8, status: 'alive'},{id: 9, status: 'alive'},{id: 10, status: 'alive'},{id: 11, status: 'alive'},
    {id: 12, status: 'alive'},{id: 13, status: 'alive'},{id: 14, status: 'alive'},{id: 20, status: 'alive'},
    {id: 21, status: 'alive'},{id: 22, status: 'alive'},{id: 23, status: 'alive'},{id: 24, status: 'alive'},
    {id: 25, status: 'alive'},{id: 26, status: 'alive'},{id: 27, status: 'alive'},{id: 28, status: 'alive'},
    {id: 29, status: 'alive'},{id: 30, status: 'alive'},{id: 31, status: 'alive'},{id: 32, status: 'alive'},
    {id: 33, status: 'alive'},{id: 34, status: 'alive'},{id: 40, status: 'alive'},{id: 41, status: 'alive'},
    {id: 42, status: 'alive'},{id: 43, status: 'alive'},{id: 44, status: 'alive'},{id: 45, status: 'alive'},
    {id: 46, status: 'alive'},{id: 47, status: 'alive'},{id: 48, status: 'alive'},{id: 49, status: 'alive'},
    {id: 50, status: 'alive'},{id: 51, status: 'alive'},{id: 52, status: 'alive'},{id: 53, status: 'alive'},
    {id: 54, status: 'alive'}
]

//aliens
alienInvaders.forEach(invader => {
    squares[currentInvaderIndex + invader.id].classList.add('invader')
})

//shooter
squares[currentShooterIndex].classList.add('shooter');

//move the shooter
function moveShooter(event) {
    if(!gameOver) {
        squares[currentShooterIndex].classList.remove('shooter');
        if(event.keyCode==37) {
            if(currentShooterIndex % width !== 0) {
                currentShooterIndex-=1;
            }
        } else if (event.keyCode==39) {
            if(currentShooterIndex%width < width-1) {
                currentShooterIndex+=1;
            }
        }
        squares[currentShooterIndex].classList.add('shooter');
    }
}

document.addEventListener('keydown', moveShooter)



function calculateLeftEdge() {

    const leftMost = () => {
        for(let i = 0; i<15; i++) {
            if (alienInvaders[i].status==='alive') {
                return i
            } else if (alienInvaders[i+15].status==='alive') {
                return i+15
            } else if (alienInvaders[i+30].status==='alive') {
                return i+30
            }
        }
        youWin()
    }

    return alienInvaders[leftMost()].id % width===0
}

function calculateRightEdge () {

    let rightMost = () => {
        for(let i = 14; i>=0; i--) {
            if (alienInvaders[i].status==='alive') {
                return i
            } else if (alienInvaders[i+15].status==='alive') {
                return i+15
            } else if (alienInvaders[i+30].status==='alive') {
                return i+30
            }
        }
        youWin()
    }
    return alienInvaders[rightMost()].id % width === width-1
} 

score.textContent = points
//move the alien invaders
function moveInvaders() {
    if(!gameOver) {
        leftEdge = calculateLeftEdge();
        rightEdge = calculateRightEdge();

        if ((leftEdge && direction === -1) || (rightEdge && direction === 1)) {
            direction = width
        } else if (direction === width) {
            if (leftEdge) {
                direction = 1
            }
            else if (rightEdge) {
                direction = -1
            } else {
                random = Math.floor(Math.random()*2)
                switch(random) {
                    case 0:
                        direction = 1;
                        break;
                    
                    case 1:
                        direction = -1;
                        break;
                }
            }
        }

        //erase the aliens from current spot
        for (let i = 0; i <= alienInvaders.length -1; i++) {
            squares[alienInvaders[i].id].classList.remove('invader')
        }

        //moves aliens to the newspot
        for (let i = 0; i <= alienInvaders.length -1; i++) {
            alienInvaders[i].id += direction
        }

        //draw aliens on new spot
        for (let i = 0; i <= alienInvaders.length-1; i++) {
            if(alienInvaders[i].status === 'alive') {
                squares[alienInvaders[i].id].classList.add('invader')
            }
        }
    }

    //decide a gamne over
    if(squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
        result.textContent = "Game Over"
        squares[currentShooterIndex].classList.add('boom')
        stop();
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        if(alienInvaders[i].id > (squares.length - (width-1))) {
            result.textContent = "Game Over";
            stop();
        }
    }

    //decide a win
    // if (points===alienInvaders.length) {
    //     result.textContent = 'You Win!'
    //     stop();
    // }
}
invaderId = setInterval(moveInvaders, 800);

//moveInvaders();
function findDeadAlien (index) {
    for (let i = 0; i<alienInvaders.length; i++) {
        if (alienInvaders[i].id === index) {
            return i;
        }
    }
}

function shoot(event) {
    let laserId
    let currentLaserIndex = currentShooterIndex

        //move the laser from the shooter to the alien invader
        if(!gameOver){ 
            function moveLaser() {
                squares[currentLaserIndex].classList.remove('laser')
                currentLaserIndex -= width
                squares[currentLaserIndex].classList.add('laser')
                if(squares[currentLaserIndex].classList.contains('invader')) {
                    squares[currentLaserIndex].classList.remove('laser')
                    squares[currentLaserIndex].classList.remove('invader')
                    squares[currentLaserIndex].classList.add('boom')

                    const deadAlien = findDeadAlien(currentLaserIndex)
                    alienInvaders[deadAlien].status = 'dead';
                    setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 250)
                    clearInterval(laserId)
                    points++;
                    score.textContent = points
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
}
document.addEventListener('keyup', shoot)

let findAlienLaserIndex = () => {
    finished = false;
    let random
    let randomAlien

    if(gameOver) {
        return 0
    } else{ 
        while(!finished) {
            random = Math.floor(Math.random()*45)
            randomAlien = alienInvaders[random].id

            if (alienInvaders[random].status==='alive') {
                return randomAlien
            }
        }
    }
}

function youWin(){
    result.textContent = 'You Win'
    stop()
}


function stop() {
    gameOver = true;
    clearInterval(invaderId)
    clearInterval(laserId)
    clearInterval(alienLaserId)
    clearTimeout(alienLaserTimer)
}

function alienShoot() {
    
    let currentAlienLaserIndex = findAlienLaserIndex()

    function moveAlienLaser() {
        if(!gameOver) {
            squares[currentAlienLaserIndex].classList.remove('AlienLaser');
            currentAlienLaserIndex += width;
            squares[currentAlienLaserIndex].classList.add('AlienLaser');
            if(squares[currentAlienLaserIndex].classList.contains('shooter')) {
                squares[currentAlienLaserIndex].classList.remove('AlienLaser')
                squares[currentAlienLaserIndex].classList.remove('shooter')
                squares[currentAlienLaserIndex].classList.add('boom')
                result.textContent = "Game Over";
                stop();
            }
        }
        
    }
    alienLaserId = setInterval(moveAlienLaser, 100)
}
alienLaserTimer = setInterval(alienShoot, 200)
