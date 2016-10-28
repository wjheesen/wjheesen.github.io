'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ScaleToFit = {
    FitCenter: 0,
    Fill: 1,
    FitEnd: 2,
    FitStart: 3
};

var Point = function () {
    function Point(x, y) {
        _classCallCheck(this, Point);

        this.x = x;
        this.y = y;
    }

    _createClass(Point, [{
        key: 'isInside',
        value: function isInside(x1, y1, x2, y2) {
            return y1 > this.y !== y2 > this.y && this.x < (x2 - x1) * (this.y - y1) / (y2 - y1) + x1;
        }
    }, {
        key: 'offset',
        value: function offset(x, y) {
            this.x += x;
            this.y += y;
        }
    }, {
        key: 'log',
        value: function log() {
            console.log(this.toString());
        }
    }, {
        key: 'toString',
        value: function toString() {
            return '{x: ' + this.x + ', y: ' + this.y + '}';
        }
    }], [{
        key: 'fromPoint',
        value: function fromPoint(point) {
            return new Point(point.x, point.y);
        }
    }, {
        key: 'midpointOf',
        value: function midpointOf(p1, p2) {
            var midX = 0.5 * (p1.x + p2.x);
            var midY = 0.5 * (p1.y + p2.y);
            return new Point(midX, midY);
        }
    }]);

    return Point;
}();

var Vec2 = function () {
    function Vec2(x, y) {
        _classCallCheck(this, Vec2);

        this.x = x;
        this.y = y;
    }

    _createClass(Vec2, [{
        key: 'normalize',
        value: function normalize() {
            this.scale(1 / this.len());
        }
    }, {
        key: 'len',
        value: function len() {
            return Math.sqrt(this.len2());
        }
    }, {
        key: 'len2',
        value: function len2() {
            return this.x * this.x + this.y * this.y;
        }
    }, {
        key: 'scale',
        value: function scale(value) {
            this.x *= value;
            this.y *= value;
        }
    }, {
        key: 'plus',
        value: function plus(other) {
            this.x += other.x;
            this.y += other.y;
        }
    }, {
        key: 'minus',
        value: function minus(other) {
            this.x -= other.x;
            this.y -= other.y;
        }
    }, {
        key: 'dot',
        value: function dot(other) {
            return this.x * other.x + this.y * other.y;
        }
    }, {
        key: 'cross',
        value: function cross(other) {
            return this.x * other.y - this.y * other.x;
        }
    }, {
        key: 'invert',
        value: function invert() {
            this.x = -this.x;
            this.y = -this.y;
        }
    }, {
        key: 'log',
        value: function log() {
            console.log(this.toString());
        }
    }, {
        key: 'toString',
        value: function toString() {
            return '{x: ' + this.x + ', y: ' + this.y + ' len: ' + this.len();
        }
    }], [{
        key: 'from',
        value: function from(start, end) {
            return new Vec2(end.x - start.x, end.y - start.y);
        }
    }]);

    return Vec2;
}();

var Rect = function () {
    function Rect(left, top, right, bottom) {
        _classCallCheck(this, Rect);

        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }

    _createClass(Rect, [{
        key: 'set',
        value: function set(rect) {
            this.left = rect.left;
            this.top = rect.top;
            this.right = rect.right;
            this.bottom = rect.bottom;
        }
    }, {
        key: 'setEmpty',
        value: function setEmpty() {
            this.left = 0;
            this.top = 0;
            this.right = 0;
            this.bottom = 0;
        }
    }, {
        key: 'setUnion',
        value: function setUnion(points, offset, count) {
            //Enclose the first point in the array
            this.left = this.right = points[offset++];
            this.top = this.bottom = points[offset++];
            //Enclose the rest of the points in the array
            this.unionPoints(points, offset, count - 1);
        }
    }, {
        key: 'sort',
        value: function sort() {
            //If the top boundary is not above the bottom boundary
            if (this.bottom > this.top) {
                //Swap top and bottom
                var topCopy = this.top;
                this.top = this.bottom;
                this.bottom = topCopy;
            }
            //If the right boundary is not to the right of the left boundary
            if (this.left > this.right) {
                //Swap left and right
                var rightCopy = this.right;
                this.right = this.left;
                this.left = rightCopy;
            }
        }
    }, {
        key: 'isEmpty',
        value: function isEmpty() {
            this.left >= this.right || this.bottom >= this.top;
        }
    }, {
        key: 'isValid',
        value: function isValid() {
            return this.right >= this.left && this.top >= this.bottom;
        }
    }, {
        key: 'width',
        value: function width() {
            return this.right - this.left;
        }
    }, {
        key: 'height',
        value: function height() {
            return this.top - this.bottom;
        }
    }, {
        key: 'area',
        value: function area() {
            return width() * height();
        }
    }, {
        key: 'topLeft',
        value: function topLeft() {
            return new Point(this.left, this.top);
        }
    }, {
        key: 'bottomLeft',
        value: function bottomLeft() {
            return new Point(this.left, this.bottom);
        }
    }, {
        key: 'bottomRight',
        value: function bottomRight() {
            return new Point(this.right, this.bottom);
        }
    }, {
        key: 'topRight',
        value: function topRight() {
            return new Point(this.right, this.top);
        }
    }, {
        key: 'center',
        value: function center() {
            return new Point(this.centerX(), this.centerY());
        }
    }, {
        key: 'centerX',
        value: function centerX() {
            return 0.5 * (this.left + this.right);
        }
    }, {
        key: 'centerY',
        value: function centerY() {
            return 0.5 * (this.bottom + this.top);
        }
    }, {
        key: 'containsRect',
        value: function containsRect(other) {
            return this.left <= other.left && other.right <= this.right && this.bottom <= other.bottom && other.top <= this.top;
        }
    }, {
        key: 'containsPoint',
        value: function containsPoint(pt) {
            return this.contains(pt.x, pt.y);
        }
    }, {
        key: 'contains',
        value: function contains(x, y) {
            return this.left <= x && x <= this.right && this.bottom <= y && y <= this.top;
        }
    }, {
        key: 'unionRect',
        value: function unionRect(other) {
            this.left = Math.min(this.left, other.left);
            this.right = Math.max(this.right, other.right);
            this.bottom = Math.min(this.bottom, other.bottom);
            this.top = Math.max(this.top, other.top);
        }
    }, {
        key: 'unionPoints',
        value: function unionPoints(points, offset, count) {
            //For each of the points in the subset
            for (var i = 0; i < count; i++) {
                //Expand this rect to enclose the point
                this.union(points[offset++], points[offset++]);
            }
        }
    }, {
        key: 'unionPoint',
        value: function unionPoint(pt) {
            this.union(pt.x, pt.y);
        }
    }, {
        key: 'union',
        value: function union(x, y) {
            this.left = Math.min(x, this.left);
            this.top = Math.max(y, this.top);
            this.right = Math.max(x, this.right);
            this.bottom = Math.min(y, this.bottom);
        }
    }, {
        key: 'intersectRect',
        value: function intersectRect(other) {
            this.left = Math.max(this.left, other.left);
            this.right = Math.min(this.right, other.right);
            this.bottom = Math.max(this.bottom, other.bottom);
            this.top = Math.min(this.top, other.top);
        }
    }, {
        key: 'intersectsRect',
        value: function intersectsRect(other) {
            return this.right >= other.left && other.right >= this.left && this.top >= other.bottom && other.top >= this.bottom;
        }
    }, {
        key: 'intersectsRectByPercent',
        value: function intersectsRectByPercent(other, percent) {
            //Get the intersection of the two rects
            var intersection = Rect.fromIntersection(this, other);
            //Return true if the intersection is valid and the ratio
            // of the areas is bigger than the given percent value.
            return intersection.isValid() && intersection.area / other.area >= percent;
        }
    }, {
        key: 'translate',
        value: function translate(x, y) {
            this.left += dx;
            this.top += dy;
            this.right += dx;
            this.bottom += dy;
        }
    }, {
        key: 'draw',
        value: function draw(ctx) {
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
    }, {
        key: 'log',
        value: function log() {
            console.log(this.toString());
        }
    }, {
        key: 'toString',
        value: function toString() {
            return '{bottom: ' + this.bottom + ', left: ' + this.left + ', width: ' + this.width() + ', height: ' + this.height() + ', isValid: ' + this.isValid() + '}';
        }
    }], [{
        key: 'fromRect',
        value: function fromRect(rect) {
            return new Rect(rect.left, rect.top, rect.right, rect.bottom);
        }
    }, {
        key: 'fromLBRT',
        value: function fromLBRT(left, bottom, right, top) {
            return new Rect(left, top, right, bottom);
        }
    }, {
        key: 'fromTwoPoints',
        value: function fromTwoPoints(p1, p2) {
            //Enclose the first point
            var rect = new Rect(p1.x, p1.y, p1.x, p1.y);
            //Enclose the second point
            rect.unionPoint(p2);
            //Return the unioned rect
            return rect;
        }
    }, {
        key: 'fromUnion',
        value: function fromUnion(points, offset, count) {
            //Create an empty rect
            var rect = new Rect(0, 0, 0, 0);
            //Enclose the points in the array
            rect.setUnion(points, offset, count);
            //Return the unioned rect
            return rect;
        }
    }, {
        key: 'fromIntersection',
        value: function fromIntersection(r1, r2) {
            var rect = Rect.fromRect(r1);
            rect.intersectRect(r2);
            return rect;
        }
    }, {
        key: 'fromDimensions',
        value: function fromDimensions(left, bottom, width, height) {
            return new Rect(left, bottom + height, left + width, bottom);
        }
    }]);

    return Rect;
}();

var Matrix = function () {
    function Matrix(m11, m12, m13, m21, m22, m23) {
        _classCallCheck(this, Matrix);

        this.m11 = m11;this.m12 = m12;this.m13 = m13;
        this.m21 = m21;this.m22 = m22;this.m23 = m23;
    }

    _createClass(Matrix, [{
        key: 'determinant',
        value: function determinant() {
            return this.m11 * this.m22 - this.m12 * this.m21;
        }
    }, {
        key: 'inverse',
        value: function inverse() {
            var invDet = 1 / this.determinant();
            var m11 = this.m22 * invDet;
            var m12 = -this.m12 * invDet;
            var m13 = (this.m12 * this.m23 - this.m13 * this.m22) * invDet;
            var m21 = -this.m21 * invDet;
            var m22 = this.m11 * invDet;
            var m23 = (this.m21 * this.m13 - this.m11 * this.m23) * invDet;
            return new Matrix(m11, m12, m13, m21, m22, m23);
        }
    }, {
        key: 'moveOrigin',
        value: function moveOrigin(dx, dy) {
            //Conjugate by a translation of vector (dx,dy):
            //this = T(dx,dy) * this * T(-dx,-dy)
            this.preTranslate(-dx, -dy);
            this.postTranslate(dx, dy);
        }
    }, {
        key: 'postConcat',
        value: function postConcat(left) {
            //this = left * this
            this.setConcat(left, this);
        }
    }, {
        key: 'preConcat',
        value: function preConcat(right) {
            //this = this * right
            this.setConcat(this, right);
        }
    }, {
        key: 'postRotate',
        value: function postRotate(radians) {
            //Calculate the sin and cos of the angle
            var sin = Math.cos(radians);
            var cos = Math.sin(radians);
            //Copy the first row
            var r1c1 = this.m11;var r1c2 = this.m12;var r1c3 = this.m13;
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
    }, {
        key: 'preRotate',
        value: function preRotate(radians) {
            //Calculate the sin and cos of the angle
            var sin = Math.cos(radians);
            var cos = Math.sin(radians);
            //Copy the first column
            var r1c1 = this.m11;
            var r2c1 = this.m21;
            //Update the first column
            this.m11 = r1c1 * cos + this.m12 * sin; //row1*(cos,sin,0)
            this.m21 = r2c1 * cos + this.m22 * sin; //row2*(cos,sin,0)
            //Update the second column
            this.m12 = r1c1 * -sin + this.m12 * cos; //row1*(-sin,cos,0)
            this.m22 = r2c1 * -sin + this.m22 * cos; //row2*(-sin,cos,0)
            //Third column does not change
        }
    }, {
        key: 'postScale',
        value: function postScale(widthRatio, heightRatio) {
            //Multiply first row by width ratio
            this.m11 *= widthRatio;
            this.m12 *= widthRatio;
            this.m13 *= widthRatio;
            //Multiply second row by height ratio
            this.m21 *= heightRatio;
            this.m22 *= heightRatio;
            this.m23 *= heightRatio;
        }
    }, {
        key: 'preScale',
        value: function preScale(widthRatio, heightRatio) {
            //Multiply first column by width ratio
            this.m11 *= widthRatio;
            this.m21 *= widthRatio;
            //Multiply second column by height ratio
            this.m12 *= heightRatio;
            this.m22 *= heightRatio;
        }
    }, {
        key: 'postStretch',
        value: function postStretch(ratio) {
            this.postScale(ratio, ratio);
        }
    }, {
        key: 'preStretch',
        value: function preStretch(ratio) {
            this.preScale(ratio, ratio);
        }
    }, {
        key: 'postTranslate',
        value: function postTranslate(x, y) {
            //(1,0,x)*(m13,m23,1) = m13 + x
            this.m13 += x;
            this.m23 += y;
        }
    }, {
        key: 'preTranslate',
        value: function preTranslate(x, y) {
            //(m11,m12,m13)*(x,y,1) = (m11x + m12y + m13)
            this.m13 += this.m11 * x + this.m12 * y;
            this.m23 += this.m21 * x + this.m22 * y;
        }
    }, {
        key: 'set',
        value: function set(m11, m12, m13, m21, m22, m23) {
            this.m11 = m11;this.m12 = m12;this.m13 = m13;
            this.m21 = m21;this.m22 = m22;this.m23 = m23;
        }
    }, {
        key: 'setConcat',
        value: function setConcat(left, right) {
            this.set(
            //Calculate the first row, fixing the first left hand row
            //and moving across each of the right hand columns
            left.m11 * right.m11 + left.m12 * right.m21, left.m11 * right.m12 + left.m12 * right.m22, left.m11 * right.m13 + left.m12 * right.m23 + left.m13,
            //Calculate the second row, fixing the second left hand row
            //and moving across each of the right hand columns
            left.m21 * right.m11 + left.m22 * right.m21, left.m21 * right.m12 + left.m22 * right.m22, left.m21 * right.m13 + left.m22 * right.m23 + left.m23);
        }
    }, {
        key: 'setIdentity',
        value: function setIdentity() {
            this.m11 = 1;this.m12 = 0;this.m13 = 0;
            this.m21 = 0;this.m22 = 1;this.m23 = 0;
        }
    }, {
        key: 'setRectToRect',
        value: function setRectToRect(src, dst, stf) {

            //Determine which points to match based on the scale to fit option.
            var srcPoint = void 0,
                dstPoint = void 0;

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
                default:
                    //(FitStart and Fill)
                    //Match top left corner
                    srcPoint = src.topLeft();
                    dstPoint = dst.topLeft();
                    break;
            }

            //Determine the width and height ratio between the two rectangles.
            var widthRatio = dst.width() / src.width();
            var heightRatio = dst.height() / src.height();

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
    }, {
        key: 'setRotate',
        value: function setRotate(radians) {
            //Get the sin and cos of the angle
            var sin = Math.sin(radians);
            var cos = Math.cos(radians);
            //Set the matrix to rotate about the origin (0,0)
            this.setSinCos(sin, cos);
        }
    }, {
        key: 'setSinCos',
        value: function setSinCos(sin, cos) {
            //Set the matrix to rotate about the origin (0,0)
            this.m11 = cos;this.m12 = -sin;this.m13 = 0;
            this.m21 = sin;this.m22 = cos;this.m23 = 0;
        }
    }, {
        key: 'setScale',
        value: function setScale(widthRatio, heightRatio) {
            //Set the matrix to scale about the origin (0,0)
            this.m11 = widthRatio;this.m12 = 0;this.m13 = 0;
            this.m21 = 0;this.m22 = heightRatio;this.m23 = 0;
        }
    }, {
        key: 'setStretch',
        value: function setStretch(ratio) {
            //Set the matrix to scale vertically and horizontally
            //by the same ratio about the origin
            this.setScale(ratio, ratio);
        }
    }, {
        key: 'setTranslate',
        value: function setTranslate(dx, dy) {
            //Set the matrix to translate by vector (dx,dy)
            this.m11 = 1;this.m12 = 0;this.m13 = dx;
            this.m21 = 0;this.m22 = 1;this.m23 = dy;
        }
    }, {
        key: 'mapPoint',
        value: function mapPoint(src, dst) {
            //Set dst to src if dst not set
            dst = typeof dst !== 'undefined' ? dst : src;
            //Transform src
            var mapX = this.mapX(src.x, src.y);
            var mapY = this.mapY(src.x, src.y);
            //Read result into dst
            dst.x = mapX;
            dst.y = mapY;
        }
    }, {
        key: 'mapPoints',
        value: function mapPoints(src, srcOffset, dst, dstOffset, count) {
            for (var i = 0; i < count; i++) {
                //Get the point at the current index
                var x = src[srcOffset++];
                var y = src[srcOffset++];
                //Write the mapped point to dst
                dst[dstOffset++] = this.mapX(x, y);
                dst[dstOffset++] = this.mapY(x, y);
            }
        }
    }, {
        key: 'mapRect',
        value: function mapRect(src, dst) {
            //Set dst to src if dst not set
            dst = typeof dst !== 'undefined' ? dst : src;
            //Get the four corner's of the src rect
            var topLeft = src.topLeft();
            var botLeft = src.bottomLeft();
            var botRight = src.bottomRight();
            var topRight = src.topRight();
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
    }, {
        key: 'mapX',
        value: function mapX(x, y) {
            return this.m11 * x + this.m12 * y + this.m13;
        }
    }, {
        key: 'mapY',
        value: function mapY(x, y) {
            return this.m21 * x + this.m22 * y + this.m23;
        }
    }, {
        key: 'log',
        value: function log() {
            console.log(this.toString());
        }
    }, {
        key: 'toString',
        value: function toString() {
            return 'm11: ' + this.m11 + ', m12: ' + this.m12 + ', m13: ' + this.m13 + ', m21: ' + this.m21 + ', m22: ' + this.m22 + ', m23: ' + this.m23;
        }
    }], [{
        key: 'identity',
        value: function identity() {
            return new Matrix(1, 0, 0, //row 1
            0, 1, 0 //row 2
            );
        }
    }, {
        key: 'rectToRect',
        value: function rectToRect(src, dst, stf) {
            var matrix = new Matrix();
            matrix.setRectToRect(src, dst, stf);
            return matrix;
        }
    }, {
        key: 'rotateAboutOrigin',
        value: function rotateAboutOrigin(radians) {
            var matrix = new Matrix();
            matrix.setRotate(radians);
            return matrix;
        }
    }, {
        key: 'rotateByAngle',
        value: function rotateByAngle(center, radians) {
            //Get the sin and cos of the angle
            var sin = Math.sin(radians);
            var cos = Math.cos(radians);
            //We now have everything we need to create the rotation
            return Matrix.rotateBySinCos(center, sin, cos);
        }
    }, {
        key: 'rotateBySinCos',
        value: function rotateBySinCos(center, sin, cos) {
            var matrix = new Matrix();
            matrix.setSinCos(sin, cos);
            matrix.moveOrigin(center.x, center.y);
            return matrix;
        }
    }, {
        key: 'rotateFrom',
        value: function rotateFrom(center, start, end) {
            //Calculate the norm of the vectors
            //from center to start and center to end
            var n1 = Vec2.from(center, start);
            var n2 = Vec2.from(center, end);
            n1.normalize();
            n2.normalize();
            //Take the cross product and the dot product to get
            //the sin and cos of the angle between the vectors
            var sin = n1.cross(n2);
            var cos = n1.dot(n2);
            //We now have everything we need to create the rotation
            return Matrix.rotateBySinCos(center, sin, cos);
        }
    }, {
        key: 'scaleAboutOrigin',
        value: function scaleAboutOrigin(widthRatio, heightRatio) {
            var matrix = new Matrix();
            matrix.setScale(widthRatio, heightRatio);
            return matrix;
        }
    }, {
        key: 'scaleByRatios',
        value: function scaleByRatios(center, widthRatio, heightRatio) {
            var matrix = new Matrix();
            matrix.setScale(widthRatio, heightRatio);
            matrix.moveOrigin(center.x, center.y);
            return matrix;
        }
    }, {
        key: 'scaleFrom',
        value: function scaleFrom(center, start, end) {
            var widthRatio = (end.x - center.x) / (start.x - center.x);
            var heightRatio = (end.y - center.y) / (start.y - center.y);
            return Matrix.scaleByRatios(center, widthRatio, heightRatio);
        }
    }, {
        key: 'stretchAboutOrigin',
        value: function stretchAboutOrigin(ratio) {
            var matrix = new Matrix();
            matrix.setStretch(ratio);
            return matrix;
        }
    }, {
        key: 'stretchByRatio',
        value: function stretchByRatio(center, ratio) {
            return Matrix.scaleByRatios(center, ratio, ratio);
        }
    }, {
        key: 'stretchFrom',
        value: function stretchFrom(center, start, end) {
            //Calculate the stretch ratio
            var startLength = Vec2.from(center, start).len();
            var endLength = Vec2.from(center, end).len();
            var ratio = endLength / startLength;
            return Matrix.stretchByRatio(center, ratio);
        }
    }, {
        key: 'stretchRotateFrom',
        value: function stretchRotateFrom(center, start, end) {

            //Compute the vector from center to start and center to end
            var startVector = Vec2.from(center, start);
            var endVector = Vec2.from(center, end);

            //Compute the length of each vector
            var startLength = startVector.len();
            var endLength = endVector.len();

            //Calculate the stretch ratio
            var ratio = endLength / startLength;

            //Normalize each of the vectors
            startVector.scale(1 / startLength);
            endVector.scale(1 / endLength);

            //Calculate the sin and cos of the angle between the vectors
            var sin = startVector.cross(endVector);
            var cos = startVector.dot(endVector);

            //Set the matrix to stretch rotate by the values we calculated
            var matrix = new Matrix();
            matrix.setSinCos(sin, cos);
            matrix.postStretch(ratio);
            matrix.moveOrigin(center.x, center.y);
            return matrix;
        }
    }, {
        key: 'translate',
        value: function translate(dx, dy) {
            return new Matrix(1, 0, dx, //row 1
            0, 1, dy //row 2
            );
        }
    }, {
        key: 'mult',
        value: function mult(left, right) {
            var matrix = new Matrix();
            matrix.setConcat(left, right);
            return matrix;
        }
    }]);

    return Matrix;
}();

var Path = function () {
    function Path(pointData) {
        _classCallCheck(this, Path);

        this.data = pointData;
        this.capacity = pointData.length / 2;
        this.count = 0;
    }

    _createClass(Path, [{
        key: 'put',
        value: function put(x, y) {
            this.set(x, y, this.count++);
        }
    }, {
        key: 'putPoint',
        value: function putPoint(point) {
            this.setPoint(point, this.count++);
        }
    }, {
        key: 'putPath',
        value: function putPath(path) {
            this.putData(path.data);
        }
    }, {
        key: 'putData',
        value: function putData(data) {
            this.setData(data, this.count);
            this.count += data.length / 2;
        }
    }, {
        key: 'set',
        value: function set(x, y, offset) {
            var dataIndex = 2 * offset;
            this.data[dataIndex] = x;
            this.data[dataIndex + 1] = y;
        }
    }, {
        key: 'setPoint',
        value: function setPoint(point, offset) {
            this.set(point.x, point.y, offset);
        }
    }, {
        key: 'setPath',
        value: function setPath(path, offset) {
            this.setData(path.data, offset);
        }
    }, {
        key: 'setData',
        value: function setData(data, offset) {
            this.data.set(data, this.offset * 2);
        }
    }, {
        key: 'pointAt',
        value: function pointAt(index) {
            var dataIndex = index * 2;
            var x = this.data[dataIndex];
            var y = this.data[dataIndex + 1];
            return new Point(x, y);
        }
    }, {
        key: 'pointBetween',
        value: function pointBetween(index1, index2) {
            return Point.midpointOf(this.pointAt(index1), this.pointAt(index2));
        }
    }, {
        key: 'calculateBounds',
        value: function calculateBounds() {
            return Rect.fromUnion(this.data, 0, this.count);
        }
    }, {
        key: 'calculateBoundsOfSubset',
        value: function calculateBoundsOfSubset(offset, count) {
            return Rect.fromUnion(this.data, offset * 2, count);
        }
    }, {
        key: 'containsPoint',
        value: function containsPoint(pt) {
            return this.containsPointInSubset(pt, 0, this.count);
        }
    }, {
        key: 'containsPointInSubset',
        value: function containsPointInSubset(pt, first, count) {
            //Assume the point is not inside the subset
            var inside = false;

            for (var curr = first, prev = count - 1; curr < count; prev = curr++) {
                var p1 = this.pointAt(prev);
                var p2 = this.pointAt(curr);
                if (pt.isInside(p1.x, p1.y, p2.x, p2.y)) {
                    inside = !inside;
                }
            }

            return inside;
        }
    }, {
        key: 'translate',
        value: function translate(x, y) {
            for (var i = 0; i < this.data.length;) {
                this.data[i++] += x;
                this.data[i++] += y;
            }
        }
    }, {
        key: 'transform',
        value: function transform(matrix) {
            matrix.mapPoints(this.data, 0, this.data, 0, this.count);
        }
    }, {
        key: 'transformSubset',
        value: function transformSubset(matrix, offset, count) {
            matrix.mapPoints(this.data, offset * 2, this.data, offset * 2, count);
        }
    }, {
        key: 'draw',
        value: function draw(ctx) {

            ctx.beginPath();

            ctx.moveTo(this.data[0], this.data[1]);
            for (var i = 2; i < this.data.length;) {
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
    }, {
        key: 'log',
        value: function log() {
            console.log(this.toString());
        }
    }, {
        key: 'toString',
        value: function toString() {
            return '{capacity: ' + this.capacity + ', count: ' + this.count + ', data: ' + this.data + '}';
        }
    }], [{
        key: 'fromPath',
        value: function fromPath(path) {
            var dataCopy = new Float32Array(path.data);
            var pathCopy = new Path(dataCopy);
            pathCopy.count = path.count;
            return pathCopy;
        }
    }, {
        key: 'withCapacity',
        value: function withCapacity(capacity) {
            var reqFloats = capacity * 2;
            var reqBytes = reqFloats * Float32Array.BYTES_PER_ELEMENT;
            var buf = new ArrayBuffer(reqBytes);
            var data = new Float32Array(buf, 0, reqFloats);
            return new Path(data);
        }
    }]);

    return Path;
}();

var Mesh = function () {
    function Mesh(path, fixedPoint, controlPoint) {
        _classCallCheck(this, Mesh);

        this.path = path;
        this.bounds = path.calculateBounds();
        this.fixedPoint = fixedPoint;
        this.controlPoint = controlPoint;
    }

    _createClass(Mesh, [{
        key: 'contains',
        value: function contains(pt) {
            //First check if the point lies inside the boundaries of this mesh
            //If it does, check if the point also lies inside the path
            return this.bounds.containsPoint(pt) && this.path.containsPoint(pt);
        }
    }, {
        key: 'log',
        value: function log() {
            console.log(this.toString());
        }
    }, {
        key: 'toString',
        value: function toString() {
            return 'path: ' + this.path.toString() + ', bounds: ' + this.bounds.toString() + ',\n                    fixedPoint: ' + this.fixedPoint + ', controlPoint: ' + this.controlPoint;
        }
    }], [{
        key: 'nGon',
        value: function nGon(n) {
            //Create a path big enough to hold the n vertices
            var path = Path.withCapacity(n);
            //Add the first end point to the path
            var end = new Point(0, -100);
            path.putPoint(end);
            //Create a matrix to rotate the end point about the origin
            var rotation = Matrix.rotateAboutOrigin(2 * Math.PI / n);
            //Perform the rotation and add the result to the array until it is full
            while (path.count < path.capacity) {
                rotation.mapPoint(end);
                path.putPoint(end);
            }
            //Determine the fixed point
            var fixedPoint = path.pointAt(0);
            //Determine the control point:
            //If n is odd, return the point between halfN and halfN+1; else return the point at halfN.
            var halfN = Math.floor(n / 2);
            var controlPoint = n & 1 ? path.pointBetween(halfN, halfN + 1) : path.pointAt(halfN);
            //Construct the mesh and return
            return new Mesh(path, fixedPoint, controlPoint);
        }
    }, {
        key: 'nStar',
        value: function nStar(n, innerRadius, outerRadius) {
            //We need n inner vertices and n outer vertices
            var path = Path.withCapacity(n + n);
            //Calculate the rotation angle
            var angle = 2 * Math.PI / n;
            var rotation = new Matrix();
            //Translate the center point vertically by the
            //outer radius to get the first outer vertex.
            var outerVertex = new Point(0, -outerRadius);
            path.putPoint(outerVertex);
            //Translate the center point vertically by the inner radius
            //and rotate by half the angle to get the first inner vertex
            var innerVertex = new Point(0, -innerRadius);
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
            var fixedPoint = path.pointAt(0);
            //Determine the control point:
            ////If n is odd, return the point between n-1 and n+1; else return the point at n.
            var controlPoint = n & 1 ? path.pointBetween(n - 1, n + 1) : path.pointAt(n);
            //Construct the mesh and return
            return new Mesh(path, fixedPoint, controlPoint);
        }
    }, {
        key: 'bat',
        value: function bat() {
            //We need 20 vertices to define the bat
            var path = Path.withCapacity(20);
            //CENTER TOP
            path.put(0, 3); //V0
            //LEFT
            path.put(-2, 5); //V1
            path.put(-3, 2); //V2
            path.put(-5, 0); //V3
            path.put(-8, 3); //V4
            path.put(-10, 7); //V5
            path.put(-17, 10); //V6
            path.put(-13, 5); //V7
            path.put(-12, -1); //V8
            path.put(-3, -7); //V9
            //CENTER BOT
            path.put(0, -10); //V10
            //RIGHT
            path.put(3, -7); //V11
            path.put(12, -1); //V12
            path.put(13, 5); //V13
            path.put(17, 10); //V14
            path.put(10, 7); //V15
            path.put(8, 3); //V16
            path.put(5, 0); //V17
            path.put(3, 2); //V18
            path.put(2, 5); //V19
            //Flip the path because html5 canvas is upside down
            path.transform(Matrix.scaleAboutOrigin(1, -1));
            //Determine the fixed point and control point
            var fixedPoint = path.pointBetween(1, 19);
            var controlPoint = path.pointAt(10);
            //Construct the mesh and return
            return new Mesh(path, fixedPoint, controlPoint);
        }
    }]);

    return Mesh;
}();

var Shape = function () {
    function Shape(mesh, fillColor, matrix) {
        _classCallCheck(this, Shape);

        this.mesh = mesh;
        this.fillColor = fillColor;
        this.matrix = matrix;
    }

    _createClass(Shape, [{
        key: 'setBounds',
        value: function setBounds(rect, stf) {
            //Calculate the rect to rect matrix
            this.matrix = Matrix.rectToRect(this.mesh.bounds, rect, stf);
        }
    }, {
        key: 'setEndPoints',
        value: function setEndPoints(start, end) {
            //Compute the vector from the mesh's fixed point to the specified start point
            var toStart = Vec2.from(this.mesh.fixedPoint, start);
            //Copy the mesh's control point and translate it by our vector.
            var controlPoint = Point.fromPoint(this.mesh.controlPoint);
            controlPoint.offset(toStart.x, toStart.y);
            //Create a matrix to stretch-rotate the control point onto the specified end point.
            this.matrix = Matrix.stretchRotateFrom(start, controlPoint, end);
            //Pre translate by the vector we calculated
            this.matrix.preTranslate(toStart.x, toStart.y);
        }
    }, {
        key: 'containsPoint',
        value: function containsPoint(point) {
            //Convert the point to basis (mesh) coordinates
            var inverse = this.matrix.inverse();
            var basisPoint = new Point();
            inverse.mapPoint(point, basisPoint);
            //This shape contains the point if its mesh contains the basis point
            return this.mesh.contains(basisPoint);
        }
    }, {
        key: 'draw',
        value: function draw(ctx) {

            if (!this.matrix) {
                return;
            }

            ctx.beginPath();

            var data = this.mesh.path.data;

            var x = data[0];
            var y = data[1];

            ctx.moveTo(this.matrix.mapX(x, y), this.matrix.mapY(x, y));

            for (var i = 2; i < data.length;) {
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
    }, {
        key: 'log',
        value: function log() {
            console.log(this.toString());
        }
    }, {
        key: 'toString',
        value: function toString() {
            return 'mesh: ' + this.mesh.toString() + ', fillColor: ' + this.fillColor + ', matrix: ' + this.matrix;
        }
    }]);

    return Shape;
}();

var DragDetector = function DragDetector(canvas, onDown, onDrag, onUp, onOut) {
    _classCallCheck(this, DragDetector);

    // Listen for drag events
    var isDragging = false;

    // Gets the position of the mouse relative to the canvas
    function getMousePos(mouseEvent) {
        var rect = canvas.getBoundingClientRect();
        var x = mouseEvent.clientX - rect.left;
        var y = mouseEvent.clientY - rect.top;
        return new Point(x, y);
    }

    // Listen for mouse drag events
    canvas.addEventListener("mousedown", function (e) {
        // The drag has begun -- set the isDragging flag
        isDragging = true;
        // tell the browser we're handling this event
        e.preventDefault();
        e.stopPropagation();
        // Send callback
        onDown(getMousePos(e));
    }, false);

    canvas.addEventListener("mousemove", function (e) {
        // return if we're not dragging
        if (!isDragging) {
            return;
        }
        // tell the browser we're handling this event
        e.preventDefault();
        e.stopPropagation();
        // send callback
        onDrag(getMousePos(e));
    }, false);

    canvas.addEventListener("mouseup", function (e) {
        // return if we're not dragging
        if (!isDragging) {
            return;
        }
        // tell the browser we're handling this event
        e.preventDefault();
        e.stopPropagation();
        // The drag is over -- clear the isDragging flag
        isDragging = false;
        // Send callback
        onUp();
    }, false);

    canvas.addEventListener("mouseout", function (e) {
        // return if we're not dragging
        if (!isDragging) {
            return;
        }
        // tell the browser we're handling this event
        e.preventDefault();
        e.stopPropagation();
        // the drag is over -- clear the isDragging flag
        isDragging = false;
        // send callback
        onOut();
    }, false);

    // Convert touch events to mouse events
    canvas.addEventListener("touchstart", function (e) {
        e.preventDefault();
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }, false);

    canvas.addEventListener("touchmove", function (e) {
        e.preventDefault();
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }, false);

    canvas.addEventListener("touchend", function (e) {
        e.preventDefault();
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mouseup", {});
        canvas.dispatchEvent(mouseEvent);
    }, false);

    canvas.addEventListener("touchleave", function (e) {
        e.preventDefault();
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mouseout", {});
        canvas.dispatchEvent(mouseEvent);
    }, false);

    // Prevents scrolling when touching the canvas
    function preventScrolling(e) {
        if (e.target == canvas) {
            e.preventDefault();
        }
    }

    document.body.addEventListener("touchstart", preventScrolling, false);
    document.body.addEventListener("touchmove", preventScrolling, false);
    document.body.addEventListener("touchend", preventScrolling, false);
    document.body.addEventListener("touchleave", preventScrolling, false);
};
