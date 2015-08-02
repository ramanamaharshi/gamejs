(function(){
	
	
	
	
	window.oInitWorld = function (iW, iH) {
		
		var oWorld = {iW: iW, iH: iH};
		
		oWorld.oLands = oInitLands(iW, iH);
		oWorld.oBuildings = oInitBuildings(oWorld, 8);
		oWorld.oUnits = oInitUnits(oWorld);
		
		oWorld.oCows = oInitCows(oWorld, 64);
		
		oWorld.vCalc = function () {
			oWorld.oLands.vCalc();
			oWorld.oBuildings.vCalc();
			oWorld.oUnits.vCalc();
		};
		oWorld.vDraw = function (oG, oCamera) {
			oWorld.oLands.vDraw(oG, oCamera);
			oWorld.oBuildings.vDraw(oG, oCamera);
			oWorld.oUnits.vDraw(oG, oCamera);
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
		
		var oBuildings = {iBuildings: 0, aBuildings: []};
		
		oBuildings.vAdd = function (oData) {
			var oBuilding = {
				iX: oData.iX,
				iY: oData.iY,
				iW: oData.iW,
				iH: oData.iH,
				oImage: oData.oImage,
				sType: oData.sType,
			};
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
			var oData = {};
			oData.sType = 'test';
			oData.iW = Math.ceil(3 * Math.random());
			oData.iH = Math.ceil(3 * Math.random());
			oData.iX = Math.floor((oWorld.iW - oData.iW) * Math.random());
			oData.iY = Math.floor((oWorld.iH - oData.iH) * Math.random());
			var oBuffer = Graphics2D.oCreateBuffer(oData.iW * 8, oData.iH * 8);
			oBuffer.vSetColor('#FFF');
			oBuffer.vFillRect(1, 1, oData.iW * 8 - 2, oData.iH * 8 - 2);
			oData.oImage = oBuffer.oCanvas;
			oBuildings.vAdd(oData);
		}
		
		return oBuildings;
		
	};
	
	
	
	
	var oInitUnits = function (oWorld) {
		
		var oUnits = {aUnits: [], iUnits: 0};
		
		oUnits.vAdd = function (oData) {
			
			var oUnit = {
				nR: oData.nR,
				nX: oData.nX,
				nY: oData.nY,
				nDir: oData.nDir,
				sType: oData.sType,
				oType: oData.oType,
			};
			
			oUnit.vSetPos = function (nX, nY) {
				oUnit.nX = nX;
				oUnit.nY = nY;
			};
			
			oUnit.vSetDir = function (nDir) {
				oUnit.nDir = nDir;
			};
			
			oUnit.vCalc = function () {
				if (typeof oUnit.oType != 'undefined' && typeof oUnit.oType.vCalc != 'undefined') {
					oUnit.oType.vCalc();
				}
			};
			
			oUnit.vDraw = function (oG, oCam) {
				if (typeof oUnit.oType != 'undefined' && typeof oUnit.oType.vDraw != 'undefined') {
					oUnit.oType.vDraw(oG, oCam);
				} else {
					oG.vDrawCircle(oCam.nPlusX + oCam.nZoom * oUnit.nX, oCam.nPlusY + oCam.nZoom * oUnit.nY, oCam.nZoom * oUnit.nR);
				}
			};
			
			oUnits.aUnits.push(oUnit);
			
			oUnits.iUnits = oUnits.aUnits.length;
			
			return oUnit;
			
		};
		
		oUnits.vCalc = function () {
			oUnits.aUnits.forEach(function(oUnit){
				oUnit.vCalc();
			});
		};
		
		oUnits.vDraw = function (oG, oCam) {
			oUnits.aUnits.forEach(function(oUnit){
				oUnit.vDraw(oG, oCam);
			});
		};
		
		return oUnits;
		
	};
	
	
	
	
	var oInitCows = function (oWorld, iCows) {
		
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
					nStomach: 0,
					nSpeed: 0.01,
					bHungry: false,
					oCache: {},
				};
				var oUnitData = {
					nDir: 0,
					nR: 0.25,
					nX: oWorld.iW * Math.random(),
					nY: oWorld.iH * Math.random(),
					oType: oCow,
					sType: 'cow',
				};
				oCow.oUnit = oWorld.oUnits.vAdd(oUnitData);
				
				oCow.oCache.pDir = null;
				oCow.oCache.mRotation = null;
				oCow.oCache.aRelPoints = [[0,0],[0,0],[0,0],[0,0]];
				oCow.vSetDir = function (nNewDir) {
					oCow.oUnit.vSetDir(nNewDir);
					oCow.oCache.pDir = oLA.pDirToPoint(oCow.oUnit.nDir);
					oCow.oCache.mRotation = oLA.mRotation(oCow.oUnit.nDir);
					for (var iP = 0; iP < 4; iP ++) {
						oCow.oCache.aRelPoints[iP] = oLA.pMultiplyNP(1, oLA.pMultiplyMP(oCow.oCache.mRotation, aCowPoints[iP]));
					}
				};
				oCow.vSetDir(Math.PI * 2 * Math.random());
				oCow.vEat = function () {
					var oLand = oWorld.oLands.oGetLand(Math.floor(oCow.oUnit.nX), Math.floor(oCow.oUnit.nY));
					if (oLand) {
						oLand.nGrass *= 0.96;
						oWorld.oLands.vUpdateBuffer(oLand);
					} else {
						console.log('no land here', oCow.oUnit.nX, oCow.oUnit.nY);
					}
				};
				oCow.vCalc = function () {
					if (oCow.bHungry) {
						
					} else {
						oCow.vEat();
						var nX = oCow.oUnit.nX + oCow.nSpeed * oCow.oCache.pDir[0];
						var nY = oCow.oUnit.nY + oCow.nSpeed * oCow.oCache.pDir[1];
						if (!(0.5 < nX && nX < oWorld.iW - 0.5 && 0.5 < nY && nY < oWorld.iH - 0.5)) {
							var pCenterRel = [oWorld.iW / 2 - nX, oWorld.iH / 2 - nY];
							pCenterRel = oLA.pNormalize(pCenterRel);
							nX += pCenterRel[0];
							nY += pCenterRel[1];
							oCow.vSetDir(Math.PI * 2 * Math.random());
						}
						if (Math.random() < 0.01) {
							oCow.vSetDir(Math.PI * 2 * Math.random());
						}
						oCow.oUnit.vSetPos(nX, nY);
					}
				}
				oCow.vDraw = function (oG, oCam) {
					var aPolygon = [];
					for (var iP = 0; iP < 4; iP ++) {
						aPolygon.push([
							oCam.nPlusX + oCam.nZoom * (oCow.oUnit.nX + oCow.oCache.aRelPoints[iP][0]),
							oCam.nPlusY + oCam.nZoom * (oCow.oUnit.nY + oCow.oCache.aRelPoints[iP][1]),
						]);
					}
					oG.vSetColor('white');
					oG.vFillPolygon(aPolygon);
				};
				oCows.aCows.push(oCow);
				
			})();
		}
		
		return oCows;
		
	};
	
	
	
	
})();