



var Person = function (pP) {
	
	var oP = this;
	
	oP.oSeat = null;
	oP.nRadius = 4;
	oP.nIM = 9999; /// inverse mass
	
	oP.pP = pP;
	oP.pV = [0, 0];
	oP.nDir = - Math.PI / 2;
	
};




Person.prototype.vTurn = function (nDir) {
	
	this.nDir += 0.1 * nDir;
	
};




Person.prototype.vWalk = function (nDir) {
	
	var oPerson = this;
	
	oPerson.pV[0] = nDir * 0.9 * Math.cos(oPerson.nDir);
	oPerson.pV[1] = nDir * 0.9 * Math.sin(oPerson.nDir);
	
};




Person.prototype.vSteer = function (nDir) {
	
	var oPerson = this;
	
	if (!oPerson.oSeat || !oPerson.oSeat.bSteeringWheel) return;
	
	var oCar = oPerson.oSeat.oCar;
	
	oCar.vSetTurn(0.1 * nDir);
	
};




Person.prototype.vDrive = function (nDir) {
	
	var oPerson = this;
	
	if (!oPerson.oSeat || !oPerson.oSeat.bSteeringWheel) return;
	
	var oCar = oPerson.oSeat.oCar;
	
	oCar.vAccelerate(nDir);
	
};




Person.prototype.vCalc = function (oG) {
	
	var oPerson = this;
	
	oPerson.pP[0] += oPerson.pV[0];
	oPerson.pP[1] += oPerson.pV[1];
	
};




Person.prototype.vDraw = function (oG) {
	
	var oPerson = this;
	
	if (oPerson.oSeat) return;
	
	var nR = oPerson.nRadius;
	var nDir = oPerson.nDir;
	var nPosX = oPerson.pP[0];
	var nPosY = oPerson.pP[1];
	
	oG.vSetColor('#222');
	oG.vDrawCircle(oPerson.pP, nR);
	oG.vDrawLine(nPosX, nPosY, nPosX + 1.33 * nR * Math.cos(nDir), nPosY + 1.33 * nR * Math.sin(nDir));
	
};




Person.vCalcMany = function (aPeople) {
	
	for (var iP = 0; iP < aPeople.length; iP ++) {
		aPeople[iP].vCalc();
	}
	
};




Person.vDrawMany = function (oG, aPeople) {
	
	for (var iP = 0; iP < aPeople.length; iP ++) {
		aPeople[iP].vDraw(oG);
	}
	
};



