

// matrix
// 0 2 4
// 1 3 5


var oLA = {
	
	
	
	
	mMatrixFromCenterNormal: function (pC, pN, bScale) {
		
		var mTranslate = oLA.mInverseTranslation(pC);
		var mRotateScale = oLA.mInverseRotation(pN, bScale);
		
		return oLA.mMultiplyMM(mRotateScale, mTranslate);
		
	},
	
	
	
	
	mInverseMatrixFromCenterNormal: function (pC, pN, bScale) {
		
		var mTranslate = oLA.mTranslation(pC);
		var mRotateScale = oLA.mRotation(pN, bScale);
		
		return oLA.mMultiplyMM(mTranslate, mRotateScale);
		
	},
	
	
	
	
	mInverseRotation: function (pR, bScale) {
		
		var nLength = 1;
		if (typeof pR == 'number') {
			pR = [Math.cos(pR), Math.sin(pR)];
		} else {
			nLength = oLA.nLength(pR);
		}
		
		return oLA.mRotation([pR[0] / nLength / nLength, -pR[1] / nLength / nLength], bScale);
		
	},
	
	
	
	
	mRotation: function (pR, bScale) {
		
		if (typeof pR == 'number') pR = [Math.cos(pR), Math.sin(pR)];
		
		var mReturn = [pR[0], pR[1], -pR[1], pR[0], 0, 0];
		
		if (!bScale) {
			var nLength = oLA.nLength(pR);
			for (var iR = 0; iR < mReturn.length; iR ++) {
				mReturn[iR] /= nLength;
			}
		}
		
		return mReturn;
		
	},
	
	
	
	
	mInverseTranslation: function (pT) {
		
		return oLA.mTranslation([-pT[0], -pT[1]]);
		
	},
	
	
	
	
	mTranslation: function (pT) {
		
		return [1, 0, 0, 1, pT[0], pT[1]];
		
	},
	
	
	
	
	mIdentity: function () {
		
		return [1,0,0,1,0,0];
		
	},
	
	
	
	
	mMultiplyMM: function (mA, mB) {
		
		///						b0			b2			b4
		///						b1			b3			b5
		///						 0			 0			 1
		///					
		///		a0 a2 a4	a0b0+a2b1	a0b2+a2b3	a0b4+a2b5+a4
		///		a1 a3 a5	a1b0+a3b1	a1b2+a3b3	a1b4+a3b5+a5
		///		 0  0  1	
		
		var mReturn = [
			mA[0] * mB[0] + mA[2] * mB[1],
			mA[1] * mB[0] + mA[3] * mB[1],
			mA[0] * mB[2] + mA[2] * mB[3],
			mA[1] * mB[2] + mA[3] * mB[3],
			mA[0] * mB[4] + mA[2] * mB[5] + mA[4],
			mA[1] * mB[4] + mA[3] * mB[5] + mA[5],
		];
		
		return mReturn;
		
	},
	
	
	
	
	pMultiplyMP: function (mM, pP) {
		
		var pReturn = [
			(mM[0] * pP[0] + mM[2] * pP[1] + mM[4]),
			(mM[1] * pP[0] + mM[3] * pP[1] + mM[5]),
		];
		
		return pReturn;
		
	},
	
	
	
	
	pMultiplyNP: function (nF, pP) {
		
		return [nF * pP[0], nF * pP[1]];
		
	},
	
	
	
	
	pAdd: function (pA, pB) {
		
		return [pA[0] + pB[0], pA[1] + pB[1]];
		
	},
	
	
	
	
	pSub: function (pA, pB) {
		
		return [pA[0] - pB[0], pA[1] - pB[1]];
		
	},
	
	
	
	
	pNormalize: function (pP) {
		
		var nLength = this.nLength(pP);
		
		if (!nLength) return null;
		
		return [pP[0] / nLength, pP[1] / nLength];
		
	},
	
	
	
	
	nDistance: function (pA, pB) {
		
		return oLA.nLength(oLA.pSub(pA, pB));
		
	},
	
	
	
	
	nLength: function (pP) {
		
		return Math.sqrt(pP[0] * pP[0] + pP[1] * pP[1]);
		
	},
	
	
	
	
	nDir: function (nValue) {
		
		if (nValue < 0) {
			return -1;
		} else if (nValue > 0) {
			return 1;
		} else {
			return 0;
		}
		
	},
	
	
	
	
	nPointToDir: function (pPoint) {
		
		return Math.PI / 2 - Math.atan2(pPoint[0], pPoint[1]);
		
	},
	
	
	
	
	pDirToPoint: function (nDir) {
		
		return [Math.cos(nDir), Math.sin(nDir)];
		
	},
	
	
	
	
	vPrintM: function (mM) {
		var sD = '  ';
		console.log(oLA.sPrint(mM[0]) + sD + oLA.sPrint(mM[2]) + sD + oLA.sPrint(mM[4]));
		console.log(oLA.sPrint(mM[1]) + sD + oLA.sPrint(mM[3]) + sD + oLA.sPrint(mM[5]));
	},
	
	
	
	
	vPrintP: function (pP) {
		console.log('(' + oLA.sPrint(pP[0]) + '  ' + oLA.sPrint(pP[1]) + ' )');
	},
	
	
	
	
	vPrintN: function (nN) {
		console.log(oLA.sPrint(nN));
	},
	
	
	
	
	sPrint: function (nValue) {
		var sReturn = nValue.toFixed(4);
		if (nValue >= 0) {
			sReturn = ' ' + sReturn;
		}
		return sReturn;
	},
	
	
	
	
};



