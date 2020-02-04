
let rockAlreadyInitialized = false;
let rockImgs = new Array(MAX_ACTIONS);



function Rock(widthScale, heightScale, startLocXMin, startLocXMax, startLocY)
{
  var leftOrRight = random(0, 1);

  // Call AliveObject's constructor
  AliveObject.call(this, itemTypes.TYPE_ROCK);

  this.name = "Rock";

  this.action = actions.ACTION_WALK_UP;
  this.drawLocation = new Point();
  this.bounceCount = 0;
  this.nextAccelTime = 0;

  this.minVelocity.x = 1 * widthScale;
  this.minVelocity.y = 1 * heightScale;
  this.maxVelocity.x = 1.2 * widthScale;
  this.maxVelocity.y = 8 * heightScale;

  this.acceleration = new Point();
  this.acceleration.x = 1 * widthScale;
  this.acceleration.y = 1 * heightScale;

  this.setLocation(Math.floor(random(startLocXMin, startLocXMax)), Math.floor(startLocY));

  if (leftOrRight < 0.5)
  {
//    this.setDestination(Math.floor(random(124, 214) * widthScale), bounceYCoord);
    this.setDestination(0, bounceYCoord);
  }
  else
  {
//    this.setDestination(Math.floor(random(426, 516) * widthScale), bounceYCoord);
    this.setDestination(screenWidth, bounceYCoord);
  }

  this.velocity.y = (-1 * random(3, 5)) * heightScale;


  if (this.objCenter.x < this.destination.x)
  {
    this.velocity.x = 4 * widthScale;
  }
  else if (this.objCenter.x > this.destination.x)
  {
    this.velocity.x = -4 * widthScale;
  }
  else
  {
    this.velocity.x = 0;
  }


  this.tail = new Emitter(10, widthScale, heightScale);
  this.tail.setSpeed(0.50, 0.2);
  this.tail.setEmits(1, 1);
  this.tail.setLife(10, 3);
  this.tail.setColors(34, 3, 37, 2);
  this.aimTail();

  this.numFrames[actions.ACTION_WALK_UP]    = 3;
  this.size[actions.ACTION_WALK_UP].x       = 8  * widthScale;
  this.size[actions.ACTION_WALK_UP].y       = 16 * heightScale;

  this.numFrames[actions.ACTION_WALK_DOWN]  = 3;
  this.size[actions.ACTION_WALK_DOWN].x     = 8  * widthScale;
  this.size[actions.ACTION_WALK_DOWN].y     = 16 * heightScale;

  this.numFrames[actions.ACTION_WALK_LEFT]  = 3;
  this.size[actions.ACTION_WALK_LEFT].x     = 16 * widthScale;
  this.size[actions.ACTION_WALK_LEFT].y     = 8  * heightScale;

  this.numFrames[actions.ACTION_WALK_RIGHT] = 3;
  this.size[actions.ACTION_WALK_RIGHT].x    = 16 * widthScale;
  this.size[actions.ACTION_WALK_RIGHT].y    = 8  * heightScale;

  this.init(widthScale, heightScale);
  this.initialize();
}


// inherit from AliveObject
Rock.prototype = new AliveObject(itemTypes.TYPE_ROCK);


Rock.prototype.init = function(widthScale, heightScale)
{
  rockImgs[actions.ACTION_WALK_UP]    = [loadImage(images.RockUp1), loadImage(images.RockUp2), loadImage(images.RockUp3)];
  rockImgs[actions.ACTION_WALK_DOWN]  = [loadImage(images.RockDown1), loadImage(images.RockDown2), loadImage(images.RockDown3)];
  rockImgs[actions.ACTION_WALK_LEFT]  = [loadImage(images.RockLeft1), loadImage(images.RockLeft2), loadImage(images.RockLeft3)];
  rockImgs[actions.ACTION_WALK_RIGHT] = [loadImage(images.RockRight1), loadImage(images.RockRight2), loadImage(images.RockRight3)];
}



Rock.prototype.aimTail = function()
{
  let tailPos = new Array(4);

  switch (this.action)
  {
    case actions.ACTION_WALK_RIGHT:
    {
      this.tail.setAngles(90, 5, 0, 5);     // left
      tailPos[rectSides.LEFT] = this.objRect[rectSides.LEFT] + 5;
      tailPos[rectSides.RIGHT] = tailPos[rectSides.LEFT];
      tailPos[rectSides.TOP] = this.objRect[rectSides.TOP];
      tailPos[rectSides.BOTTOM] = this.objRect[rectSides.BOTTOM];
      this.tail.setForce(-0.10, 0.0);
      break;
    }

    case actions.ACTION_WALK_LEFT:
    {
      this.tail.setAngles(270, 10, 0, 0);   // right
      tailPos[rectSides.LEFT] = this.objRect[rectSides.RIGHT] - 5;
      tailPos[rectSides.RIGHT] = tailPos[rectSides.LEFT];
      tailPos[rectSides.TOP] = this.objRect[rectSides.TOP];
      tailPos[rectSides.BOTTOM] = this.objRect[rectSides.BOTTOM];
      this.tail.setForce(0.10, 0.0);
      break;
    }

    case actions.ACTION_WALK_UP:
    {
      this.tail.setAngles(0, 5, 90, 5);     // down
      tailPos[rectSides.LEFT] = this.objRect[rectSides.LEFT];
      tailPos[rectSides.RIGHT] = this.objRect[rectSides.RIGHT];
      tailPos[rectSides.TOP] = this.objRect[rectSides.BOTTOM] - 5;
      tailPos[rectSides.BOTTOM] = tailPos[rectSides.TOP];
      this.tail.setForce(0.0, 0.10);
      break;
    }

    case actions.ACTION_WALK_DOWN:
    {
      this.tail.setAngles(0, 5, 270, 5);    // up
      tailPos[rectSides.LEFT] = this.objRect[rectSides.LEFT];
      tailPos[rectSides.RIGHT] = this.objRect[rectSides.RIGHT];
      tailPos[rectSides.TOP] = this.objRect[rectSides.TOP] + 5;
      tailPos[rectSides.BOTTOM] = tailPos[rectSides.TOP];
      this.tail.setForce(0.0, -0.10);
      break;
    }
  }

  this.tail.setPosByRect(tailPos);
}




Rock.prototype.getNextFrame = function()
{
  if (this.velocity.x == 0)
  {
    if (this.velocity.y > 0)
    {
      this.action = actions.ACTION_WALK_DOWN;
    }
    else
    {
      this.action = actions.ACTION_WALK_UP;
    }
  }
  else if (this.velocity.x > 0)
  {
    if (this.velocity.y >= 3)
    {
      this.action = actions.ACTION_WALK_DOWN;
    }
    else if (this.velocity.y <= -3)
    {
      this.action = actions.ACTION_WALK_UP;
    }
    else
    {
      this.action = actions.ACTION_WALK_RIGHT;
    }
  }
  else
  {
    if (this.velocity.y >= 3)
    {
      this.action = actions.ACTION_WALK_DOWN;
    }
    else if (this.velocity.y <= -3)
    {
      this.action = actions.ACTION_WALK_UP;
    }
    else
    {
      this.action = actions.ACTION_WALK_LEFT;
    }
  }

  this.imgIndex += 1;
  if (this.imgIndex >= this.numFrames[this.action])
  {
    this.imgIndex = 0;
  }

//  debugTextOut(color('black'), "new action = " + this.action);
  this.aimTail();
}



Rock.prototype.getDirectionMoving = function()
{
  var direction = new Point();

  if (this.objCenter.x < this.destination.x)
  {
    direction.x = 1;         // moving to the right
  }
  else if (this.objCenter.x > this.destination.x)
  {
    direction.x = -1;        // moving to the left
  }
  else
  {
    direction.x = 0;         // at destination X location
  }

  if (this.objCenter.y < this.destination.y)
  {
    direction.y = 1;         // moving down
  }
  else if (this.objCenter.y > this.destination.y)
  {
    direction.y = -1;        // moving up
  }
  else
  {
    direction.y = 0;         // at destination Y location
  }

  return direction;
}



Rock.prototype.update = function(collideableList)
{
  let dirX;
  let dirY;
  let overlappedObj;
  let timeNow = Date.now();

  if (this.action == actions.ACTION_DEAD)
  {
    return;
  }

  this.tail.update();

  if (timeNow < this.nextMoveTime)
  {
    return;   // not time to move yet
  }

  this.nextMoveTime = timeNow + 20;

  if (++this.imgIndex >= this.numFrames[this.action])
  {
    this.getNextFrame();
    this.imgIndex = 0;
  }

  var direction = this.getDirectionMoving();

  if (timeNow > this.nextAccelTime)
  {
    if (direction.x == 1)
    {
      this.velocity.x += this.acceleration.x;
    }
    else if (direction.x == -1)
    {
      this.velocity.x -= this.acceleration.x;
    }
    else
    {
      this.velocity.x = 0;
    }

    if (direction.y == 1)
    {
      this.velocity.y += this.acceleration.y;
    }
    else if (direction.y == -1)
    {
      this.velocity.y -= this.acceleration.y;
    }

    if (this.velocity.x > this.maxVelocity.x)
    {
      this.velocity.x = this.maxVelocity.x;
    }
    else if (this.velocity.x < -this.maxVelocity.x)
    {
      this.velocity.x = -this.maxVelocity.x;
    }

    if (this.velocity.y > this.maxVelocity.y)
    {
      this.velocity.y = this.maxVelocity.y;
    }
    else if (this.velocity.y < -this.maxVelocity.y)
    {
      this.velocity.y = -this.maxVelocity.y;
    }

    this.nextAccelTime = timeNow + 200;
  }

  // move the object to its new position
  this.objCenter.x += this.velocity.x;
  this.objCenter.y += this.velocity.y;

  // have we arrived at our destination?
  // (Bouncing off the ground)
  if (this.objCenter.y >= this.destination.y)
  {
    this.objCenter.y = this.destination.y - 1;
    if (this.bounceCount == 0)
    {
      if (this.velocity.x < 0)
      {
        this.setDestination(0, bounceYCoord);
      }
      else if (this.velocity.x > 0)
      {
        this.setDestination(screenWidth, bounceYCoord);
      }
      else
      {
        if (this.objCenter.x < screenWidth / 2)
        {
          this.setDestination(0, bounceYCoord);
        }
        else
        {
          this.setDestination(screenWidth, bounceYCoord);
        }
      }
    }

    this.bounceCount++;

    this.velocity.y = -(this.velocity.y / 8);
    this.maxVelocity.y = (6 - this.bounceCount) * heightScale;

    if (this.velocity.y > -this.maxVelocity.y)
    {
      this.velocity.y = -this.maxVelocity.y;
    }
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

  // check for collisions
  overlappedObj = this.checkOverlapped(collideableList);
  if (overlappedObj)
  {
    switch (overlappedObj.getType())
    {
      case itemTypes.TYPE_HOUSE:
      {
        if (overlappedObj.getHealth() > 0)
        {
          playerScore -= 10;
          overlappedObj.hit(25);
        }

//        console.log("Hit HOUSE");
        this.action = actions.ACTION_DEAD;
        break;
      }

      case itemTypes.TYPE_BASKET:
      {
        if (overlappedObj.getWaterLevel() > 0)
        {
          overlappedObj.hit(10);
          playerScore += 25;
          this.action = actions.ACTION_DEAD;
        }
//        console.log("Hit BASKET");
        break;
      }

      case itemTypes.TYPE_HERO:
      {
        overlappedObj.hit(10);
        playerScore -= 15;
//        console.log("Hit HERO");
        this.action = actions.ACTION_DEAD;
        break;
      }

      default:
      {
        break;
      }
    }
  }

}


Rock.prototype.render = function()
{
/*
  debugTextOut(color('red'), "Rock:");
  debugTextOut(color('black'), "action = " + this.action);
  debugTextOut(color('black'), "bounceCount = " + this.bounceCount);
  debugTextOut(color('black'), "maxVelocity = " + this.maxVelocity.x + ", " + this.maxVelocity.y);
  debugTextOut(color('black'), "acceleration= " + this.acceleration.x + ", " + this.acceleration.y);
//  debugTextOut(color('black'), "objRect     = " + this.objRect[rectSides.LEFT] + ", " + this.objRect[rectSides.TOP]);
//  debugTextOut(color('black'), "objCenter   = " + this.objCenter.x + ", " + this.objCenter.y);
//  debugTextOut(color('black'), "destination = " + this.destination.x + ", " + this.destination.y);
  debugTextOut(color('black'), "velocity    = " + this.velocity.x + ", " + this.velocity.y);
//  debugTextOut(color('black'), "size = " + this.size[this.action].x + ", " + this.size[this.action].x);
//  debugTextOut(color('black'), "halfSize = " + this.halfSize[this.action].x + ", " + this.halfSize[this.action].x);
//  debugTextOut(color('black'), "moveBounds = " + this.moveBounds[rectSides.LEFT] + ", " + this.moveBounds[rectSides.RIGHT] + ", " + this.moveBounds[rectSides.TOP] + ", " + this.moveBounds[rectSides.BOTTOM]);
*/


/*
  // Display the collision box
  stroke(255, 204, 100);
  noFill();
  strokeWeight(3);
  rect(this.objRect[rectSides.LEFT], this.objRect[rectSides.TOP], this.objRect[rectSides.RIGHT] - this.objRect[rectSides.LEFT], this.objRect[rectSides.BOTTOM] - this.objRect[rectSides.TOP]);
*/

/*
  // Display the destination marker
  fill(255, 204, 100);
  noStroke();
  circle(this.destination.x, this.destination.y, 30);
*/

  if (this.action != actions.ACTION_DEAD)
  {
    image(rockImgs[this.action][this.imgIndex], this.objRect[rectSides.LEFT], this.objRect[rectSides.TOP], this.size[this.action].x, this.size[this.action].y);
    this.tail.render();
  }
}
