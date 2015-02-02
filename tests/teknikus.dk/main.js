



var oGame = new Game(500, 400);
var oG = oGame.oG;
var oI = oGame.oI;




var oState = {};




var vInit = function () {
	
	oI.bLog = true;
	
	oState.pGravity = [0, 0];
	
	oState.oGrabbedParticle = null;
	
	oState.aParticles = [];
	oState.aParticlePolygons = [];
	oState.aMinDistances = [];
	oState.aMaxDistances = [];
	oState.aDistances = [];
	
	for (var i = 0; i < 9; i ++) {
		var nCX = oG.iW / 2 + 32 * (Math.random() - 0.5);
		var nCY = oG.iH - (i + 1) * 40;
		var nW = 30 + 4 * i;
		var nH = 20 + 2 * i;
		var nDiagonal = oLA.nLength([nW, nH]);
		var aPoints = [
			[nCX + nH / 2, nCY + nW / 2],
			[nCX - nH / 2, nCY + nW / 2],
			[nCX - nH / 2, nCY - nW / 2],
			[nCX + nH / 2, nCY - nW / 2],
		];
		var aParticlePolygon = [];
		for (var iP = 0; iP < aPoints.length; iP ++) {
			var oParticle = oMakeParticle(aPoints[iP]);
			oParticle.aPolygon = aParticlePolygon;
			//oParticle.pPold[0] += 0.5 - Math.random();
			//oParticle.pPold[1] += 0.5 - Math.random();
			oState.aParticles.push(oParticle);
			aParticlePolygon.push(oParticle);
		}
		oState.aParticlePolygons.push(aParticlePolygon);
		oState.aDistances.push({oPA: aParticlePolygon[0], oPB: aParticlePolygon[1], nLength: nW});
		oState.aDistances.push({oPA: aParticlePolygon[1], oPB: aParticlePolygon[2], nLength: nH});
		oState.aDistances.push({oPA: aParticlePolygon[2], oPB: aParticlePolygon[3], nLength: nW});
		oState.aDistances.push({oPA: aParticlePolygon[3], oPB: aParticlePolygon[0], nLength: nH});
		oState.aDistances.push({oPA: aParticlePolygon[3], oPB: aParticlePolygon[1], nLength: nDiagonal});
		oState.aDistances.push({oPA: aParticlePolygon[2], oPB: aParticlePolygon[0], nLength: nDiagonal});
	}
	
	oState.aPenetrations = [];
	
};




var vInput = function () {
	
	if (oI.iButtonJustPressed(0)) {
		var pMouse = [oI.oMouse.iX,oI.oMouse.iY];
		var nNearestParticleDistance = 99999;
		var oNearestParticle = null;
		for (var iP = 0; iP < oState.aParticles.length; iP ++) {
			var oParticle = oState.aParticles[iP];
			var nDistance = oLA.nDistance(pMouse, oParticle.pP);
			if (nDistance < nNearestParticleDistance) {
				nNearestParticleDistance = nDistance;
				oNearestParticle = oParticle;
			}
		}
		oState.oGrabbedParticle = oNearestParticle;
	}
	
	if (oI.iButtonJustReleased(0)) {
		oState.oGrabbedParticle = null;
	}
	
};




var vCalc = function (iSteps, iRelaxations) {
	
	oState.aPenetrations = [];
	
	var nTimeStep = 1 / iSteps;
	
	for (var iStep = 0; iStep < iSteps; iStep ++) {
		
		/// accumulate forces
		
		for (var iP = 0; iP < oState.aParticles.length; iP ++) {
			var oP = oState.aParticles[iP];
			oP.pA = oLA.pAdd(oP.pA, oLA.pMultiplyNP(nTimeStep, oState.pGravity));
		}
		
		/// verlet
		
		for (var iP = 0; iP < oState.aParticles.length; iP ++) {
			var oP = oState.aParticles[iP];
			for (var iI = 0; iI < 2; iI ++) {
				var nTemp = oP.pP[iI];
				oP.pP[iI] += Math.pow(0.99, nTimeStep) * (oP.pP[iI] - oP.pPold[iI]) + oP.pA[iI] * nTimeStep;
				oP.pPold[iI] = nTemp;
				oP.pA[iI] = 0;
				//var nSpeed = oP.pP[iI] - oP.pPold[iI];
				//nSpeed *= 0.99;/// TODO: use timestep
				//oP.pPold[iI] = oP.pP[iI] - nSpeed;
			}
		}
		
		/// satisfy constraints
		
		var bAverage = true;
		
		var pGameSize = [oGame.oG.iW,oGame.oG.iH];
		
		for (var iRelaxation = 0; iRelaxation < iRelaxations; iRelaxation ++) {
			
			if (bAverage) {
				for (var iP = 0; iP < oState.aParticles.length; iP ++) {
					oState.aParticles[iP].aNewTemp = [];
				}
			}
			
			if (oState.oGrabbedParticle) {
				var pMouse = [oI.oMouse.iX, oI.oMouse.iY];
				oState.oGrabbedParticle.aNewTemp.push(pMouse);
			}
			
			for (var iP = 0; iP < oState.aParticles.length; iP ++) {
				var oP = oState.aParticles[iP];
				for (var iDA = 0; iDA < 2; iDA ++) {
					iDB = (iDA + 1) % 2;
					var nPenetrationDepth = 0;
					if (oP.pP[iDA] < 0) {
						var nPenetrationDepth = 0 - oP.pP[iDA];
						var pNew = [oP.pP[0], oP.pP[1]];
						pNew[iDA] = 0;
						oState.aPenetrations.push([pNew, oP.pP]);
						if (bAverage) {
							oP.aNewTemp.push(pNew);
						} else {
							oP.pP = pNew;
						}
					}
					if (oP.pP[iDA] > pGameSize[iDA]) {
						var nPenetrationDepth = oP.pP[iDA] - pGameSize[iDA];
						var pNew = [oP.pP[0], oP.pP[1]];
						pNew[iDA] = pGameSize[iDA];
						oState.aPenetrations.push([pNew, oP.pP]);
						if (bAverage) {
							oP.aNewTemp.push(pNew);
						} else {
							oP.pP = pNew;
						}
					}
					if (nPenetrationDepth != 0) {
						var nSpeed = oP.pP[iDB] - oP.pPold[iDB];
						var nSpeedDir = oLA.nDir(nSpeed)
						nSpeed -= 0.1 * nPenetrationDepth * nSpeedDir;
						if (oLA.nDir(nSpeed) != nSpeedDir) nSpeed = 0;
						oP.pPold[iDB] = oP.pP[iDB] - nSpeed;
					}
				}
			}
			
			for (var iPo = 0; iPo < oState.aParticlePolygons.length; iPo ++) {
				var aParticlePolygon = oState.aParticlePolygons[iPo];
				var aPolygon = [];
				for (var iPP = 0; iPP < aParticlePolygon.length; iPP ++) {
					aPolygon.push(aParticlePolygon[iPP].pP);
				}
				for (var iPa = 0; iPa < oState.aParticles.length; iPa ++) {
					var oParticle = oState.aParticles[iPa];
					if (oParticle.aPolygon == aParticlePolygon) continue;
					var pParticle = oParticle.pP;
					if (bInPolygon(aPolygon, pParticle)) {
						
						var pPenetrationPoint = pFindPenetrationPoint(aPolygon, pParticle);
						
						oState.aPenetrations.push([pPenetrationPoint, pParticle]);
						
						var aPPA = aParticlePolygon;
						var pPointA = pPenetrationPoint;
						var aPPB = oParticle.aPolygon;
						var pPointB = oParticle.pP;
						
						var pDelta = oLA.pSub(pPointB, pPointA);
						var nPenetrationDepth = oLA.nLength(pDelta);
						var mDeltaMatrix = oLA.mMatrixFromCenterNormal(pPointA, pDelta);
						
						var nClosestA = 9999;
						var oClosestA = null;
						for (var iPPA = 0; iPPA < aPPA.length; iPPA ++) {
							var oPA = aPPA[iPPA];
							var nDistance = oLA.nDistance(pPointA, oPA.pP);
							if (nDistance < nClosestA) {
								nClosestA = nDistance;
								oClosestA = oPA;
							}
						}
						
						var nClosestB = 9999;
						var oClosestB = null;
						for (var iPPB = 0; iPPB < aPPB.length; iPPB ++) {
							var oPB = aPPB[iPPB];
							var nDistance = oLA.nDistance(pPointB, oPB.pP);
							if (nDistance < nClosestB) {
								nClosestB = nDistance;
								oClosestB = oPB;
							}
						}
						
						var pNewA = oLA.pAdd(oClosestA.pP, oLA.pMultiplyNP(+0.5, pDelta));
						var pNewB = oLA.pAdd(oClosestB.pP, oLA.pMultiplyNP(-0.5, pDelta));
						
						//var pRelativeSpeed = 
						
						if (bAverage) {
							oClosestA.aNewTemp.push(pNewA);
							oClosestB.aNewTemp.push(pNewB);
						} else {
							oClosestA.pP = pNewA;
							oClosestB.pP = pNewB;
						}
						
					}
				}
			}
			
			for (var iPS = 0; iPS < oState.aDistances.length; iPS ++) {
				var oStick = oState.aDistances[iPS];
				var nRestLength = oStick.nLength;
				var pDelta = oLA.pSub(oStick.oPA.pP, oStick.oPB.pP);
				var nDelta = oLA.nLength(pDelta);
				var nCorrection = nRestLength - nDelta;
				if (nCorrection) {
					//nCorrection *= 0.01;
					var pDeltaDir = oLA.pNormalize(pDelta);
					var pNewA = oLA.pAdd(oStick.oPA.pP, oLA.pMultiplyNP(nCorrection, oLA.pMultiplyNP(+0.5, pDeltaDir)));
					var pNewB = oLA.pAdd(oStick.oPB.pP, oLA.pMultiplyNP(nCorrection, oLA.pMultiplyNP(-0.5, pDeltaDir)));
					if (bAverage) {
						oStick.oPA.aNewTemp.push(pNewA);
						oStick.oPB.aNewTemp.push(pNewB);
					} else {
						oStick.oPA.pP = pNewA;
						oStick.oPB.pP = pNewB;
					}
				}
			}
			
			for (var iD = 0; iD < oState.aMinDistances.length; iD ++) {
				var oConstraint = oState.aMinDistances[iD];
				var nDistance = oConstraint.nDistance;
				var pDelta = oLA.pSub(oConstraint.oPA.pP, oConstraint.oPB.pP);
				var nDelta = oLA.nLength(pDelta);
				if (nDelta < nDistance) {
					var pDeltaDir = oLA.pNormalize(pDelta);
					var nCorrection = nRestLength - nDelta;
					var pNewA = oLA.pAdd(oConstraint.oPA.pP, oLA.pMultiplyNP(nCorrection, oLA.pMultiplyNP(+0.5, pDeltaDir)));
					var pNewB = oLA.pAdd(oConstraint.oPB.pP, oLA.pMultiplyNP(nCorrection, oLA.pMultiplyNP(-0.5, pDeltaDir)));
					if (bAverage) {
						oConstraint.oPA.aNewTemp.push(pNewA);
						oConstraint.oPB.aNewTemp.push(pNewB);
					} else {
						oConstraint.oPA.pP = pNewA;
						oConstraint.oPB.pP = pNewB;
					}
				}
			}
			
			if (bAverage) {
				for (var iP = 0; iP < oState.aParticles.length; iP ++) {
					var oParticle = oState.aParticles[iP];
					var iTempLength = oParticle.aNewTemp.length;
					if (iTempLength) {
						oParticle.pP = [0,0];
						for (var iT = 0; iT < oParticle.aNewTemp.length; iT ++) {
							oParticle.pP[0] += oParticle.aNewTemp[iT][0];
							oParticle.pP[1] += oParticle.aNewTemp[iT][1];
						}
						oParticle.pP[0] /= oParticle.aNewTemp.length;
						oParticle.pP[1] /= oParticle.aNewTemp.length;
					}
				}
			}
			
		}
		
	}
	
};




var vDraw = function () {
	
	oG.vSetColor('#FFF');
	oG.vFillRect(0, 0, oG.iW, oG.iH);
	
	oG.vSetColor('#000');
	for (var iP = 0; iP < oState.aParticles.length; iP ++) {
		var oP = oState.aParticles[iP];
		oG.vFillRect(oP.pP[0] - 1, oP.pP[1] - 1, 2, 2);
	}
	
	oG.vSetColor('#000');
	for (var iPS = 0; iPS < oState.aDistances.length; iPS ++) {
		var oStick = oState.aDistances[iPS];
		oG.vDrawLine(oStick.oPA.pP[0], oStick.oPA.pP[1], oStick.oPB.pP[0], oStick.oPB.pP[1]);
	}
	
	oG.vSetColor('#00F');
	if (oState.oGrabbedParticle) {
		oG.vDrawCircle(oState.oGrabbedParticle.pP, 3);
		oG.vDrawLine(oState.oGrabbedParticle.pP, [oI.oMouse.iX, oI.oMouse.iY]);
	}
	
	oG.vSetColor('#F00');
	for (var iP = 0; iP < oState.aPenetrations.length; iP ++) {
		var aP = oState.aPenetrations[iP];
		oG.vDrawLine(aP[0], aP[1]);
		oG.vDrawCircle(aP[0], 4);
	}
	
	oG.vSetColor('#F00');
	var pMouse = [oI.oMouse.iX, oI.oMouse.iY];
	for (var iP = 0; iP < oState.aParticles.length; iP ++) {
		
	}
	
};




vInit();

oGame.vStartLoop(function(iUT, iDeltaUT){
	vInput();
	vCalc(9, 3);
	vDraw();
});



