let w; //graph window
let myLine;
let draggable;

function setup() {
  createCanvas(400, 400);

  const xOrigin = width / 2;
  const yOrigin = height / 2;
  const xScale = 10; //px per unit
  const yScale = 10; //px per unit
  w = createGraphWindow(xOrigin, yOrigin, xScale, yScale);

  myLine = w.createLine(-1, -2, 3, 4);
  myLine.setIsDraggable(true)

  draggable = w.createDraggable();
  draggable.mouseDragged(object => {
    const mouse = createVector(mouseX, mouseY);
    const midpoint = object.getCenterInCanvas()
    const diff = p5.Vector.sub(mouse, midpoint)
    object.translate(diff)
  });
  draggable.mouseDropped(() => {})
}

function draw() {
  background(240, 240, 240);
  myLine.takeInput(draggable)
  w.line(myLine);
}
