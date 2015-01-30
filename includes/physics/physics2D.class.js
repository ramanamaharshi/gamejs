



(function(){
	
	
	
	
	var Physics2D = function () {
		
		var oP = this;
		
		oP.aParticles = [];
		oP.aRectangles = [];
		
	};
	
	
	
	
	Physics2D.prototype.vStep = function () {
		
		
		
	};
	
	
	
	
	Physics2D.prototype.oNewParticle = function (nX, nY) {
		
		var oP = this;
		
		var oNewParticle = new Physics2D.Particle();
		
		oP.aParticles.push(oNewParticle);
		
		return oNewParticle;
		
	};
	
	
	
	
	Physics2D.Particle = function () {
		
		var oP = this;
		
		oP.aRestraints = [];
		oP.aP = [nX, nY];
		oP.nIM = 1;
		
	};
	
	
	
	
	Physics2D.prototype.oNewRectangle = function () {
		
		var oP = this;
		
		var oNewRectangle = new Physics2D.Rectangle();
		
		oP.aRectangles.push(oNewRectangle);
		
		return oNewRectangle;
		
	};
	
	
	
	
	Physics2D.Rectangle = function () {
		
		var oC = this;
		
		oR.pCenter = [0,0];
		oR.pDirection = [1,0];
		oR.nW = 10;
		oR.nH = 10;
		
		oR.oFrame = {
			aParticles: [
			],
			aRestraings: [
			],
		}
		
	};
	
	
	
	
})();



