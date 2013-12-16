var UPD = (function(){
  /**
  targetCanvas - целевое поле отрисовки
  originalCanvas - поле получения изображения
  lineArr - массив линий
  */
  return {
    call: function(targetCanvas, originalCanvas, lineArr){
	  var targetContext = targetCanvas.getContext('2d');
	  var originalContext = originalCanvas.getContext('2d');
	  targetContext.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
	  for (var i in lineArr){
	    var line = lineArr[i];
		if (!line.longf){
		  var color = line.color;
	      originalContext.lineWidth = line.width;
	      originalContext.strokeStyle = color;
	      originalContext.beginPath();
		  originalContext.moveTo(line.x1, line.y1);
		  originalContext.lineTo(line.x2, line.y2);
		  originalContext.stroke();
		  originalContext.closePath();
		}
		if (line.longf){
		  originalContext.lineWidth = line.width;
	      originalContext.strokeStyle = line.color;
	      originalContext.beginPath();
		  originalContext.moveTo(line.x1, line.y1);
		  for (var j in line.pointX){
		    originalContext.lineTo(line.pointX[j], line.pointY[j]);
		  }
		  originalContext.stroke();
		  originalContext.closePath();
		}
	  }
	  targetContext.drawImage(originalCanvas, 0, 0);
      originalContext.clearRect(0, 0, originalCanvas.width, originalCanvas.height);
	}
  }
}());