
function House(action, widthScale, heightScale)
{
  let faucetPos = new Array(4);

  // Call AliveObject's constructor
  AliveObject.call(this, itemTypes.TYPE_HOUSE);

  this.name = "House";

  this.action = action;
  this.imgIndex = 0;

  this.flameList = new Array();

  this.img = new Array(6);
  this.imgSize = new Point();
  this.drawLocation = new Point();

  this.faucet = new Emitter(100, widthScale, heightScale);
  this.faucet.setAngles(100, 1, 90, 1);    // down
  this.faucet.setSpeed(1.5, 0.1);
  this.faucet.setForce(0.0, 0.0);
  this.faucet.setEmits(1, 1);
  this.faucet.setLife(50, 0);
  this.faucet.setColors(color('blue'), 0, color('blue'), 0);

  this.crashSounds =
  [
    loadSound(sounds.BANG),
    loadSound(sounds.BOOM),
    loadSound(sounds.EXPLOSION),
    loadSound(sounds.GLASS),
    loadSound(sounds.GLASSBRK)
  ];

  this.numFrames[actions.ACTION_IDLE_RIGHT] = 5;
  this.size[actions.ACTION_IDLE_RIGHT].x    = 32;
  this.size[actions.ACTION_IDLE_RIGHT].y    = 128;

  this.numFrames[actions.ACTION_IDLE_LEFT]  = 5;
  this.size[actions.ACTION_IDLE_LEFT].x     = 32;
  this.size[actions.ACTION_IDLE_LEFT].y     = 128;

  this.init(widthScale, heightScale);
  this.initialize();

  this.objRect[rectSides.LEFT]   = this.drawLocation.x;
  this.objRect[rectSides.TOP]    = this.drawLocation.y;
  this.objRect[rectSides.RIGHT]  = this.drawLocation.x + this.imgSize.x;
  this.objRect[rectSides.BOTTOM] = this.drawLocation.y + this.imgSize.y;

  if (this.action == actions.ACTION_IDLE_LEFT)
  {
    faucetPos[rectSides.LEFT]   = this.objRect[rectSides.RIGHT] + (4 * widthScale);
    faucetPos[rectSides.RIGHT]  = this.objRect[rectSides.RIGHT] + (7 * widthScale);
  }
   else
   {
    faucetPos[rectSides.LEFT]   = this.objRect[rectSides.LEFT] - (7 * widthScale);
    faucetPos[rectSides.RIGHT]  = this.objRect[rectSides.LEFT] - (4 * widthScale);
   }

  faucetPos[rectSides.TOP]    = this.objRect[rectSides.BOTTOM] - (30 * heightScale);
  faucetPos[rectSides.BOTTOM] = faucetPos[rectSides.TOP];

  this.faucet.setPosByRect(faucetPos);
}


// inherit from AliveObject
House.prototype = new AliveObject(itemTypes.TYPE_House);


House.prototype.init = function(widthScale, heightScale)
{
  this.imgSize.x = 32 * widthScale;
  this.imgSize.y = 128 * heightScale;
  this.drawLocation.y = screenHeight - this.imgSize.y;

  if (this.action == actions.ACTION_IDLE_LEFT)
  {
    this.img[0] = loadImage(images.HouseLeft1);
    this.img[1] = loadImage(images.HouseLeft2);
    this.img[2] = loadImage(images.HouseLeft3);
    this.img[3] = loadImage(images.HouseLeft4);
    this.img[4] = loadImage(images.HouseLeft5);
    this.img[5] = loadImage(images.HouseLeft6);
    this.drawLocation.x = 0;
  }
  else
  {
    this.img[0] = loadImage(images.HouseRight1);
    this.img[1] = loadImage(images.HouseRight2);
    this.img[2] = loadImage(images.HouseRight3);
    this.img[3] = loadImage(images.HouseRight4);
    this.img[4] = loadImage(images.HouseRight5);
    this.img[5] = loadImage(images.HouseRight6);
//    this.drawLocation.x = 608 * widthScale;
    this.drawLocation.x = screenWidth - this.imgSize.x;
  }

  this.setLocation(this.drawLocation.x, this.drawLocation.y);
}



House.prototype.newLevel = function(theLevel)
  {
    AliveObject.prototype.newLevel.call(this, theLevel);
    this.turnOnFaucet();
    this.putOutFires();
    this.imgIndex = 0;
  },




House.prototype.putOutFires = function()
{
  this.flameList.length = 0;
}


House.prototype.playRandomCrashSound = function()
  {
    var randCrash = Math.floor(random(0, this.crashSounds.length));
//    debugTextOut(color('black'), "randCrash = " + randCrash);
    this.crashSounds[randCrash].play();
  }


House.prototype.turnOnFaucet = function()
{
  if (this.health > 0)
    this.faucet.setLife(30, 3);
}


House.prototype.turnOffFaucet = function()
{
  this.faucet.setLife(0, 0);
}


House.prototype.blockFaucet = function()
{
  if (this.health > 0)
    this.faucet.setLife(5, 0);
}


House.prototype.createNewFlame = function()
{
  var flame = new Emitter(20, widthScale, heightScale);
  var flamePos = new Array(4);

  flame.setAngles(0, 10, 10, 3);
  flame.setSpeed(0.50, 0.1);
  flame.setForce(0.0, -0.10);
  flame.setEmits(1, 1);
  flame.setLife(20, 10);
  flame.setColors(color('red'), 2, color('red'), 2);

  if (this.action == actions.ACTION_IDLE_LEFT)
  {
    flamePos[rectSides.LEFT]   = this.objRect[rectSides.RIGHT] - random(5, this.imgSize.x - 5);
    flamePos[rectSides.RIGHT]  = flamePos[rectSides.LEFT] + (random(3, 5) * widthScale);
    flamePos[rectSides.TOP]    = this.objRect[rectSides.TOP] + random(10, this.imgSize.y);
    flamePos[rectSides.BOTTOM] = flamePos[rectSides.TOP];
  }
  else
  {
    flamePos[rectSides.LEFT]   = this.objRect[rectSides.LEFT] + random(5, this.imgSize.x - 5);
    flamePos[rectSides.RIGHT]  = flamePos[rectSides.LEFT] + (random(3, 5) * widthScale);
    flamePos[rectSides.TOP]    = this.objRect[rectSides.TOP] + random(10, this.imgSize.y);
    flamePos[rectSides.BOTTOM] = flamePos[rectSides.TOP];
  }

  flame.setPosByRect(flamePos);
  this.flameList.push(flame);
}


House.prototype.hit = function(damage)
{
  if (this.health > 0)
  {
    this.playRandomCrashSound();
    this.createNewFlame();
  }

  AliveObject.prototype.hit.call(this, damage);

  if (this.health == 0)
  {
    this.turnOffFaucet();
  }

  this.imgIndex = 4 - (this.health / 25);
}



House.prototype.update = function()
{
  this.faucet.update();

  for (var count1 = 0; count1 < this.flameList.length; count1++)
  {
    this.flameList[count1].update();
  }
}


House.prototype.render = function()
{
/*
  debugTextOut(color('red'), "House:");
  debugTextOut(color('black'), "health = " + this.health);
  debugTextOut(color('black'), "imgIndex = " + this.imgIndex);
*/

/*
  // Display the collision box
  stroke(255, 204, 100);
  noFill();
  strokeWeight(3);
  rect(this.objRect[rectSides.LEFT], this.objRect[rectSides.TOP], this.objRect[rectSides.RIGHT] - this.objRect[rectSides.LEFT], this.objRect[rectSides.BOTTOM] - this.objRect[rectSides.TOP]);
*/

  image(this.img[this.imgIndex], this.drawLocation.x, this.drawLocation.y, this.imgSize.x, this.imgSize.y);
  this.faucet.render();

  for (var count1 = 0; count1 < this.flameList.length; count1++)
  {
    this.flameList[count1].render();
  }
}
