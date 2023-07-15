/*
 * This is a proof-of-concept sketch of "drawing objects," 
 * for a p5.js library called Mathemagical.js. These shapes 
 * can be drawn in a custom coordinate system using native p5.js 
 * syntax.
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
let w; //graph window

let u, v; //vectors (p5.Vector objects)
let a, b; //arrows (Mathemagical arrow objects)

function setup() {
  createCanvas(400, 400);
  
  //vectors
  u = createVector(5, 12);
  v = createVector(7, 4);

  //graph window
  xOrigin = width / 2;
  yOrigin = height / 2;
  xScale = 10; //px per unit
  yScale = 10; //px per unit
  w = createGraphWindow(xOrigin, yOrigin, xScale, yScale);
  
  //axes
  xAxis = w.createAxis('horizontal');
  yAxis = w.createAxis('vertical');
  
  //arrows
  a = w.createArrow(u); //arrow based on u, at origin
  b = w.createArrow(v, u); //arrow based on v, at u
}

function draw() {
  background(240, 240, 240);
    
  w.axis(xAxis);
  w.axis(yAxis);
  
  w.arrow(a);
  w.arrow(b);
}
