let w; //graph window
let a; //arrow
let draggable;

function setup() {
  createCanvas(400, 400);

  const xOrigin = width / 2;
  const yOrigin = height / 2;
  const xScale = 10; //px per unit
  const yScale = 10; //px per unit
  w = createGraphWindow(xOrigin, yOrigin, xScale, yScale);

  w.createDraggable();
  a = w.createArrow(createVector(5, 12));

  draggable = w.createDraggable()

  background(240, 240, 240);
}

function draw() {
  w.arrow(a);
}

