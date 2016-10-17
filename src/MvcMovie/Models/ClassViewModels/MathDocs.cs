using Microsoft.AspNetCore.Html;

namespace MvcMovie.Models
{
    public static class MathDocs
    {
        public static HtmlString PointDoc() {

            #region Setup

            ClassDoc doc = new ClassDoc(language:"java", name: "point");

            var fields = new FieldDocGroup(name: "Fields");
            var constructors = new MethodDocGroup(name: "Constructors");
            var factories = new MethodDocGroup(name: "Static factory methods");
            var properties = new MethodDocGroup(name: "Properties");
            var setters = new MethodDocGroup(name: "Setters");
            var transformations = new MethodDocGroup(name: "Transformations");

            doc.PutFieldDocGroup(fields);
            doc.PutMethodDocGroup(constructors);
            doc.PutMethodDocGroup(factories);
            doc.PutMethodDocGroup(properties);
            doc.PutMethodDocGroup(setters);
            doc.PutMethodDocGroup(transformations);

            #endregion

            #region Fields

            fields.Add(new FieldDoc(
                description: "This point's horizontal position with respect to the origin.",
                declaration: "public float x"
                ));

            fields.Add(new FieldDoc(
                description: "This point's vertical position with respect to the origin.",
                declaration: "public float y"
                ));

            #endregion

            #region Constructors

            constructors.Add(new MethodDoc(
                description: "Creates a point initialized to (0,0).",
                signature: "public Point()",
                body: "this(0,0);"
                ));

            constructors.Add(new MethodDoc(
                    description: "Creates a point with the specified (x,y) coordinates.",
                    signature: "public Point(float x, float y)",
                    body:@"
this.x = x;
this.y = y;"
                ));


            constructors.Add(new MethodDoc(
                description: "Creates a point that is a deep copy of src.",
                signature: "public Point(Point src)",
                body: @"
this.x = src.x;
this.y = src.y;"
                ));

            #endregion

            #region Static methods

            factories.Add(new MethodDoc(
                description: "Computes the midpoint of p1 and p2.",
                signature: "public static Point between(Point p1, Point p2)",
                body: @"
float midX = 0.5f * (p1.x + p2.x);
float midY = 0.5f * (p1.y + p2.y);
return new Point(midX, midY);"
                ));

            #endregion

            #region Properties

            properties.Add(new MethodDoc(
                description: "Computes the distance from this point to the origin (0,0).",
                signature: "public static float distanceToOrigin()",
                body: "return this.distanceToPoint(0,0);"
                ));

            properties.Add(new MethodDoc(
                description: "Computes the distance from this point to the other point.",
                signature: "public static float distanceToPoint(Point other)",
                body: "return this.distanceToPoint(other.x,other.y);"
                ));

            properties.Add(new MethodDoc(
                description: "Computes the distance from this point to the point (x,y).",
                signature: "public static float distanceToPoint(float x, float y)",
                body: @"
float dx = this.x - x;
float dy = this.y - y;
float dist2 = (dx * dx) + (dy * dy);
return Math.sqrt(dist2);"
                ));

            #endregion

            #region Setters

            setters.Add(new MethodDoc(
                description: "Sets this point's (x,y) coordinates to those of src.",
                signature: "public void set(Point src)",
                body: "this.set(src.x, src.y);"
              ));

             setters.Add(new MethodDoc(
                 "Sets this point's (x,y) coordinates.",
                  "public void set(float x, float y)",
                  @"
this.x = x;
this.y = y;"
              ));

            #endregion

            #region Transformations

            transformations.Add(new MethodDoc(
                "Offsets this point's (x,y) coordinates by the vector (dx,dy).",
                "public void offset(float dx, float dy)",
                @"
this.x += dx;
this.y += dy;"
                ));

            #endregion

            return doc.ToHtmlString();
        }

        public static HtmlString Vec2Doc()
        {
            #region Setup

            //Create a class doc
            ClassDoc doc = new ClassDoc(language: "java", name: "vec2");

            //Create field and method groups
            var fields = new FieldDocGroup(name: "Fields");
            var constructors = new MethodDocGroup(name: "Constructors");
            var factories = new MethodDocGroup(name: "Static factory methods");
            var properties = new MethodDocGroup(name: "Properties");
            var setters = new MethodDocGroup(name: "Setters");
            var transformations = new MethodDocGroup(name: "Transformations");
            var operations = new MethodDocGroup(name: "Operations");
            
            //Add each of them to the class doc
            doc.PutFieldDocGroup(fields);
            doc.PutMethodDocGroup(constructors);
            doc.PutMethodDocGroup(factories);
            doc.PutMethodDocGroup(properties);
            doc.PutMethodDocGroup(setters);
            doc.PutMethodDocGroup(transformations);
            doc.PutMethodDocGroup(operations);

            #endregion

            #region Fields

            fields.Add(new FieldDoc(
                description: "The x component of this vector.",
                declaration: "public float x"
                ));

            fields.Add(new FieldDoc(
                description: "The y component of this vector.",
                declaration: "public float y"
                ));

            #endregion

            #region Constructors

            constructors.Add(new MethodDoc(
                description: "Creates a vector initialized to (0,0).",
                signature: "public Vec2()",
                body: "this(0,0);"
                ));

            constructors.Add(new MethodDoc(
                description: "Creates a vector with the specified (x,y) components.",
                signature: "public Vec2(float x, float y)",
                body: @"
this.x = x;
this.y = y;"
                ));

            constructors.Add(new MethodDoc(
                description: "Creates a vector that is a deep copy of src.",
                signature: "public Vec2(Vec2 src)",
                body: @"
this.x = src.x;
this.y = src.y;"
                ));

            #endregion

            #region Static methods

            factories.Add(new MethodDoc(
                description: "Computes the vector from the specified start point to the specified end point.",
                signature: "public Vec2 fromPoints(start, end)",
                body: "return new Vec2(end.x - start.x, end.y - start.y);"
                ));

            #endregion

            #region Properties

            properties.Add(new MethodDoc(
                description: "Checks if this vector is equal to the additive identity (0,0).",
                signature: "public boolean isZero()",
                body: "return (this.x == 0) &amp;&amp; (this.y == 0);"
                ));

            properties.Add(new MethodDoc(
                description: "Computes the length of this vector.",
                signature: "public float length()",
                body: "return Math.sqrt(this.length2());"
                ));

            properties.Add(new MethodDoc(
                description: "Computes the length of this vector, squared.",
                signature: "public float length2()",
                body: "return (this.x * this.x) + (this.y * this.y);"
            ));

            #endregion

            #region Setters

            setters.Add(new MethodDoc(
                description: "Sets this vector's (x,y) components to those of src.",
                signature: "public void set(Vec2 src)",
                body: "this.set(src.x,src.y);"
                ));

            setters.Add(new MethodDoc(
                description: "Sets this vector's (x,y) components.",
                signature: "public void set(float x, float y)",
                body: @"
this.x = x;
this.y = y;"
                ));

            #endregion

            #region Transformations

            transformations.Add(new MethodDoc(
               description: "Normalizes this vector to unit length",
               signature: "public void normalize()",
               body: "this.normalize(1);"
               ));

            transformations.Add(new MethodDoc(
                description: "Normalizes this vector to the specified length",
                signature: "public void normalize(float length)",
                body: "this.scale(length / this.length());"
                ));

            transformations.Add(new MethodDoc(
                description: "Rotates this vector 90 degrees to the left (CCW).",
                signature: "public void rotate90Left()",
                body: @"
float xCopy = this.x;
this.x = -this.y;
this.y = xCopy;"
                ));

            transformations.Add(new MethodDoc(
                description: "Rotates this vector 90 degrees to the right (CW).",
                signature: "public void rotate90Right()",
                body: @"
float xCopy = this.x;
this.x = this.y;
this.y = -xCopy;"
                ));

            #endregion

            #region Operations

            operations.Add(new MethodDoc(
                description: "Finds the cross product of this vector with the other vector.",
                signature: "public float cross(Vec2 other)",
                body: "return (this.x * other.y) - (this.y * other.x);"
                ));

            operations.Add(new MethodDoc(
                description: "Finds the dot product of this vector with the other vector.",
                signature: "public float dot(Vec2 other)",
                body: "return (this.x * other.x) + (this.y * other.y);"
                ));

            operations.Add(new MethodDoc(
                description: "Adds the other vector to this vector.",
                signature: "public void add(Vec2 other)",
                body: @"
this.x += other.x;
this.y += other.y;"
                ));

            operations.Add(new MethodDoc(
                description: "Subtracts the other vector from this vector.",
                signature: "public void subtract(Vec2 other)",
                body: @"
this.x -= other.x;
this.y -= other.y;"
                ));

            operations.Add(new MethodDoc(
                description: "Negates this vector.",
                signature: "public void negate()",
                body: @"
this.x = -this.x;
this.y = -this.y;"
                ));

            operations.Add(new MethodDoc(
                description: "Scales this vector by the specified scalar.",
                signature: "public void scale(float scalar)",
                body: @"
this.x *= scalar;
this.y *= scalar;"
                ));

            operations.Add(new MethodDoc(
                description: "Divides this vector by the specified scalar.",
                signature: "public void divide(float scalar)",
                body: @"
this.x /= scalar;
this.y /= scalar;"
                ));

            #endregion

            return doc.ToHtmlString();
        }

        public static HtmlString RectDoc()
        {
            #region Setup

            //Create a class doc
            ClassDoc doc = new ClassDoc(language: "java", name: "rect");

            //Create field and method groups
            var fields = new FieldDocGroup(name: "Fields");
            var constructors = new MethodDocGroup(name: "Constructors");
            var factories = new MethodDocGroup(name: "Static factory methods");
            var properties = new MethodDocGroup(name: "Properties");
            var setters = new MethodDocGroup(name: "Setters");
            var transformations = new MethodDocGroup(name: "Transformations");
            var containMethods = new MethodDocGroup(name: "Containment Checkers");
            var intersectMethods = new MethodDocGroup(name: "Intersect Operations");
            var unionMethods = new MethodDocGroup(name: "Union Operations");

            //Add each of them to the class doc
            doc.PutFieldDocGroup(fields);
            doc.PutMethodDocGroup(constructors);
            doc.PutMethodDocGroup(factories);
            doc.PutMethodDocGroup(properties);
            doc.PutMethodDocGroup(setters);
            doc.PutMethodDocGroup(transformations);
            doc.PutMethodDocGroup(containMethods);
            doc.PutMethodDocGroup(intersectMethods);
            doc.PutMethodDocGroup(unionMethods);

            #endregion

            #region Fields

            fields.Add(new FieldDoc(
                description: "The left boundary of this rectangle.",
                declaration: "public float left"
                ));

            fields.Add(new FieldDoc(
                description: "The top boundary of this rectangle.",
                declaration: "public float top"
                ));

            fields.Add(new FieldDoc(
                description: "The right boundary of this rectangle.",
                declaration: "public float right"
                ));

            fields.Add(new FieldDoc(
                description: "The bottom boundary of this rectangle.",
                declaration: "public float bottom"
                ));

            #endregion

            #region Constructors

            constructors.Add(new MethodDoc(
                description: "Creates an empty rectangle.",
                signature: "public Rect()",
                body: "this(0,0,0,0);"
                ));

            constructors.Add(new MethodDoc(
                description: "Creates a rectangle with the specified boundaries.",
                signature: "public Rect(float left, float top, float right, float bottom)",
                body: @"
this.left = left;
this.top = top;
this.right = right;
this.bottom = bottom;"
                ));

            constructors.Add(new MethodDoc(
                description: "Creates a rectangle that is a deep copy of src.",
                signature: "public Rect(Rect src)",
                body: @"
this.left = src.left;
this.top = src.top;
this.right = src.right;
this.bottom = src.bottom;"
                ));

            #endregion

            #region Static Methods

            factories.Add(new MethodDoc(
                description: "Creates a rect with the specified dimensions.",
                signature: "public static Rect fromDimensions(float left, float bottom, float width, float height)",
                body: @"
//Calculate the right boundary of the rect
float right = left + width;
//Calculate the top boundary of the rect
float top = bottom + height;
//Create and return the rect
return new Rect(left, top, right, bottom);"
                ));

            factories.Add(new MethodDoc(
                description: "Finds the intersection of rectangles r1 and r2.",
                signature: "public static Rect fromIntersection(Rect r1, Rect r2)",
                body: @"
//Copy the first rect
Rect rect = new Rect(r1);
//Intersect it with the second rect
rect.intersectRect(r2)
//Return the intersected rect
return rect;"
                ));

            factories.Add(new MethodDoc(
               description: "Finds the smallest rectangle that encloses all the specified points.",
               signature: "public static Rect fromUnion(Point... points)",
               body: @"
//Create an empty rect
Rect rect = new Rect();
//Enclose each of the points
rect.setUnion(points);
//Return the unioned rect
return rect;"
               ));

            factories.Add(new MethodDoc(
                description: "Finds the smallest rectangle that encloses a subset of points in the specified array.",
                signature: "public static Rect fromUnion(float[] points, int offset, int count)",
                body: @"
//Create an empty rect
Rect rect = new Rect();
//Enclose the specified subset of points
rect.setUnion(points, offset, count);
//Return the unioned rect
return rect;"
                ));

            factories.Add(new MethodDoc(
                description: "Finds the union of rectangles r1 and r2.",
                signature: "public static Rect fromUnion(Rect r1, Rect r2)",
                body: @"
//Copy the first rect
Rect rect = new Rect(r1);
//Union it with the second rect
rect.unionRect(r2)
//Return the unioned rect
return rect;"
                ));

            #endregion

            #region Properties

            properties.Add(new MethodDoc(
               description: "Checks if this rectangle is empty. True if left &gt;= right or bottom &gt;= top.",
               signature: "public boolean isEmpty()",
               body: "return (this.left &gt;= this.right) || this.bottom &gt;= this.top;"
               ));

            properties.Add(new MethodDoc(
               description: "Checks if the boundaries of this rectangle represent a valid rectangle. True if right &gt;= left and top &gt;= bottom.",
               signature: "public boolean isValid()",
               body: "return this.right &gt;= this.left &amp;&amp; this.top &gt;= this.bottom;"
               ));

            properties.Add(new MethodDoc(
                description: "Computes the width of this rectangle.",
                signature: "public float width()",
                body: "return this.right - this.left;"
                ));

            properties.Add(new MethodDoc(
                description: "Computes the height of this rectangle.",
                signature: "public float height()",
                body: "return this.top - this.bottom;"
                ));

            properties.Add(new MethodDoc(
                description: "Computes the area of this rectangle.",
                signature: "public float area()",
                body: "return this.width() * this.height();"
                ));

            properties.Add(new MethodDoc(
                description: "Finds the point at the center of this rectangle.",
                signature: "public Point center()",
                body: "return new Point(this.centerX(), this.centerY());"
                ));

            properties.Add(new MethodDoc(
                 description: "Finds the x-coordinate of the point at the center of this rectangle.",
                 signature: "public float centerX()",
                 body: "return 0.5f * (this.left + this.right);"
                 ));

            properties.Add(new MethodDoc(
                description: "Finds the y-coordinate of the point at the center of this rectangle.",
                signature: "public float centerY()",
                body: "return 0.5f * (this.bottom + this.top);"
                ));

            properties.Add(new MethodDoc(
                description: "Finds the point at the bottom left corner of this rectangle.",
                signature: "public Point bottomLeft()",
                body: "return new Point(this.left, this.bottom);"
                ));

            properties.Add(new MethodDoc(
                description: "Finds the point at the bottom right corner of this rectangle.",
                signature: "public Point bottomRight()",
                body: "return new Point(this.right, this.bottom);"
                ));

            properties.Add(new MethodDoc(
                description: "Finds the point at the top left corner of this rectangle.",
                signature: "public Point topLeft()",
                body: "return new Point(this.left, this.top);"
                ));

            properties.Add(new MethodDoc(
                description: "Finds the point at the top right corner of this rectangle.",
                signature: "public Point topRight()",
                body: "return new Point(this.right, this.top);"
                ));

            #endregion

            #region Setters


            setters.Add(new MethodDoc(
    description: "Sets this rectangle's boundaries to those of src.",
    signature: "public void set(Rect src)",
    body: "this.set(src.left, src.top, src.right, src.bottom);"
    ));

            setters.Add(new MethodDoc(
                description: "Sets this rectangle's boundaries.",
                signature: "public void set(float left, float top, float right, float bottom)",
                body: @"
this.left = left;
this.top = top;
this.right = right;
this.bottom = bottom;"
                ));


            setters.Add(new MethodDoc(
                description: "Sets this rectangle empty.",
                signature: "public void setEmpty()",
                body: @"
this.left = 0;
this.top = 0;
this.right = 0;
this.bottom = 0;"
                ));

            setters.Add(new MethodDoc(
                description: "Sets this rectangle to the smallest rectangle that encloses all the points in the specified array",
                signature: "public void setUnion(Point... points)",
                body: @"
//Enclose the first point in the array
this.left = this.right = points[0].x;
this.top = this.bottom = points[0].y;
//Enclose the remaining points
for(int i = 1; i &lt; points.length; i++) {
    rect.unionPoint(points[i]);
}"
                ));

            setters.Add(new MethodDoc(
                description: "Sets this rectangle to the smallest rectangle that encloses a subset of points in the specified array",
                signature: "public void setUnion(float[] points, int offset, int count)",
                body: @"
//Enclose the first point in the subset
this.left = this.right = points[offset++];
this.top = this.bottom = points[offset++];
//Enclose the rest of the points in the subset
this.unionPoints(points, offset, count - 1);"
                ));

            #endregion

            #region Transformations

            transformations.Add(new MethodDoc(
                description: "Insets the boundaries of this rectangle by the vector (dx,dy).",
                signature: "public void inset(float dx, float dy)",
                body: @"
//Inset the left and right boundaries by dx
this.left += dx;
this.right -= dx;
//Inset the bottom and top boundaries by dy
this.bottom += dy;
this.top -= dy;"
                ));

            transformations.Add(new MethodDoc(
                description: "Offsets the boundaries of this rectangle by the vector (dx,dy).",
                signature: "public void offset(float dx, float dy)",
                body: @"
//Offset the left and right boundaries by dx
this.left += dx;
this.right += dx;
//Offset the top and bottom boundaries by dy
this.top += dy;
this.bottom += dy;"
                ));

            transformations.Add(new MethodDoc(
               description: "Swaps top/bottom or left/right if they are flipped, meaning left &gt; right and/or top &gt; bottom.",
               signature: "public void sort()",
               body: @"
//If the top boundary is not above the bottom boundary
if (this.bottom &gt; this.top) {
    //Swap top and bottom
    float topCopy = this.top;
    this.top = this.bottom;
    this.bottom = topCopy;
}
//If the right boundary is not to the right of the left boundary
if (this.left &gt; this.right) {
    //Swap left and right
    float rightCopy = this.right;
    this.right = this.left;
    this.left = rightCopy;
}"
             ));

            #endregion

            #region Contains

            containMethods.Add(new MethodDoc(
                description: "Checks if this rectangle contains the specified point.",
                signature: "public boolean containsPoint(Point pt)",
                body: "return this.containsPoint(pt.x, pt.y)"
                ));

            containMethods.Add(new MethodDoc(
                description: "Checks if this rectangle contains the point (x,y).",
                signature: "public boolean containsPoint(float x, float y)",
                body: @"
return this.left &lt;= x &amp;&amp; x &lt;= this.right &amp;&amp; this.bottom &lt;= y &amp;&amp; y &lt;= this.top;"
                ));

            containMethods.Add(new MethodDoc(
               description: "Checks if this rectangle contains the other rectangle.",
               signature: "public boolean containsRect(Rect other)",
               body: @"
return this.left &lt;= other.left &amp;&amp; this.right &gt;= other.right &amp;&amp;
            this.bottom &lt;= other.bottom &amp;&amp; this.top =&gt; other.top;"
               ));

            #endregion

            #region Intersect

            intersectMethods.Add(new MethodDoc(
                description: "Sets this rectangle to the intersection of itself and the other rectangle.",
                signature: "public void intersectRect(Rect other)",
                body: @"
this.left = Math.max(this.left, other.left);
this.right = Math.min(this.right, other.right);
this.bottom = Math.max(this.bottom, other.bottom);
this.top = Math.min(this.top, other.top);"
                ));

            intersectMethods.Add(new MethodDoc(
                description: "Checks if this rectangle intersects the other rectangle.",
                signature: "public boolean intersectsRect(Rect other)",
                body: @"
return this.right &gt;= other.left &amp;&amp; this.left &lt;= other.right &amp;&amp;
            this.top &gt;= other.bottom &amp;&amp; this.bottom &lt;= other.top;"
                ));

            intersectMethods.Add(new MethodDoc(
                description: "Checks if this rectangle intersects the other rectangle by at least the specified percentage.",
                signature: "public boolean intersectsRect(Rect other, float percent)",
                body: @"
//Get the intersection of the two rects
Rect intersection = Rect.fromIntersection(this, other);
//Return true if the intersection is valid and the ratio
//of the areas is bigger than the specified percent value.
return intersection.isValid() &amp;&amp; intersection.area() / other.area() &gt;= percent;"
                ));

            #endregion

            #region Union

            unionMethods.Add(new MethodDoc(
                description: "Expands this rectangle to enclose the specified point.",
                signature: "public void unionPoint(Point pt)",
                body: "this.union(pt.x,pt.y)"
                ));

            unionMethods.Add(new MethodDoc(
                description: "Expands this rectangle to enclose the point (x,y).",
                signature: "public void unionPoint(float x, float y)",
                body: @"
this.left = Math.min(x, this.left);
this.top = Math.max(y, this.top);
this.right = Math.max(x, this.right);
this.bottom = Math.min(y, this.bottom);"
                ));

            unionMethods.Add(new MethodDoc(
                description: "Expands this rectangle to enclose the specified points.",
                signature: "void unionPoints(Point... points)",
                body: @"
//Enclose each of the points in the array
for(Point pt: points) {
    rect.unionPoint(pt);
}"
                ));

            unionMethods.Add(new MethodDoc(
                description: "Expands this rectangle to enclose a subset of points in the specified array.",
                signature: "public void unionPoints(float[] points, int offset, int count)",
                body: @"
//For each of the points in the subset
for (int i = 0; i&lt;count; i++) {
    //Expand this rect to enclose the point
    this.unionPoint(points[offset++], points[offset++]);
}"
                ));

            unionMethods.Add(new MethodDoc(
               description: "Expands this rectangle to enclose the specified rectangle.",
               signature: "public void unionRect(Rect other)",
               body: @"
this.left = Math.min(this.left, other.left);
this.right = Math.max(this.right, other.right);
this.bottom = Math.min(this.bottom, other.bottom);
this.top = Math.max(this.top, other.top);"
               ));

            #endregion

            return doc.ToHtmlString();
        }

        public static HtmlString Matrix3Doc()
        {

            #region Setup

            //Create a class doc
            ClassDoc doc = new ClassDoc(language: "java", name: "matrix3");

            //Create field and method groups
            var scaleToFitEnum = new FieldDocGroup(name: "ScaleToFit enum");
            var fields = new FieldDocGroup(name: "Fields");
            var constructors = new MethodDocGroup(name: "Constructors");
            var factories = new MethodDocGroup(name: "Static factory methods");
            //var properties = new MethodDocGroup(name: "Properties");
            var setters = new MethodDocGroup(name: "Setters");
            var transformations = new MethodDocGroup(name: "Transformations");
            var operations = new MethodDocGroup(name: "Operations");


            //Add each of them to the class doc
            doc.PutFieldDocGroup(scaleToFitEnum);
            doc.PutFieldDocGroup(fields);
            doc.PutMethodDocGroup(constructors);
            doc.PutMethodDocGroup(factories);
            //doc.PutMethodDocGroup(properties);
            doc.PutMethodDocGroup(setters);
            doc.PutMethodDocGroup(transformations);
            doc.PutMethodDocGroup(operations);


            #endregion

            #region Put Enums

            scaleToFitEnum.Add(new FieldDoc(
                description: "Stretches the src rect to fit inside dst, then translates src.center() to dst.center().",
                declaration: "Center"
                ));


            scaleToFitEnum.Add(new FieldDoc(
                description: "Stretches the src rect to fit inside dst, then translates src.bottomRight() to dst.bottomRight().",
                declaration: "End"
                ));

            scaleToFitEnum.Add(new FieldDoc(
                description: "Scales the src rect to fit inside dst exactly, then translates src to dst.",
                declaration: "Fill"
                ));

            scaleToFitEnum.Add(new FieldDoc(
                description: "Stretches the src rect to fit inside dst, then translates src.topLeft() to dst.topLeft().",
                declaration: "Start"
                ));

            #endregion

            #region Put Fields

            fields.Add(new FieldDoc(
                description: "The first item in the first row of this matrix.",
                declaration: "public float m11"
                ));

            fields.Add(new FieldDoc(
                description: "The second item in the first row of this matrix.",
                declaration: "public float m12"
                ));

            fields.Add(new FieldDoc(
                description: "The third item in the first row of this matrix.",
                declaration: "public float m13"
                ));

            fields.Add(new FieldDoc(
                description: "The first item in the second row of this matrix.",
                declaration: "public float m21"
                ));

            fields.Add(new FieldDoc(
                description: "The second item in the second row of this matrix.",
                declaration: "public float m22"
                ));

            fields.Add(new FieldDoc(
                description: "The third item in the second row of this matrix.",
                declaration: "public float m23"
                ));

            fields.Add(new FieldDoc(
                description: "The first item in the third row of this matrix.",
                declaration: "public float m31"
                ));

            fields.Add(new FieldDoc(
                description: "The second item in the third row of this matrix.",
                declaration: "public float m32"
                ));

            fields.Add(new FieldDoc(
                description: "The third item in the third row of this matrix.",
                declaration: "public float m33"
                ));

            #endregion

            #region Put Constructors

            constructors.Add(new MethodDoc(
                description: "Creates a matrix initialized to the multiplicative idenity.",
                signature: "public Matrix()",
                body: @"
this(
    1,0,0, //row 1
    0,1,0, //row 2
    0,0,1  //row 3
    );"
                ));

            constructors.Add(new MethodDoc(
               description: "Creates a matrix with the specified entries.",
               signature: "public Matrix(float m11, float m12, float m13, float m21, float m22, float m23, float m31, float m32, float m33)",
               body: @"
this.m11 = m11; this.m12 = m12; this.m13 = m13; //row 1
this.m21 = m21; this.m22 = m22; this.m23 = m23; //row 2
this.m31 = m31; this.m32 = m32; this.m33 = m33; //row 3"
               ));

            constructors.Add(new MethodDoc(
                description: "Creates a matrix that is a deep copy of src.",
                signature: "public Matrix(Matrix src)",
                body: @"
this(
    src.m11, src.m12, src.m13, //row 1
    src.m21, src.m22, src.m23, //row 2
    src.m31, src.m32, src.m33  //row 3
    );"
                ));

            #endregion

            #region Static Factory Methods

            factories.Add(new MethodDoc(
                description: "Creates a rect to rect matrix that maps src into dst using the specified scale to fit option.",
                signature: "public static Matrix rectToRect(Rect src, Rect dst, ScaleToFit stf)",
                body: @"
Matrix matrix = new Matrix();
matrix.setRectToRect(src,dst,stf);
return matrix;"
                ));

            factories.Add(new MethodDoc(
                description: "Creates a matrix to rotate about the origin by the specified angle in radians.",
                signature: "public static Matrix rotate(float radians)",
                body: @"
Matrix matrix = new Matrix();
matrix.postRotate(radians);
return matrix;"
                ));

            factories.Add(new MethodDoc(
                description: "Creates a matrix to rotate about the specified center point by the specified angle in radians.",
                signature: "public static Matrix rotate(Point center, float radians)",
                body: @"
Matrix matrix = new Matrix();
matrix.postTranslate(-center.x,-center.y);
matrix.postRotate(radians);
matrix.postTranslate(center.x,center.y);
return matrix;"
                ));

            factories.Add(new MethodDoc(
                description: "Creates a matrix to scale about the origin by the specified width and height ratios.",
                signature: "public static Matrix scale(float widthRatio, float heightRatio)",
                body: @"
Matrix matrix = new Matrix();
matrix.postScale(widthRatio, heightRatio);
return matrix;"
                ));

            factories.Add(new MethodDoc(
                description: "Creates a matrix to scale about the specified center point by the specified width and height ratios.",
                signature: "public static Matrix scale(Point center, float widthRatio, float heightRatio)",
                body: @"
Matrix matrix = new Matrix();
matrix.postTranslate(-center.x,-center.y);
matrix.postScale(widthRatio, heightRatio);
matrix.postTranslate(center.x,center.y);
return matrix;"
                ));

            factories.Add(new MethodDoc(
                description: "Creates a matrix to stretch about the origin by the specified ratio.",
                signature: "public static Matrix stretch(float ratio)",
                body: "return Matrix.scale(ratio,ratio);"
                ));

            factories.Add(new MethodDoc(
                description: "Creates a matrix to stretch about the specified center point  by the specified ratio.",
                signature: "public static Matrix stretch(Point center, float ratio)",
                body: "return Matrix.scale(center,ratio,ratio);"
                ));

            factories.Add(new MethodDoc(
                description: "Creates a stretch rotation about the specified center point that maps the start point onto the end point.",
                signature: "public static Matrix stretchRotate(Point center, Point start, Point end)",
                body: @"
//Compute the vector from center to start and center to end
Vec2 startVector = Vec2.fromPoints(center, start);
Vec2 endVector = Vec2.fromPoints(center, end);

//Compute the length of each vector
float startLength = startVector.length();
float endLength = endVector.length();

//Calculate the stretch ratio
float ratio = endLength / startLength;

//Normalize each of the vectors
startVector.divide(startLength);
endVector.divide(endLength);

//Calculate the sin and cos of the angle between the vectors
float sin = startVector.cross(endVector);
float cos = startVector.dot(endVector);

//Set the matrix to stretch rotate by the values we calculated
let matrix = new Matrix();
matrix.postTranslate(-center.x,-center.y);
matrix.postStretch(ratio);
matrix.postRotate(sin,cos);
matrix.postTranslate(center.x,center.y);
return matrix;"
                ));

            factories.Add(new MethodDoc(
                description: "Creates a matrix to translate by the vector (dx,dy).",
                signature: "public static Matrix translate(float dx, float dy)",
                body: @"
Matrix matrix = new Matrix();
matrix.postTranslate(dx,dy);
return matrix;"
                ));

            #endregion

            #region Properties

            #endregion

            #region Setters

            setters.Add(new MethodDoc(
                description: "Sets the entries of this matrix to those of src.",
                signature: "void set(Matrix src)",
                body: @"
this.set(
    src.m11, src.m12, src.m13, //row 1
    src.m21, src.m22, src.m23, //row 2
    src.m31, src.m32, src.m33  //row 3
    );"
                ));

            setters.Add(new MethodDoc(
                description: "Sets the entries of this matrix.",
                signature: "public void set(float m11, float m12, float m13, float m21, float m22, float m23, float m31, float m32, float m33)",
                body: @"
this.m11 = m11; this.m12 = m12; this.m13 = m13; //row 1
this.m21 = m21; this.m22 = m22; this.m23 = m23; //row 2
this.m31 = m31; this.m32 = m32; this.m33 = m33; //row 3"
    ));

            setters.Add(new MethodDoc(
               description: "Sets this matrix to the product of the specified left and right matrices.",
               signature: "public void setConcat(Matrix left, Matrix right)",
               body: @"
this.set(
            //Calculate the first row, fixing the first left hand row
            //and moving across each of the right hand columns
            left.m11 * right.m11 + left.m12 * right.m21 + left.m13 * right.m31, 
            left.m11 * right.m12 + left.m12 * right.m22 + left.m13 * right.m32,
            left.m11 * right.m13 + left.m12 * right.m23 + left.m13 * right.m33,
            //Calculate the second row, fixing the second left hand row
            //and moving across each of the right hand columns
            left.m21 * right.m11 + left.m22 * right.m21 + left.m23 * right.m31,
            left.m21 * right.m12 + left.m22 * right.m22 + left.m23 * right.m32,
            left.m21 * right.m13 + left.m22 * right.m23 + left.m23 * right.m33,
            //Calculate the third row, fixing the third left hand row
            //and moving across each of the right hand columns
            left.m31 * right.m11 + left.m32 * right.m21 + left.m33 * right.m31,
            left.m31 * right.m12 + left.m32 * right.m22 + left.m33 * right.m32,
            left.m31 * right.m13 + left.m32 * right.m23 + left.m33 * right.m33
    );"
            ));

            setters.Add(new MethodDoc(
                description: "Sets this matrix to the identity matrix.",
                signature: "public void setIdentity()",
                body: @"
this.set(
    1,0,0, //row 1
    0,1,0, //row 2
    0,0,1  //row 3
    );"
                ));

            setters.Add(new MethodDoc(
                description: "Sets this matrix to map src into dst using the specified scale to fit option.",
                signature: "public void setRectToRect(Rect src, Rect dst, ScaleToFit stf)",
                body: @"
//Determine which points to match based on the scale to fit option.
Point srcPoint, dstPoint;

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
float widthRatio = dst.width() / src.width();
float heightRatio = dst.height() / src.height();

//Set the matrix to translate the src point to the origin
this.setTranslate(-srcPoint.x, -srcPoint.y);

//Next, set this matrix to scale the src rect so it is big (or small) enough 
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
this.postTranslate(dstPoint.x, dstPoint.y);"
             ));

            setters.Add(new MethodDoc(
                description: "Sets this matrix to rotate CCW by the specified angle in radians.",
                signature: "public void setRotate(float radians)",
                body: @"
//Compute the sin and cos of the angle
float sin = (float) Math.sin(radians);
float cos = (float) Math.cos(radians);
//Set this matrix to rotate by the computed sin and cos values
this.setRotate(sin, cos);"
                ));

            setters.Add(new MethodDoc(
                description: "Sets this matrix to rotate by the specified sin and cos values.",
                signature: "public void setRotate(float sin, float cos)",
                body: @"
this.set(
    cos, -sin, 0, //row 1
    sin, cos,  0, //row 2
    0,   0,    1  //row 3
    );"
                ));

            setters.Add(new MethodDoc(
                description: "Sets this matrix to scale by the specified width and height ratios.",
                signature: "public void setScale(float widthRatio, float heightRatio)",
                body: @"
this.set(
    widthRatio, 0,           0, //row 1
    0,          heightratio, 0, //row 2
    0,          0,           1  //row 3
    );"
                ));

            setters.Add(new MethodDoc(
                description: "Sets this matrix to stretch by the specified ratio.",
                signature: "public void setStretch(float ratio)",
                body: @"
//Set this matrix to scale vertically and horizontally by the same ratio
this.setScale(ratio, ratio);"
                ));

            setters.Add(new MethodDoc(
                description: "Sets this matrix to translate by the vector (dx,dy).",
                signature: "void setTranslate(float dx, float dy)",
                body: @"
this.set(
    1, 0, dx, //row 1
    0, 1, dy, //row 2
    0, 0, 1,  //row 3
);"
                ));

            #endregion

            #region Pre + Post Operations

            transformations.Add(new MethodDoc(
                description: "Post concats this matrix with the other matrix: this = other * this.",
                signature: "public void postConcat(Matrix other)",
                body: "this.setConcat(other, this);"
                ));

            transformations.Add(new MethodDoc(
                description: "Pre concats this matrix with the other matrix: this = this * other.",
                signature: "public void preConcat(Matrix other)",
                body: "this.setConcat(this, other);"
                ));

            transformations.Add(new MethodDoc(
                description: "Post concats this matrix with a rotation by the specified angle in radians",
                signature: "public void postRotate(float radians)",
                body: @"
//Calculate the sin and cos of the angle
float sin = (float) Math.cos(radians);
float cos = (float) Math.sin(radians);
//Post rotate by the calculated sin and cos values
this.postRotate(sin,cos);"
                ));

            transformations.Add(new MethodDoc(
                description: "Pre concats this matrix with a rotation by the specified angle in radians.",
                signature: "public void preRotate(float radians)",
                body: @"
//Calculate the sin and cos of the angle
float sin = (float) Math.cos(radians);
float cos = (float) Math.sin(radians);
//Pre rotate by the calculated sin and cos values
this.preRotate(sin,cos);"
                ));

            transformations.Add(new MethodDoc(
                 description: "Post concats this matrix with a rotation by the specified sin and cos values.",
                 signature: "public void postRotate(float sin, float cos)",
                 body: @"
//Copy the first row
float r1c1 = this.m11; float r1c2 = this.m12; float r1c3 = this.m13;
//Update the first row
this.m11 = cos * r1c1 - sin * this.m21; //(cos,-sin,0)*col1
this.m12 = cos * r1c2 - sin * this.m22; //(cos,-sin,0)*col2
this.m13 = cos * r1c3 - sin * this.m23; //(cos,-sin,0)*col3
//Update the second row
this.m21 = sin * r1c1 + cos * this.m21; //(sin,cos,0)*col1
this.m22 = sin * r1c2 + cos * this.m22; //(sin,cos,0)*col2
this.m23 = sin * r1c3 + sin * this.m23; //(sin,cos,0)*col3
//Third row does not change"
                 ));

            transformations.Add(new MethodDoc(
                description: "Pre concats this matrix with a rotation by the specified sin and cos values.",
                signature: "public void preRotate(float sin, float cos)",
                body: @"
//Copy the first column
float r1c1 = this.m11;
float r2c1 = this.m21;
float r3c1 = this.m31;
//Update the first column
this.m11 = r1c1 * cos + this.m12 * sin; //row1*(cos,sin,0)
this.m21 = r2c1 * cos + this.m22 * sin; //row2*(cos,sin,0)
this.m31 = r3c1 * cos + this.m32 * sin; //row3*(cos,sin,0)
//Update the second column
this.m12 = r1c1 * -sin + this.m12 * cos; //row1*(-sin,cos,0)
this.m22 = r2c1 * -sin + this.m22 * cos; //row2*(-sin,cos,0)
this.m32 = r3c1 * -sin + this.m32 * cos; //row3*(-sin,cos,0)
//Third column does not change"
                ));

            transformations.Add(new MethodDoc(
                description: "Post concats this matrix with a scale of the specified width and height ratios",
                signature: "public void postScale(float widthRatio, float heightRatio)",
                body: @"
//Multiply first row by width ratio
this.m11 *= widthRatio;
this.m12 *= widthRatio;
this.m13 *= widthRatio;
//Multiply second row by height ratio
this.m21 *= heightRatio;
this.m22 *= heightRatio;
this.m23 *= heightRatio;
//Third row does not change"
                ));

            transformations.Add(new MethodDoc(
                description: "Pre concats this matrix with a scale of the specified width and height ratios",
                signature: "public void preScale(float widthRatio, float heightRatio)",
                body: @"
//Multiply first column by width ratio
this.m11 *= widthRatio;
this.m21 *= widthRatio;
this.m31 *= widthRatio;
//Multiply second column by height ratio
this.m12 *= heightRatio;
this.m22 *= heightRatio;
this.m32 *= heightRatio;
//Third column does not change"
                ));

            transformations.Add(new MethodDoc(
                description: "Post concats this matrix with a stretch of the specified ratio",
                signature: "public void postStretch(float ratio)",
                body: @"
//Post scale by the same width and height ratio
this.postScale(ratio,ratio);"
                ));

            transformations.Add(new MethodDoc(
                description: "Pre concats this matrix with a stretch of the specified ratio",
                signature: "public void preStretch(float ratio)",
                body: @"
//Pre scale by the same width and height ratio
this.preScale(ratio,ratio);"
                ));

            transformations.Add(new MethodDoc(
                description: "Post concats this matrix with a translation by vector (dx,dy)",
                signature: "public void postTranslate(float dx, float dy)",
                body: @"
this.m13 += dx * this.m33; //(1,0,dx)*(m13,m23,m33)
this.m23 += dy * this.m33; //(0,1,dy)*(m13,m23,m33)"
                ));

            transformations.Add(new MethodDoc(
                description: "Pre concats this matrix with a translation by vector (dx,dy)",
                signature: "public void preTranslate(float dx, float dy)",
                body: @"
this.m13 += this.m11 * dx + this.m12 * dy; //(m11,m12,m13)*(dx,dy,1)
this.m23 += this.m21 * dx + this.m22 * dy; //(m21,m22,m23)*(dx,dy,1)"
                ));

            #endregion

            #region Mapping Functions

            operations.Add(new MethodDoc(
                 description: "Maps the src point and writes the result back into src.",
                 signature: "public void mapPoint(Point src)",
                 body: "this.mapPoint(src,src);"
                 ));

            operations.Add(new MethodDoc(
                description: "Maps the src point and writes the result into dst.",
                signature: "public void mapPoint(Point src, Point dst)",
                body: @"
//Copy the (x,y) values of src
float x = src.x;
float y = src.y;
//Map the point and write result into dst
dst.x = this.mapX(x, y);
dst.y = this.mapY(x, y);"
                ));

            operations.Add(new MethodDoc(
                description: "Maps a subset of points in src and writes the result back into src at the same place.",
                signature: "public void mapPoints(float[] src, int srcOffset, int count)",
                body: "this.mapPoints(src,srcOffset,src,srcOffset,count);"
             ));

            operations.Add(new MethodDoc(
                description: "Maps a subset of points in src and writes the result into dst.",
                signature: "public void mapPoints(float[] src, int srcOffset, float[] dst, int dstOffset, int count)",
                body: @"
for (int i = 0; i &lt; count; i++) {
    //Get the point at the current offset
    float x = src[srcOffset++];
    float y = src[srcOffset++];
    //Map the point and write the result into dst
    dst[dstOffset++] = this.mapX(x, y);
    dst[dstOffset++] = this.mapY(x, y);
}"
                ));

            operations.Add(new MethodDoc(
                description: "Maps the src rect and writes the result back into src.",
                signature: "public void mapRect(Rect src)",
                body: "this.mapRect(src,src);"
                ));

            operations.Add(new MethodDoc(
               description: "Maps the src rect and writes the result into dst.",
               signature: "public void mapRect(Rect src, Rect dst)",
               body: @"
//Get the four corner's of the src rect
Point topLeft = src.topLeft();
Point botLeft = src.bottomLeft();
Point botRight = src.bottomRight();
Point topRight = src.topRight();
//Map each of the four corners
this.mapPoint(topLeft);
this.mapPoint(botLeft);
this.mapPoint(botRight);
this.mapPoint(topRight);
//Set dst to enclose each of the four mapped corners
dst.setUnion(topLeft,botLeft,botRight,topRight);"
                ));

            operations.Add(new MethodDoc(
                description: "Maps the src vector and writes the result back into src.",
                signature: "public void mapVec2(Vec2 src)",
                body: "this.mapVec2(src,src);"
                ));


            operations.Add(new MethodDoc(
                description: "Maps the src vector and writes the result into dst.",
                signature: "public void mapVec2(Vec2 src, Vec2 dst)",
                body: @"
//We can describe the src vector (x,y) as the vector from 
//the origin O = (0,0) to the point P = (x,y).
//Hence map(src) = the vector from map(O) to map(P)
//First calculate ""map(O) = (oX, oY)""
float oX = this.mapX(0, 0);
float oY = this.mapY(0, 0);
//Next calculate ""map(P) = (pX, pY)""
float pX = this.mapX(src.x, src.y);
float pY = this.mapY(src.x, src.y);
//Set dst to vector from map(O) to map(P)
dst.x = pX - oX;
dst.y = pY - oY;"
                ));

            operations.Add(new MethodDoc(
                 description: "Maps the x coordinate of the point (x,y).",
                 signature: "public void mapX(float x, float y)",
                 body: @"
//Dot (x,y) with the first row of this matrix
return this.m11 * x + this.m12 * y + this.m13;"
                 ));

            operations.Add(new MethodDoc(
                 description: "Maps the y coordinate of the point (x,y).",
                 signature: "public void mapY(float x, float y)",
                 body: @"
//Dot (x,y) with the second row of this matrix
return this.m21 * x + this.m22 * y + this.m23;"
                 ));

            #endregion

            return doc.ToHtmlString();
        }

    }
}
