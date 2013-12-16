/**
Create new Canvas
*/
var Canvas = (function(){
  return {
    /** 
	elem - DOMelement canvas
	size - Object {width: 'value', height: 'value'}
	style - Object {CSSstyle: 'value'}
	*/
    add: function(elem, size, style){
	  if (!elem) {alert('Ошибка! Canvas элемент не найден!'); return;}
	  
	  if(size){
	    for (var key in size) {
		  elem[key] = size[key];
        }
	  }
	  
	  if (style){
        for (var key in style) {
		  elem.style[key] = style[key];
        }
	  }
	  //возвращает готовый канвас
	  return elem;
	}
  }
}());

/**
Create grid on canvas
return points - точки по осям
*/
var Grid = function(value, canvas){
	this.canvas = canvas;
	new Line.set('#65A6D1', 0.5, this.canvas);
    var context = this.canvas.getContext('2d');
	
	var rx = this.canvas.width/value;
	var ry = this.canvas.height/value;
	var x = y = 0;
	var points = {};
	points.x = [];
	points.y = [];
    
	for (var i=0; i<=value; i++){
	  points.x.push(x);
	  context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, this.canvas.height);
      context.stroke();
      context.closePath();
	  x += rx;
	  
	  points.y.push(y);
	  context.beginPath();
      context.moveTo(0, y);
      context.lineTo(this.canvas.width, y);
      context.stroke();
      context.closePath();
	  y += ry;
	}
	return points;
  }