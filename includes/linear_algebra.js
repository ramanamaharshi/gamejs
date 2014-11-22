

// matrix
// 0 2 4
// 1 3 5


var oLA = {
	
	
	
	
	nLength: function (pP) {
		
		return Math.sqrt(pP[0] * pP[0] + pP[1] * pP[1]);
		
	},
	
	
	
	
	pMultiplyMP: function (mM, pP) {
		
		var pReturn = [
			(mM[0] * pP[0] + mM[2] * pP[1] + mM[4]),
			(mM[1] * pP[0] + mM[3] * pP[1] + mM[5]),
		];
		
		return pReturn;
		
	},
	
	
	
	
	mMultiplyMM: function (mA, mB) {
		
		//					b0			b2			b4
		//					b1			b3			b5
		//					 0			 0			 1
		//				
		//	a0 a2 a4	a0b0+a2b1	a0b2+a2b3	a0b4+a2b5+a4
		//	a1 a3 a5	a1b0+a3b1	a1b2+a3b3	a1b4+a3b5+a5
		//	 0  0  1	
		
		var mReturn = [
			mA[0] * mB[0] + mA[2] * mB[0],
			mA[1] * mB[0] + mA[3] * mB[0],
			mA[0] * mB[2] + mA[2] * mB[3],
			mA[1] * mB[2] + mA[3] * mB[3],
			mA[0] * mB[4] + mA[2] * mB[5] + mA[4],
			mA[1] * mB[4] + mA[3] * mB[5] + mA[5],
		];
		
		return mReturn;
		
	},
	
	
	
	
	mTranslation: function (pT) {
		
		return [1, 0, 0, 1, pT[0], pT[1]];
		
	},
	
	
	
	
	mInverseTranslation: function (pT) {
		
		return oLA.mTranslation([-pT[0], -pT[1]]);
		
	},
	
	
	
	
	mRotation: function (pR, bScale) {
		
		var mReturn = [pR[1], -pR[0], pR[0], pR[1], 0, 0];
		
		if (!bScale) {
			var nLength = oLA.nLength(pR);
			for (var iR = 0; iR < mReturn.length; iR ++) {
				mReturn[iR] /= nLength;
			}
		}
		
		return mReturn;
		
	},
	
	
	
	
	mInverseRotation: function (pR, bScale) {
		
		var nLength = oLA.nLength(pR);
		
//oLA.vPrintP(pR);
//console.log(nLength);
//pR[0] /= nLength;
//pR[1] /= nLength;
//oLA.vPrintP(pR);
		
		return oLA.mRotation([- pR[0] / nLength / nLength, pR[1] / nLength / nLength], bScale);
		
		//var mReturn = [1 / pR[1], -1 / pR[0], 1 / pR[0], 1 / pR[1], 0, 0];
		//
		//if (!bScale) {
		//	var nLength = oLA.nLength(pR);
		//	for (var iR = 0; iR < mReturn.length; iR ++) {
		//		mReturn[iR] *= nLength;
		//	}
		//}
		//
		//return mReturn;
		
	},
	
	
	
	
	mMatrixFromCenterNormal: function (pC, pN, bScale) {
		
		var mTranslate = oLA.mInverseTranslation(pC);
		var mRotateScale = oLA.mInverseRotation(pN, bScale);
		
		return oLA.mMultiplyMM(mRotateScale, mTranslate);
		
	},
	
	
	
	
	vPrintM: function (mM) {
		var sD = '  ';
		console.log(oLA.sPrint(mM[0]) + sD + oLA.sPrint(mM[2]) + sD + oLA.sPrint(mM[4]));
		console.log(oLA.sPrint(mM[1]) + sD + oLA.sPrint(mM[3]) + sD + oLA.sPrint(mM[5]));
	},
	
	
	
	
	vPrintP: function (pP) {
		console.log('(' + oLA.sPrint(pP[0]) + '  ' + oLA.sPrint(pP[1]) + ' )');
	},
	
	
	
	
	sPrint: function (nValue) {
		var sReturn = nValue.toFixed(4);
		if (nValue >= 0) {
			sReturn = ' ' + sReturn;
		}
		return sReturn;
	},
	
	
	
	
};



