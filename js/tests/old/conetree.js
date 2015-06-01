


var oGame = new Game(480, 360, '3D');
var oG = oGame.oG;
var oI = oGame.oI;

var oState = {};




var vInit = function (fOnReady) {
	
	document.body.style['text-align'] = 'center';
	
	oG.o3D.enable(oG.o3D.DEPTH_TEST);
	oG.o3D.enable(oG.o3D.CULL_FACE);
	oG.o3D.cullFace(oG.o3D.BACK);
	
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
				gl_FragColor = vec4(v3FragColor, 1);
				//gl_FragColor *= gl_FragColor;
			}
			
		///PARSE: multiline string end
		
	);
	
	oG.vSetProgram(oProgram);
	
	oG.vOnResize(function(iNewW, iNewH){
		oState.mProjection = oG.mProjection(0.01, 99, oState.oView.nFOV);
	});
	
	oState.oPkBase = oG.oCreateDrawPackage(TestPackages.oCoords(oG));
	
	oState.oPkCullTest = oG.oCreateDrawPackage(oG.oCreateAttributeBufferGroup({v3Position: [[1,0,0], [0,1,0], [0,0,1]], v3Color: [[0,0,1], [0,1,0], [1,0,0]]}));
	
	oState.oPlanet = {oConeTree: new ConeTree(5)};
	
	var oPlanetSphereAttributes = {v3Position: [], v3Color: []};
	oState.oPlanet.oConeTree.aLeafs.forEach(function(oLeaf, iLeafNr){
		var aColor = [0,0,0];
		var iColor = (iLeafNr + 1) % 4;
		if (iColor == 3) {
			aColor = [1,1,0];
		} else {
			aColor[iColor] = 1;
		}
		oPlanetSphereAttributes.v3Color.push(aColor, aColor, aColor);
		oPlanetSphereAttributes.v3Position.push(oLeaf.aTriangle[0], oLeaf.aTriangle[1], oLeaf.aTriangle[2]);
	});
	
	oState.oPkPlanetSphere = oG.oCreateDrawPackage(oG.oCreateAttributeBufferGroup(oPlanetSphereAttributes), {mObject: Math3D.mTranslation([2,.5,2])});
	
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
	
	oI.vStep();
	
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
	
	var pRelPos = Math3D.pSub(oState.oView.pPosition, [2,.5,2]);
	var oCurrentLeaf = oState.oPlanet.oConeTree.oGetLeaf(pRelPos);
	
	var oPlanetSphereAttributes = {v3Color: []};
	oState.oPlanet.oConeTree.aLeafs.forEach(function(oLeaf, iLeafNr){
		var aColor = [0,0,0];
		var iColor = (iLeafNr + 1) % 4;
		if (iColor == 3) {
			aColor = [1,1,0];
		} else {
			aColor[iColor] = 1;
		}
		if (oState.oPlanet.oConeTree.bInNode(oLeaf, pRelPos)) {
			aColor = [1,1,1];
		}
		if (oLeaf == oCurrentLeaf) {
			aColor = [0,0,0];
		}
		
		oPlanetSphereAttributes.v3Color.push(aColor, aColor, aColor);
	});
	
	oState.oPkPlanetSphere.oABG.vModify(oPlanetSphereAttributes);
	
	oState.oPkPlanetSphere.vDraw();
	
	oState.oPkCullTest.vDraw();
	
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



