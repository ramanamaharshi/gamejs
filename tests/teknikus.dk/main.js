



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
	oState.aMinDistances = [];
	oState.aMaxDistances = [];
	
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
	
	var pGameSize = [oGame.oG.iWidth,oGame.oG.iHeight];
	
	for (var iI = 0; iI < 9; iI ++) {
		
		for (var iP = 0; iP < oState.aParticles.length; iP ++) {
			var oP = oState.aParticles[iP];
			for (var iDA = 0; iDA < 2; iDA ++) {
				iDB = (iDA + 1) % 2;
				var nPenetrationDepth = 0;
				if (oP.pP[iDA] < 0) {
					var nPenetrationDepth = 0 - oP.pP[iDA];
					oP.pP[iDA] = 0;
				}
				if (oP.pP[iDA] > pGameSize[iDA]) {
					var nPenetrationDepth = oP.pP[iDA] - pGameSize[iDA];
					oP.pP[iDA] = pGameSize[iDA];
				}
				if (nPenetrationDepth != 0) {
					var nSpeed = oP.pP[iDB] - oP.pPold[iDB];
					nSpeed -= 0.1 * nPenetrationDepth * oLA.nDir(nSpeed);
					oP.pPold[iDB] = oP.pP[iDB] - nSpeed;
				}
			}
		}
		
		for (var iPS = 0; iPS < oState.aParticleSticks.length; iPS ++) {
			var oStick = oState.aParticleSticks[iPS];
			var nRestLength = oStick.nLength;
			var pDelta = oLA.pSub(oStick.oPA.pP, oStick.oPB.pP);
			var nDelta = oLA.nLength(pDelta);
			var nCorrection = nRestLength - nDelta;
			if (nCorrection) {
				nCorrection *= 0.05;
				var pDeltaDir = oLA.pNormalize(pDelta);
				pDeltaDir = oLA.pAdd(pDeltaDir, [1 * (Math.random() - 0.5), 1 * (Math.random() - 0.5)]);
				oStick.oPA.pP = oLA.pAdd(oStick.oPA.pP, oLA.pMultiplyNP(nCorrection, oLA.pMultiplyNP(0.5, pDeltaDir)));
				oStick.oPB.pP = oLA.pAdd(oStick.oPB.pP, oLA.pMultiplyNP(nCorrection, oLA.pMultiplyNP(-0.5, pDeltaDir)));
			}
		}
		
		for (var iD = 0; iD < oState.aMinDistances.length; iD ++) {
			var oConstraint = oState.aMinDistances[iD];
			var nDistance = oConstraint.nDistance;
			var pDelta = oLA.pSub(oConstraint.oPA.pP, oConstraint.oPB.pP);
			var nDelta = oLA.nLength(pDelta);
			if (nDelta < nDistance) {
				var pDeltaDir = oLA.pNormalize(pDelta);
				var nCorrection = nRestLength - nDelta;
				oConstraint.oPA.pP = oLA.pAdd(oConstraint.oPA.pP, oLA.pMultiplyNP(nCorrection, oLA.pMultiplyNP(0.5, pDeltaDir)));
				oConstraint.oPB.pP = oLA.pAdd(oConstraint.oPB.pP, oLA.pMultiplyNP(nCorrection, oLA.pMultiplyNP(-0.5, pDeltaDir)));
			}
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



