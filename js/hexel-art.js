'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Declare Program constants
var VERTICES_PER_HEX = 6;

/**
 * @enum
 */
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
        key: 'normalize',
        value: function normalize() {
            this.divScalar(this.len());
        }
    }, {
        key: 'mulScalar',
        value: function mulScalar(scalar) {
            this.x *= scalar;
            this.y *= scalar;
        }
    }, {
        key: 'divScalar',
        value: function divScalar(scalar) {
            this.x /= scalar;
            this.y /= scalar;
        }
    }, {
        key: 'add',
        value: function add(other) {
            this.x += other.x;
            this.y += other.y;
        }
    }, {
        key: 'subtract',
        value: function subtract(other) {
            this.x -= other.x;
            this.y -= other.y;
        }
    }, {
        key: 'multiply',
        value: function multiply(other) {
            this.x *= other.x;
            this.y *= other.y;
        }
    }, {
        key: 'divide',
        value: function divide(other) {
            this.x /= other.x;
            this.y /= other.y;
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
            return '{x: ' + this.x + ', y: ' + this.y + ' len: ' + this.len() + '}';
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
        key: 'setLTRB',
        value: function setLTRB(left, top, right, bottom) {
            this.left = left;
            this.top = top;
            this.right = right;
            this.bottom = bottom;
        }
    }, {
        key: 'setLBRT',
        value: function setLBRT(left, bottom, right, top) {
            this.left = left;
            this.top = top;
            this.right = right;
            this.bottom = bottom;
        }
    }, {
        key: 'setLRBT',
        value: function setLRBT(left, right, bottom, top) {
            this.left = left;
            this.top = top;
            this.right = right;
            this.bottom = bottom;
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
        key: 'offset',
        value: function offset(dx, dy) {
            this.left += dx;
            this.top += dy;
            this.right += dx;
            this.bottom += dy;
        }
    }, {
        key: 'inset',
        value: function inset(dx, dy) {
            this.left += dx;
            this.top -= dy;
            this.right -= dx;
            this.bottom += dy;
        }
    }, {
        key: 'mulScalar',
        value: function mulScalar(scalar) {
            this.left *= scalar;
            this.top *= scalar;
            this.right *= scalar;
            this.bottom *= scalar;
        }
    }, {
        key: 'divScalar',
        value: function divScalar(scalar) {
            this.left /= scalar;
            this.top /= scalar;
            this.right /= scalar;
            this.bottom /= scalar;
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
        key: 'fromLRBT',
        value: function fromLRBT(left, right, bottom, top) {
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

var Color = function () {
    function Color(r, g, b) {
        _classCallCheck(this, Color);

        this.r = r;
        this.g = g;
        this.b = b;
    }

    _createClass(Color, [{
        key: 'setRGB',
        value: function setRGB(r, g, b) {
            this.r = r;
            this.g = g;
            this.b = b;
        }
    }, {
        key: 'setColor',
        value: function setColor(other) {
            this.r = other.r;
            this.g = other.g;
            this.b = other.b;
        }
    }, {
        key: 'setHex',
        value: function setHex(hex) {
            // 0x(RRRRRRRR)(GGGGGGGG)(BBBBBBBB) (24 bits)
            this.r = hex >> 16 & 0xff;
            this.g = hex >> 8 & 0xff;
            this.b = hex >> 0 & 0xff;
        }
    }, {
        key: 'setHexString',
        value: function setHexString(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            this.r = parseInt(result[1], 16);
            this.g = parseInt(result[2], 16);
            this.b = parseInt(result[3], 16);
        }
    }, {
        key: 'setRandom',
        value: function setRandom() {
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

    }, {
        key: 'equals',
        value: function equals(other) {
            return this.r === other.r && this.g === other.g && this.b === other.b;
        }
    }, {
        key: 'toHex',
        value: function toHex() {
            // 0x(RRRRRRRR)(GGGGGGGG)(BBBBBBBB) (4 bytes, 32 bits)
            return this.r << 16 | this.g << 8 | this.b;
        }
    }, {
        key: 'toHexString',
        value: function toHexString() {
            // 1(RR)(GG)(BB)
            var hexString = (1 << 24 | this.toHex()).toString(16);
            // #(RR)(GG)(BB)
            return '#' + hexString.slice(1);
        }
    }, {
        key: 'toString',
        value: function toString() {
            return '{r: ' + this.r + ', g: ' + this.g + ', b: ' + this.b + '}';
        }
    }], [{
        key: 'fromHex',
        value: function fromHex(hex) {
            var color = new Color();
            color.setHex(hex);
            return color;
        }
    }, {
        key: 'fromHexString',
        value: function fromHexString(hex) {
            var color = new Color();
            color.setHexString(hex);
            return color;
        }
    }, {
        key: 'random',
        value: function random() {
            var color = new Color();
            color.setRandom();
            return color;
        }
    }]);

    return Color;
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
            startVector.mulScalar(1 / startLength);
            endVector.mulScalar(1 / endLength);

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
    }, {
        key: 'heart',
        value: function heart() {
            //We need 10 vertices to define the heart
            var path = Path.withCapacity(10);
            //CENTER TOP
            path.put(0, 12); //V0
            //LEFT
            path.put(-3, 16); //V1
            path.put(-5, 16); //V2
            path.put(-8, 12); //V3
            path.put(-8, 8); //V4
            //CENTER BOT
            path.put(0, 0); //V5
            //RIGHT
            path.put(8, 8); //V6
            path.put(8, 12); //V7
            path.put(5, 16); //V8
            path.put(3, 16); //V9
            //Determine the fixed point and control point
            var fixedPoint = path.pointBetween(1, 9);
            var controlPoint = path.pointAt(5);
            //Construct the mesh and return
            return new Mesh(path, fixedPoint, controlPoint);
        }
    }, {
        key: 'flower',
        value: function flower() {
            //We need 20 vertices to define the flower
            var path = Path.withCapacity(20);
            path.put(0, -2); //V0
            path.put(-1, -1); //V1
            path.put(-2, -1); //V2
            path.put(-2, -2); //V3
            path.put(-3, -3); //V4
            path.put(-1, -3); //V5
            path.put(-2, -4); //V6
            path.put(-2, -5); //V7
            path.put(-1, -5); //V8
            path.put(0, -6); //V9
            path.put(0, -4); //V10
            path.put(1, -5); //V11
            path.put(2, -5); //V12
            path.put(2, -4); //V13
            path.put(3, -3); //V14
            path.put(1, -3); //V15
            path.put(2, -2); //V16
            path.put(2, -1); //V17
            path.put(1, -1); //V18
            path.put(0, 0); //V19
            //Determine the fixed point and control point
            var fixedPoint = path.pointAt(19);
            var controlPoint = path.pointAt(9);
            //Construct the mesh and return
            return new Mesh(path, fixedPoint, controlPoint);
        }
    }]);

    return Mesh;
}();

var Shape = function () {
    function Shape(mesh) {
        _classCallCheck(this, Shape);

        this.mesh = mesh;
        this.matrix = Matrix.identity();
        this.inverse = Matrix.identity();
    }

    _createClass(Shape, [{
        key: 'setBounds',
        value: function setBounds(rect, stf) {
            // Calculate the rect to rect matrix
            this.matrix.setRectToRect(this.mesh.bounds, rect, stf);
            // Update the inverse matrix
            this.inverse.setRectToRect(rect, this.mesh.bounds, stf);
        }
    }, {
        key: 'setEndPoints',
        value: function setEndPoints(start, end) {
            //Compute the vector from the mesh's fixed point to the specified start point
            var toStart = Vec2.from(this.mesh.fixedPoint, start);
            //Copy the mesh's control point and translate it by our vector.
            var controlPoint = Point.fromPoint(this.mesh.controlPoint);
            controlPoint.offset(toStart.x, toStart.y);
            // Create a matrix to stretch-rotate the control point onto the specified end point.
            this.matrix = Matrix.stretchRotateFrom(start, controlPoint, end);
            // Pre translate by the vector we calculated
            this.matrix.preTranslate(toStart.x, toStart.y);
            // Update the inverse matrix
            this.inverse = this.matrix.inverse();
        }
    }, {
        key: 'containsPoint',
        value: function containsPoint(point) {
            //Convert the point to basis (mesh) coordinates
            var basisPoint = new Point();
            this.inverse.mapPoint(point, basisPoint);
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

var DragDetector = function () {
    function DragDetector(canvas, onDown, onDrag, onUp, onOut) {
        _classCallCheck(this, DragDetector);

        // Listen for drag events
        var isDragging = false;

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
            if (!isDragging) {
                return;
            }
            // tell the browser we're handling this event
            e.preventDefault();
            e.stopPropagation();
            // send callback
            onDrag(e);
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
            onUp(e);
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
            if (!isDragging) {
                return;
            }
            // tell the browser we're handling this event
            e.preventDefault();
            e.stopPropagation();
            // send callback
            onDrag(e.touches[0]);
        }, false);
        canvas.addEventListener("touchend", function (e) {
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
            onUp(e.touches[0]);
        }, false);
        canvas.addEventListener("touchleave", function (e) {
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
            onOut(e.touches[0]);
        }, false);
    }

    // Gets the position of the touch relative to the canvas


    _createClass(DragDetector, null, [{
        key: 'getTouchPos',
        value: function getTouchPos(touchEvent, dst) {
            return this.getMousePos(touchEvent.touches[0], dst);
        }

        // Gets the position of the mouse relative to the canvas

    }, {
        key: 'getMousePos',
        value: function getMousePos(mouseEvent, dst) {
            var p = dst || new Point();

            if (mouseEvent.offsetX) {
                p.x = mouseEvent.offsetX;
                p.y = mouseEvent.offsetY;
            } else if (mouseEvent.layerX) {
                p.x = mouseEvent.layerX;
                p.y = mouseEvent.layerY;
            } else {
                var rect = canvas.getBoundingClientRect();
                p.x = mouseEvent.clientX - rect.left;
                p.y = mouseEvent.clientY - rect.top;
            }

            return p;
        }
    }]);

    return DragDetector;
}();

/**
 * Holds cubic coordinates (q,r,s). Note that in a hexagonal grid, q+r+s = 0.
 * @class
 * @property {number} q - The q coordinate of this cube.
 * @property {number} r - The r coordinate of this cube.
 * @property {number} s - The s coordinate of this cube.
 */


var Cube = function () {

    /**
     * @param {number} q - Value of the Q axis.
     * @param {number} r - Value of the R axis.
     * @param {number} [s=-q-r] s - Value of the S axis.
     */
    function Cube(q, r, s) {
        _classCallCheck(this, Cube);

        this.q = q;
        this.r = r;
        this.s = s || -q - r;
    }

    /**
     * Creates a new cube with the same values as the other cube.
     * @param {Cube} other - The cube to copy.
     * @returns {Cube} a copy of the other cube.
     */


    _createClass(Cube, [{
        key: 'round',


        /**
         * Rounds the (q,r,s) values of this cube.
         */
        value: function round() {

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
            if (q_diff > r_diff && q_diff > s_diff) this.q = -this.r - this.s;else if (r_diff > s_diff) this.r = -this.q - this.s;else this.s = -this.q - this.r;
        }

        /**
         * Adds the coordinates of the other cube to this cube.
         * @param {Cube} other - The cube to add.
         */

    }, {
        key: 'add',
        value: function add(other) {
            this.q += other.q;
            this.r += other.r;
            this.s += other.s;
        }

        /**
         * Subtracts the coordinates of the other cube from this cube.
         * @param {Cube} other - The cube to subtract.
         */

    }, {
        key: 'subtract',
        value: function subtract(other) {
            this.q -= other.q;
            this.r -= other.r;
            this.s -= other.s;
        }

        /**
         * Computes the distance between this cube and the other cube.
         * @returns {Number} the number of cubes that must be traversed in order to reach the other cube.
         */

    }, {
        key: 'distanceTo',
        value: function distanceTo(other) {
            return Math.max(Math.abs(this.q - other.q), Math.abs(this.r - other.r), Math.abs(this.s - other.s));
        }

        /**
         * Computes the distance from this cube to the origin.
         * @returns {Number} the number of cubes that must be traversed in order to reach the origin.
         */

    }, {
        key: 'distanceToOrigin',
        value: function distanceToOrigin() {
            return Math.max(Math.abs(this.q), Math.abs(this.r), Math.abs(this.s));
        }

        /**
         * Finds each of the cubes neighboring this cube.
         * @returns {Cube[]} the six neighboring cubes.
         */

    }, {
        key: 'neighbors',
        value: function neighbors() {
            var nbrs = [];
            for (var i = 0; i < Directions.length; i++) {
                nbrs.push(this.neighbor(Directions[i]));
            }
            return nbrs;
        }

        /**
         * Finds a cube neighboring this cube.
         * @param {Directions} dir - the direction of the neighbor with respect to this cube.
         * @returns {Cube} the neighboring cube.
         */

    }, {
        key: 'neighbor',
        value: function neighbor(dir) {
            var nbr = Cube.fromCube(this);
            nbr.add(dir);
            return nbr;
        }

        /**
         * Checks if two cubes have the same (q,r,s) coordinates.
         * @param {Cube} other - The object to compare to.
         * @returns {boolean} true if the coordinates are equal.
         */

    }, {
        key: 'equals',
        value: function equals(other) {
            return this.q === other.q && this.r === other.r && this.s === other.s;
        }
    }], [{
        key: 'fromCube',
        value: function fromCube(other) {
            return new Cube(other.q, other.r, other.s);
        }
    }]);

    return Cube;
}();

;

/**
 * The six possible directions on a hexagon grid.
 */
var Directions = [new Cube(1, -1, 0), new Cube(1, 0, -1), new Cube(0, 1, -1), new Cube(-1, 1, 0), new Cube(-1, 0, 1), new Cube(0, -1, 1)];

/**
 * Holds hexagon position and attribute data.
 * @class
 * @property {Cube} position - The position of this hexagon in cubic coordinates.
 * @param {Point} center - The center of this hexagon in clip space.
 * @property {number} color - The color of this hexagon in hexadecimal (0xRRGGBB).
 */

var Hex = function () {

    /**
     * @param {Cube} position - The position of the hexagon in cubic coordinates.
     * @param {Point} center - The center of the hexagon in clip space.
     * @param {number} color - The color of the hexagon in hexadecimal (0xRRGGBB).
     */
    function Hex(position, center, color) {
        _classCallCheck(this, Hex);

        this.position = position;
        this.center = center;
        this.color = color;
    }

    /**
     * Checks if two hexagons have the same position and color.
     * @param {Hex} other - The object to compare to.
     * @returns {boolean} true if the hexagons are equal.
     */


    _createClass(Hex, [{
        key: 'equals',
        value: function equals(other) {
            return this.color === other.color && this.position.equals(other.position);
        }
    }]);

    return Hex;
}();

;

/**
 * The orientation of hexagons in a layout.
 * @enum {number}
 */
var Orientation = {
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

var Grid = function () {

    /**
     * @param {Orientation} [orientation=Orientation.FlatTop] orientation - The orientation of the hexagons on this grid.
     */
    function Grid(orientation) {
        _classCallCheck(this, Grid);

        this.coordinates = [];
        this.orientation = orientation;
    }

    /**
     * Finds the index of a hexagon on this grid with the specified cubic coordinates
     * @param {Cube} c - The cubic coordinates of the hexagon to search for.
     * @returns {Number} The index of the hexagon on this grid, or -1 if none exists.
     */


    _createClass(Grid, [{
        key: 'indexOf',
        value: function indexOf(c) {
            // Note: inefficient algorithm. Override if possible.
            for (var i = 0; i < this.coordinates.length; i++) {
                if (this.coordinates[i].equals(c)) return i;
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

    }, {
        key: 'measureWidth',
        value: function measureWidth(hexWidth, hexHeight) {
            // Abstract method: implement in subclass
            return 0;
        }

        /**
         * Measures the height of this grid given the width and height of each hexagon.
         * @param {Number} hexWidth - The width of each hexagon.
         * @param {Number} hexHeight - The height of each hexagon.
         * @returns {Number} The height of this grid.
         */

    }, {
        key: 'measureWidth',
        value: function measureWidth(hexWidth, hexHeight) {
            // Abstract method: implement in subclass
            return 0;
        }
    }]);

    return Grid;
}();

;

/*
 * Rectangular hexagonal grid.
 * @class
 * @property rows - The number of rows of hexagons on this grid.
 * @property cols - The number of columns of hexagons on this grid.
 */

var RectangleGrid = function (_Grid) {
    _inherits(RectangleGrid, _Grid);

    function RectangleGrid(orientation, rows, cols) {
        _classCallCheck(this, RectangleGrid);

        var _this = _possibleConstructorReturn(this, (RectangleGrid.__proto__ || Object.getPrototypeOf(RectangleGrid)).call(this, orientation));

        _this.rows = rows;
        _this.cols = cols;

        if (_this.orientation === Orientation.FlatTop) {
            // Flat top rectangular grid:
            for (var q = 0; q < cols; q++) {
                var q_offset = q >> 1; // or Math.floor(q/2)
                for (var r = -q_offset; r < rows - q_offset; r++) {
                    _this.coordinates.push(new Cube(q, r));
                }
            }
        } else {
            //Pointy top rectangular grid:
            for (var _r = 0; _r < rows; _r++) {
                var r_offset = _r >> 1; // or Math.floor(r/2)
                for (var _q = -r_offset; _q < cols - r_offset; _q++) {
                    _this.coordinates.push(new Cube(_q, _r));
                }
            }
        }

        return _this;
    }

    _createClass(RectangleGrid, [{
        key: 'indexOf',
        value: function indexOf(c) {
            // Since this is a rectangular grid,
            // we can compute the index directly.
            var index = void 0;
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
    }, {
        key: 'measureWidth',
        value: function measureWidth(layout) {
            if (this.orientation === Orientation.FlatTop) {
                return layout.hexWidth * (0.75 * this.cols + 0.25);
            } else {
                return layout.hexWidth * (this.cols + 0.5);
            }
        }
    }, {
        key: 'measureHeight',
        value: function measureHeight(layout) {
            if (this.orientation === Orientation.FlatTop) {
                return layout.hexHeight * (this.rows + 0.5);
            } else {
                return layout.hexHeight * (0.75 * this.rows + 0.25);
            }
        }
    }]);

    return RectangleGrid;
}(Grid);

;

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

var Layout = function () {

    /**
     * @param {Grid} grid - The grid of hexagons to be used.
     * @param {Number} [hexSize=1] hexSize - The length of the flat side of each hexagon.
     */
    function Layout(grid, hexSize) {
        _classCallCheck(this, Layout);

        this.grid = grid;
        this.hexSize = hexSize || 1;

        // Compute the dimensions of each hexagon
        if (grid.orientation === Orientation.FlatTop) {
            this.hexWidth = this.hexSize * 2;
            this.hexHeight = this.hexSize * Math.sqrt(3);
            this.hexRight = (this.hexWidth - this.hexSize) / 2;
            this.hexUp = this.hexHeight / 2;
        } else {
            this.hexHeight = this.hexSize * 2;
            this.hexWidth = this.hexSize * Math.sqrt(3);
            this.hexRight = this.hexWidth / 2;
            this.hexUp = (this.hexHeight - this.hexSize) / 2;
        }

        // Compute the width and height of each quadrant of the layout
        this.width = grid.measureWidth(this);
        this.height = grid.measureHeight(this);

        var quadrantWidth = this.width / 2;
        var quadrantHeight = this.height / 2;

        // Set the boundaries of the layout, centered at (0,0).
        this.bounds = Rect.fromLRBT(-quadrantWidth, quadrantWidth, -quadrantHeight, quadrantHeight);

        // Create a hexagon object for each of the coordinates on the grid
        this.hexes = [];
        for (var i = 0; i < grid.coordinates.length; i++) {
            var position = grid.coordinates[i];
            var center = this.findBottomLeftOfHexAt(position);
            center.x += this.hexWidth / 2;
            center.y += this.hexHeight / 2;
            this.hexes.push(new Hex(position, center, -1));
        }

        //let n = this.hexes.length;
        var n = this.hexes.length;
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


    _createClass(Layout, [{
        key: 'generateVertices',
        value: function generateVertices(n) {
            // Init the vertex buffer
            var dst = twgl.primitives.createAugmentedTypedArray(2, VERTICES_PER_HEX * n);
            // Compute the vertices at each grid coordinate and add to buffer
            for (var i = 0; i < n; i++) {
                var coordinate = this.grid.coordinates[i];
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

    }, {
        key: 'generateIndices',
        value: function generateIndices(n) {
            // Init the index buffer
            var dst = twgl.primitives.createAugmentedTypedArray(1, 12 * n, Uint16Array);
            // Compute the indices for each hexagon and add to buffer
            for (var i = 0; i < n; i++) {
                var offset = i * VERTICES_PER_HEX;
                // 012 023 034 045, 678 689 6{10}{11}
                dst.push(offset, offset + 1, offset + 2, offset, offset + 2, offset + 3, offset, offset + 3, offset + 4, offset, offset + 4, offset + 5);
            }
            // Return the index buffer
            return dst;
        }

        /**
         * Generates the color data for n hexagons in this layout.
         * @param {Number} n the number of hexagons for which to generate color data.
         * @returns {twgl.primitives.AugmentedTypedArray} byte array containing the generated color data.
         */

    }, {
        key: 'generateColors',
        value: function generateColors(n) {
            // Init the color buffer
            var dst = twgl.primitives.createAugmentedTypedArray(3, VERTICES_PER_HEX * n, Uint8Array);
            // Compute the color for each hexagon and add to buffer
            for (var i = 0; i < n; i++) {
                for (var j = 0; j < VERTICES_PER_HEX; j++) {
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

    }, {
        key: 'generateHexVertices',
        value: function generateHexVertices(c, dst) {
            // TODO: work from center?
            // Find the bottom left corner (x,y) of the hexagon
            var botLeft = this.findBottomLeftOfHexAt(c),
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

    }, {
        key: 'findBottomLeftOfHexAt',
        value: function findBottomLeftOfHexAt(c) {

            var x = this.bounds.left,
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

    }, {
        key: 'clipToCube',
        value: function clipToCube(p) {

            var q = void 0,
                r = void 0;

            // Adjust point according to layout and hexagon origin
            var adjX = p.x - (this.hexWidth / 2 + this.bounds.left),
                adjY = p.y - (this.hexHeight / 2 + this.bounds.bottom);

            if (this.grid.orientation === Orientation.FlatTop) {
                // Flat top:
                q = adjX * 2 / 3 / this.hexSize;
                r = (-adjX / 3 + Math.sqrt(3) / 3 * adjY) / this.hexSize;
            } else {
                // Pointy top:
                q = (adjX * Math.sqrt(3) / 3 - adjY / 3) / this.hexSize;
                r = adjY * 2 / 3 / this.hexSize;
            }

            return new Cube(q, r);
        }

        /**
         * Find the index of the hexagon containing the specified point.
         * @param {Point} p - a point in clip space.
         * @returns {Number} the index, or -1 if not found.
         */

    }, {
        key: 'indexOfHexContaining',
        value: function indexOfHexContaining(p) {
            // Convert point to fractal cubic coordinates
            var cube = this.clipToCube(p);
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

    }, {
        key: 'getColorIndex',
        value: function getColorIndex(index) {
            return index * this.colors.numComponents * VERTICES_PER_HEX;
        }

        /*
         * Gets the color of the hexagon at the specified index.
         * @param {Number} index - the index of the hexagon in this layout.
         * @returns {Color} the hexagon color.
         */

    }, {
        key: 'getHexagonColor',
        value: function getHexagonColor(index) {
            // Get the color of the hexagon at the specified index
            var color = this.hexes[index].color;
            // Convert to color object and return
            return Color.fromHex(color);
        }

        /*
         * Sets the color of the hexagon at the specified index.
         * @param {Number} index - the index of the hexagon in this layout.
         * @param {Color} the new color for the hexagon.
         */

    }, {
        key: 'setHexagonColor',
        value: function setHexagonColor(index, color, changes) {
            // Get the hex at the current index
            var hex = this.hexes[index];
            // Get the previous hex color
            var oldColor = hex.color;
            // Convert the new color to hexadecimal
            var newColor = color.toHex();
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
                var offset = this.getColorIndex(index);
                // 2. Apply color gradient
                for (var d = 3; d < 6; d++) {
                    var dd = 2 * d * d;
                    this.colors[offset++] = Math.min(color.r + dd, 255);
                    this.colors[offset++] = Math.min(color.g + dd, 255);
                    this.colors[offset++] = Math.min(color.b + dd, 255);
                }
                for (var _d = 3; _d < 6; _d++) {
                    var _dd = 2 * _d * _d;
                    this.colors[offset++] = Math.max(color.r - _dd, 0);
                    this.colors[offset++] = Math.max(color.g - _dd, 0);
                    this.colors[offset++] = Math.max(color.b - _dd, 0);
                }
            }
        }
    }, {
        key: 'addLine',
        value: function addLine(start, end, radius, color, changes) {
            // Compute vector from start to end
            var vector = Cube.fromCube(end);
            vector.subtract(start);
            // Compute distance of vector
            var dist = vector.distanceToOrigin();
            // Map line onto grid
            var step = 1.0 / Math.max(dist, 1);
            for (var i = 0; i <= dist; i++) {
                var t = step * i;
                var c = new Cube();
                c.q = start.q + vector.q * t;
                c.r = start.r + vector.r * t;
                c.s = start.s + vector.s * t;
                c.round();
                // If the point is on the grid
                var index = this.grid.indexOf(c);
                if (index !== -1) {
                    this.fillRange(index, radius, color, changes);
                }
            }
        }
    }, {
        key: 'addRect',
        value: function addRect(rect, color, changes) {
            for (var i = 0; i < this.hexes.length; i++) {
                if (rect.containsPoint(this.hexes[i].center)) {
                    this.setHexagonColor(i, color, changes);
                }
            }
        }
    }, {
        key: 'addShape',
        value: function addShape(shape, color, changes) {
            for (var i = 0; i < this.hexes.length; i++) {
                if (shape.containsPoint(this.hexes[i].center)) {
                    this.setHexagonColor(i, color, changes);
                }
            }
        }
    }, {
        key: 'fillRange',
        value: function fillRange(centerIndex, radius, color, changes) {
            // Get the center of the hexagon
            var center = this.hexes[centerIndex].position;
            // Set color of center hexagon to parameter
            this.setHexagonColor(centerIndex, color, changes);
            // For all hexagons inside the horizontal radius
            for (var x = -radius; x <= radius; x++) {
                var lower = Math.max(-radius, -x - radius),
                    upper = Math.min(radius, -x + radius);
                // And also inside the vertical radius
                for (var y = lower; y <= upper; y++) {
                    var cube = new Cube(x, y);
                    cube.add(center);
                    var index = this.grid.indexOf(cube);
                    if (index !== -1) {
                        this.setHexagonColor(index, color, changes);
                    }
                }
            }
        }
    }, {
        key: 'eraseRange',
        value: function eraseRange(centerIndex, radius) {
            // Get the center of the hexagon
            var center = this.hexes[centerIndex].position;
            // Set color of center hexagon to parameter
            this.eraseHexagonColor(centerIndex);
            // For all hexagons inside the horizontal radius
            for (var x = -radius; x <= radius; x++) {
                var lower = Math.max(-radius, -x - radius),
                    upper = Math.min(radius, -x + radius);
                // And also inside the vertical radius
                for (var y = lower; y <= upper; y++) {
                    var cube = new Cube(x, y);
                    cube.add(center);
                    var index = this.grid.indexOf(cube);
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

    }, {
        key: 'eraseHexagonColor',
        value: function eraseHexagonColor(index) {
            // Set the color of the hexagon at the specified index to -1
            this.hexes[index].color = -1;
            // Compute the corresponding index in the color array
            var offset = this.getColorIndex(index);
            // Apply erase gradient
            for (var d = 0; d < VERTICES_PER_HEX; d++) {
                var dd = d * d;
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

    }, {
        key: 'floodFill',
        value: function floodFill(startIndex, newColor) {
            // Get the hexagon at the specified start index
            var start = this.hexes[startIndex];
            // Get the hexadecimal value of the old color and the new color
            var oldColorHex = start.color;
            var newColorHex = newColor.toHex();
            // If these are equal, we don't need to do anything
            if (oldColorHex === newColorHex) {
                return;
            }
            // Otherwise we begin the flood fill process by
            // setting the color of the start hexagon to the new color
            this.setHexagonColor(startIndex, newColor);
            // We'll keep a list of all the hexagons we've already checked
            var visited = new Set();
            // And queue (first in, first out) of all the hexagons we have yet to check
            var fringes = [];
            // Add the position of the starting hexagon to the queue
            fringes.push(start.position);
            // As long as we have more fringes to check
            while (fringes.length > 0) {
                // Pull the next from the queue
                var fringe = fringes.shift();
                // For each of the neighboring hexagons
                var neighbors = fringe.neighbors();
                for (var i = 0; i < neighbors.length; i++) {
                    var neighbor = neighbors[i];
                    // Find the index of the neighbor on the grid
                    var index = this.grid.indexOf(neighbor);
                    // If valid, and we haven't already checked it
                    if (index != -1 && !visited.has(index)) {
                        // Add to visited list so we don't have to check again
                        visited.add(index);
                        // Get the color of the corresponding hexagon
                        var _color = this.hexes[index].color;
                        // If it matches the color of our starting hexagon
                        if (_color === oldColorHex) {
                            // Change its color
                            this.setHexagonColor(index, newColor);
                            // Add to queue so we can check its neighbors
                            fringes.push(neighbor);
                        }
                    }
                }
            }
        }
    }, {
        key: 'reverseChanges',
        value: function reverseChanges(changes) {
            while (changes.positions.length > 0) {
                var position = changes.positions.pop();
                var _color2 = changes.colors.pop();
                if (_color2 === -1) {
                    this.eraseHexagonColor(position);
                } else {
                    this.setHexagonColor(position, Color.fromHex(_color2));
                }
            }
        }
    }]);

    return Layout;
}();

;

var Changes = function () {
    function Changes() {
        _classCallCheck(this, Changes);

        this.positions = [];
        this.colors = [];
    }

    _createClass(Changes, [{
        key: 'add',
        value: function add(position, color) {
            this.positions.push(position);
            this.colors.push(color);
        }
    }]);

    return Changes;
}();

/**
 * Defines the rectangular region of clip space to display on the screen.
 * @class
 * @property {Number} scale - The scale applied to the default projection region.
 * @property {Vec2} offset - The translational offset applied to the default projection region.
 * @property {Rect} default - The region displayed by this projection when scale = 1 and offset = (0,0).
 * @property {Rect} region - The region displayed by this projection after applying its scale and offset values.
 * @property {twgl.m4} matrix - The projection matrix.
 */


var Projection = function () {

    /**
     * Creates a projection initialized to {0, 0, 0, 0}.
     */
    function Projection() {
        _classCallCheck(this, Projection);

        this.scale = 1;
        this.offset = new Vec2(0, 0), this.default = new Rect(), this.region = new Rect(), this.matrix = twgl.m4.identity();
    }

    _createClass(Projection, [{
        key: 'applyChanges',
        value: function applyChanges() {
            // Reset projection region to default
            this.region.set(this.default);
            // Apply scale, fixing (0,0)
            this.region.divScalar(this.scale);
            // Apply translational offset
            this.region.offset(this.offset.x, this.offset.y);
            // Recalculate the projection matrix
            twgl.m4.ortho(this.region.left, this.region.right, this.region.bottom, this.region.top, 0.1, 10, this.matrix);
        }
    }]);

    return Projection;
}();

;

/*
 * Renders a layout onto a canvas through WebGL.
 * @class
 * @property gl - The WebGL context being used.
 * @property {Layout} layout - The layout being rendered.
 * @property {Projection} - The projection from the layout to the canvas.
 */

var Renderer = function () {

    /**
     * @param gl - The WebGL context to use for rendering.
     * @param {Layout} layout - the layout to render.
     */
    function Renderer(gl, layout) {
        _classCallCheck(this, Renderer);

        // Get the WebGL context and save a reference to the layout
        this.gl = gl;
        this.layout = layout;
        // Init the projection
        this.projection = new Projection();
    }

    /**
     * Called when the surface hosting this renderer is first created
     */


    _createClass(Renderer, [{
        key: 'onSurfaceCreated',
        value: function onSurfaceCreated() {
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

    }, {
        key: 'onSurfaceChanged',
        value: function onSurfaceChanged(width, height) {

            // Update the viewport to match the new dimensions of the drawing buffer
            this.gl.viewport(0, 0, width, height);

            // Set the default projection region to the bounds of the layout
            this.projection.default.set(this.layout.bounds);

            // Expand projection to match width/height ratio of viewport
            if (height > width) {
                // Portrait mode: expand projection vertically
                var ratio = height / width;
                this.projection.default.bottom = this.projection.default.left * ratio;
                this.projection.default.top = this.projection.default.right * ratio;
            } else {
                // Landscape mode: expand projection horizontally
                var _ratio = width / height;
                this.projection.default.left = this.projection.default.bottom * _ratio;
                this.projection.default.right = this.projection.default.top * _ratio;
            }

            // Apply the projection changes
            this.applyProjectionChanges();
        }
    }, {
        key: 'onDrawFrame',
        value: function onDrawFrame() {
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

            if(this.bufferInfo){
                twgl.drawBufferInfo(this.gl, this.bufferInfo);
            } else {
                console.log(this.bufferInfo);
            }

        }
    }, {
        key: 'applyColorChanges',
        value: function applyColorChanges() {
            twgl.setAttribInfoBufferFromArray(this.gl, this.bufferInfo.attribs.a_color, this.attribs.a_color);
            this.needToRender = true;
        }
    }, {
        key: 'applyProjectionChanges',
        value: function applyProjectionChanges() {
            this.projection.applyChanges();
            twgl.setUniforms(this.programInfo, this.uniforms);
            this.needToRender = true;
        }
    }]);

    return Renderer;
}();

;

/**
 * Listens for drag events, converts points from screen space
 * to clip space, and resizes the canvas to fill the viewport.
 * @class
 * @property {HTMLCanvasElement} canvas - The canvas being managed by this surface.
 * @property {Renderer} renderer - The surface renderer.
 */

var Surface = function () {

    /**
     * @param {HTMLCanvasElement} canvas - The canvas to manage.
     * @param {Renderer} renderer - The surface renderer.
     */
    function Surface(canvas, renderer) {
        _classCallCheck(this, Surface);

        // Save a handle to the canvas and the layout
        this.canvas = canvas;
        this.renderer = renderer;

        // Get the width and height of the canvas
        var width = this.canvas.clientWidth,
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


    _createClass(Surface, [{
        key: 'requestRender',
        value: function requestRender() {
            this.renderer.needToRender = true;
        }

        /**
         * Resizes the canvas if its width and height no longer match that of the client.
         * @returns {boolean} true if the canvas needed to be resized; false otherwise.
         */

    }, {
        key: 'resize',
        value: function resize() {
            var realToCSSPixels = window.devicePixelRatio;

            // Lookup the size the browser is projectioning the canvas in CSS pixels
            // and compute a size needed to make our drawingbuffer match it in
            // device pixels.
            var projectionWidth = Math.floor(this.canvas.clientWidth * realToCSSPixels);
            var projectionHeight = Math.floor(this.canvas.clientHeight * realToCSSPixels);

            // Check if the canvas is not the same size.
            if (this.canvas.width !== projectionWidth || this.canvas.height !== projectionHeight) {

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

    }, {
        key: 'screenToCanvas',
        value: function screenToCanvas(e, dst) {
            var pCanvas = dst || new Point();

            if (e.offsetX) {
                pCanvas.x = e.offsetX;
                pCanvas.y = e.offsetY;
            } else if (e.layerX) {
                pCanvas.x = e.layerX;
                pCanvas.y = e.layerY;
            } else {
                var rect = canvas.getBoundingClientRect();
                pCanvas.x = e.clientX - rect.left;
                pCanvas.y = e.clientY - rect.top;
            }

            return pCanvas;
        }

        /**
         * Converts a canvas coordinate to NDC space [-1,1].
         */

    }, {
        key: 'canvasToNdc',
        value: function canvasToNdc(p, dst) {
            // Get width and height of canvas
            var width = this.canvas.clientWidth,
                height = this.canvas.clientHeight;
            // Normalize the coordinate
            var pNDC = dst || new Point();
            pNDC.x = p.x / width;
            pNDC.y = (height - p.y) / height;
            return pNDC;
        }

        /**
         * Converts a point from NDC space [-1,1] to clip space.
         */

    }, {
        key: 'ndcToClip',
        value: function ndcToClip(p, dst) {
            // Get current projection region
            var proj = this.renderer.projection.region;
            // Find position of p in projection
            var pClip = dst || new Point();
            pClip.x = proj.left + p.x * proj.width();
            pClip.y = proj.bottom + p.y * proj.height();
            return pClip;
        }

        /**
         * Converts a screen coordinate to a point in clip space.
         */

    }, {
        key: 'screenToClip',
        value: function screenToClip(e, dst) {
            var p = dst || new Point();
            this.screenToCanvas(e, p);
            this.canvasToNdc(p, p);
            this.ndcToClip(p, p);
            return p;
        }
    }]);

    return Surface;
}();

;

/**
* Returns a random integer between min (inclusive) and max (inclusive)
* Using Math.round() will give you a non-uniform distribution!
*/
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//TODO: comment out next line if using browserify
var _exports = _exports || {};
_exports.ScaleToFit = ScaleToFit;
_exports.Point = Point;
_exports.Vec2 = Vec2;
_exports.Rect = Rect;
_exports.Color = Color;
_exports.Matrix = Matrix;
_exports.Path = Path;
_exports.Mesh = Mesh;
_exports.Shape = Shape;
_exports.DragDetector = DragDetector;
_exports.Cube = Cube;
_exports.Directions = Directions;
_exports.Hex = Hex;
_exports.Orientation = Orientation;
_exports.Grid = Grid;
_exports.RectangleGrid = RectangleGrid;
_exports.Layout = Layout;
_exports.Changes = Changes;
_exports.Projection = Projection;
_exports.Renderer = Renderer;
_exports.Surface = Surface;

// Internal libraries
//var ghx = require('./gl-hex.js');
var ghx = _exports;

var cout = document.getElementById("cout");
var ctx = cout.getContext("2d");

// 1. Init canvas and WebGL context
var canvas = document.getElementById("c");
var gl = twgl.getWebGLContext(canvas);

// 2. Init hexagon grid
var grid = new ghx.RectangleGrid(ghx.Orientation.PointyTop, 100, 100);

// 3. Init layout
var layout = new ghx.Layout(grid);

// 4. Init renderer
var renderer = new ghx.Renderer(gl, layout);

// 5. Init rendering surface
var surface = new ghx.Surface(canvas, renderer);

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
var colorPicker = $("#color-picker");
var color = ghx.Color.fromHexString($(colorPicker).val());

$(colorPicker).change(function () {
    color.setHexString($(this).val());
});

// Listen for tool changes
// Could also have settings and actions

var Tool = function Tool(onDown, onDrag) {
    _classCallCheck(this, Tool);

    this.handleDownAction = onDown;
    this.handleDragAction = onDrag;
};

//Stack of changes, cleft for me?

var panTool = new Tool();
panTool.handleDownAction = function (e) {
    // Compute point in clip space where event began
    this.previous = surface.screenToClip(e);
    console.log(this.previous);
};
panTool.handleDragAction = function (e) {
    // Compute current point of mouse in clip space
    var current = surface.screenToClip(e);
    // Translate by vector from current point to previous point (reverse direction)
    var vec = ghx.Vec2.from(current, this.previous);
    var origin = renderer.projection.offset;
    origin.add(vec);
    // Avoid panning off screen
    constrainPointToGrid(origin);
    renderer.applyProjectionChanges();
    // Keep track of previous point
    this.previous.x = current.x + vec.x;
    this.previous.y = current.y + vec.y;
};

var brush = new Tool();
brush.handleDownAction = function (e) {};
brush.handleDragAction = function (e) {
    // Convert point to clip space
    var pClip = surface.screenToClip(e);
    // Find index of the corresponding hexagon
    var index = layout.indexOfHexContaining(pClip);
    // If found
    if (index !== -1) {
        // Change the color of the hexagon
        layout.fillRange(index, brushSize, color);
        //layout.setHexagonColor(index, color);
        // Apply changes to screen
        applyColorChanges();
    }
};

var eraser = new Tool();
eraser.handleDownAction = function (e) {};
eraser.handleDragAction = function (e) {
    // Convert point to clip space
    var pClip = surface.screenToClip(e);
    // Find index of the corresponding hexagon
    var index = layout.indexOfHexContaining(pClip);
    // If found
    if (index !== -1) {
        // Change the color of the hexagon
        layout.eraseRange(index, brushSize);
        // Apply changes to screen
        applyColorChanges();
    }
};

var paintBucket = new Tool();
paintBucket.handleDownAction = function (e) {
    // Convert point to clip space
    var pClip = surface.screenToClip(e);
    // Find index of the corresponding hexagon
    var index = layout.indexOfHexContaining(pClip);
    // If found
    if (index !== -1) {
        layout.floodFill(index, color);
        // Load changes into gl context
        applyColorChanges();
    }
};
paintBucket.handleDragAction = function (e) {};

var eyedropper = new Tool();
eyedropper.handleDownAction = function (e) {
    // Convert point to clip space
    var pClip = surface.screenToClip(e);
    // Find index of the corresponding hexagon
    var index = layout.indexOfHexContaining(pClip);
    if (index != -1) {
        color.setColor(layout.getHexagonColor(index));
        $(colorPicker).val(color.toHexString());
    }
};
eyedropper.handleDragAction = function (e) {};

var lineTool = new Tool();
lineTool.handleDownAction = function (e) {
    // Convert point to clip space
    var pClip = surface.screenToClip(e);
    // Convert to cube coordinates
    this.start = layout.clipToCube(pClip);
    // Keep track of changes
    this.changes = new ghx.Changes();
};
lineTool.handleDragAction = function (e) {
    layout.reverseChanges(this.changes);
    // Convert point to clip space
    var pClip = surface.screenToClip(e);
    // Convert to cube coordinates
    var end = layout.clipToCube(pClip);
    // Draw line from start to end
    layout.addLine(this.start, end, brushSize, color, this.changes);
    // Apply changes to screen
    applyColorChanges();
};

var rectangleTool = new Tool();
rectangleTool.handleDownAction = function (e) {
    // Convert start point to clip space
    this.start = surface.screenToClip(e);
    // Keep track of changes
    this.changes = new ghx.Changes();
};
rectangleTool.handleDragAction = function (e) {
    layout.reverseChanges(this.changes);
    // Convert end point to clip space
    var end = surface.screenToClip(e);
    // Compute rect from start to end
    var rect = ghx.Rect.fromTwoPoints(this.start, end);
    // Draw line from start to end
    layout.addRect(rect, color, this.changes);
    // Apply changes to screen
    applyColorChanges();
};

//Meshes array
var Meshes = [ghx.Mesh.nGon(3), //Triangle
ghx.Mesh.nStar(2, .5, 1), //Diamond
ghx.Mesh.nGon(5), //Pentagon
ghx.Mesh.nGon(6), //Hexagon
ghx.Mesh.nGon(40), //Circle
ghx.Mesh.nStar(5, 0.4, 1), //Star
ghx.Mesh.heart(), // Heart
ghx.Mesh.flower(), //Flower
ghx.Mesh.bat()];

var shapePicker = $("#shape-picker");
var mesh = Meshes[$(shapePicker).val()];
$(shapePicker).change(function () {
    //Val refers to order of option in index of Meshes array
    mesh = Meshes[$(this).val()];
});

var shapeTool = new Tool();
shapeTool.handleDownAction = function (e) {
    // Keep track of changes
    this.changes = new ghx.Changes();
    // Save reference to start point
    this.start = surface.screenToClip(e);
    // Init our shape
    this.shape = new ghx.Shape(mesh);
};
shapeTool.handleDragAction = function (e) {
    layout.reverseChanges(this.changes);
    // Convert point to clip space
    var end = surface.screenToClip(e);
    // Recalculate shape vertices
    this.shape.setEndPoints(this.start, end);
    // Map shape onto grid
    layout.addShape(this.shape, color, this.changes);
    // Apply changes to screen
    applyColorChanges();
};

var Tools = [brush, eraser, paintBucket, eyedropper, lineTool, rectangleTool, shapeTool];

var toolPicker = $("#tool-picker");
var tool = Tools[$(toolPicker).val()];

$(toolPicker).change(function () {
    //Val refers to order of option in index of Meshes array
    tool = Tools[$(this).val()];
});

var brushSizePicker = $("#brush-size-picker");
var brushSize = $(brushSizePicker).val() - 1;

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
        case 1:
            // Left click
            tool = Tools[$(toolPicker).val()];
            break;
        case 2:
            // Wheel
            tool = panTool;
            break;
        case 3:
            // Right click
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

function updateCout() {
    var imageData = ctx.getImageData(0, 0, 100, 100);
    var data = imageData.data;
    var index = 0;
    // iterate over rows from top to bottom
    for (var y = cout.width - 1; y >= 0; y--) {
        // and over the columns from left to right
        for (var x = 0; x < cout.height; x++) {
            // Compute offset into pixel data
            var offset = (cout.width * y + x) * 4;
            // Get hex at current index
            var hex = layout.hexes[index++];
            // If hex is transparent
            if (hex.color === -1) {
                // Make pixel transparent
                data[offset] = 0;
                data[offset + 1] = 0;
                data[offset + 2] = 0;
                data[offset + 3] = 0;
            } else {
                // Otherwise set color of pixel to color of hex
                var rgb = ghx.Color.fromHex(hex.color);
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
});

function onUp(e) {}

function onOut(e) {}

var detector = new ghx.DragDetector(canvas, onDown, onDrag, onUp, onOut);

var MIN_SCALE = 1;
var MAX_SCALE = Math.max(grid.rows, grid.cols);

// 8. Listen for zoom events
function handleScroll(event) {
    // Tell the browser we're handling this event
    event.preventDefault();
    event.stopPropagation();
    // Get direction of scroll
    var isPositive = event.detail < 0 || event.wheelDelta > 0;
    // Choose zoom value based on direction
    var zoom = isPositive ? 1.5 : 0.666666;
    var scale = renderer.projection.scale;
    // Constrain scale to given boundaries
    var targetScale = scale * zoom;
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
    var origin = renderer.projection.offset;
    var current = surface.screenToClip(event);
    var pan = ghx.Vec2.from(origin, current);
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
    var scale = renderer.projection.scale;
    var scaleFactor = (scale - MIN_SCALE) / scale,
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
    var reader = new FileReader();
    reader.onload = function (event) {
        var img = new Image();
        img.onload = function () {
            var hRatio = cout.width / img.width;
            var vRatio = cout.height / img.height;
            var ratio = Math.min(hRatio, vRatio);
            var centerShift_x = (cout.width - img.width * ratio) / 2;
            var centerShift_y = (cout.height - img.height * ratio) / 2;
            ctx.clearRect(0, 0, cout.width, cout.height);
            ctx.drawImage(img, 0, 0, img.width, img.height, // src
            centerShift_x, centerShift_y, img.width * ratio, img.height * ratio); // dst
            var data = ctx.getImageData(0, 0, 100, 100).data;
            var index = 0; //layout.hexes.length - 1;
            // iterate over rows from top to bottom
            for (var y = cout.width - 1; y >= 0; y--) {
                // and over the columns from left to right
                for (var x = 0; x < cout.height; x++) {
                    var offset = (cout.width * y + x) * 4;
                    // If pixel is not transparent
                    if (data[offset + 3] !== 0) {
                        var rgb = new ghx.Color(data[offset], data[offset + 1], data[offset + 2]);
                        layout.setHexagonColor(index, rgb);
                    }index++;
                }
            }
            applyColorChanges();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
});
