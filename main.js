



var oGame = new Game(500, 400);
var oG = oGame.oG;
var oI = oGame.oI;

//oI.bLog = true;

var oResources = {};
var oState = {};




var vInit = function () {
	
	oState.oMe = {nX: 0, nY: 0, nDir: 0};
	
};




var vInput = function () {
	
	var nTurnSpeed = 0.1;
	var nWalkSpeed = 2;
	
	if (oI.bKey(65, 37)) {
		oState.oMe.nDir -= nTurnSpeed;
	}
	if (oI.bKey(68, 39)) {
		oState.oMe.nDir += nTurnSpeed;
	}
	if (oI.bKey(83, 40)) {
		oState.oMe.nX -= nWalkSpeed * Math.cos(oState.oMe.nDir);
		oState.oMe.nY -= nWalkSpeed * Math.sin(oState.oMe.nDir);
	}
	if (oI.bKey(87, 38)) {
		oState.oMe.nX += nWalkSpeed * Math.cos(oState.oMe.nDir);
		oState.oMe.nY += nWalkSpeed * Math.sin(oState.oMe.nDir);
	}
	
};




var vCalc = function () {
	
	
	
};




var vDraw = function () {
	
	oG.vSetColor('#FFF');
	oG.vFillRect(0, 0, oG.iWidth, oG.iHeight);
	
	var nPosX = oG.iWidth / 2 + oState.oMe.nX;
	var nPosY = oG.iHeight / 2 + oState.oMe.nY;
	
	oG.vSetColor('#222');
	oG.vDrawCircle(nPosX, nPosY, 5);
	oG.vDrawLine(nPosX, nPosY, nPosX + 10 * Math.cos(oState.oMe.nDir), nPosY + 10 * Math.sin(oState.oMe.nDir));
	
};



vInit();

oGame.vStartLoop(function(iUT, iDeltaUT){
	vInput();
	vCalc();
	vDraw();
});



