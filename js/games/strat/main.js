(function(){
	
	
	
	
	var oGame = new Game(333, 333);
	var oG = oGame.oG;
	var oI = oGame.oI;
	
	
	
	
	var oStuff = {};
	
	
	
	
	var oState = {};
	
	
	
	
	var vInit = function () {
		
		oG.iDrawShift = 0.5;
		
		oI.iMouseCorrectionX = -1;
		oI.iMouseCorrectionY = -2;
		
		oStuff.oWorld = oInitWorld(64, 64);
		
		oStuff.oCamera = new Camera();
		oStuff.oCamera.vSetDrawRect(0, 0, 333, 333);
		oStuff.oCamera.vSetViewCenter(oStuff.oWorld.iW / 2, oStuff.oWorld.iH / 2);
		oStuff.oCamera.vSetZoom(333 / 64);
		
	};
	
	
	
	
	var vInput = function () {
		
		if (oI.iButtonJustPressed(0)) {
			//oStuff.oLands.vGrow();
			//console.log('grown');
		}
		
		var iWheel = oI.iJustWheel();
		if (iWheel != 0) {
			var oMouse = oI.oGetMousePos();
			oStuff.oCamera.vZoom(iWheel / 4, [oMouse.iX + 0.5, oMouse.iY + 0.5]);
		}
		
		oI.vStep();
		
	};
	
	
	
	
	var vCalc = function () {
		
		oStuff.oWorld.vCalc();
		
	};
	
	
	
	
	var vDraw = function () {
		
		oG.vSetColor('#FFF');
		oG.vFillRect(0, 0, oG.iGetW(), oG.iGetH());
		
		oStuff.oWorld.vDraw(oG, oStuff.oCamera);
		
	};
	
	
	
	
	vInit();
	
	oGame.vStartLoop(function(iUT, iDeltaUT){
		vInput();
		vCalc();
		vDraw();
	});
	
	
	
	
})();

