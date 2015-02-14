

var Math3D = {};


Math3D.mMultiplyMM = function (mB, mA) {
	
	var mReturn = new Float32Array(16);
	
	var nA00 = mA[0*4+0];
	var nA01 = mA[0*4+1];
	var nA02 = mA[0*4+2];
	var nA03 = mA[0*4+3];
	var nA10 = mA[1*4+0];
	var nA11 = mA[1*4+1];
	var nA12 = mA[1*4+2];
	var nA13 = mA[1*4+3];
	var nA20 = mA[2*4+0];
	var nA21 = mA[2*4+1];
	var nA22 = mA[2*4+2];
	var nA23 = mA[2*4+3];
	var nA30 = mA[3*4+0];
	var nA31 = mA[3*4+1];
	var nA32 = mA[3*4+2];
	var nA33 = mA[3*4+3];
	var nB00 = mB[0*4+0];
	var nB01 = mB[0*4+1];
	var nB02 = mB[0*4+2];
	var nB03 = mB[0*4+3];
	var nB10 = mB[1*4+0];
	var nB11 = mB[1*4+1];
	var nB12 = mB[1*4+2];
	var nB13 = mB[1*4+3];
	var nB20 = mB[2*4+0];
	var nB21 = mB[2*4+1];
	var nB22 = mB[2*4+2];
	var nB23 = mB[2*4+3];
	var nB30 = mB[3*4+0];
	var nB31 = mB[3*4+1];
	var nB32 = mB[3*4+2];
	var nB33 = mB[3*4+3];
	
	mReturn[ 0] = nA00 * nB00 + nA01 * nB10 + nA02 * nB20 + nA03 * nB30;
	mReturn[ 1] = nA00 * nB01 + nA01 * nB11 + nA02 * nB21 + nA03 * nB31;
	mReturn[ 2] = nA00 * nB02 + nA01 * nB12 + nA02 * nB22 + nA03 * nB32;
	mReturn[ 3] = nA00 * nB03 + nA01 * nB13 + nA02 * nB23 + nA03 * nB33;
	mReturn[ 4] = nA10 * nB00 + nA11 * nB10 + nA12 * nB20 + nA13 * nB30;
	mReturn[ 5] = nA10 * nB01 + nA11 * nB11 + nA12 * nB21 + nA13 * nB31;
	mReturn[ 6] = nA10 * nB02 + nA11 * nB12 + nA12 * nB22 + nA13 * nB32;
	mReturn[ 7] = nA10 * nB03 + nA11 * nB13 + nA12 * nB23 + nA13 * nB33;
	mReturn[ 8] = nA20 * nB00 + nA21 * nB10 + nA22 * nB20 + nA23 * nB30;
	mReturn[ 9] = nA20 * nB01 + nA21 * nB11 + nA22 * nB21 + nA23 * nB31;
	mReturn[10] = nA20 * nB02 + nA21 * nB12 + nA22 * nB22 + nA23 * nB32;
	mReturn[11] = nA20 * nB03 + nA21 * nB13 + nA22 * nB23 + nA23 * nB33;
	mReturn[12] = nA30 * nB00 + nA31 * nB10 + nA32 * nB20 + nA33 * nB30;
	mReturn[13] = nA30 * nB01 + nA31 * nB11 + nA32 * nB21 + nA33 * nB31;
	mReturn[14] = nA30 * nB02 + nA31 * nB12 + nA32 * nB22 + nA33 * nB32;
	mReturn[15] = nA30 * nB03 + nA31 * nB13 + nA32 * nB23 + nA33 * nB33;
	
	return mReturn;
	
};


Math3D.mMultiplyNV = function (nN, vV) {
	return [nN * vV[0], nN * vV[1], nN * vV[2]];
};


Math3D.mRotationX = function (nR, sHandedness) {
	return this.mRotation([1,0,0], nR, sHandedness);
};


Math3D.mRotationY = function (nR, sHandedness) {
	return this.mRotation([0,1,0], nR, sHandedness);
};


Math3D.mRotationZ = function (nR, sHandedness) {
	return this.mRotation([0,0,1], nR, sHandedness);
};


Math3D.mRotation = function (vAxis, nR, sHandedness) {
	
	var nC = Math.cos(nR);
	var nS = Math.sin(nR);
	var nT = 1 - nC;
	var nX = vAxis[0];
	var nY = vAxis[1];
	var nZ = vAxis[2];
	
	if (sHandedness == 'left') {
		nS *= -1;
	}
	
	return new Float32Array([
		nT * nX * nX + nC , nT * nX * nY - nS * nZ , nT * nX * nZ + nS * nY , 0 ,
		nT * nX * nY + nS * nZ , nT * nY * nY + nC , nT * nY * nZ - nS * nX , 0 ,
		nT * nX * nZ - nS * nY , nT * nY * nZ + nS * nX , nT * nZ * nZ + nC , 0 ,
		0 , 0 , 0 , 1 ,
	]);
	
};


Math3D.mScalation = function (vS) {
	
	return new Float32Array([
		vS[0],0,0,0,
		0,vS[1],0,0,
		0,0,vS[2],0,
		0,0,0,1,
	]);
	
};


Math3D.mTranslation = function (vT) {
	
	return new Float32Array([
		1,0,0,0,
		0,1,0,0,
		0,0,1,0,
		vT[0],vT[1],vT[2],1,
	]);
	
};


Math3D.mIdentity = function () {
	
	return new Float32Array([
		1,0,0,0,
		0,1,0,0,
		0,0,1,0,
		0,0,0,1,
	]);
	
};


Math3D.vNull = function () {
	
	return new Float32Array([0,0,0,1]);
	
};


Math3D.vPrintMatrix = function (mM) {
	
	var sD = '  ';
	console.log(Math3D.sPrint(mM[ 0]) + sD + Math3D.sPrint(mM[ 1]) + sD + Math3D.sPrint(mM[ 2]) + sD + Math3D.sPrint(mM[ 3]));
	console.log(Math3D.sPrint(mM[ 4]) + sD + Math3D.sPrint(mM[ 5]) + sD + Math3D.sPrint(mM[ 6]) + sD + Math3D.sPrint(mM[ 7]));
	console.log(Math3D.sPrint(mM[ 8]) + sD + Math3D.sPrint(mM[ 9]) + sD + Math3D.sPrint(mM[10]) + sD + Math3D.sPrint(mM[11]));
	console.log(Math3D.sPrint(mM[12]) + sD + Math3D.sPrint(mM[13]) + sD + Math3D.sPrint(mM[14]) + sD + Math3D.sPrint(mM[15]));
	
};


Math3D.sPrint = function (nValue) {
	var sReturn = nValue.toFixed(4);
	if (nValue >= 0) {
		sReturn = ' ' + sReturn;
	}
	return sReturn;
};

