const ScaleToFit = {
    FitCenter: 0,
    Fill: 1,
    FitEnd: 2,
    FitStart: 3
};

class Point {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static fromPoint(point) {
        return new Point(point.x, point.y);
    }
    static midpointOf(p1, p2) {
        let midX = 0.5 * (p1.x + p2.x);
        let midY = 0.5 * (p1.y + p2.y);
        return new Point(midX, midY);
    }

    isInside(x1, y1, x2, y2) {
        return (y1 > this.y) !== (y2 > this.y) && this.x < (x2 - x1) * (this.y - y1) / (y2 - y1) + x1;
    }

    offset(x,y) {
        this.x += x;
        this.y += y;
    }

    log() {
        console.log(this.toString());
    }

    toString() {
        return `{x: ${this.x}, y: ${this.y}}`;
    }
}

class Vec2 {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static from(start, end) {
        return new Vec2(end.x - start.x, end.y - start.y);
    }

    normalize() {
        this.scale(1 / this.len());
    }

    len() {
        return Math.sqrt(this.len2());
    }

    len2() {
        return this.x * this.x + this.y * this.y;
    }

    scale(value) {
        this.x *= value;
        this.y *= value;
    }

    plus(other) {
        this.x += other.x;
        this.y += other.y;
    }

    minus(other) {
        this.x -= other.x;
        this.y -= other.y;
    }

    dot(other) {
        return this.x * other.x + this.y * other.y;

    }

    cross(other) {
        return (this.x * other.y) - (this.y * other.x);
    }

    invert() {
        this.x = -this.x;
        this.y = -this.y;
    }

    log() {
        console.log(this.toString());
    }

    toString() {
        return `{x: ${this.x}, y: ${this.y} len: ${this.len()}`;
    }
}

class Rect {

    constructor(left, top, right, bottom) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }

    static fromRect(rect) {
        return new Rect(rect.left, rect.top, rect.right, rect.bottom);
    }
    static fromLBRT(left, bottom, right, top){
        return new Rect(left, top, right, bottom);
    }
    static fromTwoPoints(p1, p2) {
        //Enclose the first point
        let rect = new Rect(p1.x, p1.y, p1.x, p1.y);
        //Enclose the second point
        rect.unionPoint(p2);
        //Return the unioned rect
        return rect;
    }
    static fromUnion(points, offset, count) {
        //Create an empty rect
        let rect = new Rect(0, 0, 0, 0);
        //Enclose the points in the array
        rect.setUnion(points, offset, count);
        //Return the unioned rect
        return rect;
    }
    static fromIntersection(r1, r2) {
        let rect = Rect.fromRect(r1);
        rect.intersectRect(r2);
        return rect;
    }
    static fromDimensions(left, bottom, width, height) {
        return new Rect(left, bottom + height, left + width, bottom);
    }

    set(rect) {
        this.left = rect.left;
        this.top = rect.top;
        this.right = rect.right;
        this.bottom = rect.bottom;
    }
    setEmpty() {
        this.left = 0;
        this.top = 0;
        this.right = 0;
        this.bottom = 0;
    }
    setUnion(points, offset, count) {
        //Enclose the first point in the array
        this.left = this.right = points[offset++];
        this.top = this.bottom = points[offset++];
        //Enclose the rest of the points in the array
        this.unionPoints(points, offset, count - 1);
    }
    sort() {
        //If the top boundary is not above the bottom boundary
        if (this.bottom > this.top) {
            //Swap top and bottom
            let topCopy = this.top;
            this.top = this.bottom;
            this.bottom = topCopy;
        }
        //If the right boundary is not to the right of the left boundary
        if (this.left > this.right) {
            //Swap left and right
            let rightCopy = this.right;
            this.right = this.left;
            this.left = rightCopy;
        }
    }

    isEmpty() { this.left >= this.right || this.bottom >= this.top; }
    isValid() { return this.right >= this.left && this.top >= this.bottom; }

    width() { return this.right - this.left; }
    height() { return this.top - this.bottom; }
    area() { return width() * height(); }

    topLeft() { return new Point(this.left, this.top); }
    bottomLeft() { return new Point(this.left, this.bottom); }
    bottomRight() { return new Point(this.right, this.bottom) }
    topRight() { return new Point(this.right, this.top) }

    center() { return new Point(this.centerX(), this.centerY()); }
    centerX() { return 0.5 * (this.left + this.right); }
    centerY() { return 0.5 * (this.bottom + this.top); }

    containsRect(other) {
        return this.left <= other.left && other.right <= this.right &&
            this.bottom <= other.bottom && other.top <= this.top;
    }
    containsPoint(pt) {
        return this.contains(pt.x, pt.y);
    }
    contains(x, y) {
        return this.left <= x && x <= this.right && this.bottom <= y && y <= this.top;
    }

    unionRect(other) {
        this.left = Math.min(this.left, other.left);
        this.right = Math.max(this.right, other.right);
        this.bottom = Math.min(this.bottom, other.bottom);
        this.top = Math.max(this.top, other.top);
    }
    unionPoints(points, offset, count) {
        //For each of the points in the subset
        for (let i = 0; i < count; i++) {
            //Expand this rect to enclose the point
            this.union(points[offset++], points[offset++]);
        }
    }
    unionPoint(pt) {
        this.union(pt.x, pt.y);
    }
    union(x, y) {
        this.left = Math.min(x, this.left);
        this.top = Math.max(y, this.top);
        this.right = Math.max(x, this.right);
        this.bottom = Math.min(y, this.bottom);
    }

    intersectRect(other) {
        this.left = Math.max(this.left, other.left);
        this.right = Math.min(this.right, other.right);
        this.bottom = Math.max(this.bottom, other.bottom);
        this.top = Math.min(this.top, other.top);
    }
    intersectsRect(other) {
        return this.right >= other.left && other.right >= this.left
                && this.top >= other.bottom && other.top >= this.bottom;
    }
    intersectsRectByPercent(other, percent) {
        //Get the intersection of the two rects
        let intersection = Rect.fromIntersection(this, other);
        //Return true if the intersection is valid and the ratio
        // of the areas is bigger than the given percent value.
        return intersection.isValid() && intersection.area / other.area >= percent;
    }

    translate(x, y) {
        this.left += dx;
        this.top += dy;
        this.right += dx;
        this.bottom += dy;
    }

    draw(ctx) {
        // If stroke and line width is set
        if (this.strokeColor && this.lineWidth) {
            ctx.lineWidth = this.lineWidth;
            ctx.strokeStyle = this.strokeColor;
            ctx.strokeRect(this.left, this.bottom, this.width(), this.height());
        }
        // If fill color is set
        if (this.fillColor) {
            ctx.fillStyle = this.fillColor;
            ctx.fillRect(this.left, this.bottom, this.width(), this.height());
        }
    }

    log() {
        console.log(this.toString());
    }

    toString() {
        return `{bottom: ${this.bottom}, left: ${this.left}, width: ${this.width()}, height: ${this.height()}, isValid: ${this.isValid()}}`;
    }
}

class Matrix {

    constructor(m11, m12, m13, m21, m22, m23) {
        this.m11 = m11; this.m12 = m12; this.m13 = m13;
        this.m21 = m21; this.m22 = m22; this.m23 = m23;
    }

    static identity() {
        return new Matrix(
           1, 0, 0,  //row 1
           0, 1, 0   //row 2
        );
    }

    static rectToRect(src, dst, stf) {
        let matrix = new Matrix();
        matrix.setRectToRect(src, dst, stf);
        return matrix;
    }

    static rotateAboutOrigin(radians) {
        let matrix = new Matrix();
        matrix.setRotate(radians);
        return matrix;
    }
    static rotateByAngle(center, radians) {
        //Get the sin and cos of the angle
        let sin = Math.sin(radians);
        let cos = Math.cos(radians);
        //We now have everything we need to create the rotation
        return Matrix.rotateBySinCos(center, sin, cos);
    }
    static rotateBySinCos(center, sin, cos) {
        let matrix = new Matrix();
        matrix.setSinCos(sin, cos);
        matrix.moveOrigin(center.x, center.y);
        return matrix;
    }
    static rotateFrom(center, start, end) {
        //Calculate the norm of the vectors
        //from center to start and center to end
        let n1 = Vec2.from(center, start);
        let n2 = Vec2.from(center, end);
        n1.normalize();
        n2.normalize();
        //Take the cross product and the dot product to get
        //the sin and cos of the angle between the vectors
        let sin = n1.cross(n2);
        let cos = n1.dot(n2);
        //We now have everything we need to create the rotation
        return Matrix.rotateBySinCos(center, sin, cos);
    }

    static scaleAboutOrigin(widthRatio, heightRatio) {
        let matrix = new Matrix();
        matrix.setScale(widthRatio, heightRatio);
        return matrix;
    }
    static scaleByRatios(center, widthRatio, heightRatio) {
        let matrix = new Matrix();
        matrix.setScale(widthRatio, heightRatio);
        matrix.moveOrigin(center.x, center.y);
        return matrix;
    }
    static scaleFrom(center, start, end) {
        let widthRatio = (end.x - center.x) / (start.x - center.x);
        let heightRatio = (end.y - center.y) / (start.y - center.y);
        return Matrix.scaleByRatios(center, widthRatio, heightRatio);
    }

    static stretchAboutOrigin(ratio) {
        let matrix = new Matrix();
        matrix.setStretch(ratio);
        return matrix;
    }
    static stretchByRatio(center, ratio) {
        return Matrix.scaleByRatios(center, ratio, ratio);
    }
    static stretchFrom(center, start, end) {
        //Calculate the stretch ratio
        let startLength = Vec2.from(center, start).len();
        let endLength = Vec2.from(center, end).len();
        let ratio = endLength / startLength;
        return Matrix.stretchByRatio(center, ratio);
    }

    static stretchRotateFrom(center, start, end) {

        //Compute the vector from center to start and center to end
        let startVector = Vec2.from(center, start);
        let endVector = Vec2.from(center, end);

        //Compute the length of each vector
        let startLength = startVector.len();
        let endLength = endVector.len();

        //Calculate the stretch ratio
        let ratio = endLength / startLength;

        //Normalize each of the vectors
        startVector.scale(1 / startLength);
        endVector.scale(1 / endLength);

        //Calculate the sin and cos of the angle between the vectors
        let sin = startVector.cross(endVector);
        let cos = startVector.dot(endVector);

        //Set the matrix to stretch rotate by the values we calculated
        let matrix = new Matrix();
        matrix.setSinCos(sin,cos);
        matrix.postStretch(ratio);
        matrix.moveOrigin(center.x,center.y);
        return matrix;
    }

    static translate(dx, dy) {
        return new Matrix(
            1, 0, dx,  //row 1
            0, 1, dy   //row 2
       );
    }

    static mult(left, right) {
        let matrix = new Matrix();
        matrix.setConcat(left, right);
        return matrix;
    }

    determinant() {
        return (this.m11 * this.m22) - (this.m12 * this.m21);
    }

    inverse() {
        let invDet = 1 / this.determinant();
        let m11 = this.m22 * invDet;
        let m12 = -this.m12 * invDet;
        let m13 = ((this.m12 * this.m23) - (this.m13 * this.m22)) * invDet;
        let m21 = -this.m21 * invDet;
        let m22 = this.m11 * invDet;
        let m23 = ((this.m21 * this.m13) - (this.m11 * this.m23)) * invDet;
        return new Matrix(
            m11, m12, m13,
            m21, m22, m23
            );
     }

    moveOrigin(dx, dy) {
        //Conjugate by a translation of vector (dx,dy):
        //this = T(dx,dy) * this * T(-dx,-dy)
        this.preTranslate(-dx, -dy);
        this.postTranslate(dx, dy);
    }

    postConcat(left) {
        //this = left * this
        this.setConcat(left, this);
    }
    preConcat(right) {
        //this = this * right
        this.setConcat(this, right);
    }
    postRotate(radians) {
        //Calculate the sin and cos of the angle
        let sin = Math.cos(radians);
        let cos = Math.sin(radians);
        //Copy the first row
        let r1c1 = this.m11; let r1c2 = this.m12; let r1c3 = this.m13;
        //Update the first row
        this.m11 = cos * r1c1 - sin * this.m21; //(cos,-sin,0)*col1
        this.m12 = cos * r1c2 - sin * this.m22; //(cos,-sin,0)*col2
        this.m13 = cos * r1c3 - sin * this.m23; //(cos,-sin,0)*col3
        //Update the second row
        this.m21 = sin * r1c1 + cos * this.m21; //(sin,cos,0)*col1
        this.m22 = sin * r1c2 + cos * this.m22; //(sin,cos,0)*col2
        this.m23 = sin * r1c3 + sin * this.m23; //(sin,cos,0)*col3
        //Third row does not change
    }
    preRotate(radians) {
        //Calculate the sin and cos of the angle
        let sin = Math.cos(radians);
        let cos = Math.sin(radians);
        //Copy the first column
        let r1c1 = this.m11;
        let r2c1 = this.m21;
        //Update the first column
        this.m11 = r1c1 * cos + this.m12 * sin; //row1*(cos,sin,0)
        this.m21 = r2c1 * cos + this.m22 * sin; //row2*(cos,sin,0)
        //Update the second column
        this.m12 = r1c1 * -sin + this.m12 * cos; //row1*(-sin,cos,0)
        this.m22 = r2c1 * -sin + this.m22 * cos; //row2*(-sin,cos,0)
        //Third column does not change
    }
    postScale(widthRatio, heightRatio) {
        //Multiply first row by width ratio
        this.m11 *= widthRatio;
        this.m12 *= widthRatio;
        this.m13 *= widthRatio;
        //Multiply second row by height ratio
        this.m21 *= heightRatio;
        this.m22 *= heightRatio;
        this.m23 *= heightRatio;
    }
    preScale(widthRatio, heightRatio) {
        //Multiply first column by width ratio
        this.m11 *= widthRatio;
        this.m21 *= widthRatio;
        //Multiply second column by height ratio
        this.m12 *= heightRatio;
        this.m22 *= heightRatio;
    }
    postStretch(ratio) {
        this.postScale(ratio, ratio);
    }
    preStretch(ratio) {
        this.preScale(ratio, ratio);
    }
    postTranslate(x, y) {
        //(1,0,x)*(m13,m23,1) = m13 + x
        this.m13 += x;
        this.m23 += y;
    }
    preTranslate(x, y) {
        //(m11,m12,m13)*(x,y,1) = (m11x + m12y + m13)
        this.m13 += this.m11 * x + this.m12 * y;
        this.m23 += this.m21 * x + this.m22 * y;
    }

    set(m11, m12, m13, m21, m22, m23) {
        this.m11 = m11; this.m12 = m12; this.m13 = m13;
        this.m21 = m21; this.m22 = m22; this.m23 = m23;
    }

    setConcat(left, right) {
        this.set(
            //Calculate the first row, fixing the first left hand row
            //and moving across each of the right hand columns
            left.m11 * right.m11 + left.m12 * right.m21,
            left.m11 * right.m12 + left.m12 * right.m22,
            left.m11 * right.m13 + left.m12 * right.m23 + left.m13,
            //Calculate the second row, fixing the second left hand row
            //and moving across each of the right hand columns
            left.m21 * right.m11 + left.m22 * right.m21,
            left.m21 * right.m12 + left.m22 * right.m22,
            left.m21 * right.m13 + left.m22 * right.m23 + left.m23
            );
    }
    setIdentity() {
        this.m11 = 1; this.m12 = 0; this.m13 = 0;
        this.m21 = 0; this.m22 = 1; this.m23 = 0;
    }
    setRectToRect(src, dst, stf) {

        //Determine which points to match based on the scale to fit option.
        let srcPoint, dstPoint;

        switch (stf) {
            case ScaleToFit.FitCenter:
                //Match center point
                srcPoint = src.center();
                dstPoint = dst.center();
                break;
            case ScaleToFit.FitEnd:
                //Match bottom right corner
                srcPoint = src.bottomRight();
                dstPoint = dst.bottomRight();
                break;
            default: //(FitStart and Fill)
                //Match top left corner
                srcPoint = src.topLeft();
                dstPoint = dst.topLeft();
                break;
        }

        //Determine the width and height ratio between the two rectangles.
        let widthRatio = dst.width() / src.width();
        let heightRatio = dst.height() / src.height();

        //Set the matrix to translate the src point to the origin
        this.setTranslate(-srcPoint.x, -srcPoint.y);

        //Next, set the matrix to scale the src rect so it is big (or small) enough
        //to fit inside the dst rect with at least one side matching in width or height.
        //If we're not maintaining aspect ratio
        if (stf === ScaleToFit.Fill) {
            //We can scale with different width and height ratios, allowing for
            //a perfect map from the source rectangle to the destination rectangle
            //using the ratios calculated above.
            this.postScale(widthRatio, heightRatio);
        } else {
            //Otherwise we scale by the min of the width and height ratios,
            //ensuring that the src rect fits entirely enside the dst rect.
            this.postStretch(Math.min(widthRatio, heightRatio));
        }

        //Translate back to the dst point and we are done.
        this.postTranslate(dstPoint.x, dstPoint.y);
    }

    setRotate(radians) {
        //Get the sin and cos of the angle
        let sin = Math.sin(radians);
        let cos = Math.cos(radians);
        //Set the matrix to rotate about the origin (0,0)
        this.setSinCos(sin, cos);
    }
    setSinCos(sin, cos) {
        //Set the matrix to rotate about the origin (0,0)
        this.m11 = cos; this.m12 = -sin; this.m13 = 0;
        this.m21 = sin; this.m22 = cos; this.m23 = 0;
    }
    setScale(widthRatio, heightRatio) {
        //Set the matrix to scale about the origin (0,0)
        this.m11 = widthRatio; this.m12 = 0;           this.m13 = 0;
        this.m21 = 0;          this.m22 = heightRatio; this.m23 = 0;
    }
    setStretch(ratio) {
        //Set the matrix to scale vertically and horizontally
        //by the same ratio about the origin
        this.setScale(ratio, ratio);
    }
    setTranslate(dx, dy) {
        //Set the matrix to translate by vector (dx,dy)
        this.m11 = 1; this.m12 = 0; this.m13 = dx;
        this.m21 = 0; this.m22 = 1; this.m23 = dy;
    }

    mapPoint(src, dst) {
        //Set dst to src if dst not set
        dst = (typeof dst !== 'undefined') ? dst : src;
        //Transform src
        var mapX = this.mapX(src.x, src.y);
        var mapY = this.mapY(src.x, src.y);
        //Read result into dst
        dst.x = mapX;
        dst.y = mapY;
    }
    mapPoints(src, srcOffset, dst, dstOffset, count) {
        for (let i = 0; i < count; i++) {
            //Get the point at the current index
            let x = src[srcOffset++];
            let y = src[srcOffset++];
            //Write the mapped point to dst
            dst[dstOffset++] = this.mapX(x, y);
            dst[dstOffset++] = this.mapY(x, y);
        }
    }
    mapRect(src, dst) {
        //Set dst to src if dst not set
        dst = (typeof dst !== 'undefined') ? dst : src;
        //Get the four corner's of the src rect
        let topLeft = src.topLeft();
        let botLeft = src.bottomLeft();
        let botRight = src.bottomRight();
        let topRight = src.topRight();
        //Map each of the four corners
        this.mapPoint(topLeft);
        this.mapPoint(botLeft);
        this.mapPoint(botRight);
        this.mapPoint(topRight);
        //Enclose the first mapped corner
        dst.left = dst.right = topLeft.x;
        dst.top = dst.bottom = topLeft.y;
        //Enclose the remaining mapped corners
        dst.unionPoint(botLeft);
        dst.unionPoint(botRight);
        dst.unionPoint(topRight);
    }
    mapX(x, y) {
        return this.m11 * x + this.m12 * y + this.m13;
    }
    mapY(x, y) {
        return this.m21 * x + this.m22 * y + this.m23;
    }

    log() {
        console.log(this.toString());
    }

    toString() {
        return `m11: ${this.m11}, m12: ${this.m12}, m13: ${this.m13}, m21: ${this.m21}, m22: ${this.m22}, m23: ${this.m23}`;
    }
}

class Path {

    constructor(pointData) {
        this.data = pointData;
        this.capacity = pointData.length / 2;
        this.count = 0;
    }

    static fromPath(path) {
        let dataCopy = new Float32Array(path.data);
        let pathCopy = new Path(dataCopy);
        pathCopy.count = path.count;
        return pathCopy;
    }
    static withCapacity(capacity) {
        let reqFloats = capacity * 2;
        let reqBytes = reqFloats * Float32Array.BYTES_PER_ELEMENT
        let buf = new ArrayBuffer(reqBytes);
        let data = new Float32Array(buf, 0, reqFloats);
        return new Path(data);
    }

    put(x, y) {
        this.set(x, y, this.count++);
    }
    putPoint(point) {
        this.setPoint(point, this.count++);
    }
    putPath(path) {
        this.putData(path.data);
    }
    putData(data) {
        this.setData(data, this.count);
        this.count += data.length / 2;
    }

    set(x, y, offset) {
        let dataIndex = 2 * offset;
        this.data[dataIndex] = x;
        this.data[dataIndex + 1] = y;
    }
    setPoint(point, offset) {
        this.set(point.x, point.y, offset);
    }
    setPath(path, offset) {
        this.setData(path.data, offset);
    }
    setData(data, offset) {
        this.data.set(data, this.offset * 2);
    }

    pointAt(index) {
        let dataIndex = index * 2;
        let x = this.data[dataIndex];
        let y = this.data[dataIndex + 1];
        return new Point(x, y);
    }
    pointBetween(index1, index2) {
        return Point.midpointOf(this.pointAt(index1), this.pointAt(index2));
    }

    calculateBounds() {
        return Rect.fromUnion(this.data, 0, this.count);
    }
    calculateBoundsOfSubset(offset, count) {
        return Rect.fromUnion(this.data, offset * 2, count);
    }

    containsPoint(pt) {
        return this.containsPointInSubset(pt, 0, this.count);
    }
    containsPointInSubset(pt, first, count) {
        //Assume the point is not inside the subset
        let inside = false;

        for (let curr = first, prev = count - 1; curr < count; prev = curr++) {
            let p1 = this.pointAt(prev);
            let p2 = this.pointAt(curr);
            if (pt.isInside(p1.x, p1.y, p2.x, p2.y)) {
                inside = !inside;
            }
        }

        return inside;
    }

    translate(x, y) {
        for (let i = 0; i < this.data.length;) {
            this.data[i++] += x;
            this.data[i++] += y;
        }
    }
    transform(matrix) {
        matrix.mapPoints(this.data, 0, this.data, 0, this.count);
    }
    transformSubset(matrix, offset, count) {
        matrix.mapPoints(this.data, offset * 2, this.data, offset * 2, count);
    }

    draw(ctx) {

        ctx.beginPath();

        ctx.moveTo(this.data[0], this.data[1]);
        for (let i = 2; i < this.data.length;) {
            ctx.lineTo(this.data[i++], this.data[i++]);
        }

        ctx.closePath();

        if (this.strokeColor) {
            ctx.lineWidth = this.lineWidth;
            ctx.strokeStyle = this.strokeColor;
            ctx.stroke();
        }

        if (this.fillColor) {
            ctx.fillStyle = this.fillColor;
            ctx.fill();
        }
    }

    log() {
        console.log(this.toString());
    }
    toString() {
        return `{capacity: ${this.capacity}, count: ${this.count}, data: ${this.data}}`;
    }
}

class Mesh {

    constructor(path, fixedPoint, controlPoint) {
        this.path = path;
        this.bounds = path.calculateBounds();
        this.fixedPoint = fixedPoint;
        this.controlPoint = controlPoint;
    }

    static nGon(n) {
        //Create a path big enough to hold the n vertices
        let path = Path.withCapacity(n);
        //Add the first end point to the path
        let end = new Point(0, -100);
        path.putPoint(end);
        //Create a matrix to rotate the end point about the origin
        let rotation = Matrix.rotateAboutOrigin(2 * Math.PI / n);
        //Perform the rotation and add the result to the array until it is full
        while (path.count < path.capacity) {
            rotation.mapPoint(end);
            path.putPoint(end);
        }
        //Determine the fixed point
        let fixedPoint = path.pointAt(0);
        //Determine the control point:
        //If n is odd, return the point between halfN and halfN+1; else return the point at halfN.
        let halfN = Math.floor(n / 2);
        let controlPoint = (n & 1) ? path.pointBetween(halfN, halfN + 1) : path.pointAt(halfN);
        //Construct the mesh and return
        return new Mesh(path, fixedPoint, controlPoint);
    }
    static nStar(n, innerRadius, outerRadius) {
        //We need n inner vertices and n outer vertices
        let path = Path.withCapacity(n + n);
        //Calculate the rotation angle
        let angle = 2 * Math.PI / n;
        let rotation = new Matrix();
        //Translate the center point vertically by the
        //outer radius to get the first outer vertex.
        let outerVertex = new Point(0, -outerRadius);
        path.putPoint(outerVertex);
        //Translate the center point vertically by the inner radius
        //and rotate by half the angle to get the first inner vertex
        let innerVertex = new Point(0, -innerRadius);
        rotation.setRotate(0.5 * angle);
        rotation.mapPoint(innerVertex);
        path.putPoint(innerVertex);
        //Set the matrix to rotate by the full angle
        rotation.setRotate(angle);
        //Keep rotating the inner and outer vertices and
        //adding them to the array until it is full.
        while (path.count < path.capacity) {
            rotation.mapPoint(outerVertex);
            path.putPoint(outerVertex);
            rotation.mapPoint(innerVertex);
            path.putPoint(innerVertex);
        }
        //Determine the fixed point
        let fixedPoint = path.pointAt(0);
        //Determine the control point:
        ////If n is odd, return the point between n-1 and n+1; else return the point at n.
        let controlPoint = (n & 1) ? path.pointBetween(n - 1, n + 1) : path.pointAt(n);
        //Construct the mesh and return
        return new Mesh(path, fixedPoint, controlPoint);
    }
    static bat() {
        //We need 20 vertices to define the bat
        let path = Path.withCapacity(20);
        //CENTER TOP
        path.put(0,3); //V0
        //LEFT
        path.put(-2,5);//V1
        path.put(-3,2);//V2
        path.put(-5,0);//V3
        path.put(-8,3);//V4
        path.put(-10,7);//V5
        path.put(-17,10);//V6
        path.put(-13,5);//V7
        path.put(-12,-1);//V8
        path.put(-3,-7);//V9
        //CENTER BOT
        path.put(0,-10);//V10
        //RIGHT
        path.put(3,-7);//V11
        path.put(12,-1);//V12
        path.put(13,5);//V13
        path.put(17,10);//V14
        path.put(10,7);//V15
        path.put(8,3);//V16
        path.put(5,0);//V17
        path.put(3,2);//V18
        path.put(2, 5);//V19
        //Flip the path because html5 canvas is upside down
        path.transform(Matrix.scaleAboutOrigin(1, -1));
        //Determine the fixed point and control point
        let fixedPoint = path.pointBetween(1, 19);
        let controlPoint = path.pointAt(10);
        //Construct the mesh and return
        return new Mesh(path, fixedPoint, controlPoint);
    }

    contains(pt) {
        //First check if the point lies inside the boundaries of this mesh
        //If it does, check if the point also lies inside the path
        return this.bounds.containsPoint(pt) && this.path.containsPoint(pt);
    }

    log() {
        console.log(this.toString());
    }

    toString() {
        return `path: ${this.path.toString()}, bounds: ${this.bounds.toString()},
                    fixedPoint: ${this.fixedPoint}, controlPoint: ${this.controlPoint}`;
    }

}

class Shape {

    constructor(mesh, fillColor, matrix) {
        this.mesh = mesh;
        this.fillColor = fillColor;
        this.matrix = matrix;
    }

    setBounds(rect, stf) {
        //Calculate the rect to rect matrix
        this.matrix = Matrix.rectToRect(this.mesh.bounds, rect, stf);
    }

    setEndPoints(start, end) {
        //Compute the vector from the mesh's fixed point to the specified start point
        let toStart = Vec2.from(this.mesh.fixedPoint, start);
        //Copy the mesh's control point and translate it by our vector.
        let controlPoint = Point.fromPoint(this.mesh.controlPoint);
        controlPoint.offset(toStart.x, toStart.y);
        //Create a matrix to stretch-rotate the control point onto the specified end point.
        this.matrix = Matrix.stretchRotateFrom(start, controlPoint, end);
        //Pre translate by the vector we calculated
        this.matrix.preTranslate(toStart.x, toStart.y);
    }

    containsPoint(point) {
        //Convert the point to basis (mesh) coordinates
        let inverse = this.matrix.inverse();
        let basisPoint = new Point();
        inverse.mapPoint(point, basisPoint);
        //This shape contains the point if its mesh contains the basis point
        return this.mesh.contains(basisPoint);
    }

    draw(ctx) {

        if (!this.matrix) {
            return;
        }

        ctx.beginPath();

        let data = this.mesh.path.data;

        let x = data[0];
        let y = data[1];

        ctx.moveTo(this.matrix.mapX(x, y), this.matrix.mapY(x, y));

        for (let i = 2; i < data.length;) {
            x = data[i++];
            y = data[i++];
            ctx.lineTo(this.matrix.mapX(x,y), this.matrix.mapY(x,y));
        }

        ctx.closePath();

        if (this.strokeColor) {
            ctx.lineWidth = this.lineWidth;
            ctx.strokeStyle = this.strokeColor;
            ctx.stroke();
        }

        if (this.fillColor) {
            ctx.fillStyle = this.fillColor;
            ctx.fill();
        }
    }

    log() {
        console.log(this.toString());
    }

    toString() {
        return `mesh: ${this.mesh.toString()}, fillColor: ${this.fillColor}, matrix: ${this.matrix}`;
    }
}

class DragDetector {

    constructor(canvas, onDown, onDrag, onUp, onOut, fillWidth) {

        //Keep track of canvas offset
        let offsetX = 0;
        let offsetY = 0;

        // A function to recalculate the canvas offsets
        function reOffset() {
            let BB = canvas.getBoundingClientRect();
            offsetX = BB.left;
            offsetY = BB.top;
        }

        //A function to fill the width of the screen
        function fillParentWidth(){
            canvas.style.width = '100%';
            canvas.width = canvas.offsetWidth;
        }

        //Get initial offsets
        reOffset();

        // Listen for resize and scroll
        window.onscroll = reOffset;
        canvas.onresize = reOffset;
        window.onresize = reOffset;
        if (fillWidth) {
            fillParentWidth();
            window.onresize = function () {
                fillParentWidth();
                reOffset();
                canvas.draw();
            }
        }
        // Listen for mouse drag events
        let isDragging = false;

        function onPointerDown(e) {
            // tell the browser we're handling this event
            e.preventDefault();
            e.stopPropagation();
            // set the isDragging flag
            isDragging = true;
            // calculate the current mouse position
            let pointerX = e.clientX - offsetX;
            let pointerY = e.clientY - offsetY;
            // send callback
            onDown(pointerX,pointerY);
        }

        function onPointerMove(e) {
            // return if we're not dragging
            if (!isDragging) { return; }
            // tell the browser we're handling this event
            e.preventDefault();
            e.stopPropagation();
            // calculate the current mouse position
            let pointerX = e.clientX - offsetX;
            let pointerY = e.clientY - offsetY;
            // send callback
            onDrag(pointerX, pointerY);
        }

        function onPointerUp(e) {
            // return if we're not dragging
            if (!isDragging) { return; }
            // tell the browser we're handling this event
            e.preventDefault();
            e.stopPropagation();
            // the drag is over -- clear the isDragging flag
            isDragging = false;
            // send callback
            onUp();
        }

        function onPointerOut(e) {
            // return if we're not dragging
            if (!isDragging) { return; }
            // tell the browser we're handling this event
            e.preventDefault();
            e.stopPropagation();
            // the drag is over -- clear the isDragging flag
            isDragging = false;
            // send callback
            onOut();
        }


        if (window.PointerEvent) {
            // Pointer events are supported.
            $(canvas).on("pointerdown", onPointerDown);
            $(canvas).on("pointermove", onPointerMove);
            $(canvas).on("pointerup", onPointerUp);
            $(canvas).on("pointerout", onPointerOut);
        } else {
            canvas.onmousedown = onPointerDown;
            canvas.onmousemove = onPointerMove;
            canvas.onmouseup = onPointerUp;
            canvas.onmouseout = onPointerOut;
        }


    }


}
