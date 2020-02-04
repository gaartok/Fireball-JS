
let basketImgs = new Array(MAX_ACTIONS);


function Basket()
{
  // Call AliveObject's constructor
  AliveObject.call(this, itemTypes.TYPE_BASKET);

  this.name = "Basket";

  this.action = levels.LEVEL1;
  this.underFaucet = false;

  this.waterIndicatorLocation = new Array(4);
  this.waterIndicatorLocation[rectSides.LEFT]   = 25 * widthScale;
  this.waterIndicatorLocation[rectSides.RIGHT]  = 74 * widthScale;
  this.waterIndicatorLocation[rectSides.TOP]    = 50 * heightScale;
  this.waterIndicatorLocation[rectSides.BOTTOM] = 99 * heightScale;

  this.waterIndicatorSize = new Point();
  this.waterIndicatorSize.x = this.waterIndicatorLocation[rectSides.RIGHT]  - this.waterIndicatorLocation[rectSides.LEFT];
  this.waterIndicatorSize.y = this.waterIndicatorLocation[rectSides.BOTTOM] - this.waterIndicatorLocation[rectSides.TOP];

  basketImgs[levels.LEVEL1] = loadImage(images.Basket1);
  basketImgs[levels.LEVEL2] = loadImage(images.Basket2);
  basketImgs[levels.LEVEL3] = loadImage(images.Basket3);

  this.velocity.x        = 0;
  this.velocity.y        = 0;
  this.minVelocity.x     = 0;
  this.minVelocity.y     = 0;
  this.maxVelocity.x     = 0;
  this.maxVelocity.y     = 0;

  this.numFrames[levels.LEVEL1] = 1;
  this.size[levels.LEVEL1].x    = 24 * widthScale;
  this.size[levels.LEVEL1].y    = 16 * heightScale;

  this.numFrames[levels.LEVEL2] = 1;
  this.size[levels.LEVEL2].x    = 20 * widthScale;
  this.size[levels.LEVEL2].y    = 16 * heightScale;

  this.numFrames[levels.LEVEL3] = 1;
  this.size[levels.LEVEL3].x    = 16 * widthScale;
  this.size[levels.LEVEL3].y    = 16 * heightScale;

  this.setLocation(screenWidth / 2, screenHeight - (this.size[this.action].y / 2));
  this.initialize();

  this.waterOverflow = new Emitter(200 * widthScale, widthScale, heightScale);
  this.waterOverflow.setAngles(90, 1, 90, 1);    // down
  this.waterOverflow.setSpeed(1.0 * heightScale, 0.1);
  this.waterOverflow.setForce(0.0, 0.0);
  this.waterOverflow.setEmits(1, 1);
  this.waterOverflow.setLife(0, 0);
  this.waterOverflow.setColors(color('blue'), 0, color('blue'), 0);
  this.waterOverflow.setPosBySides(this.objRect[rectSides.LEFT], this.objRect[rectSides.RIGHT], this.objRect[rectSides.TOP], this.objRect[rectSides.TOP]);

  this.splashEndTime = Date.now() - 2;
  this.waterSplash = new Emitter(500, widthScale, heightScale);
  this.waterSplash.setAngles(0, 360, 270, 40);
  this.waterSplash.setSpeed(2.0 * heightScale, 2.0 * widthScale);
  this.waterSplash.setForce(0.0, 0.4 * heightScale);
  this.waterSplash.setEmits(5 * widthScale, 1);
  this.waterSplash.setLife(0, 0);
  this.waterSplash.setColors(color('blue'), 0, color('blue'), 0);
  this.waterSplash.setPosBySides(this.objRect[rectSides.LEFT], this.objRect[rectSides.RIGHT], this.objRect[rectSides.TOP], this.objRect[rectSides.TOP]);

  this.waterLevel = 50;

  this.splashSound = loadSound(sounds.SPLASH);
  this.fillSound   = loadSound(sounds.WATER);
  this.hitSound    = loadSound(sounds.WATER);
}


// inherit from AliveObject
Basket.prototype = new AliveObject(itemTypes.TYPE_BASKET);


Basket.prototype.hit = function(damage)
{
  if (this.waterLevel <= 0)
  {
    AliveObject.prototype.hit.call(this, damage);
    return;
  }

  this.waterLevel -= damage;
  if (this.waterLevel < 0)
    this.waterLevel = 0;
  if (this.waterLevel > 100)
    this.waterLevel = 100;

  this.splashSound.play();

  this.waterSplash.setPosBySides(this.objRect[rectSides.LEFT], this.objRect[rectSides.RIGHT], this.objRect[rectSides.TOP], this.objRect[rectSides.TOP]);
  this.waterSplash.setLife(500, 30);
  this.splashEndTime = Date.now() + 500;
}



Basket.prototype.newLevel = function(level)
{
  AliveObject.prototype.newLevel.call(this, level);
  this.waterLevel = 50;

  this.action = level;
}



Basket.prototype.drawWaterLevel = function()
{
  let waterHeight = this.waterIndicatorSize.y * (this.waterLevel / 100);

  noStroke();

  // Drop the top area brown
  fill(color('brown'));
  rect(this.waterIndicatorLocation[rectSides.LEFT],
       this.waterIndicatorLocation[rectSides.TOP],
       this.waterIndicatorSize.x,
       this.waterIndicatorSize.y - waterHeight);

  // Drop the bottom area blue
  fill(color('blue'));
  rect(this.waterIndicatorLocation[rectSides.LEFT],
       this.waterIndicatorLocation[rectSides.BOTTOM] - waterHeight,
       this.waterIndicatorSize.x,
       waterHeight);
}



Basket.prototype.update = function()
{
  let timeNow = Date.now();

  // are we under the left faucet?
  this.underFaucet = false;
  if ((this.objRect[rectSides.LEFT] <= ((32 + 4) * widthScale)) && (houseLeft.getHealth() > 0))     // 32 = width of house  4 = distance faucet is from house
  {
    houseLeft.blockFaucet();
    this.underFaucet = true;
  }
  else
  {
    houseLeft.turnOnFaucet();
  }

  // are we under the right faucet?
  if ((this.objRect[rectSides.RIGHT] >= screenWidth - ((32 - 4) * widthScale)) && (houseRight.getHealth() > 0))
  {
    houseRight.blockFaucet();
    this.underFaucet = true;
  }
  else
  {
    houseRight.turnOnFaucet();
  }

  if (this.underFaucet)
  {
    if (!this.fillSound.isPlaying())
    {
      this.fillSound.play();
    }

    if (this.waterLevel == 100)
    {
      this.waterOverflow.setLife(50, 3);
    }

    if (this.underFaucetTime == 0)  // if we just got here, start the timer
    {
      this.underFaucetTime = timeNow;
    }
    else     // we've been here a while already
    {
      if (timeNow > this.underFaucetTime + 200)
      {
        this.waterLevel += 10;
        if (this.waterLevel > 100)
          this.waterLevel = 100;

        this.underFaucetTime = timeNow; // restart the timer for another gulp
      }
    }
  }
  else
  {
    this.fillSound.stop();
    this.underFaucetTime = 0;
    this.waterOverflow.setLife(0, 0);
  }

  if (timeNow > this.splashEndTime)
    this.waterSplash.setLife(0, 0);

  this.waterOverflow.setPosBySides(this.objRect[rectSides.LEFT], this.objRect[rectSides.RIGHT], this.objRect[rectSides.TOP], this.objRect[rectSides.TOP]);
  this.waterOverflow.update();

  this.waterSplash.setPosBySides(this.objRect[rectSides.LEFT], this.objRect[rectSides.RIGHT], this.objRect[rectSides.TOP], this.objRect[rectSides.TOP]);
  this.waterSplash.update();
}


Basket.prototype.render = function()
{
/*
  debugTextOut(color('red'), "Basket:");
//  debugTextOut(color('black'), "action = " + this.action);
  debugTextOut(color('black'), "health = " + this.health);
  debugTextOut(color('black'), "waterLevel = " + this.waterLevel);
//  debugTextOut(color('black'), "underFaucet = " + this.underFaucet);
//  debugTextOut(color('black'), "objRect   = " + this.objRect[rectSides.LEFT] + ", " + this.objRect[rectSides.TOP]);
//  debugTextOut(color('black'), "objCenter = " + this.objCenter.x + ", " + this.objCenter.y);
//  debugTextOut(color('black'), "size = " + this.size[this.action].x + ", " + this.size[this.action].x);
//  debugTextOut(color('black'), "halfSize = " + this.halfSize[this.action].x + ", " + this.halfSize[this.action].x);
*/

  image(basketImgs[this.action], this.objRect[rectSides.LEFT], this.objRect[rectSides.TOP], this.size[levels.LEVEL1].x, this.size[levels.LEVEL1].y);
  this.waterOverflow.render();
  this.waterSplash.render();
  this.drawWaterLevel();
}



Basket.prototype.getWaterLevel = function()
{
  return this.waterLevel;
}

