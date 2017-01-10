// Declare Program constants
const VERTICES_PER_HEX = 6;

/**
 * @enum
 */
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

    offset(x, y) {
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

    len() {
        return Math.sqrt(this.len2());
    }

    len2() {
        return this.x * this.x + this.y * this.y;
    }

    normalize() {
        this.divScalar(this.len());
    }

    mulScalar(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }

    divScalar(scalar) {
        this.x /= scalar;
        this.y /= scalar;
    }

    add(other) {
        this.x += other.x;
        this.y += other.y;
    }

    subtract(other) {
        this.x -= other.x;
        this.y -= other.y;
    }

    multiply(other) {
        this.x *= other.x;
        this.y *= other.y;
    }

    divide(other) {
        this.x /= other.x;
        this.y /= other.y;
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
        return `{x: ${this.x}, y: ${this.y} len: ${this.len()}}`;
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
    static fromLBRT(left, bottom, right, top) {
        return new Rect(left, top, right, bottom);
    }
    static fromLRBT(left, right, bottom, top) {
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

    setLTRB(left, top, right, bottom) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }

    setLBRT(left, bottom, right, top) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }

    setLRBT(left, right, bottom, top) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
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
    bottomRight() { return new Point(this.right, this.bottom); }
    topRight() { return new Point(this.right, this.top); }

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

    offset(dx, dy) {
        this.left += dx;
        this.top += dy;
        this.right += dx;
        this.bottom += dy;
    }

    inset(dx, dy) {
        this.left += dx;
        this.top -= dy;
        this.right -= dx;
        this.bottom += dy;
    }

    mulScalar(scalar) {
        this.left *= scalar;
        this.top *= scalar;
        this.right *= scalar;
        this.bottom *= scalar;
    }

    divScalar(scalar) {
        this.left /= scalar;
        this.top /= scalar;
        this.right /= scalar;
        this.bottom /= scalar;
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

class Color {

    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    setRGB(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    setColor(other) {
        this.r = other.r;
        this.g = other.g;
        this.b = other.b;
    }

    setHex(hex) {
        // 0x(RRRRRRRR)(GGGGGGGG)(BBBBBBBB) (24 bits)
        this.r = (hex >> 16) & 0xff;
        this.g = (hex >> 8)  & 0xff;
        this.b = (hex >> 0)  & 0xff;
    }

    setHexString(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        this.r = parseInt(result[1], 16);
        this.g = parseInt(result[2], 16);
        this.b = parseInt(result[3], 16);
    }

    setRandom() {
        this.r = getRandomInt(0, 255);
        this.g = getRandomInt(0, 255);
        this.b = getRandomInt(0, 255);
    }

    // result = alpha * original + (1 - alpha) * background
    // original = (result - (1-alpha) * background) / alpha
    // assume background = (255,255,255)
    //unblend(alpha) {
    //    this.r = (this.r - (1-alpha) *
    //}

    equals(other) {
        return (this.r === other.r &&
        this.g === other.g &&
        this.b === other.b);
    }

    toHex() {
        // 0x(RRRRRRRR)(GGGGGGGG)(BBBBBBBB) (4 bytes, 32 bits)
        return (this.r << 16) | (this.g << 8) | this.b;
    }

    toHexString() {
        // 1(RR)(GG)(BB)
        let hexString = ((1 << 24) | this.toHex()).toString(16);
        // #(RR)(GG)(BB)
        return '#' + hexString.slice(1);
    }

    toString(){
        return `{r: ${this.r}, g: ${this.g}, b: ${this.b}}`;
    }

    static fromHex(hex) {
        let color = new Color();
        color.setHex(hex);
        return color;
    }

    static fromHexString(hex) {
        let color = new Color();
        color.setHexString(hex);
        return color;
    }

    static random() {
        let color = new Color();
        color.setRandom();
        return color;
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
        startVector.mulScalar(1 / startLength);
        endVector.mulScalar(1 / endLength);

        //Calculate the sin and cos of the angle between the vectors
        let sin = startVector.cross(endVector);
        let cos = startVector.dot(endVector);

        //Set the matrix to stretch rotate by the values we calculated
        let matrix = new Matrix();
        matrix.setSinCos(sin, cos);
        matrix.postStretch(ratio);
        matrix.moveOrigin(center.x, center.y);
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
        this.m11 = widthRatio; this.m12 = 0; this.m13 = 0;
        this.m21 = 0; this.m22 = heightRatio; this.m23 = 0;
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
        let reqBytes = reqFloats * Float32Array.BYTES_PER_ELEMENT;
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
        path.put(0, 3); //V0
        //LEFT
        path.put(-2, 5);//V1
        path.put(-3, 2);//V2
        path.put(-5, 0);//V3
        path.put(-8, 3);//V4
        path.put(-10, 7);//V5
        path.put(-17, 10);//V6
        path.put(-13, 5);//V7
        path.put(-12, -1);//V8
        path.put(-3, -7);//V9
        //CENTER BOT
        path.put(0, -10);//V10
        //RIGHT
        path.put(3, -7);//V11
        path.put(12, -1);//V12
        path.put(13, 5);//V13
        path.put(17, 10);//V14
        path.put(10, 7);//V15
        path.put(8, 3);//V16
        path.put(5, 0);//V17
        path.put(3, 2);//V18
        path.put(2, 5);//V19
        //Flip the path because html5 canvas is upside down
        path.transform(Matrix.scaleAboutOrigin(1, -1));
        //Determine the fixed point and control point
        let fixedPoint = path.pointBetween(1, 19);
        let controlPoint = path.pointAt(10);
        //Construct the mesh and return
        return new Mesh(path, fixedPoint, controlPoint);
    }

    static heart() {
        //We need 10 vertices to define the heart
        let path = Path.withCapacity(10);
        //CENTER TOP
        path.put(0, 12); //V0
        //LEFT
        path.put(-3, 16);//V1
        path.put(-5, 16);//V2
        path.put(-8, 12);//V3
        path.put(-8, 8);//V4
        //CENTER BOT
        path.put(0, 0);//V5
        //RIGHT
        path.put(8, 8);//V6
        path.put(8, 12);//V7
        path.put(5, 16);//V8
        path.put(3, 16);//V9
        //Determine the fixed point and control point
        let fixedPoint = path.pointBetween(1, 9);
        let controlPoint = path.pointAt(5);
        //Construct the mesh and return
        return new Mesh(path, fixedPoint, controlPoint);
    }

    static flower() {
        //We need 20 vertices to define the flower
        let path = Path.withCapacity(20);
        path.put(0, -2); //V0
        path.put(-1, -1);//V1
        path.put(-2, -1);//V2
        path.put(-2, -2);//V3
        path.put(-3, -3);//V4
        path.put(-1, -3);//V5
        path.put(-2, -4);//V6
        path.put(-2, -5);//V7
        path.put(-1, -5);//V8
        path.put(0, -6);//V9
        path.put(0, -4);//V10
        path.put(1, -5);//V11
        path.put(2, -5);//V12
        path.put(2, -4);//V13
        path.put(3, -3);//V14
        path.put(1, -3); //V15
        path.put(2, -2); //V16
        path.put(2, -1); //V17
        path.put(1, -1); //V18
        path.put(0, 0);  //V19
        //Determine the fixed point and control point
        let fixedPoint = path.pointAt(19);
        let controlPoint = path.pointAt(9);
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

    constructor(mesh) {
        this.mesh = mesh;
        this.matrix = Matrix.identity();
        this.inverse = Matrix.identity();
    }

    setBounds(rect, stf) {
        // Calculate the rect to rect matrix
        this.matrix.setRectToRect(this.mesh.bounds, rect, stf);
        // Update the inverse matrix
        this.inverse.setRectToRect(rect, this.mesh.bounds, stf);
    }

    setEndPoints(start, end) {
        //Compute the vector from the mesh's fixed point to the specified start point
        let toStart = Vec2.from(this.mesh.fixedPoint, start);
        //Copy the mesh's control point and translate it by our vector.
        let controlPoint = Point.fromPoint(this.mesh.controlPoint);
        controlPoint.offset(toStart.x, toStart.y);
        // Create a matrix to stretch-rotate the control point onto the specified end point.
        this.matrix = Matrix.stretchRotateFrom(start, controlPoint, end);
        // Pre translate by the vector we calculated
        this.matrix.preTranslate(toStart.x, toStart.y);
        // Update the inverse matrix
        this.inverse = this.matrix.inverse();
    }

    containsPoint(point) {
        //Convert the point to basis (mesh) coordinates
        let basisPoint = new Point();
        this.inverse.mapPoint(point, basisPoint);
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
            ctx.lineTo(this.matrix.mapX(x, y), this.matrix.mapY(x, y));
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

    constructor(canvas, onDown, onDrag, onUp, onOut) {

        // Listen for drag events
        let isDragging = false;

        // Listen for mouse drag events
        canvas.addEventListener("mousedown", function (e) {
            // The drag has begun -- set the isDragging flag
            isDragging = true;
            // tell the browser we're handling this event
            e.preventDefault();
            e.stopPropagation();
            // Send callback
            onDown(e);
        }, false);
        canvas.addEventListener("mousemove", function (e) {
            // return if we're not dragging
            if (!isDragging) { return; }
            // tell the browser we're handling this event
            e.preventDefault();
            e.stopPropagation();
            // send callback
            onDrag(e);
        }, false);
        canvas.addEventListener("mouseup", function (e) {
            // return if we're not dragging
            if (!isDragging) { return; }
            // tell the browser we're handling this event
            e.preventDefault();
            e.stopPropagation();
            // The drag is over -- clear the isDragging flag
            isDragging = false;
            // Send callback
            onUp(e);
        }, false);
        canvas.addEventListener("mouseout", function (e) {
            // return if we're not dragging
            if (!isDragging) { return; }
            // tell the browser we're handling this event
            e.preventDefault();
            e.stopPropagation();
            // the drag is over -- clear the isDragging flag
            isDragging = false;
            // send callback
            onOut(e);
        }, false);

        // Listen for touch events
        canvas.addEventListener("touchstart", function (e) {
            // The drag has begun -- set the isDragging flag
            isDragging = true;
            // tell the browser we're handling this event
            e.preventDefault();
            e.stopPropagation();
            // Send callback
            onDown(e.touches[0]);
        }, false);
        canvas.addEventListener("touchmove", function (e) {
            // return if we're not dragging
            if (!isDragging) { return; }
            // tell the browser we're handling this event
            e.preventDefault();
            e.stopPropagation();
            // send callback
            onDrag(e.touches[0]);
        }, false);
        canvas.addEventListener("touchend", function (e) {
            // return if we're not dragging
            if (!isDragging) { return; }
            // tell the browser we're handling this event
            e.preventDefault();
            e.stopPropagation();
            // The drag is over -- clear the isDragging flag
            isDragging = false;
            // Send callback
            onUp(e.touches[0]);
        }, false);
        canvas.addEventListener("touchleave", function (e) {
            // return if we're not dragging
            if (!isDragging) { return; }
            // tell the browser we're handling this event
            e.preventDefault();
            e.stopPropagation();
            // the drag is over -- clear the isDragging flag
            isDragging = false;
            // send callback
            onOut(e.touches[0]);
        }, false);

    }

    // Gets the position of the touch relative to the canvas
    static getTouchPos(touchEvent, dst) {
        return this.getMousePos(touchEvent.touches[0], dst);
    }

    // Gets the position of the mouse relative to the canvas
    static getMousePos(mouseEvent, dst) {
        let p = dst || new Point();

        if (mouseEvent.offsetX) {
            p.x = mouseEvent.offsetX;
            p.y = mouseEvent.offsetY;
        } else if (mouseEvent.layerX) {
            p.x = mouseEvent.layerX;
            p.y = mouseEvent.layerY;
        } else {
            let rect = canvas.getBoundingClientRect();
            p.x = mouseEvent.clientX - rect.left;
            p.y = mouseEvent.clientY - rect.top;
        }

        return p;
    }

}

/**
 * Holds cubic coordinates (q,r,s). Note that in a hexagonal grid, q+r+s = 0.
 * @class
 * @property {number} q - The q coordinate of this cube.
 * @property {number} r - The r coordinate of this cube.
 * @property {number} s - The s coordinate of this cube.
 */
class Cube {

    /**
     * @param {number} q - Value of the Q axis.
     * @param {number} r - Value of the R axis.
     * @param {number} [s=-q-r] s - Value of the S axis.
     */
    constructor(q,r,s){
        this.q = q;
        this.r = r;
        this.s = s || -q - r;
    }

    /**
     * Creates a new cube with the same values as the other cube.
     * @param {Cube} other - The cube to copy.
     * @returns {Cube} a copy of the other cube.
     */
    static fromCube(other){
        return new Cube(
            other.q, other.r, other.s
            );
    }

    /**
     * Rounds the (q,r,s) values of this cube.
     */
    round() {

        // Copy the unrounded coordinates
        var cq = this.q,
            cr = this.r,
            cs = this.s;

        // Perform the rounding
        this.q = Math.round(cq);
        this.r = Math.round(cr);
        this.s = Math.round(cs);

        // Compare rounded to unrounded
        var q_diff = Math.abs(this.q - cq),
            r_diff = Math.abs(this.r - cr),
            s_diff = Math.abs(this.s - cs);

        // Adjust accordingly
        if (q_diff > r_diff && q_diff > s_diff)
            this.q = -this.r - this.s;
        else if (r_diff > s_diff)
            this.r = -this.q - this.s;
        else
            this.s = -this.q - this.r;
    }

    /**
     * Adds the coordinates of the other cube to this cube.
     * @param {Cube} other - The cube to add.
     */
    add(other) {
        this.q += other.q;
        this.r += other.r;
        this.s += other.s;
    }

    /**
     * Subtracts the coordinates of the other cube from this cube.
     * @param {Cube} other - The cube to subtract.
     */
    subtract(other) {
        this.q -= other.q;
        this.r -= other.r;
        this.s -= other.s;
    }

    /**
     * Computes the distance between this cube and the other cube.
     * @returns {Number} the number of cubes that must be traversed in order to reach the other cube.
     */
    distanceTo(other) {
        return Math.max(
            Math.abs(this.q - other.q),
            Math.abs(this.r - other.r),
            Math.abs(this.s - other.s));
    }

    /**
     * Computes the distance from this cube to the origin.
     * @returns {Number} the number of cubes that must be traversed in order to reach the origin.
     */
    distanceToOrigin() {
        return Math.max(
            Math.abs(this.q),
            Math.abs(this.r),
            Math.abs(this.s));
    }

    /**
     * Finds each of the cubes neighboring this cube.
     * @returns {Cube[]} the six neighboring cubes.
     */
    neighbors() {
        let nbrs = [];
        for (let i = 0; i < Directions.length; i++) {
            nbrs.push(this.neighbor(Directions[i]));
        }
        return nbrs;
    }

    /**
     * Finds a cube neighboring this cube.
     * @param {Directions} dir - the direction of the neighbor with respect to this cube.
     * @returns {Cube} the neighboring cube.
     */
    neighbor(dir) {
        let nbr = Cube.fromCube(this);
        nbr.add(dir);
        return nbr;
    }

    /**
     * Checks if two cubes have the same (q,r,s) coordinates.
     * @param {Cube} other - The object to compare to.
     * @returns {boolean} true if the coordinates are equal.
     */
    equals(other) {
        return (
            this.q === other.q &&
            this.r === other.r &&
            this.s === other.s);
    }
};

/**
 * The six possible directions on a hexagon grid.
 */
const Directions = [
   new Cube(1, -1, 0), new Cube(1, 0, -1),
   new Cube(0, 1, -1), new Cube(-1, 1, 0),
   new Cube(-1, 0, 1), new Cube(0, -1, 1)
];

/**
 * Holds hexagon position and attribute data.
 * @class
 * @property {Cube} position - The position of this hexagon in cubic coordinates.
 * @param {Point} center - The center of this hexagon in clip space.
 * @property {number} color - The color of this hexagon in hexadecimal (0xRRGGBB).
 */
class Hex {

    /**
     * @param {Cube} position - The position of the hexagon in cubic coordinates.
     * @param {Point} center - The center of the hexagon in clip space.
     * @param {number} color - The color of the hexagon in hexadecimal (0xRRGGBB).
     */
    constructor(position, center, color) {
        this.position = position;
        this.center = center;
        this.color = color;
    }

    /**
     * Checks if two hexagons have the same position and color.
     * @param {Hex} other - The object to compare to.
     * @returns {boolean} true if the hexagons are equal.
     */
    equals(other) {
        return this.color === other.color && this.position.equals(other.position);
    }
};

/**
 * The orientation of hexagons in a layout.
 * @enum {number}
 */
const Orientation = {
    /** The hexagon will have flat top and bottom, and pointy sides. */
    FlatTop: 1,
    /** The hexagon will have flat side, and pointy top and bottom. */
    PointyTop: 2
};

/**
 * Hexagonal grid.
 * @class
 * @property {Orientation} orientation - The orientation of the hexagons on this grid.
 * @property {Cube[]} coordinates - The cubic coordinates of each of the hexagons on this grid.
 */
class Grid {

    /**
     * @param {Orientation} [orientation=Orientation.FlatTop] orientation - The orientation of the hexagons on this grid.
     */
    constructor(orientation) {
        this.coordinates = [];
        this.orientation = orientation;
    }

    /**
     * Finds the index of a hexagon on this grid with the specified cubic coordinates
     * @param {Cube} c - The cubic coordinates of the hexagon to search for.
     * @returns {Number} The index of the hexagon on this grid, or -1 if none exists.
     */
    indexOf(c) {
        // Note: inefficient algorithm. Override if possible.
        for (let i = 0; i < this.coordinates.length; i++) {
            if (this.coordinates[i].equals(c))
                return i;
        }
        // Not found
        return -1;
    }

    /**
     * Measures the width of this grid given the width and height of each hexagon.
     * @param {Number} hexWidth - The width of each hexagon.
     * @param {Number} hexHeight - The height of each hexagon.
     * @returns {Number} The width of this grid.
     */
    measureWidth(hexWidth, hexHeight) {
        // Abstract method: implement in subclass
        return 0;
    }

    /**
     * Measures the height of this grid given the width and height of each hexagon.
     * @param {Number} hexWidth - The width of each hexagon.
     * @param {Number} hexHeight - The height of each hexagon.
     * @returns {Number} The height of this grid.
     */
    measureWidth(hexWidth, hexHeight) {
        // Abstract method: implement in subclass
        return 0;
    }

};

/*
 * Rectangular hexagonal grid.
 * @class
 * @property rows - The number of rows of hexagons on this grid.
 * @property cols - The number of columns of hexagons on this grid.
 */
class RectangleGrid extends Grid {

    constructor(orientation, rows, cols) {
        super(orientation);
        this.rows = rows;
        this.cols = cols;

        if (this.orientation === Orientation.FlatTop) {
            // Flat top rectangular grid:
            for (let q = 0; q < cols; q++) {
                let q_offset = q >> 1; // or Math.floor(q/2)
                for (let r = -q_offset; r < rows - q_offset; r++) {
                    this.coordinates.push(new Cube(q, r));
                }
            }
        } else {
            //Pointy top rectangular grid:
            for (let r = 0; r < rows; r++) {
                let r_offset = r >> 1; // or Math.floor(r/2)
                for (let q = -r_offset; q < cols - r_offset; q++) {
                    this.coordinates.push(new Cube(q, r));
                }
            }
        }

    }

    indexOf(c) {
        // Since this is a rectangular grid,
        // we can compute the index directly.
        let index;
        if (this.orientation === Orientation.FlatTop) {
            index = this.rows * c.q + c.r + (c.q >> 1);
        } else {
            index = this.cols * c.r + c.q + (c.r >> 1);
        }

        // If the index is valid
        if (0 <= index && index < this.coordinates.length) {
            // And if the hex at that index is equal to "c"
            if (this.coordinates[index].equals(c)) {
                // We found it
                return index;
            }
        }

        // Not on grid
        return -1;
    }

    measureWidth(layout) {
        if (this.orientation === Orientation.FlatTop) {
            return layout.hexWidth * (0.75 * this.cols + 0.25);
        } else {
            return layout.hexWidth * (this.cols + 0.5);
        }
    }

    measureHeight(layout) {
        if (this.orientation === Orientation.FlatTop) {
            return layout.hexHeight * (this.rows + 0.5);
        } else {
            return layout.hexHeight * (0.75 * this.rows + 0.25);
        }
    }
};

/**
 * Generates and manages graphic data for a hexagonal grid.
 * @class
 * @property {Grid} grid - The grid of hexagons in this layout.
 * @property {Rect} bounds - The boundaries of this layout in clip space.
 * @property {Number} hexSize - The length of the flat side of each hexagon in this layout.
 * @property {Number} hexWidth - The width of each hexagon in this layout.
 * @property {Number} hexHeight - The height of each hexagon in this layout.
 * @property {Number} hexRight - The horizontal distance from the bottom left corner of a hexagon in this layout to the nearest vertex on the right.
 * @property {Number} hexUp - The vertical distance from the bottom left corner of a hexagon in this layout to the nearest vertex up above.

 */
class Layout {

    /**
     * @param {Grid} grid - The grid of hexagons to be used.
     * @param {Number} [hexSize=1] hexSize - The length of the flat side of each hexagon.
     */
    constructor(grid, hexSize) {

        this.grid = grid;
        this.hexSize = hexSize || 1;

        // Compute the dimensions of each hexagon
        if (grid.orientation === Orientation.FlatTop) {
            this.hexWidth = this.hexSize * 2;
            this.hexHeight = this.hexSize * Math.sqrt(3);
            this.hexRight = (this.hexWidth - this.hexSize) / 2;
            this.hexUp = (this.hexHeight) / 2;
        } else {
            this.hexHeight = this.hexSize * 2;
            this.hexWidth = this.hexSize * Math.sqrt(3);
            this.hexRight = (this.hexWidth) / 2;
            this.hexUp = (this.hexHeight - this.hexSize) / 2;
        }

        // Compute the width and height of each quadrant of the layout
        this.width = grid.measureWidth(this);
        this.height = grid.measureHeight(this);

        let quadrantWidth = this.width / 2;
        let quadrantHeight = this.height / 2;

        // Set the boundaries of the layout, centered at (0,0).
        this.bounds = Rect.fromLRBT(
            -quadrantWidth, quadrantWidth,
            -quadrantHeight, quadrantHeight
            );

        // Create a hexagon object for each of the coordinates on the grid
        this.hexes = [];
        for (let i = 0; i < grid.coordinates.length; i++) {
            let position = grid.coordinates[i];
            let center = this.findBottomLeftOfHexAt(position);
            center.x += this.hexWidth / 2;
            center.y += this.hexHeight / 2;
            this.hexes.push(new Hex(position, center, -1));
        }

        //let n = this.hexes.length;
        let n = this.hexes.length;
        this.vertices = this.generateVertices(n);
        this.indices = this.generateIndices(n);
        this.colors = this.generateColors(n);
    }

    //draw(renderer) {

    //}

    /**
    * Generates the vertices for the first n hexagons in this layout.
    * @param {Number} n - the number of hexagons for which to generate vertices.
    * @returns {twgl.primitives.AugmentedTypedArray} float array containing the generated vertices.
    */
    generateVertices(n) {
        // Init the vertex buffer
        let dst = twgl.primitives.createAugmentedTypedArray(
            2, VERTICES_PER_HEX * n);
        // Compute the vertices at each grid coordinate and add to buffer
        for (let i = 0; i < n; i++) {
            let coordinate = this.grid.coordinates[i];
            this.generateHexVertices(coordinate, dst);
        }
        // Return the vertex buffer
        return dst;
    }

    /**
     * Generates the indices for the first n hexagons in this layout.
     * @param {Number} n the number of hexagons for which to generate indices.
     * @returns {twgl.primitives.AugmentedTypedArray} short array containing the generated indices.
     */
    generateIndices(n) {
        // Init the index buffer
        let dst = twgl.primitives.createAugmentedTypedArray(
            1, 12 * n, Uint16Array);
        // Compute the indices for each hexagon and add to buffer
        for (let i = 0; i < n; i++) {
            let offset = i * VERTICES_PER_HEX;
            // 012 023 034 045, 678 689 6{10}{11}
            dst.push(
                offset, offset + 1, offset + 2,
                offset, offset + 2, offset + 3,
                offset, offset + 3, offset + 4,
                offset, offset + 4, offset + 5);
        }
        // Return the index buffer
        return dst;
    }

    /**
     * Generates the color data for n hexagons in this layout.
     * @param {Number} n the number of hexagons for which to generate color data.
     * @returns {twgl.primitives.AugmentedTypedArray} byte array containing the generated color data.
     */
    generateColors(n) {
        // Init the color buffer
        let dst = twgl.primitives.createAugmentedTypedArray(
            3, VERTICES_PER_HEX * n, Uint8Array);
        // Compute the color for each hexagon and add to buffer
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < VERTICES_PER_HEX; j++) {
                dst.push(235 - j * j, 235 - j * j, 235 - j * j);
            }
        }
        // Return the color buffer
        return dst;
    }

    /**
     * Generates the vertices for a hexagon at the specified positions in this layout, reading the result into dst.
     * @private
     * @param {Point} c - The cubic coordinates of the hexagon.
     * @param {Float32Array} dst - The destination buffer.
     */
    generateHexVertices(c, dst) {
        // TODO: work from center?
        // Find the bottom left corner (x,y) of the hexagon
        let botLeft = this.findBottomLeftOfHexAt(c),
            x = botLeft.x,
            y = botLeft.y;

        if (this.grid.orientation === Orientation.FlatTop) {
            // Enter points in CCW order beginning with top left vertex
            dst.push(x + this.hexRight + this.hexSize, y + this.hexHeight);
            dst.push(x + this.hexRight, y + this.hexHeight);
            dst.push(x, y + this.hexUp);
            dst.push(x + this.hexRight, y);
            dst.push(x + this.hexRight + this.hexSize, y);
            dst.push(x + this.hexWidth, y + this.hexUp);
        } else {
            // Enter points in CCW order beginning with topmost vertex
            dst.push(x + this.hexRight, y + this.hexHeight);
            dst.push(x, y + this.hexUp + this.hexSize);
            dst.push(x, y + this.hexUp);
            dst.push(x + this.hexRight, y);
            dst.push(x + this.hexWidth, y + this.hexUp);
            dst.push(x + this.hexWidth, y + this.hexUp + this.hexSize);
        }
    }

    /**
     * Finds the bottom left point of a hexagon with respect to this layout.
     * @private
     * @param {Cube} c - The cubic coordinates of the hexagon.
     * @returns {Point} the bottom left corner of the hexagon.
     */
    findBottomLeftOfHexAt(c) {

        let x = this.bounds.left,
            y = this.bounds.bottom;

        if (this.grid.orientation === Orientation.FlatTop) {
            x += c.q * this.hexWidth * 0.75;
            y += (c.r + c.q / 2) * this.hexHeight;

        } else {
            x += (c.q + c.r / 2) * this.hexWidth;
            y += c.r * this.hexHeight * 0.75;
        }

        return new Point(x, y);
    }

    /**
      * Converts a point in clip space to a point in this layout's cubic space.
      * @param {Point} p - A point in clip space.
      * @returns {Cube} The point in cubic space.
     */
    clipToCube(p) {

        let q, r;

        // Adjust point according to layout and hexagon origin
        let adjX = p.x - ((this.hexWidth / 2) + this.bounds.left),
            adjY = p.y - ((this.hexHeight / 2) + this.bounds.bottom);

        if (this.grid.orientation === Orientation.FlatTop) {
            // Flat top:
            q = (adjX * 2 / 3) / this.hexSize;
            r = (-adjX / 3 + Math.sqrt(3) / 3 * adjY) / this.hexSize;
        } else {
            // Pointy top:
            q = (adjX * Math.sqrt(3) / 3 - adjY / 3) / this.hexSize;
            r = (adjY * 2 / 3) / this.hexSize;
        }

        return new Cube(q, r);
    }

    /**
     * Find the index of the hexagon containing the specified point.
     * @param {Point} p - a point in clip space.
     * @returns {Number} the index, or -1 if not found.
     */
    indexOfHexContaining(p) {
        // Convert point to fractal cubic coordinates
        let cube = this.clipToCube(p);
        // Round to cubic coordinates
        cube.round();
        // Find and return the index of the corresponding hexagon
        return this.grid.indexOf(cube);
    }

    /*
     * Gets the offset into the color array where the color
     * data is stored for the hexagon at the specified index.
     * @private
     * @param {Number} index - the index of the hexagon in this layout.
     * @returns {Number} the offset.
     */
    getColorIndex(index) {
        return index * this.colors.numComponents * VERTICES_PER_HEX;
    }

    /*
     * Gets the color of the hexagon at the specified index.
     * @param {Number} index - the index of the hexagon in this layout.
     * @returns {Color} the hexagon color.
     */
    getHexagonColor(index) {
        // Get the color of the hexagon at the specified index
        let color = this.hexes[index].color;
        // Convert to color object and return
        return Color.fromHex(color);
    }

    /*
     * Sets the color of the hexagon at the specified index.
     * @param {Number} index - the index of the hexagon in this layout.
     * @param {Color} the new color for the hexagon.
     */
    setHexagonColor(index, color, changes) {
        // Get the hex at the current index
        let hex = this.hexes[index];
        // Get the previous hex color
        let oldColor = hex.color;
        // Convert the new color to hexadecimal
        let newColor = color.toHex();
        // If the two differ
        if (oldColor !== newColor) {
            // Set the color of our hexagon to the new color
            hex.color = newColor;
            // Keep record of change if requested
            if (changes) {
                changes.add(index, oldColor);
            }
            // Apply changes to our color buffer:
            // 1. Compute offset into color array
            let offset = this.getColorIndex(index);
            // 2. Apply color gradient
            for (let d = 3; d < 6; d++) {
                let dd = 2 * d * d;
                this.colors[offset++] = Math.min(color.r + dd, 255);
                this.colors[offset++] = Math.min(color.g + dd, 255);
                this.colors[offset++] = Math.min(color.b + dd, 255);
            }
            for (let d = 3; d < 6; d++) {
                let dd = 2 * d * d;
                this.colors[offset++] = Math.max(color.r - dd, 0);
                this.colors[offset++] = Math.max(color.g - dd, 0);
                this.colors[offset++] = Math.max(color.b - dd, 0);
            }
        }
    }

    addLine(start, end, radius, color, changes) {
        // Compute vector from start to end
        let vector = Cube.fromCube(end);
        vector.subtract(start);
        // Compute distance of vector
        let dist = vector.distanceToOrigin();
        // Map line onto grid
        let step = 1.0 / Math.max(dist, 1);
        for (let i = 0; i <= dist; i++) {
            let t = step * i;
            let c = new Cube();
            c.q = start.q + vector.q * t;
            c.r = start.r + vector.r * t;
            c.s = start.s + vector.s * t;
            c.round();
            // If the point is on the grid
            let index = this.grid.indexOf(c);
            if (index !== -1) {
                this.fillRange(index, radius, color, changes);
            }
        }
    }

    addRect(rect, color, changes) {
        for (let i = 0; i < this.hexes.length; i++) {
            if (rect.containsPoint(this.hexes[i].center)) {
                this.setHexagonColor(i, color, changes);
            }
        }
    }

    addShape(shape, color, changes) {
        for (let i = 0; i < this.hexes.length; i++) {
            if (shape.containsPoint(this.hexes[i].center)) {
                this.setHexagonColor(i, color, changes);
            }
        }
    }

    fillRange(centerIndex, radius, color, changes) {
        // Get the center of the hexagon
        let center = this.hexes[centerIndex].position;
        // Set color of center hexagon to parameter
        this.setHexagonColor(centerIndex, color, changes);
        // For all hexagons inside the horizontal radius
        for (let x = -radius; x <= radius; x++) {
            let lower = Math.max(-radius, -x - radius),
                upper = Math.min(radius, -x + radius);
            // And also inside the vertical radius
            for(let y = lower; y <= upper; y++){
                let cube = new Cube(x, y);
                cube.add(center);
                let index = this.grid.indexOf(cube);
                if (index !== -1) {
                    this.setHexagonColor(index, color, changes);
                }
            }
        }
    }

    eraseRange(centerIndex, radius) {
        // Get the center of the hexagon
        let center = this.hexes[centerIndex].position;
        // Set color of center hexagon to parameter
        this.eraseHexagonColor(centerIndex);
        // For all hexagons inside the horizontal radius
        for (let x = -radius; x <= radius; x++) {
            let lower = Math.max(-radius, -x - radius),
                upper = Math.min(radius, -x + radius);
            // And also inside the vertical radius
            for (let y = lower; y <= upper; y++) {
                let cube = new Cube(x, y);
                cube.add(center);
                let index = this.grid.indexOf(cube);
                if (index !== -1) {
                    this.eraseHexagonColor(index);
                }
            }
        }
    }

    /*
     * Erases the color of the hexagon at the specified index.
     * @param {Number} index - the index of the hexagon in this layout.
     */
    eraseHexagonColor(index) {
        // Set the color of the hexagon at the specified index to -1
        this.hexes[index].color = -1;
        // Compute the corresponding index in the color array
        let offset = this.getColorIndex(index);
        // Apply erase gradient
        for (let d = 0; d < VERTICES_PER_HEX; d++) {
            let dd = d * d;
            this.colors[offset++] = 235 - dd;
            this.colors[offset++] = 235 - dd;
            this.colors[offset++] = 235 - dd;
        }
    }

    /*
     * Flood fills this layout with the specified color.
     * @param {Number} startIndex - index of where to begin flood fill.
     * @param {Color} newColor - the new color for the hexagon.
     */
    floodFill(startIndex, newColor) {
        // Get the hexagon at the specified start index
        let start = this.hexes[startIndex];
        // Get the hexadecimal value of the old color and the new color
        let oldColorHex = start.color;
        let newColorHex = newColor.toHex();
        // If these are equal, we don't need to do anything
        if (oldColorHex === newColorHex) {
            return;
        }
        // Otherwise we begin the flood fill process by
        // setting the color of the start hexagon to the new color
        this.setHexagonColor(startIndex, newColor);
        // We'll keep a list of all the hexagons we've already checked
        let visited = new Set();
        // And queue (first in, first out) of all the hexagons we have yet to check
        let fringes = [];
        // Add the position of the starting hexagon to the queue
        fringes.push(start.position);
        // As long as we have more fringes to check
        while (fringes.length > 0) {
            // Pull the next from the queue
            let fringe = fringes.shift();
            // For each of the neighboring hexagons
            let neighbors = fringe.neighbors();
            for (let i = 0; i < neighbors.length; i++) {
                let neighbor = neighbors[i];
                // Find the index of the neighbor on the grid
                let index = this.grid.indexOf(neighbor);
                // If valid, and we haven't already checked it
                if (index != -1 && !visited.has(index)) {
                    // Add to visited list so we don't have to check again
                    visited.add(index);
                    // Get the color of the corresponding hexagon
                    let color = this.hexes[index].color;
                    // If it matches the color of our starting hexagon
                    if (color === oldColorHex) {
                        // Change its color
                        this.setHexagonColor(index, newColor);
                        // Add to queue so we can check its neighbors
                        fringes.push(neighbor);
                    }
                }
            }
        }
    }

    reverseChanges(changes) {
        while (changes.positions.length > 0) {
            let position = changes.positions.pop();
            let color = changes.colors.pop();
            if (color === -1) {
                this.eraseHexagonColor(position);
            } else {
                this.setHexagonColor(position, Color.fromHex(color));
            }
        }
    }

};

class Changes {
    constructor() {
        this.positions = [];
        this.colors = [];
    }

    add(position, color) {
        this.positions.push(position);
        this.colors.push(color);
    }
}

/**
 * Defines the rectangular region of clip space to display on the screen.
 * @class
 * @property {Number} scale - The scale applied to the default projection region.
 * @property {Vec2} offset - The translational offset applied to the default projection region.
 * @property {Rect} default - The region displayed by this projection when scale = 1 and offset = (0,0).
 * @property {Rect} region - The region displayed by this projection after applying its scale and offset values.
 * @property {twgl.m4} matrix - The projection matrix.
 */
class Projection {

    /**
     * Creates a projection initialized to {0, 0, 0, 0}.
     */
    constructor() {
        this.scale = 1;
        this.offset = new Vec2(0, 0),
        this.default = new Rect(),
        this.region = new Rect(),
        this.matrix = twgl.m4.identity();
    }

    applyChanges() {
        // Reset projection region to default
        this.region.set(this.default);
        // Apply scale, fixing (0,0)
        this.region.divScalar(this.scale);
        // Apply translational offset
        this.region.offset(this.offset.x, this.offset.y);
        // Recalculate the projection matrix
        twgl.m4.ortho(
                this.region.left,
                this.region.right,
                this.region.bottom,
                this.region.top,
                0.1, 10, this.matrix);
    }

};

/*
 * Renders a layout onto a canvas through WebGL.
 * @class
 * @property gl - The WebGL context being used.
 * @property {Layout} layout - The layout being rendered.
 * @property {Projection} - The projection from the layout to the canvas.
 */
class Renderer {

    /**
     * @param gl - The WebGL context to use for rendering.
     * @param {Layout} layout - the layout to render.
     */
    constructor(gl, layout) {
        // Get the WebGL context and save a reference to the layout
        this.gl = gl;
        this.layout = layout;
        // Init the projection
        this.projection = new Projection();
    }

    /**
     * Called when the surface hosting this renderer is first created
     */
    onSurfaceCreated() {
        // Set clear color to black
        this.gl.clearColor(0, 0, 0, 1);

        // Init the shader program
        this.programInfo = twgl.createProgramInfo(this.gl, ["vs", "fs"]);
        this.gl.useProgram(this.programInfo.program);

        // Link shader attributes to layout variables
        this.attribs = {
            //TODO: only store a_color?
            a_position: this.layout.vertices,
            a_color: this.layout.colors,
            indices: this.layout.indices
        };

        // Generate buffer objects in WebGL for each of the attributes
        this.bufferInfo = twgl.createBufferInfoFromArrays(this.gl, this.attribs);
        // then load the attribute data into the program.
        twgl.setBuffersAndAttributes(this.gl, this.programInfo, this.bufferInfo);

        // Link shader uniforms to projection variables
        this.uniforms = {
            u_MVP: this.projection.matrix
        };
    }

    /**
     * Called whenever the canvas changes size.
     * @param {Number} width - The new width of the canvas.
     * @param {Number} height - The new height of the canvas.
     */
    onSurfaceChanged(width, height) {

        // Update the viewport to match the new dimensions of the drawing buffer
        this.gl.viewport(0, 0, width, height);

        // Set the default projection region to the bounds of the layout
        this.projection.default.set(this.layout.bounds);

        // Expand projection to match width/height ratio of viewport
        if (height > width) {
            // Portrait mode: expand projection vertically
            let ratio = height / width;
            this.projection.default.bottom = this.projection.default.left * ratio;
            this.projection.default.top = this.projection.default.right * ratio;
        } else {
            // Landscape mode: expand projection horizontally
            let ratio = width / height;
            this.projection.default.left = this.projection.default.bottom * ratio;
            this.projection.default.right = this.projection.default.top * ratio;
        }

        // Apply the projection changes
        this.applyProjectionChanges();
    }

    onDrawFrame() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        twgl.drawBufferInfo(this.gl, this.bufferInfo);
    }

    applyColorChanges() {
        twgl.setAttribInfoBufferFromArray(this.gl,
             this.bufferInfo.attribs.a_color,
             this.attribs.a_color);
        this.needToRender = true;
    }

    applyProjectionChanges() {
        this.projection.applyChanges();
        twgl.setUniforms(this.programInfo, this.uniforms);
        this.needToRender = true;
    }
};

/**
 * Listens for drag events, converts points from screen space
 * to clip space, and resizes the canvas to fill the viewport.
 * @class
 * @property {HTMLCanvasElement} canvas - The canvas being managed by this surface.
 * @property {Renderer} renderer - The surface renderer.
 */
class Surface {

    /**
     * @param {HTMLCanvasElement} canvas - The canvas to manage.
     * @param {Renderer} renderer - The surface renderer.
     */
    constructor(canvas, renderer) {

        // Save a handle to the canvas and the layout
        this.canvas = canvas;
        this.renderer = renderer;

        // Get the width and height of the canvas
        let width = this.canvas.clientWidth,
            height = this.canvas.clientHeight;

        // Notify renderer of surface creation resizing
        this.renderer.onSurfaceCreated();
        this.renderer.onSurfaceChanged(width, height);
    }

    /**
     * Requests that the canvas be re-rendered,
     * applying any changes that may have have occurred
     * to either the canvas or the layout.
     */
    requestRender() {
        this.renderer.needToRender = true;
    }

    /**
     * Resizes the canvas if its width and height no longer match that of the client.
     * @returns {boolean} true if the canvas needed to be resized; false otherwise.
     */
    resize() {
        let realToCSSPixels = window.devicePixelRatio;

        // Lookup the size the browser is projectioning the canvas in CSS pixels
        // and compute a size needed to make our drawingbuffer match it in
        // device pixels.
        let projectionWidth = Math.floor(this.canvas.clientWidth * realToCSSPixels);
        let projectionHeight = Math.floor(this.canvas.clientHeight * realToCSSPixels);

        // Check if the canvas is not the same size.
        if (this.canvas.width !== projectionWidth ||
            this.canvas.height !== projectionHeight) {

            // Make the canvas the same size
            this.canvas.width = projectionWidth;
            this.canvas.height = projectionHeight;

            // Notify renderer of surface change
            this.renderer.onSurfaceChanged(projectionWidth, projectionHeight);

            // Notify change occurred
            return true;
        }
        // Notify change not occurred
        return false;
    }

    /**
     * Gets the position of a mouse or touch event relative to the canvas.
     */
    screenToCanvas(e, dst) {
        let pCanvas = dst || new Point();

        if (e.offsetX) {
            pCanvas.x = e.offsetX;
            pCanvas.y = e.offsetY;
        } else if (e.layerX) {
            pCanvas.x = e.layerX;
            pCanvas.y = e.layerY;
        } else {
            let rect = canvas.getBoundingClientRect();
            pCanvas.x = e.clientX - rect.left;
            pCanvas.y = e.clientY - rect.top;
        }

        return pCanvas;
    }

    /**
     * Converts a canvas coordinate to NDC space [-1,1].
     */
    canvasToNdc(p, dst) {
        // Get width and height of canvas
        let width = this.canvas.clientWidth,
            height = this.canvas.clientHeight;
        // Normalize the coordinate
        let pNDC = dst || new Point();
        pNDC.x = p.x / width;
        pNDC.y = (height - p.y) / height;
        return pNDC;
    }

    /**
     * Converts a point from NDC space [-1,1] to clip space.
     */
    ndcToClip(p, dst) {
        // Get current projection region
        let proj = this.renderer.projection.region;
        // Find position of p in projection
        let pClip = dst || new Point();
        pClip.x = proj.left + (p.x * proj.width());
        pClip.y = proj.bottom + (p.y * proj.height());
        return pClip
    }

    /**
     * Converts a screen coordinate to a point in clip space.
     */
    screenToClip(e, dst) {
        let p = dst || new Point();
        this.screenToCanvas(e, p);
        this.canvasToNdc(p, p);
        this.ndcToClip(p, p);
        return p;
    }
};

/**
* Returns a random integer between min (inclusive) and max (inclusive)
* Using Math.round() will give you a non-uniform distribution!
*/
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//TODO: comment out next line if using browserify
var exports = exports || {};
exports.ScaleToFit = ScaleToFit;
exports.Point = Point;
exports.Vec2 = Vec2;
exports.Rect = Rect;
exports.Color = Color;
exports.Matrix = Matrix;
exports.Path = Path;
exports.Mesh = Mesh;
exports.Shape = Shape;
exports.DragDetector = DragDetector;
exports.Cube = Cube;
exports.Directions = Directions;
exports.Hex = Hex;
exports.Orientation = Orientation;
exports.Grid = Grid;
exports.RectangleGrid = RectangleGrid;
exports.Layout = Layout;
exports.Changes = Changes;
exports.Projection = Projection;
exports.Renderer = Renderer;
exports.Surface = Surface;



$(function () {

var ghx = exports;

const cout = document.getElementById("cout");
const ctx = cout.getContext("2d");

// 1. Init canvas and WebGL context
const canvas = document.getElementById("c");
const gl = twgl.getWebGLContext(canvas);

// 2. Init hexagon grid
const grid = new ghx.RectangleGrid(
        ghx.Orientation.PointyTop,
        100, 100);

// 3. Init layout
const layout = new ghx.Layout(grid);

// 4. Init renderer
const renderer = new ghx.Renderer(gl, layout);

// 5. Init rendering surface
const surface = new ghx.Surface(canvas, renderer);

/**
 * Checks each frame if the canvas needs to be re-rendered.
 */
function checkRender() {
    // If the canvas needs to be re-rendered
    if (surface.resize() || renderer.needToRender) {
        // By all means do so
        renderer.needToRender = false;
        renderer.onDrawFrame();
    }
    requestAnimationFrame(checkRender);
}
checkRender();

// TODO: add color changer that moves to cubic coordinate and applies action?

// 6. Listen for color changes
let colorPicker = $("#color-picker");
let color = ghx.Color.fromHexString($(colorPicker).val());

$(colorPicker).change(function () {
    color.setHexString($(this).val());
});

// Listen for tool changes
// Could also have settings and actions
class Tool {
    constructor(onDown, onDrag) {
        this.handleDownAction = onDown;
        this.handleDragAction = onDrag;
    }


}

//Stack of changes, cleft for me?

const panTool = new Tool();
panTool.handleDownAction = function (e) {
    // Compute point in clip space where event began
    this.previous = surface.screenToClip(e);
    console.log(this.previous);
}
panTool.handleDragAction = function (e) {
    // Compute current point of mouse in clip space
    let current = surface.screenToClip(e);
    // Translate by vector from current point to previous point (reverse direction)
    let vec = ghx.Vec2.from(current, this.previous);
    let origin = renderer.projection.offset;
    origin.add(vec);
    // Avoid panning off screen
    constrainPointToGrid(origin);
    renderer.applyProjectionChanges();
    // Keep track of previous point
    this.previous.x = current.x + vec.x;
    this.previous.y = current.y + vec.y;
}

const brush = new Tool();
brush.handleDownAction = function (e) {

}
brush.handleDragAction = function (e) {
    // Convert point to clip space
    let pClip = surface.screenToClip(e);
    // Find index of the corresponding hexagon
    let index = layout.indexOfHexContaining(pClip);
    // If found
    if (index !== -1) {
        // Change the color of the hexagon
        layout.fillRange(index, brushSize, color);
        //layout.setHexagonColor(index, color);
        // Apply changes to screen
        applyColorChanges();
    }
};

const eraser = new Tool();
eraser.handleDownAction = function (e) {


};
eraser.handleDragAction = function (e) {
    // Convert point to clip space
    let pClip = surface.screenToClip(e);
    // Find index of the corresponding hexagon
    let index = layout.indexOfHexContaining(pClip);
    // If found
    if (index !== -1) {
        // Change the color of the hexagon
        layout.eraseRange(index, brushSize);
        // Apply changes to screen
        applyColorChanges();
    }
};

const paintBucket = new Tool();
paintBucket.handleDownAction = function (e) {
    // Convert point to clip space
    let pClip = surface.screenToClip(e);
    // Find index of the corresponding hexagon
    let index = layout.indexOfHexContaining(pClip);
    // If found
    if (index !== -1) {
        layout.floodFill(index, color);
        // Load changes into gl context
        applyColorChanges();
    }
};
paintBucket.handleDragAction = function (e) {


};

const eyedropper = new Tool();
eyedropper.handleDownAction = function (e) {
    // Convert point to clip space
    let pClip = surface.screenToClip(e);
    // Find index of the corresponding hexagon
    let index = layout.indexOfHexContaining(pClip);
    if (index != -1) {
        color.setColor(layout.getHexagonColor(index));
        $(colorPicker).val(color.toHexString());
    }
};
eyedropper.handleDragAction = function (e) {


};

const lineTool = new Tool();
lineTool.handleDownAction = function (e) {
    // Convert point to clip space
    let pClip = surface.screenToClip(e);
    // Convert to cube coordinates
    this.start = layout.clipToCube(pClip);
    // Keep track of changes
    this.changes = new ghx.Changes();
}
lineTool.handleDragAction = function (e) {
    layout.reverseChanges(this.changes);
    // Convert point to clip space
    let pClip = surface.screenToClip(e);
    // Convert to cube coordinates
    let end = layout.clipToCube(pClip);
    // Draw line from start to end
    layout.addLine(this.start, end, brushSize, color, this.changes);
    // Apply changes to screen
    applyColorChanges();
}

const rectangleTool = new Tool();
rectangleTool.handleDownAction = function (e) {
    // Convert start point to clip space
    this.start = surface.screenToClip(e);
    // Keep track of changes
    this.changes = new ghx.Changes();
}
rectangleTool.handleDragAction = function (e) {
    layout.reverseChanges(this.changes);
    // Convert end point to clip space
    let end = surface.screenToClip(e);
    // Compute rect from start to end
    let rect = ghx.Rect.fromTwoPoints(this.start, end);
    // Draw line from start to end
    layout.addRect(rect, color, this.changes);
    // Apply changes to screen
    applyColorChanges();
}

//Meshes array
const Meshes = [
   ghx.Mesh.nGon(3), //Triangle
   ghx.Mesh.nStar(2, .5, 1), //Diamond
   ghx.Mesh.nGon(5), //Pentagon
   ghx.Mesh.nGon(6), //Hexagon
   ghx.Mesh.nGon(40), //Circle
   ghx.Mesh.nStar(5, 0.4, 1), //Star
   ghx.Mesh.heart(), // Heart
   ghx.Mesh.flower(), //Flower
   ghx.Mesh.bat(), //Bat
];

let shapePicker = $("#shape-picker");
let mesh = Meshes[$(shapePicker).val()];
$(shapePicker).change(function () {
    //Val refers to order of option in index of Meshes array
    mesh = Meshes[$(this).val()];
});

const shapeTool = new Tool();
shapeTool.handleDownAction = function (e) {
    // Keep track of changes
    this.changes = new ghx.Changes();
    // Save reference to start point
    this.start = surface.screenToClip(e);
    // Init our shape
    this.shape = new ghx.Shape(mesh);
}
shapeTool.handleDragAction = function (e) {
    layout.reverseChanges(this.changes);
    // Convert point to clip space
    let end = surface.screenToClip(e);
    // Recalculate shape vertices
    this.shape.setEndPoints(this.start, end);
    // Map shape onto grid
    layout.addShape(this.shape, color, this.changes);
    // Apply changes to screen
    applyColorChanges();
};

const Tools = [
   brush, eraser, paintBucket, eyedropper, lineTool, rectangleTool, shapeTool
];

let toolPicker = $("#tool-picker");
let tool = Tools[$(toolPicker).val()];

$(toolPicker).change(function () {
    //Val refers to order of option in index of Meshes array
    tool = Tools[$(this).val()];
});

let brushSizePicker = $("#brush-size-picker");
let brushSize = $(brushSizePicker).val() - 1;

$(brushSizePicker).change(function () {
    brushSize = $(brushSizePicker).val() - 1;
});

// 7. Listen for mouse drag events
function onDown(e) {
    // If alt key held, set color to random
    if (e.altKey) {
        color.setRandom();
        $(colorPicker).val(color.toHexString());
    }
    // Choose tool depending on which mouse button is used
    switch (e.which) {
        case 1: // Left click
            tool = Tools[$(toolPicker).val()];
            break;
        case 2: // Wheel
            tool = panTool;
            break;
        case 3: // Right click
            tool = null;
            break;
    }
    // Let tool handle event
    if (tool) {
        tool.handleDownAction(e);
    }
}

function onDrag(e) {
    // Let tool handle event
    if (tool) {
        tool.handleDragAction(e);
    }
}



function applyColorChanges() {
    // Load changes into gl context
    renderer.applyColorChanges();
}

function updateCout(){
    let imageData = ctx.getImageData(0, 0, 100, 100);
    let data = imageData.data;
    let index = 0;
    // iterate over rows from top to bottom
    for (let y = cout.width - 1; y >= 0; y--) {
        // and over the columns from left to right
        for (let x = 0; x < cout.height; x++) {
            // Compute offset into pixel data
            let offset = ((cout.width * y) + x) * 4;
            // Get hex at current index
            let hex = layout.hexes[index++];
            // If hex is transparent
            if (hex.color === -1) {
                // Make pixel transparent
                data[offset] = 0;
                data[offset + 1] = 0;
                data[offset + 2] = 0;
                data[offset + 3] = 0;
            } else {
                // Otherwise set color of pixel to color of hex
                let rgb = ghx.Color.fromHex(hex.color);
                data[offset] = rgb.r;
                data[offset + 1] = rgb.g;
                data[offset + 2] = rgb.b;
                data[offset + 3] = 255;
            }
        }
    }
    ctx.clearRect(0, 0, cout.width, cout.height);
    ctx.putImageData(imageData, 0, 0);
}

/**
 * This is the function that will take care of image extracting and
 * setting proper filename for the download.
 * IMPORTANT: Call it from within a onclick event.
*/
function downloadCanvas(link, canvas, filename) {
    link.href = canvas.toDataURL();
    link.download = filename;
}

$("#download").click(function () {
    updateCout();
    downloadCanvas(this, cout, "hexel-art.png");
})


function onUp(e) {
}

function onOut(e) {
}

let detector = new ghx.DragDetector(canvas, onDown, onDrag, onUp, onOut);

const MIN_SCALE = 1;
const MAX_SCALE = Math.max(grid.rows, grid.cols);

// 8. Listen for zoom events
function handleScroll(event){
    // Tell the browser we're handling this event
    event.preventDefault();
    event.stopPropagation();
    // Get direction of scroll
    let isPositive = event.detail < 0 || event.wheelDelta > 0;
    // Choose zoom value based on direction
    let zoom = isPositive ? 1.5 : 0.666666;
    let scale = renderer.projection.scale;
    // Constrain scale to given boundaries
    let targetScale = scale * zoom;
    if (targetScale < MIN_SCALE) {
        // Need zoom * scale = MIN_SCALE, i.e. zoom = MIN_SCALE/scale
        zoom = MIN_SCALE / scale;
        scale = MIN_SCALE;
    } else if (targetScale > MAX_SCALE) {
        // Need zoom * scale = MAX_SCALE, i.e. zoom = MAX_SCALE/scale
        zoom = MAX_SCALE / scale;
        scale = MAX_SCALE;
    } else {
        scale = targetScale;
    }
    // Apply the computed scale value to our projection
    renderer.projection.scale = scale;
    // Next we need to translate map so that the current point remains under the mouse
    // First compute the vector from the origin to the current point
    let origin = renderer.projection.offset;
    let current = surface.screenToClip(event);
    let pan = ghx.Vec2.from(origin, current);
    pan.mulScalar((zoom - 1) / zoom);
    origin.add(pan);
    // Avoid panning off screen
    constrainPointToGrid(origin);
    // Update scale
    renderer.applyProjectionChanges();
}

canvas.addEventListener('DOMMouseScroll', handleScroll, false); // for Firefox
canvas.addEventListener('mousewheel', handleScroll, false); // for everyone else

function constrainPointToGrid(p) {
    let scale = renderer.projection.scale;
    let scaleFactor = (scale - MIN_SCALE) / scale,
        right = layout.bounds.right * scaleFactor,
        top = layout.bounds.top * scaleFactor;

    p.x = constrain(p.x, -right, right);
    p.y = constrain(p.y, -top, top);
}

/**
 * Constrains a value between the specified upper and lower bounds.
 */
function constrain(value, lower, upper) {
    if (value < lower) {
        return lower;
    } else if (value > upper) {
        return upper;
    } else {
        return value;
    }
}

$("#image-picker").change(function (e) {
    let reader = new FileReader();
    reader.onload = function (event) {
        let img = new Image();
        img.onload = function () {
            let hRatio = cout.width / img.width;
            let vRatio = cout.height / img.height;
            let ratio = Math.min(hRatio, vRatio);
            let centerShift_x = (cout.width - img.width * ratio) / 2;
            let centerShift_y = (cout.height - img.height * ratio) / 2;
            ctx.clearRect(0, 0, cout.width, cout.height);
            ctx.drawImage(img, 0, 0, img.width, img.height, // src
                               centerShift_x, centerShift_y, img.width * ratio, img.height * ratio); // dst
            let data = ctx.getImageData(0, 0, 100, 100).data;
            let index = 0; //layout.hexes.length - 1;
            // iterate over rows from top to bottom
            for (let y = cout.width -1; y >= 0; y--) {
                // and over the columns from left to right
                for (let x = 0; x < cout.height; x++) {
                    let offset = ((cout.width * y) + x) * 4;
                    // If pixel is not transparent
                    if (data[offset + 3] !== 0) {
                        let rgb = new ghx.Color(
                            data[offset    ],
                            data[offset + 1],
                            data[offset + 2]);
                        layout.setHexagonColor(index, rgb);
                    } index++;
                }
            }
            applyColorChanges();

        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
});


});
