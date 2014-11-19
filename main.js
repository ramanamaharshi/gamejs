



var oGame = new Game(500, 400);

var oResources = {};
var oState = {};




var vInit = function () {
	
	oState.o
	
	oState.iTest = -600;
	
	oResources.oImage = oGame.oG.oLoadImage('oXplwkA.jpg');
	
};




var vInput = function () {
	
	
	
};




var vCalc = function () {
	
	
	
};




var vDraw = function () {
	
	oGame.oG.vSetColor("white");
	oGame.oG.vFillRect(0, 0, oGame.iWidth, oGame.iHeight);
	
	if (oResources.oImage.bReady) {
		//oState.iTest ++;
		oGame.oG.vDrawImage(oResources.oImage, 0, oState.iTest);
	}
	
};



vInit();

oGame.vStartLoop(function(iUT, iDeltaUT){
	vInput();
	vCalc();
	vDraw();
});



