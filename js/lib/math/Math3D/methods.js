



Float32Array.prototype.mMxM = function (mM) {
	return Math3D.mMxM(this, mM);
};




Float32Array.prototype.mMxP = function (pP) {
	return Math3D.mMxP(this, pP);
};




Float32Array.prototype.pAdd = function (pP) {
	return Math3D.pAdd(this, pP);
};




Float32Array.prototype.pSub = function (pP) {
	return Math3D.pSub(this, pP);
};




Float32Array.prototype.pPxN = function (nN) {
	return Math3D.mNxP(nN, this);
};



