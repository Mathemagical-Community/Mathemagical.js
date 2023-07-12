/******************************** ABOUT
This mini library is a prototype for Mathemagical.js, meaning that
it's a space to try out possible implementations, and to create 
proofs of concept for different types of features:

* MATH
* ENVIRONMENT
* DRAWING
* ANIMATION
* INTERACTION

Notes:
1. Features that will eventually be supported by multiple classes 
might only be implemented here for one particular class. Also, for this 
prototype library, p5.js is used only in global mode.

2. Since the p5 web editor doesn't seem to like private class members 
with the modern # prefix, the _ prefix convention is used; however,
most members are left public for now.
********************************/

/******************************** MATH
* Matrix
* createMatrix()

Notes:

1. The matrix features just cover some quick special cases that 
are needed or may be needed soon.

2. For future reference, p5 has internal code for matrix stuff:
https://github.com/processing/p5.js/blob/a66195a45fdd4d0b7396169b09ad2ce6dfffcdd4/src/webgl/p5.Matrix.js#L13
********************************/

class Matrix {
  constructor(a, b, c, d) { //column 1, then column 2
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
  }
  
  static multAB(A, B) { //A, B are Matrix objects
    let a, b, c, d; //entries of AB
    a = A.a * B.a + A.c * B.b;
    b = A.b * B.a + A.d * B.b;
    c = A.a * B.c + A.c * B.d;
    d = A.b * B.c + A.d * B.d;
    
    return new Matrix(a, b, c, d);
  }
  
  static multAv(A, v) { //A = Matrix object, v = p5.Vector object
    let w1, w2; //entries of Av (v interpreted as a column vector)
    w1 = A.a * v.x + A.c * v.y;
    w2 = A.b * v.x + A.d * v.y;
    
    return new p5.Vector(w1, w2)
  }
}

function createMatrix(a, b, c, d) {
  return new Matrix(a, b, c, d);
}

/******************************** ENVIRONMENT
* GraphWindow
* wrappers
********************************/

//for now, using a global var to store
//the two most recent values of mouseIsPressed;
//used to detect when mouse is newly pressed or newly released,
//using only p5's built-in system variables (may be a bit kludgy?);
//"magic_" prefix used to reduce the likelihood of being overwritten by the user
var magic_pressHistory = [false, false];

/**** GraphWindow ****/
class GraphWindow {
  constructor(xOrigin, yOrigin, xScale, yScale) {
    this.xOrigin = xOrigin; //horizontal canvas coordinate of origin
    this.yOrigin = yOrigin; //vertical canvas coordinate of origin
    this.xScale = xScale; //px per unit
    this.yScale = yScale; //px per unit
    
    //a style property (more will be added)
    this._strokeWeight = 1;
  }
  
  //X(x), Y(y) convert (x, y) graph coords to (X, Y) canvas coords
  X(x) {return this.xOrigin + this.xScale * x;}
  Y(y) {return this.yOrigin - this.yScale * y;}
  
  //x(X), y(Y) convert (X, Y) canvas coords to (x, y) graph coords
  x(X) {return (X - this.xOrigin) / this.xScale;}
  y(Y) {return -(Y - this.yOrigin) / this.yScale;}
  
  //Rendering
  /* Notes on isDrawingObject() for parametric polymorphism:
  1. Current approach is just the first idea to get it working.
  2. The p5 approach uses instanceOf. See 2d_primitives.js.
  3. InstanceOf caused an error here, for some reason.
  4. Is instanceOf a code smell?
  5. An object type property ('drawing', 'animation', ...) may be better.
  */
  
  isDrawingObject(...args) {
    return args[0].render !== undefined;
  }
  
  render(drawingType, ...args) {
    //drawingType: 'square', etc.
    //...args: drawing object, or parameters for its constructor
    
    if (this.isDrawingObject(...args)) {
      args[0].render(); //call render method of supplied object
    }
    else {
      //make sure casing is correct (e.g. 'createSquare' not 'createsquare')
      let upperCaseDrawingType = drawingType[0].toUpperCase() + drawingType.slice(1);
      let constructorName = 'create' + upperCaseDrawingType;
      
      //construct object and render it
      this[constructorName](...args).render();
    }
  }
  
  strokeWeight(weight) {
    this._strokeWeight = weight;
  }
  
  getStrokeWeight() {
    return this._strokeWeight;
  }
}

/**** wrappers ****/

/**** Graph window ****/
function createGraphWindow(xOrigin, yOrigin, xScale, yScale) {
  return new GraphWindow(xOrigin, yOrigin, xScale, yScale);
}

/**** drawing ****/

//Point
GraphWindow.prototype.createPoint = function(x, y) {
  return new Point(this, x, y);
}
  
GraphWindow.prototype.point = function(...args) {
  this.render('Point', ...args);
}

//Square
GraphWindow.prototype.createSquare = function(x, y, s) {
  return new Square(this, x, y, s);
}
  
GraphWindow.prototype.square = function(...args) {
  this.render('Square', ...args);
}

//Arrow
GraphWindow.prototype.createArrow = function(v, p, hW = 0.5, hL = 0.75) {
  return new Arrow(this, v, p, hW, hL);
}
  
GraphWindow.prototype.arrow =function(...args) {
  this.render('Arrow', ...args);
}

//Axis
GraphWindow.prototype.createAxis = function(orientation) {
  return new Axis(this, orientation);
}
  
GraphWindow.prototype.axis =function(...args) {
  this.render('Axis', ...args);
}

//Tick
GraphWindow.prototype.createTick = function(axisOrientation, value = 0, length = 10) {
  return new Tick(this, axisOrientation, value, length);
}
  
GraphWindow.prototype.tick = function(...args) {
  this.render('Tick', ...args);
}

/**** animation ****/

//Rotation
GraphWindow.prototype.createRotation = function(angle, point, speed) {
  return new Rotation(this, angle, point, speed);
}

/**** interaction ****/

//Draggable
GraphWindow.prototype.createDraggable = function() {
  return new Draggable(this);
}

/******************************** DRAWING
* Point
* Square
* Arrow
* Axis
* Tick
********************************/

/**** Point ****/
class Point {
  constructor(w, x, y) {
    this.w = w; //graph window
    this.x = x;
    this.y = y;
    
    //Styles:
    //only stroke weight is supported for now,
    //as a proof of concept;
    this._strokeWeight = this.w.getStrokeWeight();
  }
  
  strokeWeight(weight) {
      this._strokeWeight = weight;
    }
  
  getStrokeWeight() {
    return this._strokeWeight;
  }

  render() {
    //call p5's native strokeWeight()
    strokeWeight(this._strokeWeight);
    
    //draw a point at graph coordinates (x, y)
    let canvasX = this.w.X(this.x);
    let canvasY = this.w.Y(this.y);
    point(canvasX, canvasY);
  }
}

/**** Square ****/
class Square {
  constructor(w, x, y, s) { //leaving out optional parameters for now
    this.w = w; //graph window
    this.s = s;
    
    //temporary version of a general model for all drawing objects
    this.verticesInCanvas = [];
    this.verticesInGraph = [];
    
    //set position of top-left graph vertex, 
    //adjust other vertices accordingly
    this.setPosition(x, y);
  }
  
  computeVerticesInCanvas(X, Y) { //X, Y are canvas coords of top-left vertex
    let W = this.getWidthInCanvas();
    let H = this.getHeightInCanvas();
    let TL = createVector(X, Y); //top left
    let TR = createVector(X + W, Y); //top right
    let BR = createVector(X + W, Y + H); //bottom right
    let BL = createVector(X, Y + H); //bottom left
    return [TL, TR, BR, BL];
  }
  
  computeGraphFromCanvas(verticesInCanvas) {
    let x, y;
    let vertexInGraph;
    let verticesInGraph = [];
    
    for (const vertexInCanvas of verticesInCanvas) {
      x = this.w.x(vertexInCanvas.x);
      y = this.w.y(vertexInCanvas.y);
      vertexInGraph = createVector(x, y);
      verticesInGraph.push(vertexInGraph);
    }
    
    return verticesInGraph;
  }

  computeCanvasFromGraph(verticesInGraph) {
    let X, Y;
    let vertexInCanvas;
    let verticesInCanvas = [];
    
    for (const vertexInGraph of verticesInGraph) {
      X = this.w.X(vertexInGraph.x);
      Y = this.w.Y(vertexInGraph.y);
      vertexInCanvas = createVector(X, Y);
      verticesInCanvas.push(vertexInCanvas);
    }
    
    return verticesInCanvas;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
    
    //reset vertices in canvas coordinates
    let X = this.w.X(this.x);
    let Y = this.w.Y(this.y);
    this.verticesInCanvas = this.computeVerticesInCanvas(X, Y);
    
    //reset vertices in graph coordinates
    this.verticesInGraph = this.computeGraphFromCanvas(this.verticesInCanvas);
  }
  
  getPosition() {
    return this.verticesInGraph[0];
  }

  setPositionInCanvas(X, Y) {
    this.x = this.w.x(X);
    this.y = this.w.y(Y);
    
    //reset vertices in canvas coordinates
    this.verticesInCanvas = this.computeVerticesInCanvas(X, Y);
    
    //reset vertices in graph window coordinates
    this.verticesInGraph = this.computeGraphFromCanvas(this.verticesInCanvas);
  }
  
  getPositionInCanvas() {
    return this.verticesInCanvas[0];
  }

  setVerticesInCanvas(verticesInCanvas) {
    this.verticesInCanvas = verticesInCanvas;
    
    //update graph vertices based on new canvas vertices
    this.verticesInGraph = this.computeGraphFromCanvas(verticesInCanvas);
      
    //update position
    this.x = this.w.x(verticesInCanvas[0].x);
    this.y = this.w.y(verticesInCanvas[0].y);
  }
  
  setVertices(vertices) {
    this.verticesInGraph = vertices;
    
    //reset canvas vertices based on new graph vertices
    this.verticesInCanvas = this.computeCanvasFromGraph(vertices);
    
    //update position
    this.x = vertices[0].x;
    this.y = vertices[0].y;
  }
  
  getCenterInCanvas() {
    let TL = this.verticesInCanvas[0]; //top-left (p5 Vector)
    let BR = this.verticesInCanvas[2]; //bottom-right (p5 Vector)
    let centerX = (TL.x + BR.x) / 2; //X-coordinate of center
    let centerY = (TL.y + BR.y) / 2; //Y-coordinate of center
    return createVector(centerX, centerY);
  }
  
  getWidthInCanvas() { //width in canvas units (i.e. pixels)
    return this.w.xScale * this.s;
  }
  
  getHeightInCanvas() { //height in canvas units (i.e. pixels)
    return this.w.yScale * this.s;
  }
  
  getCenter() {
    let TL = this.verticesInGraph[0]; //top-left (p5 Vector)
    let BR = this.verticesInGraph[2]; //bottom-right (p5 Vector)
    let centerX = (TL.x + BR.x) / 2; //x-coordinate of center
    let centerY = (TL.y + BR.y) / 2; //y-coordinate of center
    return createVector(centerX, centerY);
  }
  
  getWidth() { //width in graph units
    return this.s;
  }
  
  getHeight() { //height in graph units
    return this.s;
  }
  
  takeUpdate(animationObject) {
    animationObject.giveUpdate(this);
  }
  
  takeInput(interactionObject) {
    interactionObject.giveInput(this);
  }

  render() {
    beginShape();
    vertex(this.verticesInCanvas[0].x, this.verticesInCanvas[0].y);
    vertex(this.verticesInCanvas[1].x, this.verticesInCanvas[1].y);
    vertex(this.verticesInCanvas[2].x, this.verticesInCanvas[2].y);
    vertex(this.verticesInCanvas[3].x, this.verticesInCanvas[3].y);
    endShape(CLOSE);
  }
}

/**** Arrow ****/
class Arrow {
    constructor(w, v, p, hW = 0.5, hL = 0.75) {
      this.w = w; //w: graph window
      this.v = v; //v: vector (p5.Vector object)
      this.p = p; //[p]: point of application (p5.Vector object)
      this.hW = hW; //[hW]: head width
      this.hL = hL; //[hL]: head length
      
      //point of application defaults to the origin
      if (this.p === undefined) {
        this.p = createVector(0, 0);
      }
    }
  
  render(){
    //render vector v as an arrow, at point p

    //Note:
    //An alternative to this implementation is 
    //push() and pop() with transformations;
    //e.g. see drawArrow() at
    //https://p5js.org/reference/#/p5.Vector/rotate
        
    let u = p5.Vector.normalize(this.v); //unit vector
    let vH = p5.Vector.mult(u, this.hL); //v scaled to length of head
    let uR = p5.Vector.rotate(u, PI / 2); //u rotated
    
    //position vector for tip of head
    let tip = p5.Vector.add(this.p, this.v);
    
    //position vector for base of head (on the arrow)
    let b = p5.Vector.sub(tip, vH);
    
    //vector from b to base vertex
    let r = p5.Vector.mult(uR, this.hW);
    
    //base vertices of head (off the arrow)
    let h1 = p5.Vector.add(b, r);
    let h2 = p5.Vector.sub(b, r);
    
    //arrow segment
    line(this.w.X(this.p.x), this.w.Y(this.p.y), this.w.X(tip.x), this.w.Y(tip.y));
    
    //arrow head
    line(this.w.X(tip.x), this.w.Y(tip.y), this.w.X(h1.x), this.w.Y(h1.y));
    line(this.w.X(tip.x), this.w.Y(tip.y), this.w.X(h2.x), this.w.Y(h2.y));
  }
}

/**** Axis ****/
class Axis {
  constructor(w, orientation) {
    this.w = w; //graph window
    this.orientation = orientation; //'horizontal' or 'vertical'
  }
  
  render() {
    if (this.orientation === 'horizontal') {
     line(0, this.w.yOrigin, width, this.w.yOrigin); 
    }
    else if (this.orientation === 'vertical') {
      line(this.w.xOrigin, 0, this.w.xOrigin, height);
    }
  }
}

/**** Tick ****/
class Tick {  
  constructor(w, axisOrientation, value = 0, length = 10) {
    this.w = w; //graph window
    this.axisOrientation = axisOrientation;
    this.value = value;
    this.length = length;
  }
  
  render() {
    let cValue; //value at which to draw tick in canvas coordinates
    const h = this.length / 2;
    
    if (this.axisOrientation === 'horizontal') {
      cValue = this.w.X(this.value);
      line(cValue, this.w.yOrigin - h, cValue, this.w.yOrigin + h); 
    }
    else if (this.axisOrientation === 'vertical') {
      cValue = this.w.Y(this.value);
      line(this.w.xOrigin - h, cValue, this.w.xOrigin + h, cValue);
    }
  }
}

/******************************** ANIMATION
* Rotation
********************************/

/**** Rotation ****/
class Rotation {
  constructor(w, angle, speed, point) {
    this.w = w; //graph window
    this.angle = angle;
    this.speed = speed; //radians / frame
    this.point = point; //point about which rotation occurs (not implemented yet)
    this.updateMatrix = createMatrix(cos(speed), sin(speed), -sin(speed), cos(speed));
    this.currentAngle = 0;
  }
  
  giveUpdate(drawingObject) {
    if (this.currentAngle < this.angle) {
      let vertices = drawingObject.verticesInGraph;
      let updatedVertex;
      let updatedVertices = [];
      for (const v of vertices) {
        updatedVertex = Matrix.multAv(this.updateMatrix, v);
        updatedVertices.push(updatedVertex);
      }
      drawingObject.setVertices(updatedVertices);
      this.currentAngle += this.speed;
    }
  }
}

/******************************** INTERACTION
* Draggable
* updatePressHistory

Notes: 
1. The name 'mouseDropped' is not ideal. It'd be nice to use 'mouseDown'
in place of 'mouseDropped' since the latter's meaning is consistent with a 'mousedown' 
event in Web APIs (this event occurs once when the mouse is first pressed). 
However, p5 has a function called keyIsDown() that returns true as long as the 
specified key is pressed (not just when it's first pressed), which may cause confusion.

2. 'mouseIsLetGo' returns true even if the mouse is let go outside of the drawing
object. This is inconsistent with mouseIsHeld, and with "mouseup" events in Web
APIs. However, currently, it's not necessary to check whether the mouse is inside the
drawing object when it's let go, so the extra condition isn't checked. We may want to 
add it in at some point.
********************************/

/**** Draggable ****/
class Draggable {
  constructor(w) {
    this.w = w; //graph window
    this.offsetX = 0;
    this.offsetY = 0;
    
    //partial listeners (used for the main listeners)
    let xIsWithinBounds = (dObject) => {
        let leftBound = dObject.getCenterInCanvas().x - dObject.getWidthInCanvas() / 2;
        let rightBound = dObject.getCenterInCanvas().x + dObject.getWidthInCanvas() / 2;
        return (leftBound < mouseX) && (mouseX < rightBound);
    }
    
    let yIsWithinBounds = (dObject) => {
        let topBound = dObject.getCenterInCanvas().y - dObject.getHeightInCanvas() / 2;
        let bottomBound = dObject.getCenterInCanvas().y + dObject.getHeightInCanvas() / 2;
        return (topBound < mouseY) && (mouseY < bottomBound);
    }
    
    //listeners
    let getMouseIsOver = (dObject) => {
        return xIsWithinBounds(dObject) && yIsWithinBounds(dObject);
      };
    
    let getMouseIsOut = (dObject) => {
        return !(xIsWithinBounds(dObject) && yIsWithinBounds(dObject));
      };
    
    let getMouseIsDropped = (dObject) => { //dropped: newly pressed
      let wasPressed = magic_pressHistory[0];
      let isPressed = magic_pressHistory[1];
      return !wasPressed && isPressed && getMouseIsOver(dObject);
    };
    
    let getMouseIsLetGo = (dObject) => { //'LetGo' instead of 'Released' to avoid conflict w/ p5
      let wasPressed = magic_pressHistory[0];
      let isPressed = magic_pressHistory[1];
      return wasPressed && !isPressed;
    };
    
    let getMouseIsHeld = (dObject) => { //'Held' instead of 'Pressed' to avoid conflict w/ p5
      return mouseIsPressed && mouseIsOver(dObject);
    };

    //handlers
    let mouseOver = (dObject) => cursor(MOVE);
    let mouseOut = (dObject) => cursor(ARROW);
    
    let mouseDropped = (dObject) => {
      this.offsetX = this.w.X(dObject.x) - mouseX;
      this.offsetY = this.w.Y(dObject.y) - mouseY;
    };
    
    let mouseLetGo = (dObject) => { //no handler is currently needed
    };
    
    let mouseHeld = (dObject) => {
      dObject.setPositionInCanvas(mouseX + this.offsetX, mouseY + this.offsetY);
    };
    
    //listener, handler pairs
    this.mouseOverPair = [getMouseIsOver, mouseOver];
    this.mouseOutPair = [getMouseIsOut, mouseOut];
    this.mouseDroppedPair = [getMouseIsDropped, mouseDropped];
    this.mouseReleasedPair = [getMouseIsLetGo, mouseLetGo];
    this.mouseDraggedPair = [getMouseIsHeld, mouseHeld];
    
    this.interactionPairs = [
      this.mouseOverPair, 
      this.mouseOutPair,
      this.mouseDroppedPair, 
      this.mouseReleasedPair,
      this.mouseDraggedPair
    ];
  }
  
  //pass user input to drawing object
  giveInput(dObject) {
    for (const pair of this.interactionPairs) {
      let listener = pair[0];
      let handler = pair[1]; 
      if (listener(dObject)) {
        handler(dObject);
      }
    }
  }

  //setters
  setMouseIsOver(callback) {
    this.mouseOverPair[0] = callback;
  }
    
  mouseOver(callback) {
    this.mouseOverPair[1] = callback;
  }

  setMouseIsOut(callback) {
    this.mouseOutPair[0] = callback;
  }
    
  mouseOut(callback) {
    this.mouseOutPair[1] = callback;
  }

  setMouseIsDropped(callback) {
    this.mouseDroppedPair[0] = callback;
  }
    
  mouseDropped(callback) {
    this.mouseDroppedPair[1] = callback;
  }

  setMouseReleased(callback) {
    this.mouseReleasedPair[0] = callback;
  }
  
  mouseReleased(callback) {
    this.mouseReleasedPair[1] = callback;
  }
  
  setMouseIsDragged(callback) {
    this.mouseDraggedPair[0] = callback;
  }
    
  mouseDragged(callback) {
    this.mouseDraggedPair[1] = callback;
  }
}

//update press history
p5.prototype.updatePressHistory = function() {
    //keep only the two most recent values of mouseIsPressed
    magic_pressHistory.push(mouseIsPressed);
    magic_pressHistory.shift();
}

p5.prototype.registerMethod('post', p5.prototype.updatePressHistory);
