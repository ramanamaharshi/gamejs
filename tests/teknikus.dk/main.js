



var oGame = new Game(500, 400);
var oG = oGame.oG;
var oI = oGame.oI;




var oState = {};




var vInit = function () {
	
	oState.nTimestep = 1;
	oState.pGravity = [0, 0.00001];
	
	oState.aParticles = [];
	oState.aParticlePolygons = [];
	oState.aMinDistances = [];
	oState.aMaxDistances = [];
	oState.aDistances = [];
	
	//for (var i = 0; i < 20; i ++) {
	//	var oParticle = {pP: [250,300], pPold: [250,300], pA: [0,0]};
	//	oParticle.pP[0] += 16 * (Math.random() - 0.5);
	//	oParticle.pP[1] += 16 * (Math.random() - 0.5) - 2;
	//	oState.aParticles.push(oParticle);
	//}
	//
	//for (var iP = 3; iP < oState.aParticles.length; iP += 4) {
	//	oState.aParticlePolygons.push([
	//		oState.aParticles[iP - 0],
	//		oState.aParticles[iP - 1],
	//		oState.aParticles[iP - 2],
	//		oState.aParticles[iP - 3],
	//	]);
	//	oState.aDistances.push({oPA: oState.aParticles[iP - 0], oPB: oState.aParticles[iP - 2], nLength: 50});
	//	oState.aDistances.push({oPA: oState.aParticles[iP - 1], oPB: oState.aParticles[iP - 3], nLength: 50});
	//	oState.aDistances.push({oPA: oState.aParticles[iP - 0], oPB: oState.aParticles[iP - 1], nLength: 30});
	//	oState.aDistances.push({oPA: oState.aParticles[iP - 1], oPB: oState.aParticles[iP - 2], nLength: 40});
	//	oState.aDistances.push({oPA: oState.aParticles[iP - 2], oPB: oState.aParticles[iP - 3], nLength: 30});
	//	oState.aDistances.push({oPA: oState.aParticles[iP - 3], oPB: oState.aParticles[iP - 0], nLength: 40});
	//}
	
	for (var i = 0; i < 6; i ++) {
		var nCX = oG.iWidth / 2 + 32 * (Math.random() - 0.5);
		var nCY = oG.iHeight - (i + 1) * 40;
		var nW = 20 + 4 * i;
		var nH = 20 + 2 * i;
		var nDiagonal = oLA.nLength([nW, nH]);
		var aPoints = [
			[nCX + nW / 2, nCY + nH / 2],
			[nCX - nW / 2, nCY + nH / 2],
			[nCX - nW / 2, nCY - nH / 2],
			[nCX + nW / 2, nCY - nH / 2],
		];
		var aParticlePolygon = [];
		for (var iP = 0; iP < aPoints.length; iP ++) {
			var oParticle = oMakeParticle(aPoints[iP]);
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
	
};




var vInput = function () {
	
	
};




var vCalc = function () {
	
	var fTimeStep = 1;
	
	/// accumulate forces
	
	for (var iP = 0; iP < oState.aParticles.length; iP ++) {
		var oP = oState.aParticles[iP];
		oP.pA = oLA.pAdd(oP.pA, oState.pGravity);
	}
	
	/// verlet
	
	for (var iP = 0; iP < oState.aParticles.length; iP ++) {
		var oP = oState.aParticles[iP];
		for (var iI = 0; iI < 2; iI ++) {
			var nTemp = oP.pP[iI];
			oP.pP[iI] += oP.pP[iI] - oP.pPold[iI] + oP.pA[iI] * oState.nTimestep * oState.nTimestep;
			oP.pPold[iI] = nTemp;
		}
	}
	
	/// satisfy constraints
	
	var pGameSize = [oGame.oG.iWidth,oGame.oG.iHeight];
	
	for (var iI = 0; iI < 4; iI ++) {
		
		for (var iP = 0; iP < oState.aParticles.length; iP ++) {
			var oP = oState.aParticles[iP];
			for (var iDA = 0; iDA < 2; iDA ++) {
				iDB = (iDA + 1) % 2;
				var nPenetrationDepth = 0;
				if (oP.pP[iDA] < 0) {
					var nPenetrationDepth = 0 - oP.pP[iDA];
					oP.pP[iDA] = 0;
				}
				if (oP.pP[iDA] > pGameSize[iDA]) {
					var nPenetrationDepth = oP.pP[iDA] - pGameSize[iDA];
					oP.pP[iDA] = pGameSize[iDA];
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
			lParticleLoop:for (var iPa = 0; iPa < oState.aParticles.length; iPa ++) {
				var oParticle = oState.aParticles[iPa];
				for (var iPP = 0; iPP < aParticlePolygon.length; iPP ++) {
					if (oParticle == aParticlePolygon[iPP]) {
						continue lParticleLoop;
					}
				}
				var pParticle = oParticle.pP;
//console.log('check', pParticle[0], pParticle[1]);
				if (bInPolygon(aPolygon, pParticle)) {
//console.log('bInPolygon', aPolygon, pParticle);
					var pPenetrationPoint = pFindPenetrationPoint(aPolygon, pParticle);
oG.vSetColor('#F00');
oG.vDrawLine(pParticle, pPenetrationPoint);
oG.vDrawOval(pPenetrationPoint[0] - 4, pPenetrationPoint[1] - 4, 8, 8);
					var aDistances = [];
					var nTotalDistance = 0;
					for (var iPP = 0; iPP < aParticlePolygon; iPP ++) {
						var nDistance = oPA.nDistance(pPenetrationPoint, aParticlePolygon[iPP].pP);
						nTotalDistance += nDistance;
						aDistances.push(nDistance);
					}
					
					oParticle.pP = pPenetrationPoint;
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
				nCorrection *= 0.5;
				var pDeltaDir = oLA.pNormalize(pDelta);
				//pDeltaDir = oLA.pAdd(pDeltaDir, [1 * (Math.random() - 0.5), 1 * (Math.random() - 0.5)]);
				oStick.oPA.pP = oLA.pAdd(oStick.oPA.pP, oLA.pMultiplyNP(nCorrection, oLA.pMultiplyNP(0.5, pDeltaDir)));
				oStick.oPB.pP = oLA.pAdd(oStick.oPB.pP, oLA.pMultiplyNP(nCorrection, oLA.pMultiplyNP(-0.5, pDeltaDir)));
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
				oConstraint.oPA.pP = oLA.pAdd(oConstraint.oPA.pP, oLA.pMultiplyNP(nCorrection, oLA.pMultiplyNP(0.5, pDeltaDir)));
				oConstraint.oPB.pP = oLA.pAdd(oConstraint.oPB.pP, oLA.pMultiplyNP(nCorrection, oLA.pMultiplyNP(-0.5, pDeltaDir)));
			}
		}
		
	}
	
};




var vDraw = function () {
	
	oG.vSetColor('#000');
	
	for (var iP = 0; iP < oState.aParticles.length; iP ++) {
		var oP = oState.aParticles[iP];
		oG.vFillRect(oP.pP[0] - 1, oP.pP[1] - 1, 2, 2);
	}
	
	for (var iPS = 0; iPS < oState.aDistances.length; iPS ++) {
		var oStick = oState.aDistances[iPS];
		oG.vDrawLine(oStick.oPA.pP[0], oStick.oPA.pP[1], oStick.oPB.pP[0], oStick.oPB.pP[1]);
	}
	
	//var aParticlePolygon = oState.aParticlePolygons[0];
	//var aPolygon = [];
	//for (var iPP = 0; iPP < aParticlePolygon.length; iPP ++) {
	//	aPolygon.push(aParticlePolygon[iPP].pP);
	//}
	//oG.vSetColor('#0FF');
	//oG.vDrawPolygon(aPolygon);
	//
	//var pMouse = [oI.oMouse.iX, oI.oMouse.iY];
	//oG.vSetColor('#0F0');
	//if (bInPolygon(aPolygon, pMouse)) {
	//	oG.vSetColor('#F00');
	//}
	//oG.vFillRect(pMouse[0] - 4, pMouse[1] - 4, 8, 8);
	
};




vInit();

oGame.vStartLoop(function(iUT, iDeltaUT){
	oG.vSetColor('#FFF');
	oG.vFillRect(0, 0, oG.iWidth, oG.iHeight);
	vInput();
	vCalc();
	vDraw();
});



