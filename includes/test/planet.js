


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
			
			attribute vec4 v4Position;
			attribute vec3 v3Color;
			attribute vec3 v3Corner;
			
			varying vec2 v2TexCoord;
			varying vec3 v3FragColor;
			varying vec3 v3FragCorner;
			varying vec3 v3FragNormal;
			
			void main() {
				v3FragColor = v3Color;
				gl_Position = mProjection * mView * mObject * v4Position;
				v2TexCoord = vec2(v4Position[0], v4Position[1]);
				float nNearZ = 11.0;
				float nRangeZ = 8.0;
				v3FragCorner = v3Corner;
			}
			
		///PARSE: multiline string end
		
		,
		
		///PARSE: multiline string begin
			
			precision mediump float;
			
			uniform bool bOutline;
			uniform sampler2D sSamplerA;
			uniform sampler2D sSamplerB;
			
			varying vec2 v2TexCoord;
			varying vec3 v3FragColor;
			varying vec3 v3FragCorner;
			varying vec3 v3FragNormal;
			
			void main() {
				vec2 v2TexC = (vec2(0.5,0.5)+v2TexCoord/vec2(2,2));
				//v2TexC += 0.001 * vec2(texture2D(sSamplerA, v2TexC)[0], texture2D(sSamplerB, v2TexC)[0]);
				gl_FragColor = vec4(v3FragColor, 1);
				gl_FragColor *= gl_FragColor;
				if (texture2D(sSamplerA, vec2(0,0)) != vec4(0,0,0,1)) {
					gl_FragColor *= texture2D(sSamplerA, v2TexC)[0];
				}
				if (texture2D(sSamplerB, vec2(0,0)) != vec4(0,0,0,1)) {
					gl_FragColor *= texture2D(sSamplerB, v2TexC);
				}
				if (bOutline) {
					if (v3FragCorner[0] < 0.03 || v3FragCorner[1] < 0.03 || v3FragCorner[2] < 0.03) {
						gl_FragColor *= 0.0;//vec4(0,0,0,1);
						discard;
					}
					if (v3FragCorner[0] < 0.04 || v3FragCorner[1] < 0.04 || v3FragCorner[2] < 0.04) {
						//gl_FragColor *= 0.5;
					}
					//gl_FragColor *= v3FragCorner[0] * v3FragCorner[1] * v3FragCorner[2];
				}
			}
			
		///PARSE: multiline string end
		
	);
	
	oG.vSetProgram(oProgram);
	
	oState.nFOV = 45;
	
	oG.vOnResize(function(iNewW, iNewH){
		oState.mProjection = oG.mProjection(0.01, 99, oState.nFOV);
	});
	oG.vOnResize(1000);
	
	//oState.mView = Math3D.mIdentity();
	
	//oState.mObject = Math3D.mIdentity();
	
	oState.oDpBase = new DrawPackage(TestPackages.oCoords(oG));
	
	oState.oDpCullTest = new DrawPackage(oG.oCreateAttributeBufferPackage({v4Position: [[1,0,0], [0,1,0], [0,0,1]], v3Color: [[0,0,1], [0,1,0], [1,0,0]]}));
	
	oState.oDpSphere = new DrawPackage(oG.oCreateAttributeBufferPackage(Shapes.oSphere({iDepth: 4, nRadius: 0.2})), Math3D.mTranslation([2,.5,2]));
	
	oState.oPlanet = {oConeTree: new ConeTree(2)};
	
	oState.oView = {};
	oState.oView.nRV = 0;
	oState.oView.nRH = 0;
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
	
	oState.oImages = {oA: 'res/images/paper02.jpg', oB: 'res/images/paper06.jpg', oC: 'res/images/leaves.jpg'};
	
	oG.vLoadImages(oState.oImages, function(){
		oState.oTextures = {};
		for (var sKey in oState.oImages) {
			oState.oTextures[sKey] = oG.oCreateTexture(oState.oImages[sKey]);
		}
		fOnReady();
	});
	
};




var vInput = function () {
	
	if (oI.bMouseCaptured) {
		var nLookSpeed = 0.00005;
		oState.oView.nRH += oState.nFOV * nLookSpeed * oI.oMouseMoved.iX;
		oState.oView.nRV += oState.nFOV * nLookSpeed * oI.oMouseMoved.iY;
		if (oState.oView.nRV < -(Math.PI / 2)) oState.oView.nRV = -(Math.PI / 2);
		if (oState.oView.nRV > +(Math.PI / 2)) oState.oView.nRV = +(Math.PI / 2);
	}
	
	var nMoveSpeed = 0.05;
	var nR = oState.oView.nRH;
	var pMoveDir = [Math.sin(nR),0,-Math.cos(nR)];
	nR -= Math.PI / 2;
	var pStrafeDir = [Math.sin(nR),0,-Math.cos(nR)];
	
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
		oState.nFOV *= Math.pow(2, -0.2 * iWheel);
		oState.nFOV = Math.min(Math.max(oState.nFOV, 0.1), 160);
		oState.mProjection = oG.mProjection(0.01, 99, oState.nFOV);
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
	
	oState.oDpBase.vDraw();
	
	var pRelPos = Math3D.pSub(oState.oView.pPosition, [2,.51,2]);
	var oPlanetNode = oState.oPlanet.oConeTree.oGetLeaf(pRelPos);
	
	var oPlanetSphereAttributes = {v4Position: [], v3Color: []};
	oState.oPlanet.oConeTree.aLeafs.forEach(function(oLeaf, iLeafNr){
		var oParent = oLeaf;
		while (oParent.oParent) {
			oParent = oParent.oParent;
		}
		var aColor = [0,0,0];
		aColor[iLeafNr % 3] = 1;
		aColor = [1,1,1];
		if (oState.oPlanet.oConeTree.bInNode(oLeaf, pRelPos)) {
			aColor = [1,0,0];
		}
		oPlanetSphereAttributes.v3Color.push(aColor, aColor, aColor);
		oPlanetSphereAttributes.v4Position.push(oLeaf.aTriangle[0], oLeaf.aTriangle[1], oLeaf.aTriangle[2]);
	});
//console.log(oPlanetSphereAttributes);
	
	oState.oDpPlanetSphere = new DrawPackage(oG.oCreateAttributeBufferPackage(oPlanetSphereAttributes), Math3D.mTranslation([2,.51,2]));
	
	oState.oDpPlanetSphere.vDraw();
	
	//var pLookDir = Math3D.pMxP(mLook, [0,0,-1]);
	//
	//var aLookOrthos = Math3D.aMakeOrthogonals(pLookDir);
	//
	//var oDpLookPointer = new DrawPackage(TestPackages.oPointer(oG, {pDir: pLookDir, aColor: [1,1,1]}), Math3D.mTranslation([0.5,0.5,0.5]));
	//
	//oDpLookX = new DrawPackage(TestPackages.oPointer(oG, {pDir: aLookOrthos[0], aColor: [0,0,1]}), Math3D.mTranslation([0.5,0.5,0.5]));
	//oDpLookY = new DrawPackage(TestPackages.oPointer(oG, {pDir: aLookOrthos[1], aColor: [0,1,0]}), Math3D.mTranslation([0.5,0.5,0.5]));
	//
	//oDpLookPointer.vDraw();
	//
	//oDpLookX.vDraw();
	//oDpLookY.vDraw();
	
	oState.oDpCullTest.vDraw();
	
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




var DrawPackage = function (oAttributeBufferPackage, mObject) {
	
	var oDP = this;
	
	oDP.aSubPackages = [];
	
	oDP.oUniforms = {};
	oDP.oAttributeBufferPackage = oAttributeBufferPackage;
	oDP.mObject = Math3D.mIdentity();
	
	if (typeof mObject != 'undefined')  oDP.mObject = mObject;
	
	oDP.oUserSpace = {};
	
};




DrawPackage.prototype.vDraw = function () {
	
	var oDP = this;
	
	var oUniforms = oG.oCurrentProgram.oUniforms;
	
	for (var sKey in oDP.oUniforms) {
		oUniforms[sKey].vSet(oDP.oUniforms[sKey]);
	}
	
	oUniforms.mObject.vSet(oDP.mObject);
	
	oDP.oAttributeBufferPackage.vDraw();
	
	oDP.aSubPackages.forEach(function(oSubPackage){
		oSubPackage.vDraw();
	});
	
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



