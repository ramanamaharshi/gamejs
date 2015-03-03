



var Math3D = Math3D || {};




Math3D.mInverse = function (mM) {
	
	var mReturn = new Float32Array(16);
	
	var m00 = mM[0 * 4 + 0];
	var m01 = mM[0 * 4 + 1];
	var m02 = mM[0 * 4 + 2];
	var m03 = mM[0 * 4 + 3];
	var m10 = mM[1 * 4 + 0];
	var m11 = mM[1 * 4 + 1];
	var m12 = mM[1 * 4 + 2];
	var m13 = mM[1 * 4 + 3];
	var m20 = mM[2 * 4 + 0];
	var m21 = mM[2 * 4 + 1];
	var m22 = mM[2 * 4 + 2];
	var m23 = mM[2 * 4 + 3];
	var m30 = mM[3 * 4 + 0];
	var m31 = mM[3 * 4 + 1];
	var m32 = mM[3 * 4 + 2];
	var m33 = mM[3 * 4 + 3];
	
	var tmp_0  = m22 * m33;
	var tmp_1  = m32 * m23;
	var tmp_2  = m12 * m33;
	var tmp_3  = m32 * m13;
	var tmp_4  = m12 * m23;
	var tmp_5  = m22 * m13;
	var tmp_6  = m02 * m33;
	var tmp_7  = m32 * m03;
	var tmp_8  = m02 * m23;
	var tmp_9  = m22 * m03;
	var tmp_10 = m02 * m13;
	var tmp_11 = m12 * m03;
	var tmp_12 = m20 * m31;
	var tmp_13 = m30 * m21;
	var tmp_14 = m10 * m31;
	var tmp_15 = m30 * m11;
	var tmp_16 = m10 * m21;
	var tmp_17 = m20 * m11;
	var tmp_18 = m00 * m31;
	var tmp_19 = m30 * m01;
	var tmp_20 = m00 * m21;
	var tmp_21 = m20 * m01;
	var tmp_22 = m00 * m11;
	var tmp_23 = m10 * m01;
	
	var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
	  (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
	var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
	  (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
	var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
	  (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
	var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
	  (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);
	
	var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);
	
	mReturn[0] = d * t0,
	mReturn[1] = d * t1,
	mReturn[2] = d * t2,
	mReturn[3] = d * t3,
	mReturn[4] = d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) - (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30));
	mReturn[5] = d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) - (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30));
	mReturn[6] = d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) - (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30));
	mReturn[7] = d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) - (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20));
	mReturn[8] = d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) - (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33));
	mReturn[9] = d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) - (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33));
	mReturn[10] = d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) - (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33));
	mReturn[11] = d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) - (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23));
	mReturn[12] = d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) - (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22));
	mReturn[13] = d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) - (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02));
	mReturn[14] = d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) - (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12));
	mReturn[15] = d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) - (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02));
	
	return mReturn;
	
};




Math3D.mMxM = function (mA, mB) {
	
	var mReturn = new Float32Array(16);
	
	var nA00 = mA[ 0];	var nB00 = mB[ 0];
	var nA01 = mA[ 1];	var nB01 = mB[ 1];
	var nA02 = mA[ 2];	var nB02 = mB[ 2];
	var nA03 = mA[ 3];	var nB03 = mB[ 3];
	var nA10 = mA[ 4];	var nB10 = mB[ 4];
	var nA11 = mA[ 5];	var nB11 = mB[ 5];
	var nA12 = mA[ 6];	var nB12 = mB[ 6];
	var nA13 = mA[ 7];	var nB13 = mB[ 7];
	var nA20 = mA[ 8];	var nB20 = mB[ 8];
	var nA21 = mA[ 9];	var nB21 = mB[ 9];
	var nA22 = mA[10];	var nB22 = mB[10];
	var nA23 = mA[11];	var nB23 = mB[11];
	var nA30 = mA[12];	var nB30 = mB[12];
	var nA31 = mA[13];	var nB31 = mB[13];
	var nA32 = mA[14];	var nB32 = mB[14];
	var nA33 = mA[15];	var nB33 = mB[15];
	
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




Math3D.pMxP = function (mM, pP) {
	
	var pReturn = new Float32Array(3);
	
	pReturn[0] = mM[ 0] * pP[0] + mM[ 4] * pP[1] + mM[ 8] * pP[2] + mM[12];
	pReturn[1] = mM[ 1] * pP[0] + mM[ 5] * pP[1] + mM[ 9] * pP[2] + mM[13];
	pReturn[2] = mM[ 2] * pP[0] + mM[ 6] * pP[1] + mM[10] * pP[2] + mM[14];
	
	return pReturn;
	
};




Math3D.mTraverse = function (mM) {
	
	return new Float32Array([
		mM[ 0] , mM[ 4] , mM[ 8] , mM[12] ,
		mM[ 1] , mM[ 5] , mM[ 9] , mM[13] ,
		mM[ 2] , mM[ 6] , mM[10] , mM[14] ,
		mM[ 3] , mM[ 7] , mM[11] , mM[15] ,
	]);
	
};




Math3D.mFromCoordinateSystem = function (pX, pY, pZ) {
	
	if (typeof pY == 'undefined') {
		pZ = pX[2];
		pY = pX[1];
		pX = pX[0];
	}
	
	return new Float32Array([
		pX[0] , pX[1] , pX[2] , 0 ,
		pY[0] , pY[1] , pY[2] , 0 ,
		pZ[0] , pZ[1] , pZ[2] , 0 ,
		  0   ,   0   ,   0   , 1 ,
	]);
	
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




Math3D.mRotation = function (pAxis, nR, sHandedness) {
	
	var nC = Math.cos(nR);
	var nS = Math.sin(nR);
	var nT = 1 - nC;
	var nX = pAxis[0];
	var nY = pAxis[1];
	var nZ = pAxis[2];
	
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




Math3D.mScalation = function (pS) {
	
	if (typeof pS == 'number') pS = [pS, pS, pS];
	
	return new Float32Array([
		pS[0],0,0,0,
		0,pS[1],0,0,
		0,0,pS[2],0,
		0,0,0,1,
	]);
	
};




Math3D.mTranslation = function (pT) {
	
	return new Float32Array([
		1,0,0,0,
		0,1,0,0,
		0,0,1,0,
		pT[0],pT[1],pT[2],1,
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


