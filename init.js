if(window.addEventListener) {
  window.addEventListener('load', function () {
  var size = {width: 500, height: 500};
  var Draw, Building, Text, Route, Icons, Gridc;
  var tool;
  
  // Initialization canvas
  Gridc = new Canvas.add(document.getElementById("grid"), size, {zIndex: '-1', backgroundColor: 'transparent'});
  Building = new Canvas.add(document.getElementById("building"),size, {zIndex: '0'});
  Text = new Canvas.add(document.getElementById("text"), size, {zIndex: '1'});
  Route = new Canvas.add(document.getElementById("route"), size, {zIndex: '2'});
  Icons = new Canvas.add(document.getElementById("icons"), size, {zIndex: '3'});
  Draw = new Canvas.add(document.getElementById("draw"), size, {zIndex: '4'});
  
  var p = new Grid(10, Gridc);
  
  //Add eventListener
  Event.add(Draw, 'mousedown', select);
  Event.add(Draw, 'mousemove', select);
  Event.add(Draw, 'mouseup', select);
  Event.add(Draw, 'click', select);

  function init(){
    tool = new mode['line'](Draw, Building);
  }

  function select(ev) {
    if(tool[ev.type])tool[ev.type](ev);
  }

  //Event buttons
  //line {color: black, width: 10}
  (function type0() {
    var t0 = document.getElementById('d_line');
	t0.onclick = function(){
	  new Line.set('black', 10, Draw);
	}
  }());
  
  //line {color: green, width: 15}
  (function type1() {
    var t0 = document.getElementById('h_line');
	t0.onclick = function(){
	  new Line.set('green', 15, Draw);
	}
  }());
  
  //line {color: red, width: 5}
  (function type2() {
    var t0 = document.getElementById('t_line');
	t0.onclick = function(){
	  new Line.set('red', 5, Draw);
	}
  }());
  
  //включение режима перемещения
  (function move() {
    var m = document.getElementById('m_line');
	m.onclick = function(){
	  tool = new mode['move'](Draw, Building);
	}
  }());
   
  //включение режима рисования
  (function draw() {
    var d = document.getElementById('dr_line');
	d.onclick = function(){
	  new Line.set('black', 10, Draw);
	  tool = new mode['line'](Draw, Building);
	}
  }());

  //Показать информацию о линиях
  (function info() {
    var i = document.getElementById('i_line');
	i.onclick = function(){
      var str='';
	  for (var c in lineArr){
	    for (var p in lineArr[c]) str += lineArr[c][p]+',';
		alert(str);
		str='';
	  }
	}
  }());

  init();
}, false); }

