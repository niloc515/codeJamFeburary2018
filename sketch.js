var spr;
var target;
var points;
var highScore;
var gun;
var bullets;
var timer;
var timeToNextShot;

//TODO: leaderboard
//TODO: loosing phrases array (MOTHERFUCKER?)
//TODO: adjust multiplier for speeding up bullets
//TODO: add spawn point
//TODO: adjust colour generator so colours arent dark
//TODO: cookie for high score

//experimental
//TODO: game over w/ lives
//TODO: arrow key controls
//TODO: sounds?
//TODO: timer till next points
//TODO: level system,
      //different spawn points,
      //less  time,
      //background colour
      //changes,

function setup() {
  //instanciate varibles for the scores
  points = 0;
  highScore = 0;
  //create the canvas
  createCanvas(windowWidth, windowHeight / 2);

  //create player character sprite
  spr = createSprite(
    width/2, height/2, 40, 40);
  spr.shapeColor = color(125);

  //create the target sprite
  target = createSprite(
    random(100, width-100),
    random(100, height-100), 20, 20);
  target.shapeColor = color(getRandomColor());

  //create the bullets group and initialize the timer and time to
  //next shot for the bullets
  bullets = new Group();
  timeToNextShot = 2000;
  timer = millis();
}

function draw() {

  background(25);
  spr.position.x = mouseX;
  spr.position.y = mouseY;

  //spr.overlap(target, resetTarget());
  target.overlap(spr, resetTarget);
  bullets.overlap(spr, whoops);

  //gun.addSpeed(0, atan2(mouseX , mouseY));

  if(millis() - timer >= timeToNextShot - (points * 10)){
      shoot();
  }
  for(var i = 0; i < bullets.length; i++){
    if(bullets[i].position.x > width || bullets[i].position.x < 0){
      bullets[i].remove();
      bullets.remove(bullets[i]);
    }
  }

  drawSprites();

  textSize(48);
  fill(255);
  text(points, 50, 50);

  if(points > highScore){
    highScore = points;
  }

  textSize(36);
  fill(255);
  text("High Score: " + highScore, 50, 100);

}

function whoops(){
  textSize(72);
  fill(255);
  text("whoops!", width/2, height/2);
  points = 0;
}

function shoot(){
  var bullet = createSprite(windowWidth - 60,
    (windowHeight / 2) - 60,
    10,
    10,);
  bullet.attractionPoint(0.8, mouseX, mouseY);
  bullet.shapeColor = color('#ffbf00');
  bullets.add(bullet);
  //var tempX, tempY;
  timer = millis();
}

function resetTarget(){
  points++;
  target.remove();
  target = createSprite(
    random(100, width-100),
    random(100, height-100),
    20,
    20,
  );
}

function resetSprite(s, size){
  points++;
  s.remove();
  s = createSprite(
    random(100, width-100),
    random(100, height-100),
    size,
    size);
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
