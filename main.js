



var oGame = new Game(500, 400);
var oG = oGame.oG;
var oI = oGame.oI;




var oState = {};
var oResources = {};




var vInit = function () {
	
	oState.oMe = {pP: [250, 200], pV: [0, 0], nDir: - Math.PI / 2, nRadius: 4};
	
	oState.aCars = [
		{pP: [400, 500], pV: [0, 0], pSize: [20, 40], nDir: - Math.PI / 2},
	];
	
	oState.oGeometry = {
		//aPolygons: [
		//	[[234,123], [256,149], [219,132]],
		//	[[234,343], [268,310], [248,316], [295,378]],
		//],
		aWalls: [
			oMakeWall([84, 19, 41, 57]),
			oMakeWall([24, 29, 31, 37]),
			oMakeWall([134, 156, 176, 134]),
		],
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
		var nR = oState.oMe.nRadius;
		var pRel = oLA.pMultiplyMP(oWall.mMatrixA, oState.oMe.pP);
		if (Math.abs(pRel[1]) < oState.oMe.nRadius) {
			if (0 < pRel[0] + nR && pRel[0] - nR < oWall.nLength) {
				if (0 < pRel[0] && pRel[0] < oWall.nLength) {
					if (pRel[1] > 0) {
						pRel[1] = nR;
					} else {
						pRel[1] = -nR;
					}
				} else {
					if (0 < pRel[0]) {
						pRel[0] -= oWall.nLength;
						pRel = oLA.pMultiplyNP(nR / oLA.nLength(pRel), pRel);
						pRel[0] += oWall.nLength;
					} else {
						pRel = oLA.pMultiplyNP(nR / oLA.nLength(pRel), pRel);
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
	
	//oState.oGeometry.aPolygons.forEach(function(aPolygon){
	//	var aWall = oWall.aArray;
	//	oG.vDrawLine(aWall[0], aWall[1], aWall[2], aWall[3]);
	//});
	
	oG.vSetColor('#888');
	oState.oGeometry.aWalls.forEach(function(oWall){
		var aWall = oWall.aArray;
		oG.vDrawLine(aWall[0], aWall[1], aWall[2], aWall[3]);
	});
	
	oG.vSetColor('#222');
	var nR = oState.oMe.nRadius;
	oG.vDrawCircle(nPosX, nPosY, nR);
	oG.vDrawLine(nPosX, nPosY, nPosX + 1.33 * nR * Math.cos(oState.oMe.nDir), nPosY + 1.33 * nR * Math.sin(oState.oMe.nDir));
	
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



