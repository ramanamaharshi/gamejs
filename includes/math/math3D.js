

var Math3D = {};


Math3D.mRotation = function (vAxis, nRotateRadians) {
	
	
	
};


Math3D.mTranslation = function (vT) {
	
	return Float32Array([
		1,0,0,0,
		0,1,0,0,
		0,0,1,0,
		vT[0],vT[1],vT[2],1,
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

