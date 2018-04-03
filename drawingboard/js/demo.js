(function () {
    //变量声明
    var mouseFrom = {}, mouseTo = {}, drawType = null, canvasObjectIndex = 0;
    var drawWidth = 2; //笔触宽度
    var color = "#E34F51"; //画笔颜色

    //初始化画板
    var canvas = new fabric.Canvas('c', {
        isDrawingMode: true, skipTargetFind: true, selectable: false, selection: false
    });
    canvas.freeDrawingBrush.color = color; //设置自由绘颜色
    canvas.freeDrawingBrush.width = drawWidth;

    //绑定画板事件
    canvas.on("mouse:down", function (options) {
        mouseFrom.x = options.e.clientX;
        mouseFrom.y = options.e.clientY;
    });
    canvas.on("mouse:up", function (options) {
        mouseTo.x = options.e.clientX;
        mouseTo.y = options.e.clientY;
        drawing();
    });
    canvas.on("selection:created", function (e) {
        if (e.target._objects) {
            //多选删除
            var etCount = e.target._objects.length;
            for (var etindex = 0; etindex < etCount; etindex++) {
                canvas.remove(e.target._objects[etindex]);
            }
        } else {
            //单选删除
            canvas.remove(e.target);
        }
        canvas.discardActiveObject(); //清楚选中框
    });

    //绑定工具事件
    jQuery("#toolsul").find("li").on("click", function () {
        //设置样式
        jQuery("#toolsul").find("li>i").each(
            function () {
                jQuery(this).attr("class", jQuery(this).attr("data-default"));
            }
        );
        jQuery(this).addClass("active").siblings().removeClass("active");
        jQuery(this).find("i").attr("class", jQuery(this).find("i").attr("class").replace("black", "select"));
        drawType = jQuery(this).attr("data-type");
        canvas.isDrawingMode = false;
        if (drawType == "pen") {
            canvas.isDrawingMode = true;
        } else if (drawType == "remove") {
            canvas.selection = true;
            canvas.skipTargetFind = false;
            canvas.selectable = true;
        }
        else {
            canvas.skipTargetFind = true; //画板元素不能被选中
            canvas.selection = false; //画板不显示选中
        }
    });

    //绘画方法
    function drawing() {
        var canvasObject = null;
        switch (drawType) {
            case "arrow": //箭头
                canvasObject = new fabric.Path(drawArrow(mouseFrom.x, mouseFrom.y, mouseTo.x, mouseTo.y, 30, 30), {
                    stroke: color,
                    fill: "#fff",
                    strokeWidth: drawWidth
                });
                break;
            case "line": //直线
                canvasObject = new fabric.Line([mouseFrom.x, mouseFrom.y, mouseTo.x, mouseTo.y], {
                    stroke: color,
                    strokeWidth: drawWidth
                });
                break;
            case "dottedline": //虚线
                canvasObject = new fabric.Line([mouseFrom.x, mouseFrom.y, mouseTo.x, mouseTo.y], {
                    strokeDashArray: [3, 1],
                    stroke: color,
                    strokeWidth: drawWidth
                });
                break;
            case "circle": //正圆
                var left = mouseFrom.x, top = mouseFrom.y;
                var radius = Math.sqrt((mouseTo.x - left) * (mouseTo.x - left) + (mouseTo.y - top) * (mouseTo.y - top)) / 2;
                canvasObject = new fabric.Circle({
                    left: left,
                    top: top,
                    stroke: color,
                    fill: "rgba(255, 255, 255, 0)",
                    radius: radius,
                    strokeWidth: drawWidth
                });
                break;
            case "ellipse": //椭圆
                var left = mouseFrom.x, top = mouseFrom.y;
                var radius = Math.sqrt((mouseTo.x - left) * (mouseTo.x - left) + (mouseTo.y - top) * (mouseTo.y - top)) / 2;
                canvasObject = new fabric.Ellipse({
                    left: left,
                    top: top,
                    stroke: color,
                    fill: "rgba(255, 255, 255, 0)",
                    originX: "center",
                    originY: "center",
                    rx: Math.abs(left - mouseTo.x),
                    ry: Math.abs(top - mouseTo.y),
                    strokeWidth: drawWidth
                });
                break;
            case "square": //TODO:正方形（后期完善）

                break;
            case "rectangle": //长方形
                var path = "M " + mouseFrom.x + " " + mouseFrom.y +
                    " L " + mouseTo.x + " " + mouseFrom.y +
                    " L " + mouseTo.x + " " + mouseTo.y +
                    " L " + mouseFrom.x + " " + mouseTo.y +
                    " L " + mouseFrom.x + " " + mouseFrom.y + " z";
                canvasObject = new fabric.Path(path, {
                    left: left,
                    top: top,
                    stroke: color,
                    strokeWidth: drawWidth,
                    fill: "rgba(255, 255, 255, 0)"
                });
                break;
            case "rightangle":

                break;
            case "equilateral":

                break;
            case "isosceles":

                break;
            case "text":
                canvasObject = new fabric.Textbox("", {
                    left: mouseTo.y,
                    top: mouseTo.x,
                    width: 150,
                    fontSize: 18,
                    borderColor: "#2c2c2c",
                    editingBorderColor: "#2c2c2c",
                    strokeWidth: drawWidth,
                    hasControls: false
                });
                break;
            case "remove":

                break;
            default:
                break;
        }
        if (canvasObject) {
            // canvasObject.index = getCanvasObjectIndex();
            canvas.add(canvasObject); //.setActiveObject(canvasObject)
        }
    }

    //绘制箭头方法
    function drawArrow(fromX, fromY, toX, toY, theta, headlen) {
        theta = typeof (theta) != 'undefined' ? theta : 30;
        headlen = typeof (theta) != 'undefined' ? headlen : 10;
        // 计算各角度和对应的P2,P3坐标 
        var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
            angle1 = (angle + theta) * Math.PI / 180,
            angle2 = (angle - theta) * Math.PI / 180,
            topX = headlen * Math.cos(angle1),
            topY = headlen * Math.sin(angle1),
            botX = headlen * Math.cos(angle2),
            botY = headlen * Math.sin(angle2);
        var arrowX = fromX - topX,
            arrowY = fromY - topY;
        var path = " M " + fromX + " " + fromY;
        path += " L " + toX + " " + toY;
        arrowX = toX + topX;
        arrowY = toY + topY;
        path += " M " + arrowX + " " + arrowY;
        path += " L " + toX + " " + toY;
        arrowX = toX + botX;
        arrowY = toY + botY;
        path += " L " + arrowX + " " + arrowY;
        return path;
    }

    //获取画板对象的下标
    function getCanvasObjectIndex() {
        return canvasObjectIndex++;
    }

})();