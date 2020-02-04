
let heroImgs = new Array(MAX_ACTIONS);


function Hero()
{
  // Call AliveObject's constructor
  AliveObject.call(this, itemTypes.TYPE_HERO);

  this.name = "Hero";

  this.movementSpeed = 3 * widthScale;

  heroImgs[actions.ACTION_IDLE_LEFT]  = [loadImage(images.HeroLeft1)];
  heroImgs[actions.ACTION_IDLE_RIGHT] = [loadImage(images.HeroRight1)];
  heroImgs[actions.ACTION_WALK_LEFT]  = [loadImage(images.HeroLeft1), loadImage(images.HeroLeft2), loadImage(images.HeroLeft3), loadImage(images.HeroLeft4)];
  heroImgs[actions.ACTION_WALK_RIGHT] = [loadImage(images.HeroRight1), loadImage(images.HeroRight2), loadImage(images.HeroRight3), loadImage(images.HeroRight4)];

  this.action = actions.ACTION_IDLE_RIGHT;

  this.ouchSounds =
  [
    loadSound(sounds.AAAH),
    loadSound(sounds.ARGH),
    loadSound(sounds.AGONY),
    loadSound(sounds.AHHHHHHH),
    loadSound(sounds.BONK),
    loadSound(sounds.JIBBERISH),
    loadSound(sounds.KINISON),
    loadSound(sounds.KOOK),
    loadSound(sounds.MWPUNCH),
    loadSound(sounds.NI),
    loadSound(sounds.OUCH),
    loadSound(sounds.POP),
    loadSound(sounds.POP1),
    loadSound(sounds.POP2),
    loadSound(sounds.SCREAM),
    loadSound(sounds.WOOW1),
    loadSound(sounds.YELLING)
  ];

  this.numFrames[actions.ACTION_IDLE_LEFT]  = 1;
  this.size[actions.ACTION_IDLE_LEFT].x     = 16 * widthScale;
  this.size[actions.ACTION_IDLE_LEFT].y     = 32 * heightScale;

  this.numFrames[actions.ACTION_IDLE_RIGHT] = 1;
  this.size[actions.ACTION_IDLE_RIGHT].x    = 16 * widthScale;
  this.size[actions.ACTION_IDLE_RIGHT].y    = 32 * heightScale;

  this.numFrames[actions.ACTION_WALK_LEFT]  = 4;
  this.size[actions.ACTION_WALK_LEFT].x     = 16 * widthScale;
  this.size[actions.ACTION_WALK_LEFT].y     = 32 * heightScale;

  this.numFrames[actions.ACTION_WALK_RIGHT] = 4;
  this.size[actions.ACTION_WALK_RIGHT].x    = 16 * widthScale;
  this.size[actions.ACTION_WALK_RIGHT].y    = 32 * heightScale;

  this.setLocation(screenWidth / 2, screenHeight - (this.size[this.action].y / 2));
  this.initialize();

  this.moveBasket();

  this.moveBounds[rectSides.LEFT]  = (32 * widthScale) + basket.getXSize();                // 32 = width of house
  this.moveBounds[rectSides.RIGHT] = screenWidth - (32 * widthScale) - basket.getXSize();
}

// inherit from AliveObject
Hero.prototype = new AliveObject(itemTypes.TYPE_HERO);



Hero.prototype.newLevel = function(theLevel)
  {
    AliveObject.prototype.newLevel.call(this, theLevel);
    this.setLocation(screenWidth / 2, screenHeight - (this.size[this.action].y / 2));
    this.moveBasket();
  },


Hero.prototype.playRandomOuchSound = function()
  {
    var randOuch = Math.floor(random(0, this.ouchSounds.length));
    this.ouchSounds[randOuch].play();
  }



Hero.prototype.hit = function(damage)
{
  AliveObject.prototype.hit.call(this, damage);
  this.playRandomOuchSound();
}



Hero.prototype.keyPressed = function(keyCode)
{
  if (keyCode == RIGHT_ARROW)
  {
  }

  if (keyCode == LEFT_ARROW)
  {
  }
}


Hero.prototype.keyReleased = function(keyCode)
{
  if (keyCode == RIGHT_ARROW)
  {
  }

  if (keyCode == LEFT_ARROW)
  {
  }
}


Hero.prototype.drawHealthLevel = function()
{
  let healthHeight = this.size[this.action].y * (this.health / 100);
  let healthWidth = 5 * widthScale;

  noStroke();

  if ((this.action == actions.ACTION_WALK_LEFT) || (this.action == actions.ACTION_IDLE_LEFT))
  {
    // Drop the top area red
    fill(color('red'));
    rect(this.objRect[rectSides.RIGHT],
         this.objRect[rectSides.TOP],
         healthWidth,
         this.size[this.action].y - healthHeight);

    // Drop the bottom area green
    fill(color('green'));
    rect(this.objRect[rectSides.RIGHT],
         this.objRect[rectSides.BOTTOM] - healthHeight,
         healthWidth,
         healthHeight);
  }
  else if ((this.action == actions.ACTION_WALK_RIGHT) || (this.action == actions.ACTION_IDLE_RIGHT))
  {
    // Drop the top area red
    fill(color('red'));
    rect(this.objRect[rectSides.LEFT] - healthWidth,
         this.objRect[rectSides.TOP],
         healthWidth,
         this.size[this.action].y - healthHeight);

    // Drop the bottom area green
    fill(color('green'));
    rect(this.objRect[rectSides.LEFT] - healthWidth,
         this.objRect[rectSides.BOTTOM] - healthHeight,
         healthWidth,
         healthHeight);
  }

}



Hero.prototype.update = function()
{
  let timeNow = Date.now();

  if (timeNow < this.nextMoveTime)
  {
    return;   // not time to move yet
  }

  if (keyIsDown(RIGHT_ARROW))
  {
    if (!keyIsDown(LEFT_ARROW))
    {
      this.objCenter.x += this.movementSpeed;
      this.setDestination(this.objCenter.x + this.movementSpeed, this.objCenter.y);
    }
  }
  else if (keyIsDown(LEFT_ARROW))
  {
    if (!keyIsDown(RIGHT_ARROW))
    {
      this.objCenter.x -= this.movementSpeed;
      this.setDestination(this.objCenter.x - this.movementSpeed, this.objCenter.y);
    }
  }
  else
  {
    if (this.action == actions.ACTION_WALK_RIGHT)
    {
      this.action = actions.ACTION_IDLE_RIGHT;
    }
    else if (this.action == actions.ACTION_WALK_LEFT)
    {
      this.action = actions.ACTION_IDLE_LEFT;
    }
  }

  if (++this.imgIndex >= this.numFrames[this.action])
  {
    this.getNextFrame();
    this.imgIndex = 0;
  }

  if (this.objCenter.x > this.moveBounds[rectSides.RIGHT])
  {
    this.objCenter.x = this.moveBounds[rectSides.RIGHT];
  }
  else if (this.objCenter.x < this.moveBounds[rectSides.LEFT])
  {
    this.objCenter.x = this.moveBounds[rectSides.LEFT];
  }

  this.calcObjRect();

  this.moveBasket();
}




Hero.prototype.moveBasket = function()
{
  if ((this.action == actions.ACTION_IDLE_LEFT) || (this.action == actions.ACTION_WALK_LEFT))
    basket.setLocation(this.objRect[rectSides.LEFT] - (basket.getXSize() / 2), this.objCenter.y);
  else
    basket.setLocation(this.objRect[rectSides.RIGHT] + (basket.getXSize() / 2), this.objCenter.y);
}


Hero.prototype.render = function()
{
/*
  debugTextOut(color('red'), "Hero:");
  debugTextOut(color('black'), "action = " + this.action);
  debugTextOut(color('black'), "health = " + this.health);
  debugTextOut(color('black'), "objRect   = " + this.objRect[rectSides.LEFT] + ", " + this.objRect[rectSides.TOP]);
  debugTextOut(color('black'), "objCenter = " + this.objCenter.x + ", " + this.objCenter.y);
  debugTextOut(color('black'), "size = " + this.size[this.action].x + ", " + this.size[this.action].x);
  debugTextOut(color('black'), "halfSize = " + this.halfSize[this.action].x + ", " + this.halfSize[this.action].x);
*/

/*
  // Display the collision box
  stroke(255, 204, 100);
  noFill();
  strokeWeight(5);
  rect(this.objRect[rectSides.LEFT], this.objRect[rectSides.TOP], this.objRect[rectSides.RIGHT] - this.objRect[rectSides.LEFT], this.objRect[rectSides.BOTTOM] - this.objRect[rectSides.TOP]);
*/

/*
  // Display the moveBounds box
  stroke(255, 204, 100);
  noFill();
  strokeWeight(5);
  rect(this.moveBounds[rectSides.LEFT], this.moveBounds[rectSides.TOP], this.moveBounds[rectSides.RIGHT] - this.moveBounds[rectSides.LEFT], this.moveBounds[rectSides.BOTTOM] - this.moveBounds[rectSides.TOP]);
*/

  image(heroImgs[this.action][this.imgIndex], this.objRect[rectSides.LEFT], this.objRect[rectSides.TOP], this.size[this.action].x, this.size[this.action].y);
  this.drawHealthLevel();
}



