



(function(){
	
	
	
	
	var Physics2D = function () {
		
		var oP = this;
		
		oP.pGravity = [0,0];
		
		oP.aParticles = [];
		oP.aRectangles = [];
		
		oP.oRestraints = {aDistance: []};
		
	};
	
	
	
	
	Physics2D.prototype.vStep = function () {
		
		var oPhysics = this;
		
		/// accumulate forces
		
		oPhysics.aParticles.forEach(function(oP, iNr){
			oP.pPold[0] -= oPhysics.pGravity[0]
			oP.pPold[1] -= oPhysics.pGravity[1]
		});
		
		/// verlet
		
		oPhysics.aParticles.forEach(function(oP){
			for (var iI = 0; iI < 2; iI ++) {
				var nTemp = oP.pP[iI];
				oP.pP[iI] += 0.999 * (oP.pP[iI] - oP.pPold[iI]);
				oP.pPold[iI] = nTemp;
			}
		});
		
		/// satisfy constraints
		
		var bAverage = true;
		
		var iRelaxations = 2;
		
		for (var iRelaxation = 0; iRelaxation < iRelaxations; iRelaxation ++) {
			
			oPhysics.aParticles.forEach(function(oP){
				oP.aNewTemp = [];
			});
			
			oP.oRestraints.aDistance.forEach(function(oR){
				var pDelta = oLA.pSub(oR.oPA.pP, oR.oPB.pP);
				var nDelta = oLA.nLength(pDelta);
				var nCorrection = oR.nDistance - nDelta;
				if (nCorrection) {
					var pDeltaDir = oLA.pNormalize(pDelta);
					if (!pDeltaDir) {
						var nRandomDir = 9 * Math.random();
						pDeltaDir = [Math.sin(nRandomDir), Math.cos(nRandomDir)];
					}
					var pNewA = oLA.pAdd(oR.oPA.pP, oLA.pMultiplyNP(nCorrection, oLA.pMultiplyNP(+0.5, pDeltaDir)));
					var pNewB = oLA.pAdd(oR.oPB.pP, oLA.pMultiplyNP(nCorrection, oLA.pMultiplyNP(-0.5, pDeltaDir)));
					oR.oPA.aNewTemp.push(pNewA);
					oR.oPB.aNewTemp.push(pNewB);
				}
			});
			
			oPhysics.aParticles.forEach(function(oP){
				var iTempLength = oP.aNewTemp.length;
				if (iTempLength) {
					oP.pP = [0,0];
					for (var iT = 0; iT < iTempLength; iT ++) {
						oP.pP[0] += oP.aNewTemp[iT][0];
						oP.pP[1] += oP.aNewTemp[iT][1];
					}
					oP.pP[0] /= iTempLength;
					oP.pP[1] /= iTempLength;
				}
			});
			
		}
		
	};
	
	
	
	
	Physics2D.prototype.oNewDistantRestraint = function (nDistance, oPA, oPB) {
		
		var oP = this;
		
		var oNewDR = {nDistance: nDistance, oPA: oPA, oPB: oPB};
		
		oP.oRestraints.aDistance.push(oNewDR);
		
		return oNewDR;
		
	};
	
	
	
	
	Physics2D.Particle = function (nX, nY) {
		
		var oP = this;
		
		oP.nIM = 1;
		oP.pP = [nX, nY];
		oP.pPold = [nX, nY];
		
	};
	
	
	
	
	Physics2D.Rectangle = function () {
		
		var oC = this;
		
		oR.pCenter = [0,0];
		oR.pDirection = [1,0];
		oR.nW = 10;
		oR.nH = 10;
		
		oR.oFrame = {
			aParticles: [],
			aRestraints: [],
		}
		
		oR.oFrame.aParticles.push();
		
	};
	
	
	
	
	Physics2D.prototype.oNewParticle = function (nX, nY) {
		
		var oP = this;
		
		var oNewParticle = new Physics2D.Particle(nX, nY);
		
		oP.aParticles.push(oNewParticle);
		
		return oNewParticle;
		
	};
	
	
	
	
	Physics2D.prototype.oNewRectangle = function () {
		
		var oP = this;
		
		var oNewRectangle = new Physics2D.Rectangle();
		
		oP.aRectangles.push(oNewRectangle);
		
		return oNewRectangle;
		
	};
	
	
	
	
	window.Physics2D = Physics2D;
	
	
	
	
})();



