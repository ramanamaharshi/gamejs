



var Car = function (pP, pSize) {
	
	var oCar = this;
	
	oCar.pSize = [pSize[1], pSize[0]];
	oCar.nIM = 999; /// inverse mass
	
	oCar.nTurn = 0;
	oCar.nV = 0;
	
	oCar.nDir = - Math.PI / 2;
	oCar.pP = pP;
	oCar.pV = [0,0];
	oCar.nA = 0;
	
	oCar.aSeats = [];
	var aDirs = [[1,1], [-1,1], [-1,-1], [1,-1]];
	for (var iD = 0; iD < aDirs.length; iD ++) {
		var pDir = aDirs[iD];
		var nW4 = oCar.pSize[1] / 4;
		var oSeat = {oCar: oCar, oPassenger: null, bSteeringWheel: false, nDir: 0};
		oSeat.pP = oLA.pMultiplyNP(nW4, pDir);
		var pAAC = oLA.pAdd(oSeat.pP, [0, 2 * nW4 * pDir[1]]);
		oSeat.pAccessAreaCenter = pAAC;
		oSeat.aAccessArea = [];
		for (var iD2 = 0; iD2 < aDirs.length; iD2 ++) {
			oSeat.aAccessArea.push(oLA.pAdd(pAAC, oLA.pMultiplyNP(nW4, aDirs[iD2])));
		}
		oCar.aSeats.push(oSeat);
	}
	oCar.aSeats[3].bSteeringWheel = true;
	
	oCar.vMakeMatrices();
	
};




Car.prototype.vMakeMatrices = function () {
	
	var oCar = this;
	
	var mTransA = oLA.mTranslation(oCar.pP);
	var mRotA = oLA.mRotation(oCar.nDir, false);
	oCar.mMatrixA = oLA.mMultiplyMM(mTransA, mRotA);
	
	var mTransB = oLA.mInverseTranslation(oCar.pP);
	var mRotB = oLA.mInverseRotation(oCar.nDir, false);
	oCar.mMatrixB = oLA.mMultiplyMM(mRotB, mTransB);
	
};




Car.prototype.bPassengerEnter = function (oSeat, oPassenger) {
	
	var oCar = this;
	
	if (oSeat.oPassenter) return false;
	
	oSeat.oPassenger = oPassenger;
	oPassenger.oSeat = oSeat;
	oPassenger.pP = [0,0];
	
	return true;
	
};




Car.prototype.bPassengerExit = function (oSeat) {
	
	var oCar = oSeat.oCar;
	
	if (!oSeat.oPassenger) return false;
	
	var oPassenger = oSeat.oPassenger;
	
	oSeat.oPassenger = null;
	oPassenger.oSeat = null;
	
	oPassenger.pP = oLA.pMultiplyMP(oCar.mMatrixA, oSeat.pAccessAreaCenter);
	
	oPassenger.nDir = oCar.nDir + oSeat.nDir;
	
	return true;
	
};




Car.prototype.vSetTurn = function (nTurn) {
	
	this.nTurn = nTurn;
	
};




Car.prototype.vAccelerate = function (nDir) {
	
	var oCar = this;
	
	oCar.nV += 0.25 * nDir;
	
};




Car.prototype.vCalc = function () {
	
	this.vCalcMovement();
	
};




Car.prototype.vCalcMovement = function () {
	
	var oCar = this;
	
	oCar.nDir += oCar.nV * 0.1 * oCar.nTurn;
	
	oCar.pP[0] += oCar.nV * Math.cos(oCar.nDir);
	oCar.pP[1] += oCar.nV * Math.sin(oCar.nDir);
	
	oCar.nV *= 0.95;
	
	oCar.vMakeMatrices();
	
};




Car.prototype.vDraw = function (oG) {
	
	var oCar = this;
	
	for (var iS = 0; iS < oCar.aSeats.length; iS ++) {
		var oSeat = oCar.aSeats[iS];
		var pSeat = oLA.pMultiplyMP(oCar.mMatrixA, oSeat.pP)
		if (oSeat.oPassenger) {
			var nR = oSeat.oPassenger.nRadius;
			var nDir = oCar.nDir + oSeat.nDir;
			oG.vSetColor('#888');
			oG.vDrawCircle(pSeat[0], pSeat[1], nR);
			oG.vDrawLine(pSeat[0], pSeat[1], pSeat[0] + 1.33 * nR * Math.cos(nDir), pSeat[1] + 1.33 * nR * Math.sin(nDir));
		} else {
			oG.vSetColor('#8FF');
			oG.vDrawDot(pSeat);
		}
		var aAARel = aTransformPolygon(oCar.mMatrixA, oSeat.aAccessArea);
		oG.vSetColor('#DFF');
		//oG.vFillPolygon(aAARel);
	}
	
	var aRelativeCorners = oCar.aGetRelativeCornersPolygon();
	var aAbsoluteCorners = aTransformPolygon(oCar.mMatrixA, aRelativeCorners);
	oG.vSetColor('#222');
	oG.vDrawPolygon(aAbsoluteCorners);
	
};



Car.prototype.aGetRelativeCornersPolygon = function () {
	
	var oCar = this;
	
	var nCX = oCar.pSize[0] / 2;
	var nCY = oCar.pSize[1] / 2;
	
	return [[nCX,nCY], [-nCX,nCY], [-nCX,-nCY], [nCX,-nCY]];
	
};




Car.vCalcMany = function (aCars) {
	
	for (var iC = 0; iC < aCars.length; iC ++) {
		aCars[iC].vCalc();
	}
	
};




Car.vDrawMany = function (oG, aCars) {
	
	for (var iC = 0; iC < aCars.length; iC ++) {
		aCars[iC].vDraw(oG);
	}
	
};



