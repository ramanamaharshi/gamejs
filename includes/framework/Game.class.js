



(function () {
	
	
	
	
	var Game = function (iW, iH, sGraphicsType) {
		
		var oGame = this;
		
		oGame.oG = sGraphicsType == '3D' ? new Graphics3D(iW, iH) : new Graphics2D(iW, iH);
		oGame.oI = new Input(oGame.oG.oGetCanvas());
		
	};
	
	
	
	
	Game.prototype.vStartLoop = function (vLoopFunction) {
		
		var oGame = this;
		
		oGame.vLoopFunction = vLoopFunction;
		
		var iStartUT = (new Date()).getTime();
		
		var iOldMillis = 0;
		
		oGame.iFrameUTs = 99;
		oGame.aFrameUTs = [];
		oGame.iAtFrameUT = 0;
		for (var iF = 0; iF < oGame.iFrameUTs; iF ++) {
			oGame.aFrameUTs.push(0);
		}
		
		oGame.vLoopWrapperFunction = function () {
			
			var iMillis = (new Date()).getTime() - iStartUT;
			var iDeltaMillis = iMillis - iOldMillis;
			oGame.vLoopFunction(iMillis, iDeltaMillis);
			iOldMillis = iMillis;
			
			oGame.oI.vStep();
			
			window.requestAnimationFrame(oGame.vLoopWrapperFunction);
			
			oGame.iAtFrameUT = (oGame.iAtFrameUT + 1) % oGame.iFrameUTs;
			oGame.aFrameUTs[oGame.iAtFrameUT] = iMillis;
			
		};
		
		oGame.vLoopWrapperFunction();
		
	};
	
	
	
	
	Game.prototype.nGetFrameRate = function () {
		
		var oGame = this;
		
		var iNewestUTat = oGame.iAtFrameUT;
		var iOldestUTat = (iNewestUTat + 1) % oGame.iFrameUTs;
		
		var iTimePassed = oGame.aFrameUTs[iNewestUTat] - oGame.aFrameUTs[iOldestUTat];
		
		var nFrameRate = 1000 * (oGame.iFrameUTs / iTimePassed);
		
		return nFrameRate;
		
	};
	
	
	
	
	window.Game = Game;
	
	
	
	
})();



