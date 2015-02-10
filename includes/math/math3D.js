

var Math3D = {};


Math3D.mRotation = function (vAxis, nRotateRadians) {
	
	
	
};


Math3D.mScale = function (vS) {
	
	return Float32Array([
		vS[0],0,0,0,
		0,vS[1],0,0,
		0,0,vS[2],0,
		0,0,0,vS[3],
	]);
	
};


Math3D.mTranslation = function (vT) {
	
	return Float32Array([
		1,0,0,0,
		0,1,0,0,
		0,0,1,0,
		vT[0],vT[1],vT[2],vT[3],
	]);
	
};


Math3D.mIdentity = function () {
	
	return Float32Array([
		1,0,0,0,
		0,1,0,0,
		0,0,1,0,
		0,0,0,1,
	]);
	
};


Math3D.vNull = function () {
	
	return Float32Array([0,0,0,1]);
	
};

