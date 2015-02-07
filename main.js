



var oGame = new Game(500, 400);
var oG = oGame.oG;
var oI = oGame.oI;




var oState = {};
var oResources = {};




var vInit = function () {
	
	oG.iDrawShift = 0.5;
	
	oI.iMouseCorrectionX = -1;
	oI.iMouseCorrectionY = -2;
	
	oState.aPeople = [];
	
	oState.oMe = new Person([250, 200]);
	
	for (var iY = -1; iY <= 1; iY ++) {
		for (var iX = -1; iX <= 1; iX ++) {
			oState.aPeople.push(new Person([250 + 10 * iX, 150 + 10 * iY]));
		}
	}
	
	oState.aPeople.push(oState.oMe);
	
	oState.aCars = [new Car([300, 200], [20, 40])];
	
	var oBike = new Car([280, 200], [6, 20]);
	oBike.aSeats = [
		{
			oCar: oBike,
			oPassenger: null,
			bSteeringWheel: true,
			aAccessArea: [[10,10], [-10,10], [-10,-10], [10,-10]],
			pAccessAreaCenter: [0, -6],
			pP: [0, 0],
			nDir: 0,
		}
	];
	oState.aCars.push(oBike);
	
	oState.oEnvironment = new Environment();
	
	new Environment.Building(oState.oEnvironment, [100,100], oLA.pDirToPoint(0), 10, 3, 2);
	
};




var vInput = function () {
	
	var nTurnSpeed = 0.1;
	var nWalkSpeed = 0.9;
	
	oState.oMe.pV[0] = 0;
	oState.oMe.pV[1] = 0;
	
	if (oState.oMe.oSeat) {
		oState.oMe.oSeat.oCar.vSetTurn(0);
		if (oI.bKey(37) || oI.bKey(65)) {
			oState.oMe.vSteer(-1);
		}
		if (oI.bKey(39) || oI.bKey(68)) {
			oState.oMe.vSteer(+1);
		}
		if (oI.bKey(40) || oI.bKey(83)) {
			oState.oMe.vDrive(-1);
		}
		if (oI.bKey(38) || oI.bKey(87)) {
			oState.oMe.vDrive(+1);
		}
	} else {
		if (oI.bKey(37) || oI.bKey(65)) {
			oState.oMe.vTurn(-1);
		}
		if (oI.bKey(39) || oI.bKey(68)) {
			oState.oMe.vTurn(+1);
		}
		if (oI.bKey(40) || oI.bKey(83)) {
			oState.oMe.vWalk(-1);
		}
		if (oI.bKey(38) || oI.bKey(87)) {
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
	
};




var vCalc = function () {
	
	Person.vCalcMany(oState.aPeople);
	
	Car.vCalcMany(oState.aCars);
	
	vCalcCollisions(oState);
	
};




var vDraw = function () {
	
	oG.vSetColor('#FFF');
	oG.vFillRect(0, 0, oG.iW, oG.iH);
	
	var mGDM = oLA.mIdentity();
	
	Car.vDrawMany(oG, oState.aCars);
	
	Person.vDrawMany(oG, oState.aPeople);
	
	oState.oEnvironment.aBuildings.forEach(function(oBuilding){
		oBuilding.vDraw(oG, mGDM);
	});
	
};




vInit();

oGame.vStartLoop(function(iUT, iDeltaUT){
	vInput();
	vCalc();
	vDraw();
});



