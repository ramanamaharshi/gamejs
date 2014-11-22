



var oGame = new Game(500, 400);
var oG = oGame.oG;
var oI = oGame.oI;




var oState = {};
var oResources = {};




var vInit = function () {
	
	oState.oMe = {pP: [99, 99], pV: [0, 0], nDir: - Math.PI / 2, nRadius: 4};
	oState.oGeometry = {
		aWalls: [
			oMakeWall([84, 19, 41, 57]),
			oMakeWall([24, 29, 31, 37]),
		]
	};
	
};




var vInput = function () {
	
	var nTurnSpeed = 0.1;
	var nWalkSpeed = 0.9;
	
	oState.oMe.pV[0] = 0;
	oState.oMe.pV[1] = 0;
	
	if (oI.bKey(65, 37)) {
		oState.oMe.nDir -= nTurnSpeed;
	}
	if (oI.bKey(68, 39)) {
		oState.oMe.nDir += nTurnSpeed;
	}
	if (oI.bKey(83, 40)) {
		oState.oMe.pV[0] = -nWalkSpeed * Math.cos(oState.oMe.nDir);
		oState.oMe.pV[1] = -nWalkSpeed * Math.sin(oState.oMe.nDir);
	}
	if (oI.bKey(87, 38)) {
		oState.oMe.pV[0] = +nWalkSpeed * Math.cos(oState.oMe.nDir);
		oState.oMe.pV[1] = +nWalkSpeed * Math.sin(oState.oMe.nDir);
	}
	
};




var vCalc = function () {
	
	oState.oMe.pP[0] += oState.oMe.pV[0];
	oState.oMe.pP[1] += oState.oMe.pV[1];
	
	oState.oGeometry.aWalls.forEach(function(oWall){
		var pRel = oLA.pMultiplyMP(oWall.mMatrixA, oState.oMe.pP);
		if (Math.abs(pRel[0]) < oState.oMe.nRadius) {
			if (0 < pRel[1] + oState.oMe.nRadius && pRel[1] - oState.oMe.nRadius < oWall.nLength) {
				if (0 < pRel[1] && pRel[1] < oWall.nLength) {
					if (pRel[0] > 0) {
						pRel[0] = oState.oMe.nRadius;
					} else {
						pRel[0] = -oState.oMe.nRadius;
					}
				} else {
					if (0 < pRel[1]) {
						pRel[1] -= oWall.nLength;
						pRel = oLA.pMultiplyNP(oState.oMe.nRadius / oLA.nLength(pRel), pRel);
						pRel[1] += oWall.nLength;
					} else {
						pRel = oLA.pMultiplyNP(oState.oMe.nRadius / oLA.nLength(pRel), pRel);
					}
				}
			}
			oState.oMe.pP = oLA.pMultiplyMP(oWall.mMatrixB, pRel);
		}
	});
	
};




var vDraw = function () {
	
	oG.vSetColor('#FFF');
	oG.vFillRect(0, 0, oG.iWidth, oG.iHeight);
	
	var nPosX = oState.oMe.pP[0];
	var nPosY = oState.oMe.pP[1];
	
	oG.vSetColor('#888');
	oState.oGeometry.aWalls.forEach(function(oWall){
		var aWall = oWall.aArray;
		oG.vDrawLine(aWall[0], aWall[1], aWall[2], aWall[3]);
	});
	
	oG.vSetColor('#222');
	oG.vDrawCircle(nPosX, nPosY, oState.oMe.nRadius);
	oG.vDrawLine(nPosX, nPosY, nPosX + 6 * Math.cos(oState.oMe.nDir), nPosY + 6 * Math.sin(oState.oMe.nDir));
	
};



vInit();

oGame.vStartLoop(function(iUT, iDeltaUT){
	vInput();
	vCalc();
	vDraw();
});




//var pP = [5, 3];
//oLA.vPrintP(pP);
//console.log('----');
//console.log('mRotation');
//oLA.vPrintP(oLA.pMultiplyMP(oLA.mRotation(pP, true), [1, 0]))
//oLA.vPrintP(oLA.pMultiplyMP(oLA.mRotation(pP, true), [0, 1]))
//console.log('----');
//console.log('mInverseRotation');
//var mIR = oLA.mInverseRotation(pP, true);
//oLA.vPrintM(mIR);
//oLA.vPrintP(oLA.pMultiplyMP(mIR, pP));
//console.log('----');



