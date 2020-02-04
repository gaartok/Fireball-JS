let originalScreenWidth = 640;
let originalScreenHeight = 480;
let imgSplash;
let imgBackground;
let gameState;
let timeToSwitchState;
let debrisEmitter;
let playerLevel;
let nextSpewTime;       // when we should spew another rock out the volcano
let spewRateMin = 1000; // rate at which to spew rocks in milliseconds (min time between)
let spewRateMax = 3000; // rate at which to spew rocks in milliseconds (max time between)
let rockCount = 0;
let rockInstance = 0;
let alreadyAlerted = false;
let debugTextY = 5;
let debugHeight;
let rockStartLocXMin;
let rockStartLocXMax;
let rockStartLocY;
let greatBalls;
let highScores = new Array();
let aliveList = new Array();
let theXMLObject = null;
let userInitials = "DAD";
let baseURL = "http://localhost/greygames/public_html/thoughtwaves/demos/Fireball/";


let instructions = new Array
  (
  "You were in your house when it happened.",
  "The volcano started to erupt!!  You grab",
  "your bucket, run outside, and fill the",
  "bucket with water.  Try to catch all the",
  "fireballs, but make sure you don't get hit",
  "on the head by one.  You must keep your",
  "bucket full of water to exterminate the",
  "flames. It's up to you to save the town.",
  "             GOOD LUCK!",
  " ",
  "             How To Play",
  "To move the person, push the left and right",
  "arrow keys.  Keep the bucket full of water",
  "by standing under the faucets on the house.",
  "If you let the houses burn down, you will",
  "have no water to full your bucket, so",
  "protect the houses!",
  " ",
  "        Click screen to begin"
  );



function preload()
{
//  sounds = loadJSON('./Sounds.json',"","json",preloadStep2);
//  images = loadJSON('./Images.json',"","json",preloadStep2);

  sounds =  {
    GREATBALLS  : "art/grtballs.wav",
    AAAH        : "art/aaah.wav",
    ARGH        : "art/089_argh.wav",
    AGONY       : "art/agony.wav",
    AHHHHHHH    : "art/ahhhhh.wav",
    BONK        : "art/aaah.wav",
    JIBBERISH   : "art/jiberish.wav",
    KINISON     : "art/kinison.wav",
    KOOK        : "art/kook.wav",
    MWPUNCH     : "art/mwpunch.wav",
    NI          : "art/ni.wav",
    OUCH        : "art/ouch.wav",
    POP         : "art/pop.wav",
    POP1        : "art/pop1.wav",
    POP2        : "art/pop2.wav",
    SCREAM      : "art/scream.wav",
    WOOW1       : "art/woow1.wav",
    YELLING     : "art/yelling.wav",
    SPLASH      : "art/splash.wav",
    WATER       : "art/water.wav",
    BANG        : "art/b_bang_2.wav",
    BOOM        : "art/boom.wav",
    EXPLOSION   : "art/exploson.wav",
    GLASS       : "art/glass.wav",
    GLASSBRK    : "art/glassbrk.wav"
  };

  images = {
    HeroRight1  : "art/HeroRight1.png",
    HeroRight2  : "art/HeroRight2.png",
    HeroRight3  : "art/HeroRight3.png",
    HeroRight4  : "art/HeroRight4.png",
    HeroLeft1   : "art/HeroLeft1.png",
    HeroLeft2   : "art/HeroLeft2.png",
    HeroLeft3   : "art/HeroLeft3.png",
    HeroLeft4   : "art/HeroLeft4.png",
    Basket1     : "art/Basket1.png",
    Basket2     : "art/Basket2.png",
    Basket3     : "art/Basket3.png",
    HouseLeft1  : "art/HouseLeft1.png",
    HouseLeft2  : "art/HouseLeft2.png",
    HouseLeft3  : "art/HouseLeft3.png",
    HouseLeft4  : "art/HouseLeft4.png",
    HouseLeft5  : "art/HouseLeft5.png",
    HouseLeft6  : "art/HouseLeft6.bmp",
    HouseRight1 : "art/HouseRight1.png",
    HouseRight2 : "art/HouseRight2.png",
    HouseRight3 : "art/HouseRight3.png",
    HouseRight4 : "art/HouseRight4.png",
    HouseRight5 : "art/HouseRight5.png",
    HouseRight6 : "art/HouseRight6.bmp",
    RockUp1     : "art/RockUp1.png",
    RockUp2     : "art/RockUp2.png",
    RockUp3     : "art/RockUp3.png",
    RockDown1   : "art/RockDown1.png",
    RockDown2   : "art/RockDown2.png",
    RockDown3   : "art/RockDown3.png",
    RockLeft1   : "art/RockLeft1.png",
    RockLeft2   : "art/RockLeft2.png",
    RockLeft3   : "art/RockLeft3.png",
    RockRight1  : "art/RockRight1.png",
    RockRight2  : "art/RockRight2.png",
    RockRight3  : "art/RockRight3.png",
    Splash      : "art/Splash.bmp",
    Volcano     : "art/VolcanoCentered.bmp"
  };

  colors = {
    backgroundColor   : "#3f62ae",
    textColor         : "#ffffff",
    instructionsColor : "#232bd6",
    debrisStartColor  : "#ee1010",
    debrisEndColor    : "#2f2f3e"
  };


//  console.log(sounds);
//  console.log(images);
  
  screenWidth = window.innerWidth * 0.95;
  screenHeight = window.innerHeight * 0.95;
//  screenWidth = document.body.clientWidth;
//  screenHeight = document.body.clientHeight;

  // 640x480 = 307200
  screenAreaRatio = (screenWidth * screenHeight) / 307200;

  widthScale = screenWidth / originalScreenWidth;
  heightScale = screenHeight / originalScreenHeight;
  bounceYCoord = BOUNCE_Y_COORD * heightScale;
  debugHeight = screenHeight / 40;

  // Taller, skinnier screens will have larger screenRatios
  // This is based on the original artwork of 640 x 480, which would have a screenRatio of 1
  screenRatio = (screenHeight / 480.0) / (screenWidth / 640.0);


  // setup sounds
//  console.log(sounds.GREATBALLS);
//  console.log(sounds["GREATBALLS"]);

  soundFormats('mp3', 'ogg', 'wav');
  greatBalls = loadSound(sounds.GREATBALLS);
//  greatBalls = new Audio();
//  greatBalls.src = sounds.GREATBALLS;

  gameState = programStates.PS_INIT;
//  gameState = programStates.PS_INSTRUCTIONS;  // Skip the splash screen

  imgSplash = loadImage(images.Splash);
  imgBackground = loadImage(images.Volcano);

  basket = new Basket();
  theHero = new Hero();

  let volcanoLeft = 272 * widthScale;
  let volcanoWidth = 80 * widthScale;

  let left = volcanoLeft;
  let right = left + volcanoWidth;
  let top = 124 * heightScale;
  let bottom = top;

  debrisEmitter = new Emitter(2000 * screenAreaRatio, widthScale, heightScale);
  debrisEmitter.setForce(0.0, 0.04);
  debrisEmitter.setEmits(0.5, 0.2);
  debrisEmitter.setLife(300, 50);
  debrisEmitter.setPosBySides(left, right, top, bottom);
  debrisEmitter.setSpeed(3.0 * heightScale, 0.5);
  debrisEmitter.setColors(colors.debrisStartColor, 100, colors.debrisEndColor, 0.5);

  houseLeft  = new House(actions.ACTION_IDLE_LEFT, widthScale, heightScale);
  houseRight = new House(actions.ACTION_IDLE_RIGHT, widthScale, heightScale);

  rockStartLocXMin = left;
  rockStartLocXMax = right;
  rockStartLocY = top;

  aliveList.push(basket);
  aliveList.push(theHero);
  aliveList.push(debrisEmitter);
  aliveList.push(houseLeft);
  aliveList.push(houseRight);

  timeToSwitchState = 0;
}


function setup()
{
  // make a full screen canvas
  createCanvas(screenWidth, screenHeight);
}




// stuff to be done once per game
function newGame()
{
  playerScore = 0;
  playerLevel = levels.LEVEL1;
}



// stuff to be done at the beginning of each level
function initLevel()
{
  playerScore = 0;

  if (playerScore > LEVEL3_MIN_SCORE)
  {
    playerLevel = levels.LEVEL3;
  }
  else if (playerScore > LEVEL2_MIN_SCORE)
  {
    playerLevel = levels.LEVEL2;
  }
  else
  {
    playerLevel = levels.LEVEL1;
  }

  // remove any rocks that may be left in the list from the previous level
  let count1 = 0;
  while (count1 < aliveList.length)
  {
    if (aliveList[count1].getType() == itemTypes.TYPE_ROCK)
    {
      aliveList.splice(count1, 1);
    }
    else
    {
      count1 += 1;
    }
  }

  houseLeft.newLevel(playerLevel);
  houseRight.newLevel(playerLevel);
  theHero.newLevel(playerLevel);
  basket.newLevel(playerLevel);

  nextSpewTime = Date.now();
}


function showInstructions()
{
  let textLocation = 20;
  let textHeight = screenHeight / 40;

  image(imgBackground, 0, 0, screenWidth, screenHeight);
  houseLeft.render();
  houseRight.render();

  noStroke();
  textSize(textHeight);
  fill(colors.instructionsColor);
  textAlign(CENTER, TOP);

  for (count1 = 0; count1 < instructions.length; count1++)
  {
    text(instructions[count1], screenWidth / 2, textLocation);
    textLocation += textHeight + 2;
  }
}


function showHighScores()
{
  let textLocation = 20;
  let textHeight = screenHeight / 20;
  let nextStrOut;

  image(imgBackground, 0, 0, screenWidth, screenHeight);
  houseLeft.render();
  houseRight.render();

  noStroke();
  textSize(textHeight);
  fill(colors.instructionsColor);
  textAlign(CENTER, TOP);

  text("High Scores", screenWidth / 2, textLocation);
  textLocation += (textHeight + 2) * 2;

  for (count1 = 0; count1 < highScores.length; count1++)
  {
    nextStrOut = highScores[count1][0] + " : " + highScores[count1][1];
    text(nextStrOut, screenWidth / 2, textLocation);
    textLocation += textHeight + 2;
  }
}


function draw()
{
  let count1;
  let timeNow = Date.now();

  switch(gameState)
  {
    case programStates.PS_INIT:
    {
      timeToSwitchState = timeNow + SPLASH_SCREEN_TIME;
//      greatBalls.play();
      gameState = programStates.PS_SPLASH;
      break;      
    }

    case programStates.PS_SPLASH:
    {
      image(imgSplash, 0, 0, screenWidth, screenHeight);

      if (timeNow > timeToSwitchState)
      {
        newGame();
        initLevel();
        getHighScores();
        timeToSwitchState = 0;
        gameState = programStates.PS_GET_HIGH_SCORES;
      }
      break;
    }

    case programStates.PS_GET_HIGH_SCORES:
    {
      if (timeToSwitchState == 0)
      {
        timeToSwitchState = timeNow + SPLASH_SCREEN_TIME;
      }
      else if (timeNow > timeToSwitchState)
      {
        timeToSwitchState = timeNow + SPLASH_SCREEN_TIME;
        gameState = programStates.PS_SHOW_HIGH_SCORES;
      }
      break;
    }

    case programStates.PS_SHOW_HIGH_SCORES:
    {
      showHighScores();
      if (timeNow > timeToSwitchState)
      {
        timeToSwitchState = timeNow + SPLASH_SCREEN_TIME;
        gameState = programStates.PS_INSTRUCTIONS;
      }
      break;
    }

    case programStates.PS_INSTRUCTIONS:
    {
      // redraw the damaged houses
      for (count1 = 0; count1 < aliveList.length; count1++)
      {
        aliveList[count1].render();
      }

      showInstructions();
      break;
    }

    case programStates.PS_BEGIN_LEVEL:
    {
      gameState = programStates.PS_ACTIVE;
      break;
    }

    case programStates.PS_ACTIVE:
    {
      if (gameTick())
      {
        gameState = programStates.PS_ENDGAME;
      }
      break;
    }

    case programStates.PS_ENDGAME:
    {
      gameTick();
      let textLocation = screenHeight / 2;
      let textHeight = screenHeight / 20;

      noStroke();
      textSize(textHeight);
      fill(colors.instructionsColor);
      textAlign(CENTER, TOP);
      text("Game Over", screenWidth / 2, textLocation);

      submitScore();
      timeToSwitchState = timeNow + INSTRUCTIONS_TIME;
      gameState = programStates.PS_SHOW_SCORE;
      break;
    }

    case programStates.PS_SHOW_SCORE:
    {
      if (timeNow > timeToSwitchState)
      {
        gameState = programStates.PS_SHOW_HIGH_SCORES;
      }
      break;
    }
  }
}


function displayScore()
{
  let textLocation = 10;
  let textHeight = screenHeight / 20;
  let theText = "Score: " + playerScore;

  noStroke();
  textSize(textHeight);
  fill(colors.instructionsColor);
  textAlign(CENTER, TOP);
  text(theText, screenWidth / 2, textLocation);
}



function keyPressed()
{
  switch(gameState)
  {
    case programStates.PS_INSTRUCTIONS:
      gameState = programStates.PS_BEGIN_LEVEL;
      break;
    case programStates.PS_ACTIVE:
      break;
  }
}

function keyReleased()
{
  switch(gameState)
  {
    case programStates.PS_ACTIVE:
      break;
  }
}


function touchStarted()
{
  if (gameState == programStates.PS_INSTRUCTIONS)
  {
    gameState = programStates.PS_BEGIN_LEVEL;
  }
}


function debugTextOut(theColor, textOut)
{
  textSize(debugHeight);
  noStroke();
  fill(theColor);
  text(textOut, 5, debugTextY);
  debugTextY += debugHeight;
}


function gameTick()
{
  let count1;
  let textOut;
  let gameEnded = false;
  let timeNow = Date.now();

  textAlign(LEFT, TOP);
  debugTextY = 5;

  image(imgBackground, 0, 0, screenWidth, screenHeight);

//if (rockCount == 0) // For debugging: only one rock at a time
{
  if (timeNow > nextSpewTime)
  {
    let newRock = new Rock(widthScale, heightScale, rockStartLocXMin, rockStartLocXMax, rockStartLocY);
    aliveList.push(newRock);
    nextSpewTime = timeNow + random(spewRateMin, spewRateMax);
    rockInstance += 1;
  }
}

  rockCount = 0;

  for (count1 = 0; count1 < aliveList.length; count1++)
  {
    aliveList[count1].update(aliveList);
    aliveList[count1].render();
    if (!aliveList[count1].isAlive())
    {
      aliveList.splice(count1, 1);
      count1 -= 1;
    }
    else if (aliveList[count1].getType() == itemTypes.TYPE_ROCK)
    {
      rockCount += 1;
    }
  }

   // check for end-game situation (hero dead or both houses dead)
  if ((theHero.getHealth() == 0) || ((houseLeft.getHealth() == 0) && (houseRight.getHealth() == 0)))
  {
    gameEnded = true;
  }

//  debugTextOut(color('red'), "gameState = " + gameState);

/*
  debugTextOut(color('red'), "System:");
//  debugTextOut(color('black'), "playerScore = " + playerScore);
//  debugTextOut(color('black'), "rockCount = " + rockCount + "  rockInstance = " + rockInstance);
  debugTextOut(color('black'), "screenWidth = " + screenWidth + "  screenHeight = " + screenHeight);
  debugTextOut(color('black'), "widthScale = " + widthScale + "  heightScale = " + heightScale);
  debugTextOut(color('black'), "screenRatio = " + screenRatio);
  debugTextOut(color('black'), "screenAreaRatio = " + screenAreaRatio);
*/

  displayScore();
  return gameEnded;
}


function submitScore()
{
    let updateScoreURL = baseURL + "SubmitScore.php?initials=" + userInitials + "&score=" + playerScore;
//    alert("updateScoreURL = " + updateScoreURL);
    let xmlData = new xmlObject();
    xmlData.fromURL(updateScoreURL);
}


function getHighScores()
{
    let getHighScoresURL = baseURL + "GetHighScores.php";
//    alert("getHighScoresURL = " + getHighScoresURL);
    let xmlData = new xmlObject();
    xmlData.urlCallback = highScoresCallback;
    xmlData.fromURL(getHighScoresURL);
}
  
  
function highScoresCallback(xmlObjectIn)
{
  let nextInitials;
  let nextScore;
  let result = xmlObjectIn.getFirstObject("Result").value;

  if (result == "Success")
  {
    highScores = new Array();
    let nextHighScore = xmlObjectIn.getFirstObject("NextScore");
    while (nextHighScore)
    {
      nextInitials = nextHighScore.getFirstObject("initials");
      nextScore = nextHighScore.getFirstObject("score");
      highScores[highScores.length] = [ nextInitials.value, nextScore.value ];
      nextHighScore = xmlObjectIn.getNextObject("NextScore");
    }
    console.log(highScores);
  }
}

