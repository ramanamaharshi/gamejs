



var oGame = new Game(500, 400);
var oG = oGame.oG;
var oI = oGame.oI;




var oStuff = {};




var vInit = function () {
	
	oG.iDrawShift = 0.5;
	
	oI.iMouseCorrectionX = -1;
	oI.iMouseCorrectionY = -2;
	
	oG.vSetColor('#DDD');
	oG.vFillRect(0, 0, oG.iGetW(), oG.iGetH());
	oG.vSetColor('#000');
	
	oStuff.oMouseNew = oI.oGetMousePos();
	oStuff.oMouseOld = oI.oGetMousePrev();
	
	oStuff.aPixelColor = oG.aGetPixelColor(0,0);
	
	oStuff.oWorld = oMakeWorld(111,111,[22,22,333,333]);
	
	oStuff.aStart = [100,10];
	oStuff.aTarget = [10,100];
	
	oStuff.oPath = {aPath: null};
	oStuff.oPath.vDraw = function (oG) {
		var aPath = oStuff.oPath.aPath;
		if (!aPath) return;
		for (var iP = 1; iP < aPath.length; iP ++) {
			var aA = oStuff.oWorld.aCoordsToPixel(aPath[iP - 1]);
			var aB = oStuff.oWorld.aCoordsToPixel(aPath[iP]);
			oG.vSetColor('#0FF');
			oG.vDrawLine(aA, aB);
		}
	};
	
	//var oBuffer = Graphics2D.oCreateBuffer(222, 222);
	//oBuffer.vSetColor('rgba(255,0,0,0.5)');
	//oBuffer.vFillCircle(22, 22, 11);
	//oG.oLoadImage('https://mdn.mozillademos.org/files/5397/rhino.jpg', function(oImage){
	//	oG.vDrawImage(oImage, 33, 33);
	//	oG.vDrawBuffer(oBuffer, 44, 44);
	//});
	
};




var vInput = function () {
	
	if (oI.bButton(0)) {
		//oG.vDrawLine(oStuff.oMouseOld.iX, oStuff.oMouseOld.iY, oStuff.oMouseNew.iX, oStuff.oMouseNew.iY);
		//oG.vFillCircle(oStuff.oMouseNew.iX, oStuff.oMouseNew.iY, 9);
		//oG.vFillRect(oStuff.oMouseNew.iX, oStuff.oMouseNew.iY, 2, 2);
		var aOld = oStuff.oWorld.aPixelToCoords([oStuff.oMouseOld.iX, oStuff.oMouseOld.iY]);
		var aNew = oStuff.oWorld.aPixelToCoords([oStuff.oMouseNew.iX, oStuff.oMouseNew.iY]);
		vLine(aOld[0], aOld[1], aNew[0], aNew[1], function (iX, iY) {
			//oG.vDrawDot(iX, iY);
			oStuff.oWorld.vSetSquare(iX, iY, true);
		});
	}
	
	if (oI.iButtonJustPressed(1)) {
		//console.log(oG.aGetPixelColor(oI.oMouse.iX, oI.oMouse.iY));
		//console.log(oStuff.aPixelColor, oG.aGetPixelColor(0,0));
		oAlgos.naive.vParseMap(oStuff.oWorld.aSquares);
		oStuff.oPath.aPath = oAlgos.naive.aFindPath(oStuff.aStart, oStuff.aTarget);
		console.log(oStuff.oPath.aPath);
	}
	
	oI.vStep();
	
};




var vCalc = function () {};




var vDraw = function () {
	
	oStuff.oWorld.vDraw(oG);
	
	oG.vSetColor('#0FF');
	oStuff.oPath.vDraw(oG);
	
	oG.vSetColor('#F00');
	oG.vDrawCircle(oStuff.oWorld.aCoordsToPixel(oStuff.aStart), 1);
	oG.vDrawCircle(oStuff.oWorld.aCoordsToPixel(oStuff.aTarget), 1);
	
};




var oMakeWorld = function (iW, iH, aProjection) {
	
	var oWorld = {iW: iW, iH: iH, aSquares: []};
	
	for (var iY = 0; iY < iH; iY ++) {
		var aRow = [];
		oWorld.aSquares.push(aRow);
		for (var iX = 0; iX < iW; iX ++) {
			aRow.push(0);
		}
	}
	
	oWorld.oProjection = {
		iX: aProjection[0],
		iY: aProjection[1],
		iW: aProjection[2],
		iH: aProjection[3],
	};
	
	oWorld.oG = Graphics2D.oCreateBuffer(iW, iH, '#FFF');
	
	oWorld.vSetSquare = function (iX, iY, bValue) {
		if (-1 < iX && iX < iW && -1 < iY && iY < iH) {
			oWorld.aSquares[iY][iX] = bValue;
			oWorld.oG.vSetColor(bValue ? '#000' : '#FFF');
			oWorld.oG.vDrawDot(iX, iY);
		}
	};
	
	oWorld.vDraw = function (oG) {
		var oP = oWorld.oProjection;
		oG.vDrawBuffer(oWorld.oG, oP.iX, oP.iY, oP.iW, oP.iH);
	};
	
	oWorld.aPixelToCoords = function (aPixel) {
		var oP = oWorld.oProjection;
		var aCoords = [
			Math.floor((aPixel[0] - oP.iX) * (oWorld.iW / oP.iW)),
			Math.floor((aPixel[1] - oP.iY) * (oWorld.iH / oP.iH)),
		];
		return aCoords;
	};
	
	oWorld.aCoordsToPixel = function (aCoords) {
		var oP = oWorld.oProjection;
		var aPixel = [
			Math.floor(((aCoords[0] + 0.5) * (oP.iW / oWorld.iW) + oP.iX)),
			Math.floor(((aCoords[1] + 0.5) * (oP.iW / oWorld.iW) + oP.iY)),
		];
		return aPixel;
	};
	
	return oWorld;
	
};




var vLine = function (iAX, iAY, iBX, iBY, vDo) {
	
	var bTranspose = Math.abs(iAX - iBX) < Math.abs(iAY - iBY);
	if (bTranspose) {
		iAT = iAX; iAX = iAY; iAY = iAT;
		iBT = iBX; iBX = iBY; iBY = iBT;
	}
	
	var iFactorX = (iAX > iBX) ? -1 : 1;
	var iFactorY = (iAY > iBY) ? -1 : 1;
	iAX *= iFactorX; iBX *= iFactorX;
	iAY *= iFactorY; iBY *= iFactorY;
	
	var iDeltaX = iBX - iAX;
	var iDeltaY = iBY - iAY;
	var nSlope = iDeltaX ? (iDeltaY / iDeltaX) : 0;
	
	for (var iRelX = 0; iRelX <= iDeltaX; iRelX ++) {
		var iRelY = Math.floor(nSlope * iRelX);
		if (bTranspose) {
			vDo(iFactorY * (iAY + iRelY), iFactorX * (iAX + iRelX));
		} else {
			vDo(iFactorX * (iAX + iRelX), iFactorY * (iAY + iRelY));
		}
	}
	
}




vInit();

oGame.vStartLoop(function(iUT, iDeltaUT){
	vInput();
	vCalc();
	vDraw();
});



