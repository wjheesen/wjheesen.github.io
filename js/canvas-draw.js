$(document).ready(function () {

    //Draw Mode Enum
    const DrawMode = {
        FillRect: 0,
        StretchRotate: 1,
    };

    //Meshes array
    const Meshes = [
       Mesh.nGon(5), //Hexagon
       Mesh.nGon(6), //Pentagon
       Mesh.nStar(2, .5, 1), //Diamond
       Mesh.nStar(5, 0.4, 1), //Star
       Mesh.bat() //Bat
    ];

    //Draw variables set by user
    let drawMode = $("#selectDrawMode").val();
    let mesh = Meshes[$("#selectShape").val()];
    let fillColor = $("#pickFillColor").val();
    let strokeColor = $("#pickStrokeColor").val();
    let lineWidth = 6;

    //Listen for change in draw variables
    $("#selectDrawMode").change(function () {
        //Val refers to order of option in list and corresponds to enum DrawMode
        drawMode = $(this).find("option:selected").val();
    });
    $("#selectShape").change(function () {
        //Val refers to order of option in index of Meshes array
        mesh = Meshes[$(this).val()];
    })
    $("#pickFillColor").change(function () {
        fillColor = $(this).val();
    })
    $("#pickStrokeColor").change(function () {
        strokeColor = $(this).val();
    })

    //Canvas variables
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    //Mouse drag listener
    const surface = new DragDetector(canvas, onMouseDown, onMouseMove, onMouseUp, onMouseOut, true);

    //Set initial text on canvas
    ctx.font = "16px sans-serif";
    ctx.fillText("Click and drag to draw shape.", 10, 50);

    //Shapes to render
    let shape = new Rect(0, 0, 0, 0);

    let selectionBox = new Rect(0, 0, 0, 0);
    selectionBox.lineWidth = 4;
    selectionBox.strokeColor = 'blue';
    selectionBox.fillColor = 'lightBlue';

    let stretchLine = Path.withCapacity(2);
    stretchLine.lineWidth = 4;
    stretchLine.strokeColor = 'red';

    //Mouse tracking variable
    let start;

    function onMouseDown(mouseX, mouseY) {
        //Convert to point and save
        start = new Point(mouseX, mouseY);
        //Init our shape
        shape = new Shape(mesh, fillColor);
        //shape.points.data.fill(0);
        shape.lineWidth = lineWidth;
        shape.strokeColor = strokeColor;
    }

    function onMouseMove(mouseX, mouseY) {
        //Convert to point
        let mouse = new Point(mouseX, mouseY);

        if (drawMode == DrawMode.FillRect) {
            //Calculate rect from start to mouse
            let rect = Rect.fromLBRT(start.x, start.y, mouse.x, mouse.y);
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
    }

});
