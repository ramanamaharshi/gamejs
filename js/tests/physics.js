


var oGame = new Game(480, 360, '3D');
var oG = oGame.oG;
var oI = oGame.oI;
var oState = {};




var vInit = function (fOnReady) {
	
	document.body.style['text-align'] = 'center';
	
	oG.o3D.enable(oG.o3D.DEPTH_TEST);
	//oG.o3D.enable(oG.o3D.CULL_FACE);
	//oG.o3D.cullFace(oG.o3D.BACK);
	
	var oProgram = oG.oCreateProgram(
		
		/// PARSE: multiline string begin
			
			uniform mat4 mProjection;
			uniform mat4 mView;
			uniform mat4 mObject;
			
			attribute vec3 v3Color;
			attribute vec3 v3Position;
			
			varying vec3 v3FragColor;
			
			void main() {
				v3FragColor = v3Color;
				gl_Position = mProjection * mView * mObject * vec4(v3Position, 1.0);
			}
			
		/// PARSE: multiline string end
		
		,
		
		/// PARSE: multiline string begin
			
			precision mediump float;
			
			varying vec3 v3FragColor;
			
			void main() {
				gl_FragColor = vec4(v3FragColor * v3FragColor, 1);
			}
			
		/// PARSE: multiline string end
		
	);
	
	oG.vSetProgram(oProgram);
	
	oState.oPkBase = oG.oCreateDrawPackage(TestPackages.oCoords(oG));
	
	oState.oView = {};
	oState.oView.nRV = 0;
	oState.oView.nRH = 0;
	oState.oView.nFOV = 45;
	oState.oView.pPosition = [2,0.5,5];
	oState.oView.mMakeMatrix = function(){
		var oView = this;
		var mTranslation = Math3D.mTranslation(Math3D.pNxP(-1, oView.pPosition));
		var mRH = Math3D.mRotationY(-oView.nRH);
		var mRV = Math3D.mRotationX(-oView.nRV);
		var mReturn = Math3D.mMxM(Math3D.mMxM(mRV, mRH), mTranslation);
		return mReturn;
	};
	
	oI.vActivateMouseCapturing();
	
	oG.vOnResize(function(iNewW, iNewH){
		oState.mProjection = oG.mProjection(0.01, 99, oState.oView.nFOV);
	});
	
	oG.vOnResize(1000);
	
	fOnReady();
	
};




var vCalc = function (iMillis) {};




var vDraw = function () {
	
	oG.o3D.clearColor(0,0,0,1);
	oG.o3D.clear(oG.o3D.COLOR_BUFFER_BIT);
	
	var oUniforms = oG.oCurrentProgram.oUniforms;
	
	/// PROJECTION
	
	oUniforms.mProjection.vSet(oState.mProjection);
	
	/// VIEW
	
	var mRV = Math3D.mRotationX(oState.oView.nRV);
	var mRH = Math3D.mRotationY(oState.oView.nRH);
	var mLook = Math3D.mMxM(mRH, mRV);
	
	var mTranslation = Math3D.mInverse(Math3D.mTranslation(oState.oView.pPosition));
	var mInverseLook2 = Math3D.mInverse(mLook);
	
	oUniforms.mView.vSet(Math3D.mMxM(mInverseLook2, mTranslation));
	
	/// DRAW
	
	oState.oPkBase.vDraw();
	
};




var Physible = function (pSize, mO) {
	
	var oP = this;
	
	if (typeof mO == 'undefined') mO = Math3D.mIdentity();
	
	oP.pHalfSize = Math3D.pNxP(0.5, pSize);
	oP.pSize = pSize;
	
	oP.aCornersO = [];
	oP.aCornersS = [];
	for (var iC = 0; iC < 8; iC ++) {
		var pPoint = [];
		for (var iI = 0; iI < 3; iI ++) {
			var iMult = (Math.pow(2, iI) & iC) ? 1 : -1;
			pPoint.push(iMult * oP.pHalfSize);
		}
		oP.aCornersO.push(new Float32Array(pPoint));
		oP.aCornersS.push(new Float32Array(pPoint));
	}
	
	oP.vSetO(mO);
	
};




Physible.prototype.vSetO = function (mO) {
	
	var oP = this;
	
	oP.mO = mO;
	
	oP.mS = Math3D.mInverse(oP.mO);
	
	for (var iC = 0; iC < 8; iC ++) {
		oP.aCornersO[iC] = oP.mO.pMxP(oP.aCornersS[iC]);
	}
	
};




Physible.prototype.pGetNearestOutsideS = function (pS) {
	
	var oP = this;
	
	var nDistance = 0;
	var nSmallestDistance = -1;
	var iSmallestDistanceI = null;
	
	for (var iI = 0; iI < 3; iI ++) {
		nDistance = oP.pHalfSize[iI] - pS[iI];
		if (pS[iI] < 0) nDistance = -nDistance;
		if (nDistance < 0) return null;
		if (nSmallestDistance == -1 || nDistance < nSmallestDistance) {
			nSmallestDistance = nDistance;
			iSmallestDistanceI = iI;
		}
	}
	
	var pSmallestDistanceP = new Float32Array([pS[0], pS[1], pS[2]]);
	pSmallestDistanceP[iSmallestDistanceI] = (pS[iSmallestDistanceI] < 0) ? -oP.pHalfSize : oP.pHalfSize;
	
	return pSmallestDistanceP;
	
};




var vInput = function () {
	
	if (oI.bMouseCaptured) {
		var nLookSpeed = 0.00005;
		oState.oView.nRH += oState.oView.nFOV * nLookSpeed * oI.oMouseMoved.iX;
		oState.oView.nRV += oState.oView.nFOV * nLookSpeed * oI.oMouseMoved.iY;
		if (oState.oView.nRV < -(Math.PI / 2)) oState.oView.nRV = -(Math.PI / 2);
		if (oState.oView.nRV > +(Math.PI / 2)) oState.oView.nRV = +(Math.PI / 2);
	}
	
	var nMoveSpeed = 0.05;
	var nR = oState.oView.nRH;
	var pMoveDir = [Math.sin(nR),0,-Math.cos(nR)];
	nR -= Math.PI / 2;
	var pStrafeDir = [Math.sin(nR),0,-Math.cos(nR)];
	
	var mRV = Math3D.mRotationX(oState.oView.nRV);
	var mRH = Math3D.mRotationY(oState.oView.nRH);
	var mLook = Math3D.mMxM(mRH, mRV);
	var pLookDir = Math3D.pMxP(mLook, new Float32Array([0,0,-1]));
	var pMoveDir = pLookDir;
	
	if (oI.bKey(65)) { /// a
		oState.oView.pPosition[0] += nMoveSpeed * pStrafeDir[0];
		oState.oView.pPosition[1] += nMoveSpeed * pStrafeDir[1];
		oState.oView.pPosition[2] += nMoveSpeed * pStrafeDir[2];
	}
	if (oI.bKey(68)) { /// d
		oState.oView.pPosition[0] -= nMoveSpeed * pStrafeDir[0];
		oState.oView.pPosition[1] -= nMoveSpeed * pStrafeDir[1];
		oState.oView.pPosition[2] -= nMoveSpeed * pStrafeDir[2];
	}
	if (oI.bKey(87)) { /// w
		oState.oView.pPosition[0] += nMoveSpeed * pMoveDir[0];
		oState.oView.pPosition[1] += nMoveSpeed * pMoveDir[1];
		oState.oView.pPosition[2] += nMoveSpeed * pMoveDir[2];
	}
	if (oI.bKey(83)) { /// s
		oState.oView.pPosition[0] -= nMoveSpeed * pMoveDir[0];
		oState.oView.pPosition[1] -= nMoveSpeed * pMoveDir[1];
		oState.oView.pPosition[2] -= nMoveSpeed * pMoveDir[2];
	}
	
	var iWheel = oI.iJustWheel();
	if (iWheel) {
		oState.oView.nFOV *= Math.pow(2, -0.2 * iWheel);
		oState.oView.nFOV = Math.min(Math.max(oState.oView.nFOV, 0.1), 160);
		oState.mProjection = oG.mProjection(0.01, 99, oState.oView.nFOV);
	}
	
	oI.vStep();
	
};




vInit(function(){
	var iFrameNr = 0;
	oGame.vStartLoop(function(iMillis, iDeltaMillis){
		iFrameNr ++;
		if (iFrameNr % 1 != 0) return;
		vInput();
		vCalc(iMillis);
		vDraw();
	});
});



