var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided,trex_shooting;
var ground, invisibleGround, groundImage;
var backgroundImg;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var green_balloon, red_balloonAnimation,blue_balloon;
var redGroup,blueGroup,greenGroup;
var score;
var gameOverImg,restartImg;
var jumpSound , checkPointSound, dieSound,musicSound,shootSound;

function preload(){
restartImg = loadImage("restart.png")
gameOverImg = loadImage("gameOver.png")

trex_running = loadAnimation("cuphead.gif");
trex_collided = loadAnimation("cupheadDead.png");
trex_shooting=loadImage("cupheadShoot.png")
backgroundImg=loadImage("background.png");
groundImage = loadImage("Floor.png");
arrowImage = loadImage("fire.png");

red_balloonAnimation=loadImage("flor.png");  
blue_balloon=loadImage("goopy.png");
green_balloon=loadImage("rana.png");

obstacle1 = loadImage("tuberia.png");
obstacle2 = loadImage("Larnacle.webp");
obstacle3 = loadImage("tronco.png");
  
jumpSound = loadSound("jump.mp3")
dieSound = loadSound("die.mp3")
checkPointSound = loadSound("checkPoint.mp3")
musicSound=loadSound("music.mp3")
shootSound=loadSound("shoot.mp3")

}

function setup() {
createCanvas(2020, 1000);
musicSound.loop(); 

var message = "This is a message";
console.log(message)

trex = createSprite(200,680,20,20);
trex.addAnimation("running", trex_running);
trex.addAnimation("collided", trex_collided);
trex.addAnimation("shooting", trex_shooting);

trex_collided.scale=0.5;
 
trex.scale = 1.5;
  
ground = createSprite(700,670,9000,20);
ground.addImage("ground",groundImage);
ground.x = ground.width /2;
ground.scale=2.2
  

  
invisibleGround = createSprite(200,830,700,10);
invisibleGround.visible = false;
  
//create Obstacle and Cloud Groups
obstaclesGroup = createGroup();

trex.setCollider("circle",5,20,75);
trex.debug = true
arrowGroup= new Group(); 

score = 0;  
redGroup = new Group();
blueGroup= new Group();
greenGroup= new Group();

gameOver = createSprite(1010,500);
gameOver.addImage(gameOverImg);

restart = createSprite(1010,700);
restart.addImage(restartImg);

gameOver.scale =1.5;
restart.scale =2.5;
}
function draw() { 
background(backgroundImg);
//displaying score
textSize(50);
text("Score: "+ score, 1500,150);

if(gameState === PLAY){
  
gameOver.visible = false;
restart.visible = false;

if (keyDown("SHIFT")){
    trex.changeAnimation("shooting", trex_shooting);
  }
if (keyWentUp("SHIFT")){
    trex.changeAnimation("running", trex_running);
  }    

if (keyWentDown("shift")) {
createArrow();
}
var select_balloon = Math.round(random(1,3));

if (World.frameCount % 60 == 0) {
if (select_balloon == 1) { 
redBalloon();
}
}
if (World.frameCount %100 == 0) {
  if (select_balloon == 1) { 
    blueBalloon();
  }
}  
   if (World.frameCount %80 == 0) {
  if (select_balloon == 1) { 
    greenBalloon();
  }  
}      
if(arrowGroup.isTouching(redGroup)){
  redGroup.destroyEach();
  arrowGroup.destroyEach();}

  if(arrowGroup.isTouching(blueGroup)){
    blueGroup.destroyEach();
    arrowGroup.destroyEach();}
        
if(arrowGroup.isTouching(greenGroup)){
      greenGroup.destroyEach();
      arrowGroup.destroyEach();}
              
ground.velocityX = -(25* score/50)
//scoring
score = score + Math.round(getFrameRate()/60);
    
if(score>0 && score%500 === 0){
checkPointSound.play() 
}    
if (ground.x < 0){
ground.x = ground.width/2;
}    
//jump when the space key is pressed
if(keyDown("space")&& trex.y >= 600) {
trex.velocityY = -50;
jumpSound.play();
}
//add gravity
trex.velocityY = trex.velocityY + 2.9;

//spawn obstacles on the ground
spawnObstacles();

if(obstaclesGroup.isTouching(trex)){
//trex.velocityY = -12;
jumpSound.play();
gameState = END; 
dieSound.play()
}
if(redGroup.isTouching(trex)){
  //trex.velocityY = -12;
  jumpSound.play();
  gameState = END; 
  dieSound.play()
  }
  if(blueGroup.isTouching(trex)){
    //trex.velocityY = -12;
    jumpSound.play();
    gameState = END; 
    dieSound.play()
    }
    if(greenGroup.isTouching(trex)){
      //trex.velocityY = -12;
      jumpSound.play();
      gameState = END; 
      dieSound.play()
      }
}
else if (gameState === END) {
gameOver.visible = true;
restart.visible = true;
 
musicSound.stop() 

//change the trex animation
trex.changeAnimation("collided", trex_collided);
         
ground.velocityX = 0;
trex.velocityY = 0
      
//set lifetime of the game objects so that they are never destroyed
obstaclesGroup.destroyEach();
redGroup.destroyEach();
blueGroup.destroyEach();
greenGroup.destroyEach();  
arrowGroup.destroyEach();

/*obstaclesGroup.setLifetimeEach(-1);     
obstaclesGroup.setVelocityXEach(0);

redGroup.setLifetimeEach(-1);     
redGroup.setVelocityXEach(0);

blueGroup.setLifetimeEach(-1);     
blueGroup.setVelocityXEach(0);

greenGroup.setLifetimeEach(-1);     
greenGroup.setVelocityXEach(0);*/
}

//stop trex from falling down
trex.collide(invisibleGround);
  
if(mousePressedOver(restart)&&gameState===END) {
musicSound.stop() 
reset();
}

drawSprites();
}
function reset(){
gameState=PLAY;
gameOver.visible = false;
restart.visible = false;

obstaclesGroup.destroyEach();
redGroup.destroyEach();
blueGroup.destroyEach();
greenGroup.destroyEach();
  
trex.changeAnimation("running", trex_running);

musicSound.loop() 

score=0;
}
function redBalloon() {
var red= createSprite(1900,500,10,40);
red.velocityX = -(50 + score/20);
red.addImage("levitating",red_balloonAnimation);
red.lifetime = 150;
red.scale = 1.2;
red.lifetime = 1000;
redGroup.add(red);
}
function blueBalloon() {
  var blue= createSprite(1900,500,10,40);
  blue.velocityX = -(130 + score/20);
  blue.addImage("levitating2",blue_balloon);
  blue.lifetime = 150;
  blue.scale = 1;
  blue.lifetime = 1000;
  blueGroup.add(blue);
  }
  function greenBalloon() {
    var green= createSprite(1900,500,10,40);
    green.velocityX = -(90 + score/20);
    green.addImage("levitating3",green_balloon);
    green.lifetime = 150;
    green.scale = 1.2;
    green.lifetime = 1000;
    greenGroup.add(green);
    }
function createArrow() {
var arrow= createSprite(100, 100, 60, 10);
    arrow.addImage(arrowImage);
    arrow.x =trex.x;
    arrow.y=trex.y;
    shootSound.play();
    arrow.velocityX = 100;
    arrow.lifetime = 400;
    arrow.scale = 0.7;
    arrow.lifetime = 400;
    //trex.changeAnimation("shooting", trex_shooting);
    arrowGroup.add(arrow);
}

function spawnObstacles(){
if (frameCount % 40 === 0){
var obstacle = createSprite(1900,690,10,40);
obstacle.velocityX = -(40 + score/50);
//generate random obstacles
var rand = Math.round(random(1,3));
switch(rand) {
case 1: obstacle.addImage(obstacle1);
              break;
case 2: obstacle.addImage(obstacle2);
              break;
case 3: obstacle.addImage(obstacle3);
              break;
default: break;
}
//assign scale and lifetime to the obstacle           
obstacle.scale = 1.5;
obstacle.lifetime = 300;
//add each obstacle to the group
obstaclesGroup.add(obstacle);
}
}