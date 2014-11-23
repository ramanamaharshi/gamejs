



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
		var oSeat = {oPassenger: null, bSteeringWheel: false, nDir: 0, pP: oLA.pMultiplyNP(nW4, pDir)};
		var pAAC = oLA.pAdd(oSeat.pP, [0, 2 * nW4 * pDir[1]]);
		oSeat.pAccessAreaCenter = pAAC;
		oSeat.aAccessArea = [];
		for (var iD2 = 0; iD2 < aDirs.length; iD2 ++) {
			oSeat.aAccessArea.push(oLA.pAdd(pAAC, oLA.pMultiplyNP(nW4, aDirs[iD2])));
		}
		oCar.aSeats.push(oSeat);
	}
	oCar.aSeats[1].bSteeringWheel = true;
	
	oCar.vMakeMatrices();
	
	return oCar;
	
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
	oPassenger.oCar = oCar;
	
	return true;
	
};




Car.prototype.bPassengerExit = function (oPassenger) {
	
	var oCar = this;
	
	var oSeat = null;
	for (var iS = 0; iS < oCar.aSeats.length; iS ++) {
		if (oCar.aSeats[iS].oPassenger == oPassenger) {
			oSeat = oCar.aSeats[iS];
			break;
		}
	}
	
	if (!oSeat) return false;
	
	oSeat.oPassenger = null;
	oPassenger.oCar = null;
	
	//var pSeat = oLA.pMultiplyMP(oCar.mMatrixA, oSeat.pP);
	var pAreaCenter = 
	//var pExitDir
	
	oPassenger.pP = oLA.pMultiplyMP(oCar.mMatrixA, oSeat.pAccessAreaCenter);
	
	oPassenger.nDir = oCar.nDir + oSeat.nDir;
	
	return true;
	
};




Car.prototype.vSetTurn = function (nTurn) {
	
	this.nTurn = nTurn;
	
};




Car.prototype.vAccelerate = function (nAccDir) {
	
	var oCar = this;
	
	oCar.nV += 0.25 * nAccDir;
	
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
	
	var nCX = oCar.pSize[0] / 2;
	var nCY = oCar.pSize[1] / 2;
	
	var aCornersRelative = [[nCX,nCY], [-nCX,nCY], [-nCX,-nCY], [nCX,-nCY]];
	var aCorners = aTransformPolygon(oCar.mMatrixA, aCornersRelative);
	
	for (var iS = 0; iS < oCar.aSeats.length; iS ++) {
		var oSeat = oCar.aSeats[iS];
		var pSeat = oLA.pMultiplyMP(oCar.mMatrixA, oSeat.pP)
		if (oSeat.oPassenger) {
			oG.vSetColor('#888');
			oG.vFillCircle(pSeat[0], pSeat[1], oSeat.oPassenger.nRadius);
		} else {
			oG.vSetColor('#888');
			oG.vDrawDot(pSeat);
		}
		var aAARel = aTransformPolygon(oCar.mMatrixA, oSeat.aAccessArea);
		oG.vSetColor('#8FF');
		oG.vDrawPolygon(aAARel);
	}
	
	oG.vSetColor('#222');
	oG.vDrawPolygon(aCorners);
	
};




Car.vCalcMany = function (aCars) {
	
	for (var iC = 0; iC < aCars.length; iC ++) {
		aCars[iC].vCalc();
	}
	
};




Car.vDrawMany = function (oG, aCars) {
	
	oG.vSetColor('#222');
	
	for (var iC = 0; iC < aCars.length; iC ++) {
		aCars[iC].vDraw(oG);
	}
	
};



