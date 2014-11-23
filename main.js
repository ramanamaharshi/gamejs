



var oGame = new Game(500, 400);
var oG = oGame.oG;
var oI = oGame.oI;




var oState = {};
var oResources = {};




var vInit = function () {
	
	oState.aPeople = [{pP: [250, 200], pV: [0, 0], nDir: - Math.PI / 2, nRadius: 4, oCar: null}];
	
	oState.aCars = [
		new Car([300, 200], [20, 40]),
	];
	
	oState.oGeometry = {
		aWalls: [
			oMakeWall([84, 19, 41, 57]),
			oMakeWall([24, 29, 31, 37]),
			oMakeWall([134, 156, 176, 134]),
		],
	};
	
	oState.oMe = oState.aPeople[0];
	oState.oMyCar = oState.aCars[0];
	
};




var vInput = function () {
	
	var nTurnSpeed = 0.1;
	var nWalkSpeed = 0.9;
	
	oState.oMe.pV[0] = 0;
	oState.oMe.pV[1] = 0;
	
	if (oI.bKey(37)) {
		oState.oMe.nDir -= nTurnSpeed;
	}
	if (oI.bKey(39)) {
		oState.oMe.nDir += nTurnSpeed;
	}
//if (oI.bKey(37) || oI.bKey(39)) {
//	var nDirA = oState.oMe.nDir;
//	var pV = oLA.pDirToPoint(nDirA);
//	var nDirB = oLA.nPointToDir(pV);
//	console.log('----');
//	oLA.vPrintN(nDirA);
//	oLA.vPrintP(pV);
//	oLA.vPrintN(nDirB);
//	console.log('----');
//}
	if (oI.bKey(40)) {
		oState.oMe.pV[0] = -nWalkSpeed * Math.cos(oState.oMe.nDir);
		oState.oMe.pV[1] = -nWalkSpeed * Math.sin(oState.oMe.nDir);
	}
	if (oI.bKey(38)) {
		oState.oMe.pV[0] = +nWalkSpeed * Math.cos(oState.oMe.nDir);
		oState.oMe.pV[1] = +nWalkSpeed * Math.sin(oState.oMe.nDir);
	}
	if (oI.iKeyJustPressed(13)) {
		if (oState.oMe.oCar) {
			oState.oMe.oCar.bPassengerExit(oState.oMe);
		} else {
			for (var iC = 0; iC < oState.aCars.length; iC ++) {
				var oCar = oState.aCars[iC];
				for (var iS = 0; iS < oCar.aSeats.length; iS ++) {
					var oSeat = oCar.aSeats[iS];
					var aAccessArea = aTransformPolygon(oCar.mMatrixA, oSeat.aAccessArea);
					if (bInPolygon(aAccessArea, oState.oMe.pP)) {
						oCar.bPassengerEnter(oSeat, oState.oMe);
					}
				}
			}
		}
	}
	
	oState.oMyCar.vSetTurn(0);
	if (oI.bKey(65)) {
		oState.oMyCar.vSetTurn(-0.1);
	}
	if (oI.bKey(68)) {
		oState.oMyCar.vSetTurn(+0.1);
	}
	if (oI.bKey(83)) {
		oState.oMyCar.vAccelerate(-1);
	}
	if (oI.bKey(87)) {
		oState.oMyCar.vAccelerate(+1);
	}
	
};




var vCalc = function () {
	
	oState.oMe.pP[0] += oState.oMe.pV[0];
	oState.oMe.pP[1] += oState.oMe.pV[1];
	
	oState.oGeometry.aWalls.forEach(function(oWall){
		oState.aPeople.forEach(function(oPerson){
			var nR = oPerson.nRadius;
			var pRel = oLA.pMultiplyMP(oWall.mMatrixB, oPerson.pP);
			if (Math.abs(pRel[1]) < oPerson.nRadius) {
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
				oState.oMe.pP = oLA.pMultiplyMP(oWall.mMatrixA, pRel);
			}
		});
	});
	
	Car.vCalcMany(oState.aCars);
	
};




var vDraw = function () {
	
	oG.vSetColor('#FFF');
	oG.vFillRect(0, 0, oG.iWidth, oG.iHeight);
	
	vDrawWalls(oG, oState.oGeometry.aWalls);
	
	Car.vDrawMany(oG, oState.aCars);
	
	vDrawPeople(oG, oState.aPeople);
	
};




vInit();

oGame.vStartLoop(function(iUT, iDeltaUT){
	vInput();
	vCalc();
	vDraw();
});



