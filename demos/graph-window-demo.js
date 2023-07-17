/* 
 * This is a proof-of-concept sketch of a custom graphing window,
 * for a p5.js library called Mathemagical.js. With a custom 
 * graphing window, inputs to native p5 shapes are interpreted in
 * terms of a user-defined coordinate system. Mathemagical shapes
 * work the same way.
 *
 * The code that makes this sketch work can be found in the 
 * mathemagical-prototype.js file in this project's directory. 
 * That file constitutes an early prototype of Mathemagical.js.
 * Only a small sample of the planned features are currently 
 * included.
*/

let w; //graphing window

function setup() {
  createCanvas(400, 400);
  
  //createGraphWindow(xOrigin, yOrigin, xScale, yScale)
  //specify scale values in px per unit
  w = createGraphWindow(width / 2, height / 2, 20, 20);
}

function draw() {
  background(240);
  w.strokeWeight(10);
  w.point(0, 0);
}
