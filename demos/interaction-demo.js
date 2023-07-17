/* DRAG THE SQUARE
 * This is a proof-of-concept sketch of an "interaction object," 
 * for a p5.js library called Mathemagical.js. With interaction 
 * objects, making objects interactive is as easy as drawing them.
 * Each interaction object stores a customizable mode of 
 * interaction that can be used to apply user input to any drawing 
 * object.
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
let myDraggable;

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
  //constructor takes same parameters as p5's square(), 
  //but specified in the coordinate system of the graph window
  mySquare = w.createSquare(-1, 1, 2);
  
  //draggable
  myDraggable = w.createDraggable();
}

function draw() {
  background(240);
  
  //Axes
  w.axis(xAxis);
  w.axis(yAxis);
  
  //Square
  mySquare.takeInput(myDraggable);
  w.square(mySquare);
}
