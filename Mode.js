var mode = {};
var lineArr = [];

//режим рисования
mode.line = function (Draw, Building) {
  //курсор в режиме рисования
  Draw.style.cursor = 'default';
  //создание контекста канваса Draw
  var context = Draw.getContext('2d');
  //параметры линии
  new Line.set('black', 10, Draw);
  //координаты начала и конца линии
  var x1, x2; 
  var y1, y2;
  //флаг начала рисования
  var started = false;
  //идентификатор (номер) линии
  var id = lineArr.length;
  //смещение холста
  var top = Draw.offsetTop;
  var left = Draw.offsetLeft;
  
  this.mousedown = function (ev) {
    started = true;
    x1 = ev.pageX - left;
    y1 = ev.pageY - top;
  };

  this.mousemove = function (ev) {
    if (!started) return;
	x2 = ev.pageX - left;
	y2 = ev.pageY - top;
	
    context.clearRect(0, 0, Draw.width, Draw.height);
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
    context.closePath();
  };

  this.mouseup = function (ev) {
    if (!started) return;
    this.mousemove(ev);
    started = false;
	lineArr.push(new Line.add(x1, y1, x2, y2, context.strokeStyle, context.lineWidth, id));
	id++;    
	new UPD.call(Building,Draw,lineArr);
  };
}

// режим перемещения
mode.move = function (Draw, Building) {
  var context = Draw.getContext('2d');
  //флаг режима перемещения линии
  var drag = false;
  //флаг режима перемещения конца линии
  var changing_length = {start: false, end: false};
  var dx, //радиус вокруг точки
      id; //идентификатор линии
  
  var top = Draw.offsetTop;
  var left = Draw.offsetLeft;
  
  this.mousedown = function (ev) {
    var mouseX = ev.pageX - left;
	var mouseY = ev.pageY - top;
	
	//поиск линии на холсте
	for (var i in lineArr) {
	  var line = lineArr[i];
	  dx = r(line);
	  //расстояние до прямой
	  var h = line.normal_eq(mouseX, mouseY);
	  if(h <= dx){
	    //линия на северо-запад
		if (line.y1 > line.y2 && line.x1 > line.x2){
		  if(mouseY > line.y1 && mouseX > line.x1 || mouseY < line.y2 && mouseX < line.x2) break;
		  findLine (line, mouseX, mouseY);
	      id = line.id;
		  return;
		}
		//линия на северо-восток
		if (line.y1 > line.y2 && line.x2 > line.x1){
		  if(mouseY > line.y1 && mouseX < line.x1 || mouseY < line.y2 && mouseX > line.x2) break;
		  findLine (line, mouseX, mouseY);
	      id = line.id;
		  return;
		}
		//линия на юго-восток
		if (line.y2 > line.y1 && line.x1 > line.x2){
		  if(mouseY < line.y1 && mouseX < line.x1 || mouseY > line.y2 && mouseX > line.x2) break;
		  findLine (line, mouseX, mouseY);
	      id = line.id;
		  return;
		}
		//линия на юго-запад
		if (line.y2 > line.y1 && line.x2 > line.x1){
		  if(mouseY < line.y1 && mouseX > line.x1 || mouseY > line.y2 && mouseX < line.x2) break;
		  findLine (line, mouseX, mouseY);
	      id = line.id;
		  return;
		}
		if (line.y1 == line.y2){
		  //на запад
		  if (line.x1 > line.x2){
		    if(mouseX > line.x1 || mouseX < line.x2) continue;
		    findLine (line, mouseX, mouseY);
	        id = line.id;
		    return;
		  }
		  //на восток
		  if (line.x2 > line.x1){
		    if(mouseX < line.x1 || mouseX > line.x2) continue;
		    findLine (line, mouseX, mouseY);
	        id = line.id;
		    return;
		  }
		}
		if (line.x1 == line.x2){
		  //на север
		  if (line.y1 > line.y2){
		    if(mouseY > line.y1 || mouseY < line.y2) continue;
		    findLine (line, mouseX, mouseY);
	        id = line.id;
		    return;
		  }
		  //на юг
		  if (line.y2 > line.y1){
		    if(mouseY < line.y1 || mouseY > line.y2) continue;
		    findLine (line, mouseX, mouseY);
	        id = line.id;
		    return;
		  }
		}
	  }
	}
  };

  this.mousemove = function (ev) {
    Draw.style.cursor = 'default';
    var mouseX = ev.pageX - left;
	var mouseY = ev.pageY - top;
	
	if (id != undefined){
	  //обновление в начале, для отображения подсветки точек поверх линии
	  //new UPD.call(Building,Draw,lineArr);
	  //пересчет координат середины во время движения, чтоб эта точка не отставала от линии
	  lineArr[id].x_ = Math.round((lineArr[id].x2 + lineArr[id].x1)/2);
	  lineArr[id].y_ = Math.round((lineArr[id].y2 + lineArr[id].y1)/2);
	}
   
	//перемещение линии
    if (drag) {
	new UPD.call(Building,Draw,lineArr);
	  //курсор в момент перемещения
	  Draw.style.cursor = 'help';
      //изменение координат фигуры
      lineArr[id].x1 = mouseX - lineArr[id].offsetX0;
      lineArr[id].y1 = mouseY - lineArr[id].offsetY0;
	  lineArr[id].x2 = mouseX - lineArr[id].offsetX1;
      lineArr[id].y2 = mouseY - lineArr[id].offsetY1;
	  backlight(lineArr[id]);
    }
	//изменение положения начальной точки линии
	if (changing_length.start){
	new UPD.call(Building,Draw,lineArr);
	  //курсор в момент перемещения
	  Draw.style.cursor = 'default';
	  //новые координаты точки
	  lineArr[id].x1 = mouseX;
      lineArr[id].y1 = mouseY;
	  backlight(lineArr[id]);
	  concat(lineArr[id]);
    }
	//изменение положения конечной точки линии
	if (changing_length.end){
	new UPD.call(Building,Draw,lineArr);
	  Draw.style.cursor = 'default';
	  lineArr[id].x2 = mouseX;
      lineArr[id].y2 = mouseY;
	  backlight(lineArr[id]);
	  concat(lineArr[id]);	  
	}
	
	//обнаружение линии при наведении мыши
	for (var i in lineArr) {
	
	  var line = lineArr[i];
	  dx = r(line);
	  var h = line.normal_eq(mouseX, mouseY);
	  if(h <= dx){
	    if (line.y1 > line.y2){
		  if(mouseY > line.y1 || mouseY < line.y2) return;	
		  Draw.style.cursor = 'help';
		  backlight(line);
		}
		if (line.y1 < line.y2){
		  if(mouseY < line.y1 || mouseY > line.y2) return;
		  Draw.style.cursor = 'help';
		  backlight(line);
		}
		if(line.x1 > line.x2){
		  if(mouseX > line.x1 || mouseX < line.x2) return;
		  Draw.style.cursor = 'help';
		  backlight(line);
		}
		if(line.x1 < line.x2){
		  if(mouseX < line.x1 || mouseX > line.x2) return;
		  Draw.style.cursor = 'help';
		  backlight(line);
		}
	  }
	}
	
  };

  this.mouseup = function (ev) {
    //прекращение перемещения линии
    if (drag) drag = false;
	//прекращение перемещения начальной точки линии
	if (changing_length.start) changing_length.start = false;
	//прекращение перемещения конечной точки линии
	if (changing_length.end) changing_length.end = false;
	//перезапись изменившихся данных линии
	if (id != undefined){
	  lineArr[id] = new Line.add(lineArr[id].x1, lineArr[id].y1, lineArr[id].x2, lineArr[id].y2, lineArr[id].color, lineArr[id].width, lineArr[id].id);
	}
	new UPD.call(Building,Draw,lineArr);
	id = undefined;
  };
  
  this.click = function(ev){
    context.fillStyle  = '#fff';
	context.lineWidth = 1;
    var mouseX = ev.pageX - left;
	var mouseY = ev.pageY - top;
	for (var i in lineArr) {
	  var line = lineArr[i];
	  dx = r(line);
	  var h = line.normal_eq(mouseX, mouseY);
	  if(h <= dx){
		if (line.y1 >= line.y2){
		  if(mouseY > line.y1 || mouseY < line.y2) return;
		  //fill(line, 1);
		  for (var x=line.x1; x<=line.x2; x++){
	      for (var y=line.y1; y>=line.y2; y--){
	      if (line.normal_eq(x, y) > dx-1) continue;
		  if (x%3 != 1) continue;
		  if (y%3 != 1) continue;
		  context.beginPath();
		  context.arc(x, y, 1, 0, Math.PI*2, true);
		  context.stroke();
		  context.fill();
		  }
          }		  
		  continue;
		}
		if (line.y1 < line.y2){
		  if(mouseY < line.y1 || mouseY > line.y2) return;
		  //fill(line, 2);
		  for (var x=line.x1; x<=line.x2; x++){
	      for (var y=line.y1; y<=line.y2; y++){
	      if (line.normal_eq(x, y) > dx-1) continue;
		  if (x%3 != 1) continue;
		  if (y%3 != 1) continue;
		  context.beginPath();
		  context.arc(x, y, 1, 0, Math.PI*2, true);
		  context.stroke();
		  context.fill();
		  }
	      }
		  continue;
		}
		if(line.x1 >= line.x2){
	      if(mouseX > line.x1 || mouseX < line.x2) return;
		  //fill(line, 3);
		  
		  for (var x=line.x1; x<=line.x2; x++){
	      for (var y=line.y1; y<=line.y2; y++){
	      if (line.normal_eq(x, y) > dx-1) continue;
		  if (x%3 != 1) continue;
		  if (y%3 != 1) continue;
		  context.beginPath();
		  context.arc(x, y, 1, 0, Math.PI*2, true);
		  context.stroke();
		  context.fill();
		  }
	      }
		  return;
		}
		if(line.x1 < line.x2){
		  if(mouseX < line.x1 || mouseX > line.x2) return;
		  fill(line, 4);
		  return;
		}
	  }
	}
  };
	
	function fill(line, i){
	  for (var x=line.x1; x<=line.x2; x++){
	    for (var y=line.y1; y<=line.y2; y++){
	      if (line.normal_eq(x, y) > dx-1) continue;
		  if (x%3 != 1) continue;
		  if (y%3 != 1) continue;
		  context.beginPath();
		  context.arc(x, y, 1, 0, Math.PI*2, true);
		  context.stroke();
		  context.fill();
		}
	  }
	  alert(i);
	}
  
  //функция подсветки концов и середины линии
  function backlight(line){
	var z = dx + 1;
    
    bl('x1','y1',z, 'red');
	bl('x2','y2',z, 'green');
	bl('x_','y_',z);
	
	function bl(x, y, z, color){
	  with(context){
	    lineWidth = 2;
	    strokeStyle = "#6BA0FF";
	    fillStyle = color || "#B451A9";
	    strokeRect(line[x]-z/2, line[y]-z/2, z, z); 
        fillRect(line[x]-z/2, line[y]-z/2, z, z);
	  }
	}
  }
  
  /** Функция, включающая поиск концов линии и реагирующая на событие перемещение
  line - активная линия
  mX, mY - кординаты мыши
  */
  function findLine (line, mX, mY){
    with (line){
      if(mX < x1 + dx && mX > x1 - dx && mY < y1 + dx && mY > y1 - dx) {
	    changing_length.start = true;
		changing_length.end = false;
	    return;
	  }
	  if(mX < x2 + dx && mX > x2 - dx && mY < y2 + dx && mY > y2 - dx) {
	    changing_length.end = true;
		changing_length.start = false;
	    return;
	  }
	  drag = true;
	  offsetX0 = mX - x1;
	  offsetY0 = mY - y1;
	  offsetX1 = mX - x2;
	  offsetY1 = mY - y2;
    }
  }
    
  /** Функция соединения линий
  aLine - активная линия
  lineArr - массив существующих линий
  mX, mY - кординаты мыши
  */
  function concat(aLine){
	dx = r(aLine)+2;
    for (var i in lineArr){
		if(aLine.x1 < lineArr[i].x1 + dx && aLine.x1 > lineArr[i].x1 - dx && aLine.y1 < lineArr[i].y1 + dx && aLine.y1 > lineArr[i].y1 - dx) {
		  if (lineArr[i].id == aLine.id) continue;
          aLine.x1 = lineArr[i].x1;
		  aLine.y1 = lineArr[i].y1;
		}
		if(aLine.x2 < lineArr[i].x2 + dx && aLine.x2 > lineArr[i].x2 - dx && aLine.y2 < lineArr[i].y2 + dx && aLine.y2 > lineArr[i].y2 - dx) {
		  if (lineArr[i].id == aLine.id) continue;
		  aLine.x2 = lineArr[i].x2;
		  aLine.y2 = lineArr[i].y2;
		}
		if(aLine.x1 < lineArr[i].x2 + dx && aLine.x1 > lineArr[i].x2 - dx && aLine.y1 < lineArr[i].y2 + dx && aLine.y1 > lineArr[i].y2 - dx) {
		  if (lineArr[i].id == aLine.id) continue;
		  aLine.x1 = lineArr[i].x2;
		  aLine.y1 = lineArr[i].y2;
		}
		if(aLine.x2 < lineArr[i].x1 + dx && aLine.x2 > lineArr[i].x1 - dx && aLine.y2 < lineArr[i].y1 + dx && aLine.y2 > lineArr[i].y1 - dx) {
		  if (lineArr[i].id == aLine.id) continue;
		  aLine.x2 = lineArr[i].x1;
		  aLine.y2 = lineArr[i].y1;
		}
	  }
  }
  
  /** Радиус вокруг линии
  line - активная линия
  */
  function r(line) {
    var dx;
    if (line.width <= 2) dx = Math.round(line.width+2/2); 
	else dx = Math.round(line.width/2);
	return dx;
  }
  
}

/** BAGS
1. ЛИНИЯ КОЛЛАПСИРУЕТ. Когда в режим перемещения попадает две линии, одна исчезает. Info показывает, что координаты начальной и конечной точки совпадают => нужно искать почему они приравниваются

*/

/**
не соединять линии, а правильно стыковать
*/