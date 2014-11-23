



var Car = function (pP, pSize) {
	
	var oCar = this;
	
	oCar.nIM = 999; /// inverse mass
	oCar.pSize = [pSize[1], pSize[0]];
	
	oCar.nTurn = 0;
	oCar.nV = 0;
	
	oCar.nDir = - Math.PI / 2;
	oCar.pP = pP;
	oCar.pV = [0,0];
	oCar.nA = 0;
	
	oCar.aSeats = [];
	var aDirs = [[-1,1], [1,1], [-1,-1], [1,-1]];
	for (var iD = 0; iD < aDirs.length; iD ++) {
		var pDir = aDirs[iD];
		var nW = oCar.pSize[1] / 2;
		//var oSeat = {nDir: 0, pP: oLA.pMult(nW / 4, pDir), oAccessArea: [pP: , ]};
	}
	
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
	
	var aCorners = [[nCX,nCY], [-nCX,nCY], [-nCX,-nCY], [nCX,-nCY]];
	
	for (var iC = 0; iC < aCorners.length; iC ++) {
		aCorners[iC] = oLA.pMultiplyMP(oCar.mMatrixA, aCorners[iC]);
	}
	
	oG.vSetColor('#222');
	for (var iC = 0; iC < aCorners.length; iC ++) {
		var aCornerA = aCorners[iC];
		var aCornerB = aCorners[(iC + 1) % aCorners.length];
		oG.vDrawLine(aCornerA, aCornerB);
	}
	
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



