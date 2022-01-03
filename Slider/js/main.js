"use strict";
const app = new PIXI.Application({width: 950, height: 550, backgroundColor: 0xFFFFFF});
document.querySelector("#game").appendChild(app.view);

//constants
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;

//load images
PIXI.loader.add(["images/player.png", "images/spikes.png", "images/wall.png","images/noStop.png","images/exit.png"])
.on("progress",e=>{console.log(`progress=${e.progress}`)}).load(setup);

//aliases
let stage;
//game vaiables
let startScene;
let gameScene,player,lifeLabel,deathSound,backMusic,dt,held,time,started,direction,startx,starty,exit,movesLabel,scoreLabel,gameOverScoreLabel;
let gameScene2;
let gameScene3;
let gameOverScene;
let gameWinScene;

let spikes = [];
let walls = [];
let noStops = [];
let moves = 0;
let totalMoves = 0;
let life = 5;
let levelNum = 1;
let paused = true;

const keyboard = Object.freeze({
    W: 87,
    A: 65,
    S: 83,
    D: 68,
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39
});
const keys = [];

window.onkeyup = (e) => {
    keys[e.keyCode] = false;
    held = false;
    moveAdder(1);
    totalMoves++;
    e.preventDefault();
};
window.onkeydown = (e)=>{
    keys[e.keyCode] = true;
    time++;
    held = true;
};

//setup the base
function setup()
{
	stage = app.stage;

    //Start Scene
    startScene = new PIXI.Container();
    startScene.visible = true;
    stage.addChild(startScene);
    
    //levels
    gameScene = new PIXI.Container();
    gameScene.visible = false;
    stage.addChild(gameScene);

    gameScene2 = new PIXI.Container();
    gameScene2.visible = false;
    stage.addChild(gameScene2);

    gameScene3 = new PIXI.Container();
    gameScene3.visible = false;
    stage.addChild(gameScene3);

    //Game over Scene
    gameOverScene = new PIXI.Container();
    gameOverScene.visible = false;
    stage.addChild(gameOverScene);

    //Game win scene
    gameWinScene = new PIXI.Container();
    gameWinScene.visible = false;
    stage.addChild(gameWinScene);

    //Create player
    player = new Player(50, 500);
    gameScene.addChild(player);


    //Labels and buttons in all scenes
    createLabelsAndButtons();

    //Load sounds
    deathSound = new Howl({
        src: ['sounds/hit.mp3']
    });
    backMusic = new Howl({
        src: ['sounds/backMusic.mp3']
    });
    backMusic.play();

    //start update loop
    app.ticker.add(gameLoop);
}

//ceate the labels and buttons
function createLabelsAndButtons()
{
    //Start Scene setup
    //button style
    let buttonStyle = new PIXI.TextStyle({
        fill: 0xFF0000, 
        fontSize: 48, 
        fontFamily: "Press Start 2P",
        stroke: 0x000000, 
        strokeThickness: 4
    });

    //label 1
    let startLabel1 = new PIXI.Text("Slider");
    startLabel1.style = new PIXI.TextStyle({
        fill: 0xFF0000, 
        fontSize: 96, 
        fontFamily: 'Press Start 2P', 
        stroke: 0x000000, 
        strokeThickness: 6
    });
    startLabel1.x = 200
    startLabel1.y = 120;
    startScene.addChild(startLabel1);

    //label 2
    let startLabel2 = new PIXI.Text("Can you slide your way?");
    startLabel2.style = new PIXI.TextStyle({
        fill: 0xFF0000, 
        fontSize: 32, 
        fontFamily: "Press Start 2P",  
        stroke: 0x00000, 
        strokeThickness: 3
    });
    startLabel2.x = 125;
    startLabel2.y = 300;
    startScene.addChild(startLabel2);

    //add the button and set it up
    let startButton = new PIXI.Text("Begin");
    startButton.style = buttonStyle;
    startButton.x = 340;
    startButton.y = sceneHeight - 100;
    startButton.interactive = true;
    startButton.buttonMode = true;
    startButton.on("pointerup",startGame);
    startButton.on('pointerover',e=>e.target.alpha = 0.7);
    startButton.on('pointerout',e=>e.currentTarget.alpha = 1.0);
    startScene.addChild(startButton);


    //Game scene setup
    //text style
    let textStyle = new PIXI.TextStyle({
        fill: 0xFF0000,
        fontSize: 18,
        fontFamily: "Press Start 2P",
        stroke: 0x000000,
        strokeThickness: 2
    })

    //Life label
    lifeLabel = new PIXI.Text();
    lifeLabel.style = textStyle;
    lifeLabel.x = 10;
    lifeLabel.y = 20;
    gameScene.addChild(lifeLabel);
    decreaseLifeBy(0);

    //Move label
    movesLabel = new PIXI.Text();
    movesLabel.style = textStyle;
    movesLabel.x = 10;
    movesLabel.y = 50;
    gameScene.addChild(movesLabel);
    moveAdder(0);


    //Game over scene setup
    //text style
    let gameOverText = new PIXI.Text("Game Over!");
    textStyle = new PIXI.TextStyle({
        fill: 0xFF0000,
        fontSize: 64,
        fontFamily: "Press Start 2P",
        stroke: 0x000000,
        strokeThickness: 6
    })
    gameOverText.style = textStyle;
    gameOverText.x = 175;
    gameOverText.y = sceneHeight/2 - 160;
    gameOverScene.addChild(gameOverText);

    //final score
    gameOverScoreLabel = new PIXI.Text("Total Moves: ");
    gameOverScoreLabel.style = new PIXI.TextStyle({
        fill: 0xFF0000, 
        fontSize: 32, 
        fontFamily: "Press Start 2P",  
        stroke: 0x00000, 
        strokeThickness: 3
    });
    gameOverScoreLabel.x = 250;
    gameOverScoreLabel.y = 300;
    gameOverScene.addChild(gameOverScoreLabel);

    //Play again button
    let tryAgainButton = new PIXI.Text("Try Again?");
    tryAgainButton.style = buttonStyle;
    tryAgainButton.x = 225;
    tryAgainButton.y = sceneHeight - 100;
    tryAgainButton.interactive = true;
    tryAgainButton.buttonMode = true;
    tryAgainButton.on("pointerup",startGame);
    tryAgainButton.on('pointerover',e=>e.target.alpha = 0.7);
    tryAgainButton.on('pointerout',e=>e.currentTarget.alpha = 1.0);
    gameOverScene.addChild(tryAgainButton);


    //Game win scene setup
    //text style
    let gameWinText = new PIXI.Text("VICTORY!");
    textStyle = new PIXI.TextStyle({
        fill: 0xFF0000,
        fontSize: 64,
        fontFamily: "Press Start 2P",
        stroke: 0x000000,
        strokeThickness: 6
    })
    gameWinText.style = textStyle;
    gameWinText.x = 225;
    gameWinText.y = sceneHeight/2 - 160;
    gameWinScene.addChild(gameWinText);

    //final score
    scoreLabel = new PIXI.Text("Total Moves: ");
    scoreLabel.style = new PIXI.TextStyle({
        fill: 0xFF0000, 
        fontSize: 32, 
        fontFamily: "Press Start 2P",  
        stroke: 0x00000, 
        strokeThickness: 3
    });
    scoreLabel.x = 250;
    scoreLabel.y = 300;
    gameWinScene.addChild(scoreLabel);

    //Play again button
    let playAgainButton = new PIXI.Text("Play Again?");
    playAgainButton.style = buttonStyle;
    playAgainButton.x = 225;
    playAgainButton.y = sceneHeight - 100;
    playAgainButton.interactive = true;
    playAgainButton.buttonMode = true;
    playAgainButton.on("pointerup",startGame);
    playAgainButton.on('pointerover',e=>e.target.alpha = 0.7);
    playAgainButton.on('pointerout',e=>e.currentTarget.alpha = 1.0);
    gameWinScene.addChild(playAgainButton);
}

//Creates level 1
function makeLevel()
{
    //Define player starting position
    startx = player.width/2;
    starty = sceneHeight - (player.height/2);

    //Level 1
    //Add walls
    //Lower wall
    walls.push(new Wall(startx, starty-player.height));
    walls.push(new Wall(walls[0].x+walls[0].width, starty-player.height));
    walls.push(new Wall(walls[1].x+walls[1].width, starty-player.height));
    walls.push(new Wall(walls[2].x+walls[2].width, starty-player.height));
    walls.push(new Wall(walls[3].x+walls[3].width, starty-player.height));
    walls.push(new Wall(walls[4].x+walls[4].width, starty-player.height));
    walls.push(new Wall(walls[5].x+walls[5].width, starty-player.height));
    //upper wall
    walls.push(new Wall(900, 200));
    walls.push(new Wall(800, 200));
    walls.push(new Wall(700, 200));
    walls.push(new Wall(600, 200));
    walls.push(new Wall(500, 200));
    walls.push(new Wall(400, 200));
    walls.push(new Wall(150, 200));
    walls.push(new Wall(50, 200));

    //Add spikes
    //Lower wall
    spikes.push(new Spikes(940, 500));
    spikes[0].rotation = Math.PI * (3/2);
    spikes.push(new Spikes(940, 400));
    spikes[1].rotation = Math.PI * (3/2);
    spikes.push(new Spikes(940, 300));
    spikes[2].rotation = Math.PI * (3/2);
    //top
    spikes.push(new Spikes(50, 10));
    spikes[3].rotation = Math.PI;
    spikes.push(new Spikes(150, 10));
    spikes[4].rotation = Math.PI;
    spikes.push(new Spikes(250, 10));
    spikes[5].rotation = Math.PI;
    spikes.push(new Spikes(350, 10));
    spikes[6].rotation = Math.PI;
    spikes.push(new Spikes(750, 10));
    spikes[7].rotation = Math.PI;
    spikes.push(new Spikes(850, 10));
    spikes[8].rotation = Math.PI;
    spikes.push(new Spikes(950, 10));
    spikes[9].rotation = Math.PI;
    //Mid wall
    spikes.push(new Spikes(10, 300));
    spikes[10].rotation = Math.PI * (1/2);

    //Add no stopping zones
    noStops.push(new NoStop(500, 300));
    noStops.push(new NoStop(450, 100));
    noStops.push(new NoStop(550, 100));
    noStops.push(new NoStop(650, 100));
    noStops.push(new NoStop(450, 0));
    noStops.push(new NoStop(550, 0));
    noStops.push(new NoStop(650, 0));

    //Add obstacles to the scene
    for(let s in spikes)
    {
        gameScene.addChild(spikes[s]);
    }
    for(let w in walls)
    {
        gameScene.addChild(walls[w]);
    }
    for(let n in noStops)
    {
        gameScene.addChild(noStops[n]);
    }

    //Add exit
    exit = new ExitPortal(900, 100);
    gameScene.addChild(exit);
}

//Creates level 2
function makeLevel2()
{
    //Define player starting position
    startx = player.width/2;
    starty = sceneHeight - (player.height/2);
    ResetLevel();
    //Level 1
    //Add walls
    //first vert
    walls.push(new Wall(200, 500));
    walls.push(new Wall(200, 400));
    walls.push(new Wall(200, 300));
    walls.push(new Wall(200, 200));
    //top wall
    walls.push(new Wall(400, 200));
    walls.push(new Wall(500, 200));
    walls.push(new Wall(600, 200));
    walls.push(new Wall(700, 200));
    walls.push(new Wall(500, 280));
    walls.push(new Wall(600, 280));
    walls.push(new Wall(700, 280));
    //right wall
    walls.push(new Wall(700, 200));
    walls.push(new Wall(750, 500));
    //short cut vert
    walls.push(new Wall(400, 300));
    walls.push(new Wall(400, 370));
    walls.push(new Wall(500, 370));
    walls.push(new Wall(550, 370));

    //Add spikes
    //top
    spikes.push(new Spikes(50, 10));
    spikes[0].rotation = Math.PI;
    spikes.push(new Spikes(150, 10));
    spikes[1].rotation = Math.PI;
    spikes.push(new Spikes(250, 10));
    spikes[2].rotation = Math.PI;
    spikes.push(new Spikes(350, 10));
    spikes[3].rotation = Math.PI;
    spikes.push(new Spikes(650, 10));
    spikes[4].rotation = Math.PI;
    spikes.push(new Spikes(750, 10));
    spikes[5].rotation = Math.PI;
    spikes.push(new Spikes(850, 10));
    spikes[6].rotation = Math.PI;
    //shortcut
    spikes.push(new Spikes(300, 540));
    //side
    spikes.push(new Spikes(940, 50));
    spikes[8].rotation = Math.PI*(3/2);
    spikes.push(new Spikes(940, 150));
    spikes[9].rotation = Math.PI*(3/2);
    spikes.push(new Spikes(940, 350));
    spikes[10].rotation = Math.PI*(3/2);
    spikes.push(new Spikes(940, 450));
    spikes[11].rotation = Math.PI*(3/2);
    spikes.push(new Spikes(940, 550));
    spikes[12].rotation = Math.PI*(3/2);
    spikes.push(new Spikes(850, 540));
    spikes.push(new Spikes(400, 540));
    spikes.push(new Spikes(500, 540));
    spikes.push(new Spikes(600, 540));
    spikes.push(new Spikes(700, 540));

    //Add no stopping zones
    noStops.push(new NoStop(300, 250));
    noStops.push(new NoStop(300, 350));
    noStops.push(new NoStop(100, 350));
    //Shortcut
    noStops.push(new NoStop(0, 350));
    //top
    noStops.push(new NoStop(450, 100));
    noStops.push(new NoStop(550, 100));
    noStops.push(new NoStop(450, 0));
    noStops.push(new NoStop(550, 0));
    //right
    noStops.push(new NoStop(800, 250));
    noStops.push(new NoStop(900, 250));

    //Add obstacles to the scene
    for(let s in spikes)
    {
        gameScene2.addChild(spikes[s]);
    }
    for(let w in walls)
    {
        gameScene2.addChild(walls[w]);
    }
    for(let n in noStops)
    {
        gameScene2.addChild(noStops[n]);
    }
    
    //Add exit
    exit = new ExitPortal(500, 470);
    gameScene2.addChild(exit);

    //Add misc
    player.x = startx;
    player.y = starty;
    time = 0;
    gameScene2.addChild(player);
    gameScene2.addChild(lifeLabel);
    gameScene2.addChild(movesLabel);
}

//Creates level 3
function makeLevel3()
{
    //Define player starting position
    startx = player.width/2;
    starty = sceneHeight - (player.height/2);
    ResetLevel();

    //walls
    //bottom
    walls.push(new Wall(50,400));
    walls.push(new Wall(100,400));
    walls.push(new Wall(200,400));
    walls.push(new Wall(300,400));
    walls.push(new Wall(550,400));
    walls.push(new Wall(600,400));
    walls.push(new Wall(700,400));
    //middle
    walls.push(new Wall(200,350));
    walls.push(new Wall(300,350));
    walls.push(new Wall(550,350));
    walls.push(new Wall(600,350));
    walls.push(new Wall(700,350));
    walls.push(new Wall(800,350));
    //top
    walls.push(new Wall(200,150));
    walls.push(new Wall(300,150));
    walls.push(new Wall(550,150));
    walls.push(new Wall(600,150));
    walls.push(new Wall(700,150));
    walls.push(new Wall(800,150));
    walls.push(new Wall(900,150));
    walls.push(new Wall(550,50));
    walls.push(new Wall(600,50));
    walls.push(new Wall(700,50));
    walls.push(new Wall(800,50));
    walls.push(new Wall(900,50));
    
    //spikes
    //middle
    spikes.push(new Spikes(50,340));
    spikes.push(new Spikes(150,340));
    //corner
    spikes.push(new Spikes(900,540));
    spikes.push(new Spikes(940,500));
    spikes[3].rotation = Math.PI*(3/2);

    //nostops
    //bottom
    noStops.push(new NoStop(250,500));
    noStops.push(new NoStop(590,500));
    noStops.push(new NoStop(690,500));
    //middle col
    noStops.push(new NoStop(400,300));
    noStops.push(new NoStop(500,300));
    noStops.push(new NoStop(400,200));
    noStops.push(new NoStop(500,200));
    //middle row
    noStops.push(new NoStop(300,250));
    noStops.push(new NoStop(600,250));
    noStops.push(new NoStop(700,250));


    //Add obstacles to the scene
    for(let s in spikes)
    {
        gameScene3.addChild(spikes[s]);
    }
    for(let n in noStops)
    {
        gameScene3.addChild(noStops[n]);
    }
    for(let w in walls)
    {
        gameScene3.addChild(walls[w]);
    }
    
    //Add exit
    exit = new ExitPortal(800, 400);
    gameScene3.addChild(exit);

    //Add misc
    player.x = startx;
    player.y = starty;
    time = 0;
    gameScene3.addChild(player);
    gameScene3.addChild(lifeLabel);
    gameScene3.addChild(movesLabel);
}

//resets all the level components
function ResetLevel()
{
    spikes = [];
    walls = [];
    noStops = [];
    exit = [];
    gameScene.addChild(player);
    gameScene.addChild(lifeLabel);
    gameScene.addChild(movesLabel);
    moves = 0;
    moveAdder(0);
}

//Start the game
function startGame()
{
    gameWinScene.visible = false;
    ResetLevel();
    makeLevel();
    startScene.visible = false;
    gameOverScene.visible = false;
    gameScene.visible = true; 
    levelNum = 1;
    life = 5;
    moves = 0;
    decreaseLifeBy(0);
    player.x = startx;
    player.y = starty;
    held = false;
    started = false;
    time = 0;
    paused = false;
    gameLoop();
}

//Decrease the players lives by the specified amount
function decreaseLifeBy(value)
{
    life -= value;
    let lifeTris = "";
    for(let i = 0; i < life; i++){
        lifeTris += "▲";
    }
    lifeLabel.text = `Lives Remaining:${lifeTris}`;
}

//Adds to the moves count
function moveAdder(value)
{
    moves += value;
    movesLabel.text = `Moves: ${moves}`;
}

//Main game loop
function gameLoop()
{
	if (paused) return;
	// #1 - Calculate "delta time"
    dt = 1/app.ticker.FPS;
    if(dt > 1/12) 
    {
        dt=1/12;
    }

    // #2 - Check Keys
    if(keys[keyboard.RIGHT] || keys[keyboard.D])
    {
        player.dx = player.speed;
        player.rotation = 1/2*Math.PI;
    }
    else if(keys[keyboard.LEFT] || keys[keyboard.A])
    {
        player.dx = -player.speed;
        player.rotation = 3/2*Math.PI;
    }
    else if(time <= 0)
    {
        player.dx = 0;
    }
    if(keys[keyboard.DOWN] || keys[keyboard.S])
    {
        player.dy = player.speed;
        player.rotation = Math.PI;
    }
    else if(keys[keyboard.UP] || keys[keyboard.W])
    {
        player.dy = -player.speed;
        player.rotation = 0;
    }
    else if(time <= 0)
    {
        player.dy = 0;
    } 
    //Actually move
    if(time > 0 && !held)
    {
        player.move(dt, sceneWidth, sceneHeight);
        time--;
    }

    //check collsions
    collisionCheck();

	//check game over
    //check for loss
    if(life <= 0)
    {
        end();
        return;
    }
    //check for win
    if(player.collides(exit))
    {
        if(gameScene.visible === true)
        {
            gameScene.visible = false;
            makeLevel2();
            gameScene2.visible = true;
        }
        else if(gameScene2.visible === true)
        {
            gameScene2.visible = false;
            makeLevel3();
            gameScene3.visible = true;
        }
        else
        {
            gameScene3.visible = false;
            gameWinScene.visible = true;
            scoreLabel.text = `Total Moves: ${totalMoves}`; 
            paused = true;
            totalMoves = 0;
        }
    }
}

//Check collisions
function collisionCheck()
{
    //check for collisions with walls
    for(let i = 0; i < walls.length; i++)
    {
        //stop player from going through walls
        if(player.collides(walls[i]))
        {
            //Calculate the edges of the wall collided with
            let wTop = walls[i].y+(walls[i].height/2);
            let wBot = walls[i].y-(walls[i].height/2);
            let wRight = walls[i].x+(walls[i].width/2);
            let wLeft = walls[i].x-(walls[i].width/2);
            let w = player.width/2;
            let h = player.height/2;
            let xoff = player.x - walls[i].x;
            let yoff = player.y - walls[i].y;
            if(Math.abs(xoff) > Math.abs(yoff) && xoff < 0)
            {
                player.x = wLeft-w;
            }
            else if(Math.abs(xoff) > Math.abs(yoff)&& xoff > 0)
            {
                player.x = wRight+w;
            }
            else if(Math.abs(xoff) < Math.abs(yoff) && yoff > 0)
            {
                player.y = wTop+h;
            }
            else if(Math.abs(xoff) < Math.abs(yoff) && yoff < 0)
            {
                player.y = wBot-h;
            }
        }
    }
    
    //check for collisions with spikes
    for(let i = 0; i < spikes.length; i++)
    {
        //kill player if they hit spikes
        if(player.collides(spikes[i]))
        {
            console.log("Spike");
            decreaseLifeBy(1);
            deathSound.play();
            time = 0;
            player.x = startx;
            player.y = starty;
        }
    }

    //check for nostops
    if(time <= 0){
        for(let i = 0; i < noStops.length; i++)
        {
            //kill player if they hit spikes
            if(player.collides(noStops[i]))
            {
                console.log("noStop");
                decreaseLifeBy(1);
                deathSound.play();
                time = 0;
                player.x = startx;
                player.y = starty;
            }
        }
    }
}

//Ends the game
function end()
{
    paused = true;
    gameOverScoreLabel.text = `Total Moves: ${totalMoves}`;
    totalMoves = 0;
    ResetLevel();
    gameOverScene.visible = true;
    gameScene.visible = false;
    gameScene2.visible = false;
    gameScene3.visible = false;
}
