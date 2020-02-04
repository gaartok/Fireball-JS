
let basket;
let theHero;
let houseLeft;
let houseRight;
let playerScore;
let sounds;
let images;
let colors;


const MAX_HEALTH = 100;

const levels =
   {
   LEVEL1:  1,
   LEVEL2:  2,
   LEVEL3:  3
   };


const LEVEL1_MIN_SCORE = 0;
const LEVEL2_MIN_SCORE = 100;
const LEVEL3_MIN_SCORE = 300;

const SPLASH_SCREEN_TIME = 4000;
const INSTRUCTIONS_TIME  = 10000;

// Original artwork size
const SCREEN_WIDTH  = 640;
const SCREEN_HEIGHT = 480;

// Location on screen where the rocks bounce.  Based on original artwork size.
const BOUNCE_Y_COORD = 460;


let screenWidth;
let screenHeight;
let widthScale;
let heightScale;
let screenRatio;
let screenAreaRatio;
let bounceYCoord;

const rectSides =
   {
   LEFT:   0,
   RIGHT:  1,
   TOP:    2,
   BOTTOM: 3
   };


const actions =
{
  ACTION_UNKNOWN:    0,
  ACTION_IDLE_LEFT:  1,
  ACTION_IDLE_RIGHT: 2,
  ACTION_WALK_LEFT:  3,
  ACTION_WALK_RIGHT: 4,
  ACTION_WALK_UP:    5,
  ACTION_WALK_DOWN:  6,
  ACTION_FIDGET1:    7,
  ACTION_FIDGET2:    8,
  ACTION_FIDGET3:    9,
  ACTION_DEAD:       10,
  ACTION_LAST:       11
};

const MAX_ACTIONS = actions.ACTION_LAST;


const programStates =
{
  PS_INIT:              0,
  PS_SPLASH:            1,
  PS_GET_HIGH_SCORES:   2,
  PS_SHOW_HIGH_SCORES:  3,
  PS_INSTRUCTIONS:      4,
  PS_BEGIN_LEVEL:       5,
  PS_ACTIVE:            6,
  PS_ENDGAME:           7,
  PS_SHOW_SCORE:        8,
  PS_ENTER_NAME:        9,
  PS_FINISHED:          10,
  PS_IDLE:              11
};


const itemTypes =
{
  TYPE_UNKNOWN: 0,
  TYPE_HERO:    1,
  TYPE_BASKET:  2,
  TYPE_ROCK:    3,
  TYPE_HOUSE:   4,
  TYPE_EMITTER: 5,
  TYPE_LAST:    6
};


