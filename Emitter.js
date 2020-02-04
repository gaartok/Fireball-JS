
let deadParticles = new Array();



function degreesToRadians(degrees)
{
  return degrees * (Math.PI / 180);
}



function Particle()
  {
  this.pos = new Point(); // current position
  this.dir = new Point(); // current direction with speed
  this.life = 2000;       // how long it will last
  this.colorR;            // current color of particle
  this.colorG;            // current color of particle
  this.colorB;            // current color of particle
  this.deltaColorR;       // change of color
  this.deltaColorG;       // change of color
  this.deltaColorB;       // change of color
  }



Particle.prototype =
{
  constructor: Particle,

  update : function(force)
  {
    this.pos.x += this.dir.x;
    this.pos.y += this.dir.y;

    this.dir.x += force.x;
    this.dir.y += force.y;

//    this.color += this.deltaColor;

    if (this.life > 0)
    {
      this.life = Math.floor(this.life - 1);
    }
  },

  render : function()
  {
    fill(this.colorR, this.colorG, this.colorB);
    circle(this.pos.x, this.pos.y, 3 * heightScale);
  }
}




function Emitter(maxParticles, widthScale, heightScale)
{
  this.name = "Emitter";

  this.maxParticles = maxParticles; // maximum emitted at any time
  this.widthScale = widthScale;
  this.heightScale = heightScale;

  this.aliveParticles = new Array();   // active particles
  this.posUL = new Point();            // XYZ position Upper Left
  this.posLR = new Point();            // XYZ position Lower Right
  this.yaw;              // yaw and variation
  this.yawVar;           // yaw and variation
  this.pitch;            // pitch and variation
  this.pitchVar;         // pitch and variation
  this.speed;
  this.speedVar;
  this.particleCount = 0;           // total emitted right now
  this.emitsPerFrame;               // emits per frame and variation
  this.emitVar;                     // emits per frame and variation
  this.life;
  this.lifeVar;

  this.startColorR;
  this.startColorG;
  this.startColorB;
  this.startColorVar;

  this.endColorR;
  this.endColorG;
  this.endColorB;
  this.endColorVar;
  this.force = new Point();

  this.objRect = new Array(4);         // the object's position RECT

  this.setDefault();
}




Emitter.prototype =
{
  constructor: Emitter,

  getType : function()
  {
    return itemTypes.TYPE_EMITTER;
  },

  isAlive : function()
  {
    return true;
  },

  // Convert a Yaw and Pitch to a direction vector
  rotationToDirection : function(pitch, yaw)
  {
    let direction = new Point();

    direction.x = -Math.sin(yaw) * Math.cos(pitch);
    direction.y = Math.sin(pitch);

   return direction;
  },

  setPosByRect : function(posRect)
  {
    this.posUL.x = posRect[rectSides.LEFT];
    this.posUL.y = posRect[rectSides.TOP];
    this.posLR.x = posRect[rectSides.RIGHT];
    this.posLR.y = posRect[rectSides.BOTTOM];
  },


  setPosBySides : function(left, right, top, bottom)
  {
    this.posUL.x = left;
    this.posUL.y = top;
    this.posLR.x = right;
    this.posLR.y = bottom;
  },


  setAngles : function(yawAngle, yawVarAngle, pitchAngle, pitchVarAngle)
  {
    this.yaw      = degreesToRadians(yawAngle);
    this.yawVar   = degreesToRadians(yawVarAngle);
    this.pitch    = degreesToRadians(pitchAngle);
    this.pitchVar = degreesToRadians(pitchVarAngle);
  },


  setSpeed : function(newSpeed, newSpeedVar)
  {
    this.speed    = newSpeed;
    this.speedVar = newSpeedVar;
  },


  setForce : function(forceX, forceY)
  {
    this.force.x  = forceX * this.widthScale;
    this.force.y  = forceY * this.heightScale;
  },


  setEmits : function(newEmits, newEmitsVar)
  {
    this.emitsPerFrame  = newEmits;
    this.emitVar        = newEmitsVar;
  },


  setLife : function(newLife, newLifeVar)
  {
    this.life     = newLife;
    this.lifeVar  = newLifeVar;

    if (this.life == 0)
    {
      for (var count1 = 0; count1 < this.aliveParticles.length; count1++)
      {
        deadParticles.push(this.aliveParticles[count1]);
      }

      this.aliveParticles.length = 0;
      this.particleCount = 0;
    }

  },

  setColors : function(newStartColor, newStartColorVar, newEndColor, newEndColorVar)
  {
    this.startColorR    = red(newStartColor);
    this.startColorG    = green(newStartColor);
    this.startColorB    = blue(newStartColor);
    this.startColorVar  = newStartColorVar;
    this.endColorR      = red(newEndColor);
    this.endColorG      = green(newEndColor);
    this.endColorB      = blue(newEndColor);
    this.endColorVar    = newEndColorVar;
  },


  setDefault : function()
  {
    this.particleCount = 0;

    this.posUL.x = 225.0;
    this.posUL.y = 120.0;
    this.posLR.x = 320.0;
    this.posLR.y = 120.0;

    this.yaw      = degreesToRadians(0.0);
    this.yawVar   = degreesToRadians(360.0);
    this.pitch    = degreesToRadians(270.0);
    this.pitchVar = degreesToRadians(40.0);

    this.speed    = 3.0;
    this.speedVar = 0.5;

    this.force.x        = 0.000;
    this.force.y        = 0.04;

    this.emitsPerFrame  = 2;
    this.emitVar        = 3;

    this.life           = 200;
    this.lifeVar        = 15;

    this.endColorR      = 0;
    this.endColorG      = 0;
    this.endColorB      = 0;
    this.startColorVar  = 1.0;
    this.endColorR      = 0;
    this.endColorG      = 0;
    this.endColorB      = 0;
    this.endColorVar    = 1.0;
  },


  addParticle : function()
  {
    let theParticle;
    let startColor;
    let endColor;
    let deltaColor;
    let theYaw;
    let thePitch;
    let theSpeed;
    let returnVal;

    if ((this.particleCount < this.maxParticles) && (this.life > 0))
    {
      if (deadParticles.length > 0)
      {
        theParticle  = deadParticles.pop();
      }
      else
      {
        theParticle = new Particle();
      }

      theParticle.life = this.life + (this.lifeVar * random(0, 1));

      theParticle.pos.x = random(this.posUL.x, this.posLR.x);
      theParticle.pos.y = random(this.posUL.y, this.posLR.y);

      // calculate the starting direction vector
      theYaw = this.yaw + (this.yawVar * random(0, 1));
      thePitch = this.pitch + (this.pitchVar * random(0, 1));

      // convert the rotations to a vector
      theParticle.dir = this.rotationToDirection(thePitch, theYaw);

      // multiply in the speed factor
      theSpeed = this.speed + (this.speedVar * random(0, 1));
      theParticle.dir.x *= theSpeed;
      theParticle.dir.y *= theSpeed;

      theParticle.colorR = this.startColorR + (this.startColorVar * random(0, 1));
      theParticle.colorG = this.startColorG + (this.startColorVar * random(0, 1));
      theParticle.colorB = this.startColorB + (this.startColorVar * random(0, 1));

      // a new particle is born
      this.aliveParticles.push(theParticle);
      this.particleCount++;

      returnVal = true;
    }

    returnVal = false;

    return returnVal;
  },


  update : function(collideableList)
  {
    textAlign(LEFT, TOP);

    for (var count1 = 0; count1 < this.aliveParticles.length; count1++)
    {
      this.aliveParticles[count1].update(this.force);

      if (this.aliveParticles[count1].life == 0)
      {
        deadParticles.push(this.aliveParticles[count1]);
        this.aliveParticles.splice(count1, 1);
        count1 -= 1;

        if (this.particleCount > 0)
        {
          this.particleCount--;
        }
      }
    }

    // don't add new particles if Emitter's life == 0
    if ((this.particleCount < this.maxParticles) && (this.life > 0))
    {
      var emitCount = this.emitsPerFrame + (this.emitVar * random(0, 1));
      for (var count1 = 0; count1 < emitCount; count1++)
      {
        this.addParticle();
      }
    }

  },



  render : function()
  {
    noStroke();
    colorMode(RGB);

    for (var count1 = 0; count1 < this.aliveParticles.length; count1++)
    {
      this.aliveParticles[count1].render();
    }
  }


};

