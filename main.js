



var oGame = new Game(500, 400);
var oG = oGame.oG;
var oI = oGame.oI;




var oState = {};
var oResources = {};




var vInit = function () {
	
	oState.aPeople = [new Person([250, 200])];
	
	oState.aCars = [new Car([300, 200], [20, 40])];
	
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
	
	if (oState.oMe.oSeat) {
		oState.oMe.oSeat.oCar.vSetTurn(0);
		if (oI.bKey(37)) {
			oState.oMe.vSteer(-1);
		}
		if (oI.bKey(39)) {
			oState.oMe.vSteer(+1);
		}
		if (oI.bKey(40)) {
			oState.oMe.vDrive(-1);
		}
		if (oI.bKey(38)) {
			oState.oMe.vDrive(+1);
		}
	} else {
		if (oI.bKey(37)) {
			oState.oMe.vTurn(-1);
		}
		if (oI.bKey(39)) {
			oState.oMe.vTurn(+1);
		}
		if (oI.bKey(40)) {
			oState.oMe.vWalk(-1);
		}
		if (oI.bKey(38)) {
			oState.oMe.vWalk(+1);
		}
	}
	
	if (oI.iKeyJustPressed(13)) {
		if (oState.oMe.oSeat) {
			oState.oMe.oSeat.oCar.bPassengerExit(oState.oMe.oSeat);
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
	
	//if (oI.bKey(65)) {
	//	oState.oMyCar.vSetTurn(-0.1);
	//}
	//if (oI.bKey(68)) {
	//	oState.oMyCar.vSetTurn(+0.1);
	//}
	//if (oI.bKey(83)) {
	//	oState.oMyCar.vAccelerate(-1);
	//}
	//if (oI.bKey(87)) {
	//	oState.oMyCar.vAccelerate(+1);
	//}
	
};




var vCalc = function () {
	
	Person.vCalcMany(oState.aPeople);
	
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
	
	Person.vDrawMany(oG, oState.aPeople);
	
};




vInit();

oGame.vStartLoop(function(iUT, iDeltaUT){
	vInput();
	vCalc();
	vDraw();
});



