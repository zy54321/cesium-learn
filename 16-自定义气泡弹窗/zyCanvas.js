
var mCanvas; //声明Canvas对象;
var cxt; //声明context对象,该对象拥有丰富的绘图的API
function initMikyouCanvas(mCanvas, cxt) {
	this.mCanvas = mCanvas;
	this.cxt = cxt;
}
/**
 * 1、绘制矩形(主要分为:绘制填充矩形和绘制边框矩形和清除矩形区域(利用isClear标记是否绘制清除矩形，实际上就是绘制一个与画布背景色一致的矩形区域),利用isFill变量来标记)
 * 主要使用canvas原生的API:FillRect(x,y,width,height),StrokeRect(x,y,width,height),ClearRect(x,y,width,height)
 * 自己封装的参数:drawRect(x,y,width,height,isClear,isFill,bgColor)
 * x:矩形起点的X坐标(注意：相对坐标系是以画布的左上角为原点，向右为X坐标正方向，向下为Y坐标的正方向)
 * y:矩形终点的Y坐标
 * width:矩形的宽度
 * height:矩形的高度
 * isClear:是否绘制清除画布的矩形区域，true则就是绘制一个清除画布矩形区域，false就是绘制其他两种矩形
 * isFill:是否是填充，false为绘制边框，true为绘制填充
 * bgColor:矩形的颜色，若为填充则为整个矩形背景色，边框则为边框色
 * */
function drawRect(x, y, width, height, isClear, isFill, bgColor) {
	if (isClear) { //为true表示绘制清除画布的矩形区域,那么传入的isFill, bgColor值可以为任意值
		cxt.clearRect(x, y, width, height);
	} else { //false
		if (isFill) { //为true，则绘制填充矩形
			cxt.fillStyle = bgColor;
			cxt.fillRect(x, y, width, height);
		} else { //为false,则绘制边框矩形
			cxt.strokeStyle = bgColor;
			cxt.strokeRect(x, y, width, height);
		}
	}
 
}
/**
 * 2、绘制圆弧(主要分为：绘制填充圆弧和绘制圆弧边框利用isFill变量来标记,注意：在绘制圆弧边框的时候还有一种特殊情况就是，只需要仅仅绘制弧边，不需要绘制圆弧开始起点和终点之间的连线，这个就是调用了beginPath()不需要调用closePath(),这里也使用一个isOnlyArc变量来标记true为仅仅绘制弧边
 *其他的正常)
 * 主要是使用的是canvas原生的API:
 * arc(x,y,radius,startAngle,endAngle,anticlockwise);
 * x:圆心X坐标
 * y:圆心Y坐标
 * startAngle:开始的弧度
 * endAngle:结束的弧度
 * anticlockwise:true为逆时针，false为顺时针
 * 自己封装的参数:drawCircle(x,y,radius,startAngle，endAngle,anticlockwise,isFill，bgColor)
 * x:圆心X坐标
 * y:圆心Y坐标
 * startAngle:开始的角度(通过getAngle方法将传入的角度转换成相应角度的弧度，
 * 	因为在原生的绘制圆弧的API它是根据弧度大小来绘制的，例如如果你想绘制一个30度的圆弧，如果直接传入30是不行的，要传入Math.PI/6
 * 所以在这里个人做了一个优化，直接传入30就通过getAngle方法转换成Math.PI/6，这样就很方便的绘制自己传入的角度大小的圆弧。
 * )
 * endAngle:结束的角度
 * 注意:如果要绘制圆形那么只需要调用该方法，传入的startAngle和endAngle是0度和360度即可。
 * anticlockwise:true为逆时针，false为顺时针
 * isFill:是否是填充，false为绘制边框，true为绘制填充
 * bgColor:圆弧的颜色
 * */
function drawArc(x, y, radius, startAngle, endAngle, anticlockwise, isOnlyArc, isFill, bgColor) {
	if (isFill) { //为true绘制填充圆弧
		cxt.fillStyle = bgColor;
		cxt.beginPath();
		cxt.arc(x, y, radius, getAngle(startAngle), getAngle(endAngle), anticlockwise);
		cxt.closePath();
		cxt.fill();
	} else { //为false绘制边框圆弧
		cxt.strokeStyle = bgColor;
		cxt.beginPath();
		cxt.arc(x, y, radius, getAngle(startAngle), getAngle(endAngle), anticlockwise);
		if (isOnlyArc) { //绘制边框的另一种情况就是仅仅绘制弧边不需要调用closePath()
 
		} else { //否则就是不仅绘制边框还得绘制起点和终点的连线，需要调用了closePath();
			cxt.closePath();
		}
 
		cxt.stroke();
	}
}
/**
 * 3、绘制扇形(主要分为：绘制填充扇形和绘制扇形边框利用isFill变量来标记）
 *主要是使用的是canvas原生的API:
 * arc(x,y,radius,startAngle,endAngle,anticlockwise);
 * x:圆心X坐标
 * y:圆心Y坐标
 * startAngle:开始的弧度
 * endAngle:结束的弧度
 * anticlockwise:true为逆时针，false为顺时针
 * 自己封装参数API:drawSector(x,y,radius,startAngle,endAngle,anticlockwise,isFill,bgColor);
 * x:圆心X坐标
 * y:圆心Y坐标
 * startAngle:开始的角度(通过getAngle方法将传入的角度转换成相应角度的弧度，
 * 	因为在原生的绘制圆弧的API它是根据弧度大小来绘制的，例如如果你想绘制一个30度的圆弧，如果直接传入30是不行的，要传入Math.PI/6
 * 所以在这里个人做了一个优化，直接传入30就通过getAngle方法转换成Math.PI/6，这样就很方便的绘制自己传入的角度大小的圆弧。
 * )
 * endAngle:结束的角度
 * anticlockwise:true为逆时针，false为顺时针
 * isFill:是否是填充，false为绘制边框，true为绘制填充
 * bgColor:扇形的颜色
 * */
function drawSector(x, y, radius, startAngle, endAngle, anticlockwise, isFill, bgColor) {
	if (isFill) {
		cxt.fillStyle = bgColor;
 
		cxt.beginPath();
		cxt.moveTo(x, y); //把路径移动到画布中的指定点，不创建线条，注意：绘制扇形唯一与绘制弧的区别在于，紧跟着beginPath()后面调用，首先将路径移动到圆心位置
		cxt.arc(x, y, radius, getAngle(startAngle), getAngle(endAngle), false);
		cxt.closePath();
		cxt.fill();
	} else {
		cxt.strokeStyle = bgColor;
 
		cxt.beginPath();
		cxt.moveTo(x, y);
		cxt.arc(x, y, radius, getAngle(startAngle), getAngle(endAngle), false);
		cxt.closePath();
		cxt.stroke();
	}
}
/**
 * @description 4、绘制线段(主要分为：绘制填充线段和绘制空心线段利用isFill变量来标记）
 * 主要是使用的是canvas原生的API:
 * lineTo(x,y):表示从某点连线到该坐标点
 *moveTo(x,y):表示将路径移动到画布中的该坐标点
 * x:画布中某点的X坐标
 * y:画布中某点的Y坐标
 * 注意：如果开始没有调用moveTo,那么第一个lineTo的功能就相当于一个moveTo
 * 自己封装的API:drawLine(startX,startY,endX,endY,lineWidth,bgcolor)
 * 
 * startX:表示线的起点的X坐标
 * startY:表示起点的Y坐标
 * endX:表示线的终点的X坐标
 * endY:表示线的终点的Y坐标
 * lineWidth:表示线段的宽度
 * bgColor:线的颜色
 * */
function drawLine(startX, startY, endX, endY, lineWidth, bgColor) {
	cxt.beginPath();
	cxt.lineWidth = lineWidth;
	cxt.fillStyle = bgColor;//经过测试不管是fillStyle还是StrokeStyle都是一样的
	cxt.moveTo(startX, startY);
	cxt.lineTo(endX, endY);
	cxt.closePath();
	cxt.fill();
}
/**
 * @description 5、绘制贝塞尔曲线
 * drawBezierCurve
 * */
 
//将角度转换成弧度函数，
function getAngle(arc) {
	return Math.PI * (arc / 180);
}