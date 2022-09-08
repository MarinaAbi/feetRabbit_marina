const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var rope, fruit, ground;
var fruit_con;
var fruit_con_2;

var bg_img;
var food;
var rabbit;

var button, blower;
var bunny;
var blink, eat, sad;
var mute_btn;

var fr, rope2;

var bk_song;
var cut_sound;
var sad_sound;
var eating_sound;
var air;

var canH, canW;

function preload() {
  bg_img = loadImage('images/background.png');
  food = loadImage('images/melon.png');
  rabbit = loadImage('images/Rabbit-01.png');

  bk_song = loadSound('sons/sound1.mp3');
  sad_sound = loadSound('sons/sad.wav');
  cut_sound = loadSound('sons/rope_cut.mp3');
  eating_sound = loadSound('sons/eating_sound.mp3');
  air = loadSound('sons/air.wav');

  blink = loadAnimation(
    'images/blink_1.png',
    'images/blink_2.png',
    'images/blink_3.png'
  );

  eat = loadAnimation(
    'images/eat_0.png',
    'images/eat_1.png',
    'images/eat_2.png',
    'images/eat_3.png',
    'images/eat_4.png'
  );

  sad = loadAnimation(
    'images/sad_1.png',
    'images/sad_2.png',
    'images/sad_3.png'
  );

  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping = false;
  eat.looping = false;
}

function setup() {
 
var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    canH = displayHeight;
    canW = displayWidth;
  } else {
    canH = windowHeight;
    canW = windowWidth;
  }
  createCanvas(canW, canH);
  
  frameRate(80);

  //bk_song.play();
  bk_song.setVolume(0.5);

  engine = Engine.create();
  world = engine.world;

  button = createImg('images/cut_btn.png');
  button.position(canW /2 -18, 30);
  button.size(50, 50);
  button.mouseClicked(drop);

  button1 = createImg('images/balloon.png');
  button1.position(10, 250);
  button1.size(150, 150);
  button1.mouseClicked(assoprar);

  button2 = createImg('images/mute.png');
  button2.position(canW -75, 25);
  button2.size(30, 30);
  button2.mouseClicked(mutar);

  rope = new Rope(7, { x: canW /2, y: 30 });
  ground = new Ground(canW /2, canH -10, canW, 20);

  blink.frameDelay = 20;
  eat.frameDelay = 20;

  bunny = createSprite(canW /2 -20 , canH -100, 100, 100);
  bunny.scale = 0.2;

  bunny.addAnimation('blinking', blink);
  bunny.addAnimation('eating', eat);
  bunny.addAnimation('crying', sad);
  bunny.changeAnimation('blinking');

  fruit = Bodies.circle(300, 300, 20);
  Matter.Composite.add(rope.body, fruit);

  fruit_con = new Link(rope, fruit);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50);
}

function draw() {
  background(51);
  image(bg_img, 0, 0, canW, canH);

  push();
  imageMode(CENTER);
  if (fruit != null) {
    image(food, fruit.position.x, fruit.position.y, 70, 70);
  }
  pop();

  rope.show();
  Engine.update(engine);
  ground.show();

  drawSprites();

  if (collide(fruit, bunny) == true) {
    bunny.changeAnimation('eating');
    eating_sound.play();
  }

  if (fruit != null && fruit.position.y >= 650) {
    bunny.changeAnimation('crying');
    fruit = null;
    sad_sound.play();
  }
}

function drop() {
  rope.break();
  fruit_con.detach();
  fruit_con = null;
}

function collide(body, sprite) {
  if (body != null) {
    var d = dist(
      body.position.x,
      body.position.y,
      sprite.position.x,
      sprite.position.y
    );
    if (d <= 80) {
      World.remove(engine.world, fruit);
      fruit = null;
      return true;
    } else {
      return false;
    }
  }
}

function assoprar() {
  Matter.Body.applyForce(fruit, { x: 0, y: 0 }, { x: 0.01, y: 0 });
  air.play();
}

function mutar() {
  if (bk_song.isPlaying()) {
    bk_song.stop();
  } else {
    bk_song.play();
  }
}
