



var Math3D = Math3D || {};




Math3D.oMatrixHelper = {};




Math3D.oMatrixHelper.pUp = [ 0 , 1 , 0 ];




//  Math3D.oMatrixHelper.mRotToS = function (nRH, nRV) { /// s for subjective
//  	
//  	return Math3D.mMxM(Math3D.mRotationX(-nRV), Math3D.mRotationZ(-nRH));
//  	
//  };
//  
//  
//  
//  
//  Math3D.oMatrixHelper.mRotToO = function (nRH, nRV) { /// o for objective
//  	
//  	return Math3D.mMxM(Math3D.mRotationZ(nRH), Math3D.mRotationX(nRV));
//  	
//  };
//  
//  
//  
//  
//  
//  Math3D.oMatrixHelper.mDirToS = function (pDir, pUp) { /// s for subjective
//  	
//  	var oMH = this;
//  	
//  	var mReturn = Math3D.mInverse(oMH.mDirToO(pDir, pUp));
//  	
//  	return mReturn;
//  	
//  };
//  
//  
//  
//  
//  Math3D.oMatrixHelper.mDirToO = function (pDir, pUp) { /// o for objective
//  	
//  	var oMH = this;
//  	
//  	if (typeof pUp == 'undefined') pUp = oMH.pUp;
//  	
//  	var pY = Math3D.pNormalize([pDir[0], pDir[1], pDir[2]]);
//  	var pX = Math3D.pNormalize(Math3D.pPxP(pUp, pY));
//  	var pZ = Math3D.pNormalize(Math3D.pPxP(pY, pX));
//  	
//  	return Math3D.mFromCoordinateSystem(pX,pY,pZ);
//  	
//  	return mReturn;
//  	
//  };




Math3D.vPrintM = function (mM) {
	
	var sD = '  ';
	
	console.log(Math3D.sPrint(mM[ 0]) + sD + Math3D.sPrint(mM[ 1]) + sD + Math3D.sPrint(mM[ 2]) + sD + Math3D.sPrint(mM[ 3]));
	console.log(Math3D.sPrint(mM[ 4]) + sD + Math3D.sPrint(mM[ 5]) + sD + Math3D.sPrint(mM[ 6]) + sD + Math3D.sPrint(mM[ 7]));
	console.log(Math3D.sPrint(mM[ 8]) + sD + Math3D.sPrint(mM[ 9]) + sD + Math3D.sPrint(mM[10]) + sD + Math3D.sPrint(mM[11]));
	console.log(Math3D.sPrint(mM[12]) + sD + Math3D.sPrint(mM[13]) + sD + Math3D.sPrint(mM[14]) + sD + Math3D.sPrint(mM[15]));
	
};




Math3D.vPrintP = function (pP) {
	
	var sD = '  ';
	
	console.log(Math3D.sPrint(pP[ 0]) + sD + Math3D.sPrint(pP[ 1]) + sD + Math3D.sPrint(pP[ 2]));
	
};




Math3D.sPrint = function (nValue) {
	var sReturn = nValue.toFixed(4);
	if (nValue >= 0) {
		sReturn = ' ' + sReturn;
	}
	return sReturn;
};



