(function(){
	
	
	
	
	window.oInitWorld = function (iW, iH) {
		
		var oWorld = {iW: iW, iH: iH};
		
		oWorld.oLands = oInitLands(iW, iH);
		oWorld.oBuildings = oInitBuildings(oWorld, 8);
		oWorld.oCows = oInitCows(oWorld, 64);
		
		oWorld.vCalc = function () {
			oWorld.oLands.vCalc();
			oWorld.oBuildings.vCalc();
			oWorld.oCows.vCalc();
		};
		oWorld.vDraw = function (oG, oCamera) {
			oWorld.oLands.vDraw(oG, oCamera);
			oWorld.oBuildings.vDraw(oG, oCamera);
			oWorld.oCows.vDraw(oG, oCamera);
		};
		
		return oWorld;
		
	};
	
	
	
	
	var oInitLands = function (iW, iH) {
		
		var oLands = {iW: iW, iH: iH, iLands: iW * iH, aLands: []};
		var aLands = oLands.aLands;
		
		oLands.vCalc = function () {
			oLands.oGrowRunner.vGrowLands();
		};
		
		oLands.oGetLand = function (iX, iY) {
			var oLand = null;
			if (-1 < iX && iX < oLands.iW && -1 < iY && iY < oLands.iH) {
				oLand = aLands[iY * this.iW + iX]
			}
			return oLand;
		};
		
		for (var iY = 0; iY < oLands.iH; iY ++) {
			for (var iX = 0; iX < oLands.iW; iX ++) {
				aLands.push({iI: aLands.length, iX: iX, iY: iY});
			}
		}
		
		var nSqrt2 = Math.sqrt(2);
		var aDirections = [[0,-1],[1,0],[0,1],[-1,0]];
		
		aLands.forEach(function(oLand, iI){
			oLand.nTree = Math.random();
			oLand.nGrass = Math.random()// < 0.5 ? 0 : 1;
			if (oLand.nTree < 0.9) oLand.nTree = 0;
			oLand.oNeighbors = {aStraight: [], aDiagonal: []};
			for (var iD = 0; iD < aDirections.length; iD ++) {
				var aStraight = aDirections[iD];
				var aDiagonal = oLA.pAdd(aStraight, aDirections[(iD + 1) % aDirections.length]);
				aStraight = oLA.pAdd(aStraight, [oLand.iX, oLand.iY]);
				aDiagonal = oLA.pAdd(aDiagonal, [oLand.iX, oLand.iY]);
				var oStraight = oLands.oGetLand(aStraight[0], aStraight[1]);
				var oDiagonal = oLands.oGetLand(aDiagonal[0], aDiagonal[1]);
				if (oStraight) oLand.oNeighbors.aStraight.push(oStraight);
				if (oDiagonal) oLand.oNeighbors.aDiagonal.push(oDiagonal);
				oLand.nMaxNeighborSum = oLand.oNeighbors.aStraight.length + oLand.oNeighbors.aDiagonal.length / nSqrt2;
			}
		});
		
		oLands.oGrowRunner = {iGrowLand: 0, iCensusLand: 3 * iW, iAtOnce: iW * iH / 32};
		
		oLands.oGrowRunner.vCensus = function (oLand) {
			oLand.oNeighborSums = {nGrass: 0, nTree: 0};
			oLand.oNeighbors.aStraight.forEach(function(oSN){
				oLand.oNeighborSums.nGrass += oSN.nGrass;
				oLand.oNeighborSums.nTree += oSN.nTree;
			});
			oLand.oNeighbors.aDiagonal.forEach(function(oDN){
				oLand.oNeighborSums.nGrass += oDN.nGrass / nSqrt2;
				oLand.oNeighborSums.nTree +=  oDN.nTree / nSqrt2;
			});
		};
		oLands.oGrowRunner.vGrow = function (oLand) {
			var nRNS = (oLand.oNeighborSums.nGrass / oLand.nMaxNeighborSum);
			nRNS = nRNS * nRNS;
			var nGrow = nRNS - 0.2;
			oLand.nGrass += nGrow / 8;
			if (oLand.nGrass < 0) oLand.nGrass = 0;
			if (oLand.nGrass > 1) oLand.nGrass = 1;
		};
		oLands.oGrowRunner.vGrowLands = function () {
			var oRunner = oLands.oGrowRunner;
			for (var iI = 0; iI < oRunner.iAtOnce; iI ++) {
				oRunner.vCensus(oLands.aLands[oRunner.iCensusLand]);
				oRunner.vGrow(oLands.aLands[oRunner.iGrowLand]);
				oLands.vUpdateBuffer(oLands.aLands[oRunner.iGrowLand]);
				oRunner.iCensusLand = (oRunner.iCensusLand + 1) % oLands.iLands;
				oRunner.iGrowLand = (oRunner.iGrowLand + 1) % oLands.iLands;
			}
		};
		
		oLands.oBuffer = Graphics2D.oCreateBuffer(oLands.iW, oLands.iH);
		oLands.vUpdateBuffer = function (oLand) {
			var oBuffer = oLands.oBuffer;
			oBuffer.vSetColor('rgb(33,' + Math.round(33 + 222 * oLand.nGrass) + ',00)');
			oBuffer.vDrawDot(oLand.iX, oLand.iY);
		};
		oLands.vDraw = function (oG, oCamera) {
			oG.vDrawBuffer(oLands.oBuffer, oCamera.nPlusX, oCamera.nPlusY, oCamera.nZoom * oLands.iW, oCamera.nZoom * oLands.iH);
		};
		
		oLands.aLands.forEach(function(oLand){
			oLands.oGrowRunner.vCensus(oLand);
			oLands.vUpdateBuffer(oLand);
		});
		
		return oLands;
		
	};
	
	
	
	
	var oInitBuildings = function (oWorld, iBuildings) {
		
		var iWorldW = oWorld.iW;
		var iWorldH = oWorld.iH;
		
		var oBuildings = {iBuildings: 0, aBuildings: []};
		
		oBuildings.vAdd = function (iX, iY, iW, iH, oImage) {
			var oBuilding = {iX: iX, iY: iY, iW: iW, iH: iH, oImage: oImage};
			oBuildings.aBuildings.push(oBuilding);
			oBuildings.iBuildings = oBuildings.aBuildings.length;
			oBuilding.vDraw = function (oG, oCam) {
				oG.vDrawImage(
					oBuilding.oImage,
					oCam.nPlusX + oCam.nZoom * oBuilding.iX,
					oCam.nPlusY + oCam.nZoom * oBuilding.iY,
					oCam.nZoom * oBuilding.iW,
					oCam.nZoom * oBuilding.iH,
					undefined
				);
			};
		};
		
		oBuildings.vCalc = function () {};
		
		oBuildings.vDraw = function (oG, oCam) {
			oBuildings.aBuildings.forEach(function(oBuilding){
				oBuilding.vDraw(oG, oCam);
			});
		};
		
		for (var iB = 0; iB < iBuildings; iB ++) {
			var iW = Math.ceil(3 * Math.random());
			var iH = Math.ceil(3 * Math.random());
			var iX = Math.floor((iWorldW - iW) * Math.random());
			var iY = Math.floor((iWorldH - iH) * Math.random());
			var oImage = Graphics2D.oCreateBuffer(iW * 8, iH * 8);
			oImage.vSetColor('#FFF');
			oImage.vFillRect(1, 1, iW * 8 - 2, iH * 8 - 2);
			oBuildings.vAdd(iX, iY, iW, iH, oImage.oCanvas);
		}
		
		return oBuildings;
		
	};
	
	
	
	
	var oInitCows = function (oWorld, iCows) {
		
		var iWorldW = oWorld.iW;
		var iWorldH = oWorld.iH;
		
		var oCows = {iCows: iCows, aCows: []};
		
		var aCowPoints = [
			[+0.25,+0.1],
			[+0.25,-0.1],
			[-0.25,-0.1],
			[-0.25,+0.1],
		];
		
		for (var iS = 0; iS < iCows; iS ++) {
			(function(){
				var oCow = {
					nX: iWorldW * Math.random(),
					nY: iWorldH * Math.random(),
					bHungry: false,
					nStomach: 0,
					nSpeed: 0.01,
					nDir: 0,
					oCache: {},
				};
				oCow.oCache.pDir = null;
				oCow.oCache.mRotation = null;
				oCow.oCache.aRelPoints = [[0,0],[0,0],[0,0],[0,0]];
				oCow.vSetDir = function (nNewDir) {
					oCow.nDir = nNewDir;
					oCow.oCache.pDir = oLA.pDirToPoint(oCow.nDir);
					oCow.oCache.mRotation = oLA.mRotation(oCow.nDir);
					for (var iP = 0; iP < 4; iP ++) {
						oCow.oCache.aRelPoints[iP] = oLA.pMultiplyNP(1, oLA.pMultiplyMP(oCow.oCache.mRotation, aCowPoints[iP]));
					}
				};
				oCow.vSetDir(Math.PI * 2 * Math.random());
				oCow.vEat = function () {
					var oLand = oWorld.oLands.oGetLand(Math.floor(oCow.nX), Math.floor(oCow.nY));
					if (oLand) {
						oLand.nGrass *= 0.96;
						oWorld.oLands.vUpdateBuffer(oLand);
					} else {
						console.log('no land here', oCow.nX, oCow.nY);
					}
				};
				oCow.vCalc = function () {
					if (oCow.bHungry) {
						
					} else {
						oCow.vEat();
						oCow.nX += oCow.nSpeed * oCow.oCache.pDir[0];
						oCow.nY += oCow.nSpeed * oCow.oCache.pDir[1];
						if (!(0.5 < oCow.nX && oCow.nX < iWorldW - 0.5 && 0.5 < oCow.nY && oCow.nY < iWorldH - 0.5)) {
							var pCenterRel = [iWorldW / 2 - oCow.nX, iWorldH / 2 - oCow.nY];
							pCenterRel = oLA.pNormalize(pCenterRel);
							oCow.nX += pCenterRel[0];
							oCow.nY += pCenterRel[1];
							oCow.vSetDir(Math.PI * 2 * Math.random());
						}
						if (Math.random() < 0.01) {
							oCow.vSetDir(Math.PI * 2 * Math.random());
						}
					}
				}
				oCow.vDraw = function (oG, oCam) {
					var aPolygon = [];
					for (var iP = 0; iP < 4; iP ++) {
						aPolygon.push([
							oCam.nPlusX + oCam.nZoom * (oCow.nX + oCow.oCache.aRelPoints[iP][0]),
							oCam.nPlusY + oCam.nZoom * (oCow.nY + oCow.oCache.aRelPoints[iP][1]),
						]);
					}
					oG.vSetColor('white');
					oG.vFillPolygon(aPolygon);
				};
				oCows.aCows.push(oCow);
			})();
		}
		
		oCows.vCalc = function () {
			oCows.aCows.forEach(function(oCow){
				oCow.vCalc();
			});
		};
		
		oCows.vDraw = function (oG, oCamera) {
			oCows.aCows.forEach(function(oCow){
				oCow.vDraw(oG, oCamera);
			});
		};
		
		return oCows;
		
	};
	
	
	
	
})();