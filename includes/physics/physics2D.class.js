



(function(){
	
	
	
	
	var Physics2D = function () {
		
		var oP = this;
		
		oP.aCircles = [];
		
		oP.aPolygons = [];
		
	};
	
	
	
	
	Physics2D.prototype.oNewCircle = function () {
		
		var oP = this;
		
		var oNewCircle = new Physics2D.Circle();
		
		oP.aCircles.push(oNewCircle);
		
		return oNewCircle;
		
	};
	
	
	
	
	Physics2D.prototype.oNewPolygon = function () {
		
		var oP = this;
		
		var oNewPolygon = new Physics2D.Polygon();
		
		oP.aPolygons.push(oNewPolygon);
		
		return oNewPolygon;
		
	};
	
	
	
	
	Physics2D.prototype.oNewLine = function () {
	};
	
	
	
	
	Physics2D.Circle = function () {
		
		var oC = this;
		
		oC.nR = 0;
		oC.nIM = 0;
		oC.pP = [0,0];
		oC.pV = [0,0];
		
	};
	
	
	
	
	Physics2D.Polygon = function () {
		
		var oP = this;
		
		oP.aCorners = [];
		
		oP.pLIM = 0;
		oP.pLP = [0,0];
		oP.pLV = [0,0];
		
		oP.pLAM = 0;
		oP.nAP = 0;
		oP.nAV = 0;
		
	};
	
	
	
	
})();



