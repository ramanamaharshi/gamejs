


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
		
		///PARSE: multiline string begin
			
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
			
		///PARSE: multiline string end
		
		,
		
		///PARSE: multiline string begin
			
			precision mediump float;
			
			varying vec3 v3FragColor;
			
			void main() {
				gl_FragColor = vec4(v3FragColor * v3FragColor, 1);
			}
			
		///PARSE: multiline string end
		
	);
	
	oG.vSetProgram(oProgram);
	
	oG.vOnResize(function(iNewW, iNewH){
		oState.mProjection = oG.mProjection(0.01, 99, oState.oView.nFOV);
	});
	
	oState.oPkBase = oG.oCreateDrawPackage(TestPackages.oCoords(oG));
	
	oState.oPkCamera = oG.oCreateDrawPackage(TestPackages.oCoords(oG));
	
	/// create planet
	
	oState.oPlanet = {nRadius: 0.5, pPosition: [2,.5,2], oConeTree: new ConeTree(7)};
	
	var oPlanetSphereAttributes = {v3Position: [], v3Color: []};
	oState.oPlanet.oConeTree.aLeafs.forEach(function(oLeaf, iLeafNr){
		var aColor = [0,0,0];
		var iColor = (iLeafNr + 1) % 4;
		if (iColor == 3) {
			aColor = [0,1,1];
		} else {
			aColor[iColor] = 1;
		}
		oPlanetSphereAttributes.v3Color.push(aColor, aColor, aColor);
		oPlanetSphereAttributes.v3Position.push(
			Math3D.pNxP(oState.oPlanet.nRadius, oLeaf.aTriangle[0]),
			Math3D.pNxP(oState.oPlanet.nRadius, oLeaf.aTriangle[1]),
			Math3D.pNxP(oState.oPlanet.nRadius, oLeaf.aTriangle[2])
		);
	});
	
	oState.oPlanet.oPk = oG.oCreateDrawPackage(oG.oCreateABG(oPlanetSphereAttributes), {mObject: Math3D.mTranslation(oState.oPlanet.pPosition)});
	
	oState.oPlanet.mPlanetToWorld = function () {
		return Math3D.mMxM(this.oPk.mObject, Math3D.mScalation(this.nRadius));
	};
	
	/// create puppet
	
	var oPuppetShapes = {};
	oPuppetShapes.oBody = Shapes.oPike({
		nRadius: 1 / 6,
		nLength: 1,
		pDir: [0,0,1],
		aColorTop: [1,1,1],
	});
	Shapes.vTransform(oPuppetShapes.oBody, Math3D.mTranslation([0,0,-0.5]));
	oPuppetShapes.oLeftArm = Shapes.oPike({
		nRadius: 0.4 / 6,
		nLength: 0.4,
		pDir: [1,0,0],
		aColorTop: [1,1,1],
	});
	Shapes.vTransform(oPuppetShapes.oLeftArm, Math3D.mTranslation([-0.1,0.2,-0.2]));
	oPuppetShapes.oRightArm = Shapes.oPike({
		nRadius: 0.4 / 6,
		nLength: 0.4,
		pDir: [1,0,0],
		aColorTop: [1,1,1],
	});
	Shapes.vTransform(oPuppetShapes.oRightArm, Math3D.mTranslation([-0.1,-0.2,-0.2]));
	oPuppetShapes.oComplete = Shapes.oConcatenate(oPuppetShapes.oBody, oPuppetShapes.oLeftArm, oPuppetShapes.oRightArm);
	
	oState.oPuppet = {nSize: 0.01, pP: [0,0,1], pDir: [1,0,0]};
	
	Shapes.vTransform(oPuppetShapes.oComplete, Math3D.mScalation(oState.oPuppet.nSize));
	
	oState.oPuppet.oPk = oG.oCreateDrawPackage(oG.oCreateABG(oPuppetShapes.oComplete));
	
	oState.oPuppet.vTurn = function (nTurns) {
		var oPuppet = this;
		oPuppet.pDir = Math3D.pMxP(oPuppet.mRotationO,[Math.cos(2 * Math.PI * nTurns), Math.sin(2 * Math.PI * nTurns), 0]);
		oPuppet.vUpdate();
	};
	
	oState.oPuppet.vMove = function (pTranslation) {
		var oPuppet = this;
		oPuppet.pP = Math3D.pAdd(oPuppet.pP, Math3D.pMxP(oPuppet.mRotationO, pTranslation));
		oPuppet.pP = Math3D.pNxP((1 + 0.5 * oPuppet.nSize) / Math3D.nLength(oPuppet.pP), oPuppet.pP);
		oPuppet.vUpdate();
	};
	
	oState.oPuppet.vUpdate = function () {
		var oPuppet = this;
		oPuppet.mTranslationO = Math3D.mTranslation(oPuppet.pP);
		var oCone = oPuppet.oGetCone();
		var pX = oPuppet.pDir;
		var pZ = oCone.pNormal;
		var pY = Math3D.pNormalize(Math3D.pPxP(pZ, pX));
		var pX = Math3D.pNormalize(Math3D.pPxP(pY, pZ));
		oPuppet.mRotationO = Math3D.mFromCoordinateSystem(pX, pY, pZ);
		oPuppet.pDir = pX;
		var mOnPlanet = Math3D.mMxM(oPuppet.mTranslationO, oPuppet.mRotationO);
		oPuppet.oPk.mObject = Math3D.mMxM(oState.oPlanet.mPlanetToWorld(), mOnPlanet);
	};
	
	oState.oPuppet.mMakeView = function () {
		var oPuppet = this;
		if (typeof pTranslation == 'undefined') pTranslation = [0,0,0];
		var mOnPlanet = Math3D.mMxM(oPuppet.mTranslationO, oPuppet.mRotationO);
		
		return Math3D.mInverse(Math3D.mMxM(oState.oPlanet.mPlanetToWorld(), mOnPlanet));
		
		var pViewDir = [1,0,0];
		pViewDirOnPlanet = Math3D.pMxP(mOnPlanet, pViewDir);
		var pViewZonPlanet = Math3D.pNxP(-1, pViewDir);
		var pViewYonPlanet = oPuppet.oGetCone().pNormal;
		var pViewXonPlanet = Math3D.pNormalize(Math3D.pPxP(pViewYonPlanet, pViewZonPlanet));
		pViewZonPlanet = Math3D.pNormalize(Math3D.pPxP(pViewXonPlanet, pViewYonPlanet));
		var mViewOnPlanet = Math3D.mFromCoordinateSystem(pViewXonPlanet, pViewZonPlanet, pViewZonPlanet);
		var mView = Math3D.mInverse(Math3D.mMxM(oState.oPlanet.mPlanetToWorld(), mViewOnPlanet));
		return mView;
	};
	
	oState.oPuppet.oGetCone = function () {
		return oState.oPlanet.oConeTree.oGetLeaf(this.pP);
	};
	
	oState.oPuppet.vUpdate();
	
	oState.oPuppet.vMove([0,0,0]);
	
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
	
	oG.vOnResize(1000);
	
	fOnReady();
	
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
	
	/// puppet
	var oPuppet = oState.oPuppet;
	var nPuppetTurnSpeed = 0.01;
	var nPuppetMoveSpeed = oPuppet.nSize * 0.05;
	if (oI.bKey(37)) {
		oPuppet.vTurn(+nPuppetTurnSpeed);
	}
	if (oI.bKey(39)) {
		oPuppet.vTurn(-nPuppetTurnSpeed);
	}
	if (oI.bKey(38)) {
		oPuppet.vMove([+nPuppetMoveSpeed,0,0]);
	}
	if (oI.bKey(40)) {
		oPuppet.vMove([-nPuppetMoveSpeed,0,0]);
	}
	
	oI.vStep();
	
};




var vCalc = function (iMillis) {
	
	oState.oPlanet.oPk.mObject = Math3D.mMxM(oState.oPlanet.oPk.mObject, Math3D.mRotationY(0.001));
	oState.oPuppet.vUpdate();
	
};




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
	
	var mPuppetEyePosition = Math3D.mFromCoordinateSystem([0,-1,0], [0,0,1], [-1,0,0]);
	
	var mCameraOffset = Math3D.mMxM(Math3D.mRotationX(0.25), Math3D.mTranslation([0,0,5*oState.oPuppet.nSize]));
	
	var mRelativeCameraPosition = Math3D.mMxM(mPuppetEyePosition, mCameraOffset);
	
	var mMyCamera = Math3D.mMxM(Math3D.mInverse(mRelativeCameraPosition), oState.oPuppet.mMakeView());
	
	//oState.oPkCamera.mObject = Math3D.mInverse(mMyCamera);
	
	oUniforms.mView.vSet(mMyCamera);
	
	/// DRAW
	
	oState.oPkBase.vDraw();
	
	//var pRelPos = Math3D.pSub(oState.oView.pPosition, [2,.5,2]);
	//var oCurrentLeaf = oState.oPlanet.oConeTree.oGetLeaf(pRelPos);
	//
	//var oPlanetSphereAttributes = {v3Color: []};
	//oState.oPlanet.oConeTree.aLeafs.forEach(function(oLeaf, iLeafNr){
	//	var aColor = [0,0,0];
	//	var iColor = (iLeafNr + 1) % 4;
	//	if (iColor == 3) {
	//		aColor = [0,1,1];
	//	} else {
	//		aColor[iColor] = 1;
	//	}
	//	if (oState.oPlanet.oConeTree.bInNode(oLeaf, pRelPos)) {
	//		aColor = [1,1,0];
	//	}
	//	if (oLeaf == oCurrentLeaf) {
	//		aColor = [0,0,0];
	//	}
	//	oPlanetSphereAttributes.v3Color.push(aColor, aColor, aColor);
	//});
	//
	//oState.oPlanet.oPk.oABG.vModify(oPlanetSphereAttributes);
	
	oState.oPlanet.oPk.vDraw();
	
	oState.oPuppet.oPk.vDraw();
	
	oState.oPkCamera.vDraw();
	
};




var Puppet = function (oPuppetData, oPlanetData) {
	
	var oP = this;
	
	oP.nH = 1;
	oP.nR = 1;
	oP.pPos = [0,0,0];
	oP.pDir = [0,1,0];
	
	for (var sKey in oPuppetData) {
		oP[sKey] = oPuppetData[sKey];
	}
	
	oP.oPlanet = {nRadius: 1, pCenter: [0,0,0]};
	
	for (var sKey in oPlanetData) {
		oP.oPlanet[sKey] = oPlanetData[sKey];
	}
	
};




Puppet.prototype.vMove = function (nForwards, nSideways) {
	
	var oP = this;
	
};



Puppet.prototype.vCorrectPosition = function () {
	
	var oP = this;
	
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



