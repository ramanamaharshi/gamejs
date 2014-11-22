



(function () {
	
	
	
	
	var Game = function (iW, iH) {
		
		var oGame = this;
		
		oGame.oG = new Graphics2D(iW, iH);
		oGame.oI = new Input(oGame.oG.oGetCanvas());
		
	};
	
	
	
	
	Game.prototype.vStartLoop = function (vLoopFunction) {
		
		var oGame = this;
		
		oGame.vLoopFunction = vLoopFunction;
		
		var iOldUT = (new Date()).getTime()
		
		oGame.vLoopWrapperFunction = function () {
			
			var iUT = (new Date()).getTime();
			var iDeltaUT = iUT - iOldUT;
			oGame.vLoopFunction(iUT, iDeltaUT);
			iOldUT = iUT;
			
			window.requestAnimationFrame(oGame.vLoopWrapperFunction);
			
		};
		
		oGame.vLoopWrapperFunction();
		
	};
	
	
	
	
	window.Game = Game;
	
	
	
	
})();



