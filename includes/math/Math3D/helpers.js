



var Math3D = Math3D || {};




Math3D.oMatrixHelper = {};




Math3D.oMatrixHelper.pUp = [ 0 , 1 , 0 ];




Math3D.oMatrixHelper.mDirToS = function (pDir) {
	
	var oMH = this;
	
	var mReturn = Math3D.mInverse(oMH.mDirToO(pDir));
	
	return mReturn;
	
};




Math3D.oMatrixHelper.mDirToO = function (pDir) {
	
	var oMH = this;
	
	var pY = Math3D.pNormalize([pDir[0], pDir[1], pDir[2]]);
	var pX = Math3D.pNormalize(Math3D.pPxP(oMH.pUp, pY));
	var pZ = Math3D.pNormalize(Math3D.pPxP(pY, pX));
	
//console.log('pX');
//Math3D.vPrintP(pX);
//console.log('pY');
//Math3D.vPrintP(pY);
//console.log('pZ');
//Math3D.vPrintP(pZ);
	
	var mReturn = new Float32Array([
		pX[0] , pX[1] , pX[2] , 0 ,
		pY[0] , pY[1] , pY[2] , 0 ,
		pZ[0] , pZ[1] , pZ[2] , 0 ,
		0 , 0 , 0 , 1 ,
	]);
	
	//mReturn = Math3D.mIdentity();
	
	return mReturn;
	
};




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



