



var vCalcCollisions = function (oState) {
	
	/// walls <> people
	
	//for (var iW = 0; iW < oState.aWalls.length; iW ++) {
	//	var oWall = oState.aWalls[iW];
	//	for (var iP = 0; iP < oState.aPeople.length; iP ++) {
	//		var oPerson = oState.aPeople[iP];
	//		
	//		if (oPerson.oSeat) continue;
	//		var nR = oPerson.nRadius;
	//		var pRel = oLA.pMultiplyMP(oWall.mMatrixB, oPerson.pP);
	//		if (Math.abs(pRel[1]) < oPerson.nRadius) {
	//			if (0 < pRel[0] + nR && pRel[0] - nR < oWall.nLength) {
	//				if (0 < pRel[0] && pRel[0] < oWall.nLength) {
	//					if (pRel[1] > 0) {
	//						pRel[1] = nR;
	//					} else {
	//						pRel[1] = -nR;
	//					}
	//				} else {
	//					if (0 < pRel[0]) {
	//						pRel[0] -= oWall.nLength;
	//						pRel = oLA.pMultiplyNP(nR / oLA.nLength(pRel), pRel);
	//						pRel[0] += oWall.nLength;
	//					} else {
	//						pRel = oLA.pMultiplyNP(nR / oLA.nLength(pRel), pRel);
	//					}
	//				}
	//			}
	//			oPerson.pP = oLA.pMultiplyMP(oWall.mMatrixA, pRel);
	//		}
	//		
	//	}
	//}
	
	/// cars <> cars
	
	/// people <> people
	
	for (var iPA = 0; iPA < oState.aPeople.length; iPA ++) {
		var oPA = oState.aPeople[iPA];
		for (var iPB = 0; iPB < oState.aPeople.length; iPB ++) {
			if (iPA == iPB) continue;
			var oPB = oState.aPeople[iPB];
			
			if (oPA.oSeat || oPB.oSeat) continue;
			var pDelta = oLA.pSub(oPB.pP, oPA.pP);
			var nDistance = oLA.nLength(pDelta);
			if (nDistance < oPA.nRadius + oPB.nRadius) {
				var nBothIM = oPA.nIM + oPB.nIM;
				var nBothMove = oPA.nRadius + oPB.nRadius - nDistance;
				nBothMove *= 1.01;
				var nMoveA = nBothMove * oPA.nIM / nBothIM;
				var nMoveB = nBothMove * oPB.nIM / nBothIM;
				var nMoveDirA = oLA.pNormalize(oLA.pSub(oPA.pP, oPB.pP));
				var nMoveDirB = oLA.pMultiplyNP(-1, nMoveDirA);
				oPA.pP = oLA.pAdd(oPA.pP, oLA.pMultiplyNP(nMoveA, nMoveDirA));
				oPB.pP = oLA.pAdd(oPB.pP, oLA.pMultiplyNP(nMoveB, nMoveDirB));
			}
			
		}
	}
	
	///// walls <> cars
	//
	//for (var iW = 0; iW < oState.aWalls.length; iW ++) {
	//	var oWall = oState.aWalls[iW];
	//	for (var iC = 0; iC < oState.aCars.length; iC ++) {
	//		var oCar = oState.aCars[iC];
	//		/// TODO
	//	}
	//}
	
	/// cars <> people
	
	for (var iC = 0; iC < oState.aCars.length; iC ++) {
		var oCar = oState.aCars[iC];
		for (var iP = 0; iP < oState.aPeople.length; iP ++) {
			var oPerson = oState.aPeople[iP];
			
			if (oPerson.oSeat) continue;
			var nR = oPerson.nRadius;
			var pPersonRel = oLA.pMultiplyMP(oCar.mMatrixB, oPerson.pP);
			
			if (- oCar.pSize[0] / 2 < pPersonRel[0] + nR && pPersonRel[0] - nR < oCar.pSize[0] / 2) {
				if (- oCar.pSize[1] / 2 < pPersonRel[1] + nR && pPersonRel[1] - nR < oCar.pSize[1] / 2) {
					
					var bInHor = - oCar.pSize[0] / 2 < pPersonRel[0] && pPersonRel[0] < oCar.pSize[0] / 2;
					var bInVer = - oCar.pSize[1] / 2 < pPersonRel[1] && pPersonRel[1] < oCar.pSize[1] / 2;
					
					if (bInHor || bInVer) {
						if (!bInHor) {
							pPersonRel[0] = oLA.nDir(pPersonRel[0]) * (oCar.pSize[0] / 2 + nR);
						} else if (!bInVer) {
							pPersonRel[1] = oLA.nDir(pPersonRel[1]) * (oCar.pSize[1] / 2 + nR);
						} else { /// in both
							if (Math.abs(pPersonRel[0] / oCar.pSize[0]) < Math.abs(pPersonRel[1] / oCar.pSize[1])) {
								pPersonRel[0] = oLA.nDir(pPersonRel[0]) * (oCar.pSize[0] / 2 + nR);
							} else {
								pPersonRel[1] = oLA.nDir(pPersonRel[1]) * (oCar.pSize[1] / 2 + nR);
							}
						}
					} else { ///corner
						var pCorner = [oLA.nDir(pPersonRel[0]) * oCar.pSize[0] / 2, oLA.nDir(pPersonRel[1]) * oCar.pSize[1] / 2];
						var pDir = oLA.pNormalize(oLA.pSub(pPersonRel, pCorner));
						pPersonRel = oLA.pAdd(pCorner, oLA.pMultiplyNP(nR, pDir));
					}
					
					oPerson.pP = oLA.pMultiplyMP(oCar.mMatrixA, pPersonRel);
					
				}
			}
			
		}
	}
	
};



