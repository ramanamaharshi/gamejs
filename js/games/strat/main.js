(function(){
	
	
	
	
	var oGame = new Game(500, 400);
	var oG = oGame.oG;
	var oI = oGame.oI;
	
	
	
	
	var oState = {};
	
	
	
	
	var vInit = function () {
		
		oG.iDrawShift = 0.5;
		
		oI.iMouseCorrectionX = -1;
		oI.iMouseCorrectionY = -2;
		
	};
	
	
	
	
	var vInput = function () {
		
		oI.vStep();
		
	};
	
	
	
	
	var vCalc = function () {};
	
	
	
	
	var vDraw = function () {
		
		oG.vSetColor('#FFF');
		oG.vFillRect(0, 0, oG.iGetW(), oG.iGetH());
		
		var oCamera = {nZoom: 1, aDisplayRect: [2, 2, 22, 22]};
		
		oWorld.vDraw(oG, oCamera);
		
	};
	
	
	
	
	vInit();
	
	oGame.vStartLoop(function(iUT, iDeltaUT){
		vInput();
		vCalc();
		vDraw();
	});
	
	
	
	
})();

