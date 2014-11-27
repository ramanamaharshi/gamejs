



var oGame = new Game(500, 400);
var oG = oGame.oG;
var oI = oGame.oI;




var oState = {};




var vInit = function () {
	
	oState.nTimestep = 1;
	oState.pGravity = [0, 0.002];
	
	oState.aParticles = [];
	
	for (var i = 0; i < 33; i ++) {
		var oParticle = {pP: [250,300], pPold: [250,305], pA: [0,0]};
		oParticle.pPold[0] += 8 * (Math.random() - 0.5);
		oParticle.pP[0] += 2 * (Math.random() - 0.5);
		oParticle.pP[1] += 2 * (Math.random() - 0.5);
		oState.aParticles.push(oParticle);
	}
	
	oState.aParticleSticks = [];
	
	for (var iP = 2; iP < oState.aParticles.length; iP += 3) {
		oState.aParticleSticks.push({oPA: oState.aParticles[iP - 0], oPB: oState.aParticles[iP - 1], nLength: 50});
		oState.aParticleSticks.push({oPA: oState.aParticles[iP - 1], oPB: oState.aParticles[iP - 2], nLength: 50});
		oState.aParticleSticks.push({oPA: oState.aParticles[iP - 2], oPB: oState.aParticles[iP - 0], nLength: 50});
	}
	
};




var vInput = function () {
	
	
};




var vCalc = function () {
	
	var fTimeStep = 1;
	
	/// accumulate forces
	
	for (var iP = 0; iP < oState.aParticles.length; iP ++) {
		var oP = oState.aParticles[iP];
		oP.pA = oLA.pAdd(oP.pA, oState.pGravity);
	}
	
	/// verlet
	
	for (var iP = 0; iP < oState.aParticles.length; iP ++) {
		var oP = oState.aParticles[iP];
		for (var iI = 0; iI < 2; iI ++) {
			var nTemp = oP.pP[iI];
			oP.pP[iI] += oP.pP[iI] - oP.pPold[iI] + oP.pA[iI] * oState.nTimestep * oState.nTimestep;
			oP.pPold[iI] = nTemp;
		}
	}
	
	/// satisfy constraints
	
	for (var iI = 0; iI < 9; iI ++) {
		
		for (var iP = 0; iP < oState.aParticles.length; iP ++) {
			var oP = oState.aParticles[iP];
			oP.pP[0] = Math.max(0, Math.min(oP.pP[0], oGame.oG.iWidth));
			oP.pP[1] = Math.max(0, Math.min(oP.pP[1], oGame.oG.iHeight));
		}
		
		for (var iPS = 0; iPS < oState.aParticleSticks.length; iPS ++) {
			var oStick = oState.aParticleSticks[iPS];
			var nRestLength = oStick.nLength;
			var pDelta = oLA.pSub(oStick.oPA.pP, oStick.oPB.pP)
			var pDeltaDir = oLA.pNormalize(pDelta);
			var nDelta = oLA.nLength(pDelta);
			var nCorrection = nRestLength - nDelta;
			oStick.oPA.pP = oLA.pAdd(oStick.oPA.pP, oLA.pMultiplyNP(nCorrection, oLA.pMultiplyNP(0.5, pDeltaDir)));
			oStick.oPB.pP = oLA.pAdd(oStick.oPB.pP, oLA.pMultiplyNP(nCorrection, oLA.pMultiplyNP(-0.5, pDeltaDir)));
		}
		
	}
	
};




var vDraw = function () {
	
	oG.vSetColor('#FFF');
	oG.vFillRect(0, 0, oG.iWidth, oG.iHeight);
	oG.vSetColor('#000');
	
	for (var iP = 0; iP < oState.aParticles.length; iP ++) {
		var oP = oState.aParticles[iP];
		oG.vFillRect(oP.pP[0] - 1, oP.pP[1] - 1, 2, 2);
	}
	
	for (var iPS = 0; iPS < oState.aParticleSticks.length; iPS ++) {
		var oStick = oState.aParticleSticks[iPS];
		oG.vDrawLine(oStick.oPA.pP[0], oStick.oPA.pP[1], oStick.oPB.pP[0], oStick.oPB.pP[1]);
	}
	
};




vInit();

oGame.vStartLoop(function(iUT, iDeltaUT){
	vInput();
	vCalc();
	vDraw();
});



