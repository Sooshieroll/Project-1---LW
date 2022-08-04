let game = document.getElementById('myGame');
let context = game.getContext('2d');
context.font = 'bold 30px cursive';
let scrollCounter, cameraY, current, mode, xSpeed;
let ySpeed = 5;
let height = 50;
let blocks = [];
blocks[0] = {
    x: 300,
    y: 300,
    width: 225,
}; // how tall and wide the stacking blocks are
let missedBlocks = {
    x: 0,
    width: 0,
};

function nextBlock() {
    blocks[current] = {
        x: 0,
        y: (current + 9) * height, // how tall it is from the prior block
        width: blocks[current - 1].width
    };
}

function gameOver() {
    mode = 'gameOver';
    context.fillText('Game over. Click here to play again!', 50, 50);
}


function animate() {
    if (mode != 'gameOver') {
        context.clearRect(0, 0, game.width, game.height);
        context.fillText('Score: ' + (current - 1).toString(), 100, 200);
        for (let n = 0; n < blocks.length; n++) {
            let box = blocks[n];
            context.fillStyle = 'rgb(' + n * 16 + ',' + n * 16 + ',' + n * 16 + ')';
            context.fillRect(box.x, 600 - box.y + cameraY, box.width, height);
        }
        context.fillStyle = 'blue';
        context.fillRect(missedBlocks.x, 600 - missedBlocks.y + cameraY, missedBlocks.width, height);
        if (mode == 'bounce') {
            blocks[current].x = blocks[current].x + xSpeed;
            if (xSpeed > 0 && blocks[current].x + blocks[current].width > game.width)
                xSpeed = -xSpeed;
            if (xSpeed < 0 && blocks[current].x < 0)
                xSpeed = -xSpeed;
        }
        if (mode == 'fall') {
            blocks[current].y = blocks[current].y - ySpeed;
            if (blocks[current].y == blocks[current - 1].y + height) {
                mode = 'bounce';
                let difference = blocks[current].x - blocks[current - 1].x;
                if (Math.abs(difference) >= blocks[current].width) {
                    gameOver();
                }
                missedBlocks = {
                    y: blocks[current].y,
                    width: difference
                }
                if (blocks[current].x > blocks[current - 1].x) {
                    blocks[current].width = blocks[current].width - difference;
                    missedBlocks.x = blocks[current].x + blocks[current].width;
                } else {
                    missedBlocks.x = blocks[current].x - difference;
                    blocks[current].width = blocks[current].width + difference;
                    blocks[current].x = blocks[current - 1].x;
                }
                if (xSpeed > 0)
                    xSpeed++
                else
                    xSpeed--;
                current++;
                scrollCounter = height;
                nextBlock();
                if (difference == 0) {
                    let popup = document.querySelector('h2');
                    popup.innerHTML = 'Perfect!';
                    setTimeout(function () {
                        popup.innerHTML = 'Perfect!';
                    }, 2000);
                }
            }

        }
        missedBlocks.y = missedBlocks.y - ySpeed;
        if (scrollCounter) {
            cameraY++;
            scrollCounter--;
        }
    }
    window.requestAnimationFrame(animate);
}



function flashing() {
    let flash = document.getElementById('title');
    setInterval(function () {
        if (current > 16)
            flash.style.visibility = (flash.style.visibility == "hidden" ? '' : 'hidden');
    }, 1000)
}


function restart() {
    blocks.splice(1, blocks.length - 1);
    mode = 'bounce';
    cameraY = 0;
    scrollCounter = 0;
    xSpeed = 2;
    current = 1;
    nextBlock();
    missedBlocks.y = 0;
}

game.onpointerdown = function () {
    if (mode == 'gameOver')
        restart();
    else {
        if (mode == 'bounce')
            mode = 'fall';
    }
};

document.body.addEventListener("keyup", (e) => {
    if (e.keyCode === 32)
        mode = 'fall';
});



flashing();
restart();
animate();