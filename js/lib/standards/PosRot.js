	
	
	
	
	window.PosRot = function (pPos, aRot, sUpAxis) {
		
		var oPR = this;
		
		oPR.pPos = [0,0,0];
		oPR.aRot = [0,0]; /// nRH,nRV
		
		if (pPos) {
			oPR.pPos[0] = pPos[0];
			oPR.pPos[1] = pPos[1];
			oPR.pPos[2] = pPos[2];
		}
		
		if (aRot) {
			oPR.aRot[0] = aRot[0];
			oPR.aRot[1] = aRot[1];
		}
		
		if (!sUpAxis) sUpAxis = 'Z';
		var oAxisTranslation = {'X': 0, 'Y': 1, 'Z': 2};
		oPR.iUpAxis = oAxisTranslation[sUpAxis];
		
	};
	
	
	
	
	window.PosRot.prototype.pGetPos = function () {
		return [this.pPos[0],this.pPos[1],this.pPos[2]];
	};
	window.PosRot.prototype.aGetRot = function () {
		return [this.aRot[0],this.aRot[1]];
	};
	window.PosRot.prototype.vSetPos = function (pPos) {
		this.pPos[0] = pPos[0];
		this.pPos[1] = pPos[1];
		this.pPos[2] = pPos[2];
	};
	window.PosRot.prototype.vSetRot = function (aRot) {
		this.aRot[0] = aRot[0];
		this.aRot[1] = aRot[1];
	};
	
	
	
	
	window.PosRot.prototype.vLookAt = function (pPos) {
		this.vSetRotAsVector(Math3D.pSub(pPos, this.pPos));
	};
	window.PosRot.prototype.pGetRotAsVector = function () {
		return Math3D.pMxP(window.PosRot.mO(), [0,0,-1]);
	};
	window.PosRot.prototype.vSetRotAsVector = function (pDir) {
		pDir = Math3D.pNormalize(pDir);
		
	};
	
	
	
	
	window.PosRot.prototype.mS = function () {
		return Math3D.mInverse(this.mO());
	};
	window.PosRot.prototype.mO = function () {
		return Math3D.mMxM(this.mPosO(), this.mRotO());
	};
	window.PosRot.prototype.mRotS = function () {
		return Math3D.mInverse(this.mRotO());
	};
	window.PosRot.prototype.mRotO = function () {
		return Math3D.mMxM(Math3D.mRotationZ(this.aRot[0]), Math3D.mRotationX(this.aRot[1]));
	};
	window.PosRot.prototype.mPosS = function () {
		return Math3D.mInverse(this.mPosO());
	};
	window.PosRot.prototype.mPosO = function () {
		return Math3D.mTranslation(this.pPos);
	};
	
	
	
	
	window.PosRot.prototype.vMove = function (nForwards, nSideways) {
		
		var oPR = this;
		
		var mRot = oPR.mRotO();
		var pMoveDir = Math3D.pMxP(mRot,[0,0,-1]);
		var pStrafeDir = Math3D.pMxP(mRot,[1,0,0]);
		
		oPR.pPos[0] += nForwards * pMoveDir[0];
		oPR.pPos[1] += nForwards * pMoveDir[1];
		oPR.pPos[2] += nForwards * pMoveDir[2];
		oPR.pPos[0] += nSideways * pStrafeDir[0];
		oPR.pPos[1] += nSideways * pStrafeDir[1];
		oPR.pPos[2] += nSideways * pStrafeDir[2];
		
	};
	
	
	
	
	window.PosRot.prototype.vTurn = function (nRH, nRV, bLimit) {
		
		var oPR = this;
		
		oPR.aRot[0] += nRH;
		oPR.aRot[1] += nRV;
		
		if (bLimit) {
			if (oPR.aRot[1] < 0)			oPR.aRot[1] = 0;
			if (oPR.aRot[1] > Math.PI)		oPR.aRot[1] = Math.PI;
			if (oPR.aRot[0] < 0)			oPR.aRot[0] += 2 * Math.PI;
			if (oPR.aRot[0] > 2 * Math.PI)	oPR.aRot[0] -= 2 * Math.PI;
		}
		
	};
	
	
	
	
