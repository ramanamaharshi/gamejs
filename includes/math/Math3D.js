

var Math3D = {};


Math3D.mMultiplyMM = function (mA, mB) {
	
	var mReturn = new Float32Array(16);
	
	var nA00 = mA[ 0];
	var nA01 = mA[ 1];
	var nA02 = mA[ 2];
	var nA03 = mA[ 3];
	var nA10 = mA[ 4];
	var nA11 = mA[ 5];
	var nA12 = mA[ 6];
	var nA13 = mA[ 7];
	var nA20 = mA[ 8];
	var nA21 = mA[ 9];
	var nA22 = mA[10];
	var nA23 = mA[11];
	var nA30 = mA[12];
	var nA31 = mA[13];
	var nA32 = mA[14];
	var nA33 = mA[15];
	
	var nB00 = mB[ 0];
	var nB01 = mB[ 1];
	var nB02 = mB[ 2];
	var nB03 = mB[ 3];
	var nB10 = mB[ 4];
	var nB11 = mB[ 5];
	var nB12 = mB[ 6];
	var nB13 = mB[ 7];
	var nB20 = mB[ 8];
	var nB21 = mB[ 9];
	var nB22 = mB[10];
	var nB23 = mB[11];
	var nB30 = mB[12];
	var nB31 = mB[13];
	var nB32 = mB[14];
	var nB33 = mB[15];
	
	mReturn[ 0] = nB00 * nA00 + nB01 * nA10 + nB02 * nA20 + nB03 * nA30;
	mReturn[ 1] = nB00 * nA01 + nB01 * nA11 + nB02 * nA21 + nB03 * nA31;
	mReturn[ 2] = nB00 * nA02 + nB01 * nA12 + nB02 * nA22 + nB03 * nA32;
	mReturn[ 3] = nB00 * nA03 + nB01 * nA13 + nB02 * nA23 + nB03 * nA33;
	mReturn[ 4] = nB10 * nA00 + nB11 * nA10 + nB12 * nA20 + nB13 * nA30;
	mReturn[ 5] = nB10 * nA01 + nB11 * nA11 + nB12 * nA21 + nB13 * nA31;
	mReturn[ 6] = nB10 * nA02 + nB11 * nA12 + nB12 * nA22 + nB13 * nA32;
	mReturn[ 7] = nB10 * nA03 + nB11 * nA13 + nB12 * nA23 + nB13 * nA33;
	mReturn[ 8] = nB20 * nA00 + nB21 * nA10 + nB22 * nA20 + nB23 * nA30;
	mReturn[ 9] = nB20 * nA01 + nB21 * nA11 + nB22 * nA21 + nB23 * nA31;
	mReturn[10] = nB20 * nA02 + nB21 * nA12 + nB22 * nA22 + nB23 * nA32;
	mReturn[11] = nB20 * nA03 + nB21 * nA13 + nB22 * nA23 + nB23 * nA33;
	mReturn[12] = nB30 * nA00 + nB31 * nA10 + nB32 * nA20 + nB33 * nA30;
	mReturn[13] = nB30 * nA01 + nB31 * nA11 + nB32 * nA21 + nB33 * nA31;
	mReturn[14] = nB30 * nA02 + nB31 * nA12 + nB32 * nA22 + nB33 * nA32;
	mReturn[15] = nB30 * nA03 + nB31 * nA13 + nB32 * nA23 + nB33 * nA33;
	
	return mReturn;
	
};


Math3D.mMultiplyMV = function (mM, vV) {
	
	var vReturn = Float32Array(3);
	
	vReturn[0] = mM[ 0] * vV[0] + mM[ 1] * vV[1] + mM[ 2] * vV[2] + mM[ 3];
	vReturn[1] = mM[ 4] * vV[0] + mM[ 5] * vV[1] + mM[ 6] * vV[2] + mM[ 7];
	vReturn[2] = mM[ 8] * vV[0] + mM[ 9] * vV[1] + mM[10] * vV[2] + mM[11];
	
	return vReturn;
	
};


Math3D.mMultiplyNV = function (nN, vV) {
	return new Float32Array([nN * vV[0], nN * vV[1], nN * vV[2]]);
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

