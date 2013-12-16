var Line = (function(){
  return {
    set: function(color, width, elem){
	       elem = elem.getContext('2d');
	       elem.strokeStyle = color;
	       elem.lineWidth = width;
		   elem.lineJoin = 'miter';
    },
	add: function(x1, y1, x2, y2, color, width, id, flag) {
	  //координаты линии
	  this.x1 = x1;
	  this.y1 = y1;
	  this.x2 = x2;
	  this.y2 = y2;
	  //координаты середины
	  this.x_ = Math.round((this.x2 + this.x1)/2);
	  this.y_ = Math.round((this.y2 + this.y1)/2);
	  //цвет линии
	  this.select = false;
	  var sel = this.select;
	  this.color = c();
	  function c(){
	    var cr;
	    if(sel) cr = 'red';
		else cr = color;
		return cr;
	  }
	  //ширина линии
	  this.width = width;
	  this.length = Math.round(Math.sqrt(Math.pow(this.x2 - this.x1, 2) + Math.pow(this.y2 - this.y1, 2)));
	  //идентификатор (номер) линии
	  this.id = id;
	  //смещение линии при перемещении
      this.offsetX0 = 0;
      this.offsetY0 = 0;
	  this.offsetX1 = 0;
      this.offsetY1 = 0;
	  //коэффициенты уравнения прямой
	  this.A = Math.round(this.y2 - this.y1);
	  this.B = Math.round(this.x1 - this.x2);
	  this.C = Math.round(-this.x1*(this.y2 - this.y1) + this.y1*(this.x2 - this.x1));
	  //минимальное расстояние от точки до прямой
	  this.normal_eq = function(mouseX, mouseY){
	    return Math.round(Math.abs((this.A*mouseX + this.B*mouseY + this.C))/
		  (Math.sqrt(Math.pow(this.A, 2) + Math.pow(this.B, 2))));
	  };
	  //метка длинной линии
	  this.longf = flag || false;
	  this.pointX = [];
	  this.pointY = [];
	}
  }
}());



