

var Math3D = {};


Math3D.mRotationX = function (nR, sHandedness) {
	return this.mRotation([1,0,0], nR, sHandedness);
}


Math3D.mRotationY = function (nR, sHandedness) {
	return this.mRotation([0,1,0], nR, sHandedness);
}


Math3D.mRotationZ = function (nR, sHandedness) {
	return this.mRotation([0,0,1], nR, sHandedness);
}


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

