/*
 * This is a proof-of-concept sketch of an "animator object," 
 * for a p5.js library called Mathemagical.js. With animator 
 * objects, animations are as easy to create as drawings. Each 
 * animator object stores a customizable animation type, which 
 * can then be applied to any drawing object.
 *
 * The code that makes this sketch work can be found in the 
 * mathemagical-prototype.js file in this project's directory. 
 * That file constitutes an early prototype of Mathemagical.js.
 * Only a small sample of the planned features are currently 
 * included.
*/

let xOrigin, yOrigin;
let xScale, yScale; //px per unit
let xAxis, yAxis;
let w; //graphing window
let mySquare;
let myAngle; //angle of rotation
let mySpeed; //radians per frame
let myRotationAnimator;

function setup() {
  createCanvas(400, 400);
  
  //graph window
  xOrigin = width / 2;
  yOrigin = height / 2;
  xScale = 20; //px per unit
  yScale = 20; //px per unit
  w = createGraphWindow(xOrigin, yOrigin, xScale, yScale);
  
  //axes
  xAxis = w.createAxis('horizontal');
  yAxis = w.createAxis('vertical');
  
  //square
  mySquare = w.createSquare(-1, 1, 2);
  
  //rotation
  myAngle = PI / 4;
  mySpeed = myAngle / 100;
  myRotationAnimator = w.createRotationAnimator(myAngle, mySpeed);
}

function draw() {
  background(240);
  
  //Axes
  w.axis(xAxis);
  w.axis(yAxis);
  
  //Square
  mySquare.takeUpdate(myRotationAnimator);
  w.square(mySquare);
}
