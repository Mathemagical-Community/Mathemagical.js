/* DRAG THE SQUARE
 * This is a proof-of-concept sketch of custom event responders
 * for a p5.js library called Mathemagical.js. Specifically, this
 * sketch demonstrates Mathemagical's addEventResponder() and 
 * deleteEventResponder(). To see deleteEventResponder() work, 
 * uncomment the lines that call that method.
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
let myDragController;

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
  
  //drag controller
  myDragController = w.createDragController();
  
  myDragController.addEventResponder('mouseover', myMouseOverResponder);
  myDragController.addEventResponder('mouseout', myMouseOutResponder);
  
  //myDragController.deleteEventResponder('mouseover', myMouseOverResponder);
  //myDragController.deleteEventResponder('mouseout', myMouseOutResponder);  
}

function draw() {
  background(240);
  
  //Axes
  w.axis(xAxis);
  w.axis(yAxis);
  
  //Square
  mySquare.takeInput(myDragController);
  w.square(mySquare);
}

function myMouseOverResponder(drawingObject) {
  drawingObject.strokeWeight(3);
}

function myMouseOutResponder(drawingObject) {
  drawingObject.strokeWeight(1);
}
