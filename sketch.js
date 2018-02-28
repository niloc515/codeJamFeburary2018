var spr;              //the player sprite
var target;           //the target the player is chasing
var points;           //the number of points the player has
var highScore;        //the players high score
var gun;              //the spawn point for the bullets
var bullets;          //the group of sprites for the player to avoid
var loosingPhrases;   //the array of string messages that could appear upon loosing
var encouragement;    //phrases of encouragment when certain amount of points is reached
var message;          //the message currently appearing upon loosing
var shotTimer;        //current time in milli seconds for
var targetTimer;      //time till target gets moved
var timeToMoveTarget; //time till the target gets moved
var timeToNextShot;   //time till the next bullet is created
var overlapFlag;      //flag for wether the player is overlapping with a bullets

//TODO: add spawn point
//TODO: adjust colour generator so colours arent dark
//TODO: pause button (p key)
//TODO: positive messages for doing well (in progress)

//bugs to fix
//TODO: fix bullet death bug so they die when they leave canvas
//TODO: collide with edges of canvas

//experimental
//TODO: leaderboard
//TODO: game over w/ lives
//TODO: arrow key controls
//TODO: sounds?
//TODO: level system,
      //different spawn points,
      //less  time,
      //background colour
      //changes,

function setup() {//start setup
  //instanciate varibles for the scores
  points = 0;
  checkCookie();    //sets the highScore according to the cookie

  loosingPhrases = ["Whoops", "Uh oh", "Oops", ":(", "Darn",
                    "A for effort", "An attempt was made", "#@&$!"];
  encouragment = ["Good job", "Keep going!", "Yay!", ":)"];
  overlapFlag = false; //true if mouse overlaps with bullets

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

  //create the bullets group and initialize the shotTimer and time to
  //next shot for the bullets
  bullets = new Group();
  timeToNextShot = 2000;
  shotTimer = millis();
  targetTimer = millis();
  timeToMoveTarget = 2500;
}//end setup

function draw() {//start draw

  background(25);
  spr.position.x = mouseX;
  spr.position.y = mouseY;

  //what happens whe the mouse overlaps the other sprites
  target.overlap(spr, resetTarget);
  if(bullets.overlap(spr) && !overlapFlag){
    overlapFlag = true;
    message = random(loosingPhrases);
    whoops();
  }
  else if(bullets.overlap(spr) && overlapFlag){
    whoops();
  }
  else if(!bullets.overlap(spr)){
    overlapFlag = false;
  }


  if(millis() - shotTimer >= timeToNextShot - (points * 20)){
      shoot();
  }
  for(var i = 0; i < bullets.length; i++){
    if(bullets[i].position.x > width || bullets[i].position.x < 0
        || bullets[i].position.y > height || bullets[i].position.y < 0){
      bullets.remove(bullets[i]);
    }
  }
  //moves the taget if player is taking too long
  if(millis() - targetTimer >= timeToMoveTarget){
    moveTarget();
  }

  drawSprites();

  textSize(48);
  fill(255);
  text(points, 50, 50);

  if(points > highScore){
    highScore = points;
    setCookie("hS", highScore);
  }

  textSize(36);
  fill(255);
  text("High Score: " + highScore, 50, 100);

}//end draw

/**
 * Displays a message and resets current points to zero
 */
function whoops(){
  textSize(72);
  fill(255);
  text(message, width/2, height/2);
  points = 0;
}

/**
 * Creates a new bullet sprite, adds it to the "bullets" group
 * and resets the shotTimer to the current time in miliseconds
 */
function shoot(){
  var bullet = createSprite(windowWidth - 60,
    (windowHeight / 2) - 60,
    10,
    10,);
  bullet.attractionPoint(0.8 + (0.1 * points), mouseX, mouseY);
  bullet.shapeColor = color('#ffbf00');
  bullets.add(bullet);
  //var tempX, tempY;
  shotTimer = millis();
}

/**
 * Adds to score and moves the target to a new location
 */
function resetTarget(){
  points++;
  moveTarget();
}

/**
 * Moves the target sprite
 */
function moveTarget(){
  target.remove();
  target = createSprite(
    random(100, width-100),
    random(100, height-100),
    20,
    20,
  );
  targetTimer = millis();
}

/**
 * Function to add a value to the cookie
 * @param cName the name of the cookie
 * @param cValue the value of the cookie
*/
function setCookie(cName, cValue) {
    var exDate = new Date();    //the expirery date of the cookie
    exDate.setTime(exDate.getTime() + (30 *86400000));
    var expires = "expires="+ exDate.toUTCString();
    document.cookie = cName + "=" + cValue + ";" + expires + ";path=/";
}

/**
 * Function to set the value of the cookie
 * @param cName the name of the cookie
 * @param cValue the value of the cookie
*/
function getCookie(cName) {
    var name = cName + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

/**
 * Checks the value of the cookie and sets the high score accordinly
*/
function checkCookie(){
  var hS=getCookie("hS");
  if(hS != ""){
    highScore = hS;
  }
  else{
    highScore = 0;
  }
}

/**
 * Returns a random hex colour
 * @return a hex colour (eg. #AA0099)
 */
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
