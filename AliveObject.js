

function AliveObject(type)
{
  this.name = "AliveObject";
  this.type = type;
  this.action = actions.ACTION_UNKNOWN;
  this.objCenter = new Point();   // the object's center Point
  this.numFrames = new Array(MAX_ACTIONS);
  this.imgIndex = 0;
  this.velocity = new Point(0, 0);
  this.minVelocity = new Point();
  this.maxVelocity = new Point();
  this.destination = new Point();               // where the unit is headed on the map

  this.moveBounds = new Array(4);
  this.moveBounds[rectSides.LEFT]   = 0;
  this.moveBounds[rectSides.RIGHT]  = screenWidth;
  this.moveBounds[rectSides.TOP]    = 0;
  this.moveBounds[rectSides.BOTTOM] = screenHeight;

  this.nextMoveTime;
  this.health = 100;

  this.objRect = new Array(4);         // the object's position RECT

  this.size = new Array(MAX_ACTIONS);
  this.halfSize = new Array(MAX_ACTIONS);

  for (var count1 = 0; count1 < MAX_ACTIONS; count1++)
  {
    this.size[count1] = new Point();
    this.halfSize[count1] = new Point();
  }

  this.initialize();
}



AliveObject.prototype =
{
  constructor: AliveObject,

  initialize : function()
  {
    for (var count1 = 0; count1 < MAX_ACTIONS; count1++)
    {
      this.halfSize[count1].x = this.size[count1].x / 2;
      this.halfSize[count1].y = this.size[count1].y / 2;
    }

    this.calcObjRect();
  },


  newLevel : function(theLevel)
  {
    this.health = MAX_HEALTH;
  },


  getHealth : function()
  {
    return this.health;
  },


  hit : function(damage)
  {
    if (this.health >= damage)
    {
      this.health = this.health - damage;
    }
    else
    {
      this.health = 0;
    }
  },


  isAlive : function()
  {
    if (this.action == actions.ACTION_DEAD)
    {
      return false;
    }
    else
    {
      return true;
    }
  },


  getXSize : function()
  {
    return this.size[this.action].x;
  },


  getYSize : function()
  {
    return this.size[this.action].y;
  },


  getXPosition : function()
  {
    return this.objCenter.x;
  },


  getYPosition : function()
  {
    return this.objCenter.y;
  },



  checkForHit : function(xPos, yPos)
   {
   if ((xPos > this.objRect[rectSides.LEFT]) && (xPos < this.objRect[rectSides.RIGHT]) && (yPos > this.objRect[rectSides.TOP]) && (yPos < this.objRect[rectSides.BOTTOM]))
      return true;

   return false;
   },


  getObjCenter : function()
  {
    return this.objCenter;
  },


  calcObjRect : function()
  {
    this.objRect[rectSides.LEFT]   = Math.floor(this.objCenter.x - this.halfSize[this.action].x);
    this.objRect[rectSides.RIGHT]  = Math.floor(this.objCenter.x + this.halfSize[this.action].x);
    this.objRect[rectSides.TOP]    = Math.floor(this.objCenter.y - this.halfSize[this.action].y);
    this.objRect[rectSides.BOTTOM] = Math.floor(this.objCenter.y + this.halfSize[this.action].y);
  },


  setLocation : function(xDst, yDst)
  {
    let inBounds;

    this.objCenter.x = xDst;
    this.objCenter.y = yDst;
    this.calcObjRect();
    this.destination.x = xDst;
    this.destination.y = yDst;
  },



  getRect : function()
   {
     return this.objRect;
   },


  getNextFrame : function()
  {
    this.imgIndex += 1;
    if (this.imgIndex >= this.numFrames[this.action])
    {
      this.imgIndex = 0;
    }
  },


  move : function(collideableList)
  {
  },


  getType : function()
  {
    return this.type;
  },


  setDestination : function(xPos, yPos)
  {
    // velocity is zero in X and Y when coming from a dead stop
    if ((this.action == actions.ACTION_IDLE_LEFT) || (this.action == actions.ACTION_IDLE_RIGHT))
    {
      this.velocity.x = 0;
      this.velocity.y = 0;
    }

//    console.log("xPos = " + xPos, ", " + yPos);
//    console.log("objCenter 6 = " + this.objCenter.x, ", " + this.objCenter.y);
//    console.log("moveBounds 2 = " + this.moveBounds[rectSides.RIGHT], ", " + this.moveBounds[rectSides.BOTTOM]);

    if ((xPos <= this.moveBounds[rectSides.RIGHT]) && (xPos >= this.moveBounds[rectSides.LEFT]))
    {
      this.destination.x = xPos;
    }
    else
    {
//      console.log("destination.x out of bounds");
      if (xPos > this.moveBounds[rectSides.RIGHT])
      {
        this.objCenter.x = this.moveBounds[rectSides.RIGHT];
      }
      else
      {
        this.objCenter.x = this.moveBounds[rectSides.LEFT];
      }
    }

    if ((yPos <= this.moveBounds[rectSides.BOTTOM]) && (yPos >= this.moveBounds[rectSides.TOP]))
    {
      this.destination.y = yPos;
    }
    else
    {
      if (yPos > this.moveBounds[rectSides.BOTTOM])
      {
        this.objCenter.x = this.moveBounds[rectSides.BOTTOM];
      }
      else
      {
        this.objCenter.y = this.moveBounds[rectSides.TOP];
      }
    }

    if (this.objCenter.x < this.destination.x)
    {
      this.action = actions.ACTION_WALK_RIGHT;
    }
    else if (this.objCenter.x > this.destination.x)
    {
      this.action = actions.ACTION_WALK_LEFT;
    }

    this.destination.x = xPos;
    this.destination.y = yPos;
  },



  getDestination : function()
  {
    return destination;
  },


  draw : function()
  {
  },



  isOverlapped : function(testRect)
  {
    // it's easier to test if their NOT overlapped, and invert it
    return (!(testRect[rectSides.RIGHT]  <= this.objRect[rectSides.LEFT]   ||
              testRect[rectSides.LEFT]   >= this.objRect[rectSides.RIGHT]  ||
              testRect[rectSides.TOP]    >= this.objRect[rectSides.BOTTOM] ||
              testRect[rectSides.BOTTOM] <= this.objRect[rectSides.TOP]));
  },



  checkOverlapped : function(aliveList)
  {
    for (count1 = 0; count1 < aliveList.length; count1++)
    {
      // skip over this object
      if ((aliveList[count1] != this) && (aliveList[count1].name != "Emitter"))
      {
        // if bounding rectangles overlap...
        if (this.isOverlapped(aliveList[count1].objRect))
        {
//          console.log("overlapped");
          return aliveList[count1];
        }

      }
    }

    return false;
  }

};
