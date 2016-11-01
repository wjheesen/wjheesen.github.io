"use strict";

$(function () {

    //Canvas variables
    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext("2d");

    //A function to fill the width of the screen
    function fillParentWidth() {
        canvas.style.width = '100%';
        canvas.width = canvas.offsetWidth;
    }

    //Apply the function
    fillParentWidth();

    //Resize canvas and redraw canvas whenever window is resized
    window.onresize = function () {
        fillParentWidth();
        canvas.draw();
    };

    //Listen for mouse drag events
    var surface = new DragDetector(canvas, onMouseDown, onMouseMove, onMouseUp, onMouseOut);

    //Draw Mode Enum
    var DrawMode = {
        FillRect: 0,
        StretchRotate: 1
    };

    //Meshes array
    var Meshes = [Mesh.nGon(5), //Hexagon
    Mesh.nGon(6), //Pentagon
    Mesh.nStar(2, .5, 1), //Diamond
    Mesh.nStar(5, 0.4, 1), //Star
    Mesh.bat() //Bat
    ];

    //Draw variables set by user
    var drawMode = $("#selectDrawMode").val();
    var mesh = Meshes[$("#selectShape").val()];
    var fillColor = $("#pickFillColor").val();
    var strokeColor = $("#pickStrokeColor").val();
    var lineWidth = 6;

    //Listen for change in draw variables
    $("#selectDrawMode").change(function () {
        //Val refers to order of option in list and corresponds to enum DrawMode
        drawMode = $(this).find("option:selected").val();
    });
    $("#selectShape").change(function () {
        //Val refers to order of option in index of Meshes array
        mesh = Meshes[$(this).val()];
    });
    $("#pickFillColor").change(function () {
        fillColor = $(this).val();
    });
    $("#pickStrokeColor").change(function () {
        strokeColor = $(this).val();
    });

    //Set initial text on canvas
    ctx.font = "16px sans-serif";
    ctx.fillText("Click and drag to draw shape.", 10, 50);

    //Shapes to render
    var shape = new Rect(0, 0, 0, 0);

    var selectionBox = new Rect(0, 0, 0, 0);
    selectionBox.lineWidth = 4;
    selectionBox.strokeColor = 'blue';
    selectionBox.fillColor = 'lightBlue';

    var stretchLine = Path.withCapacity(2);
    stretchLine.lineWidth = 4;
    stretchLine.strokeColor = 'red';

    //Mouse tracking variable
    var start = void 0;

    function onMouseDown(mouse) {
        //Save reference to start point
        start = mouse;
        //Init our shape
        shape = new Shape(mesh, fillColor);
        shape.lineWidth = lineWidth;
        shape.strokeColor = strokeColor;
    }

    function onMouseMove(mouse) {

        if (drawMode == DrawMode.FillRect) {
            //Calculate rect from start to mouse
            var rect = Rect.fromLBRT(start.x, start.y, mouse.x, mouse.y);
            //Update shape
            shape.setBounds(rect, ScaleToFit.Fill);
            //Update selection box
            selectionBox.set(rect);
        } else if (drawMode == DrawMode.StretchRotate) {
            //Update shape
            shape.setEndPoints(start, mouse);
            //Update line
            stretchLine.setPoint(start, 0);
            stretchLine.setPoint(mouse, 1);
        }

        // clear the canvas and redraw all shapes
        canvas.draw();
    }

    function onMouseUp() {
        if (drawMode == DrawMode.FillRect) {
            //Remove selection box
            selectionBox.setEmpty();
        } else if (drawMode == DrawMode.StretchRotate) {
            //Remove line
            stretchLine.data.fill(0);
        }
        canvas.draw();
    }

    function onMouseOut() {
        onMouseUp();
    }

    canvas.draw = function () {
        // clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // redraw all shapes in their current positions
        if (drawMode == DrawMode.FillRect) {
            selectionBox.draw(ctx);
            shape.draw(ctx);
        } else if (drawMode == DrawMode.StretchRotate) {
            shape.draw(ctx);
            stretchLine.draw(ctx);
        }
    };
});
