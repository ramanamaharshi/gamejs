



var oGame = new Game(500, 400);
var oG = oGame.oG;
var oI = oGame.oI;

var oP = new Physics2D();

var iSCALE = 4;
var oState = {};



var vInit = function () {
	
	oG.iDrawShift = 0.5;
	
	oI.iMouseCorrectionX = -1;
	oI.iMouseCorrectionY = -2;
	
	oState.oEnvironment = new Environment();
	
};




var vInput = function () {
	
	if (oI.iButtonJustPressed(0)) {
		var iLeafX = Math.floor((oI.oMouse.iX - oG.iW / 2) / iSCALE);
		var iLeafY = Math.floor((oI.oMouse.iY - oG.iH / 2) / iSCALE);
		oState.oSelectedLeaf = oState.oEnvironment.oTree.oGetLeaf(iLeafX, iLeafY, true);
	}
	
};




var vCalc = function () {
	
	oP.vStep();
	
};




var vDraw = function () {
	
	oG.vSetColor('#FFF');
	oG.vFillRect(0, 0, oG.iW, oG.iH);
	
	oG.vSetColor('#CCC');
	oG.vDrawLine(0, oI.oMouse.iY, oG.iW, oI.oMouse.iY);
	oG.vDrawLine(oI.oMouse.iX, 0, oI.oMouse.iX, oG.iH);
	
	oG.vSetColor('#000');
	var oTree = oState.oEnvironment.oTree;
	vDrawNode(oTree.oRoot);
	
	oG.vSetColor('#F00');
	var oDrawNode = oState.oSelectedLeaf;
	while (oDrawNode) {
		vDrawNode(oDrawNode);
		oDrawNode = oDrawNode.oParent;
	}
	
};




var vDrawNode = function (oNode) {
	
	var iNodeSize = oState.oEnvironment.oTree.aLevelSizes[oNode.iLevel];
	var iRX = oG.iW / 2 + iSCALE * oNode.iAbsPosX;
	var iRY = oG.iH / 2 + iSCALE * oNode.iAbsPosY;
	oG.vDrawRect(iRX, iRY, iSCALE * iNodeSize - 1, iSCALE * iNodeSize - 1);
	
};




vInit();

var iFrameNr = 0;
oGame.vStartLoop(function(){
	iFrameNr ++;
	vInput();
	if (iFrameNr % 2 != 0) return;
	vCalc();
	vDraw();
});



