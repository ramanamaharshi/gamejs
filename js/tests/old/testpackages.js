


var oGame = new Game(480, 360, '3D');
var oG = oGame.oG;
var oI = oGame.oI;

var oState = {};




var vInit = function (fOnReady) {
	
	document.body.style['text-align'] = 'center';
	
	oG.o3D.enable(oG.o3D.DEPTH_TEST);
	
	var oProgram = oG.oCreateProgram(
		
		///PARSE: multiline string begin
			
			uniform mat4 mProjection;
			uniform mat4 mView;
			uniform mat4 mObject;
			
			attribute vec3 v3Position;
			attribute vec3 v3Color;
			attribute vec3 v3Corner;
			
			varying vec2 v2TexCoord;
			varying vec3 v3FragColor;
			varying vec3 v3FragCorner;
			varying vec3 v3FragNormal;
			
			void main() {
				v3FragColor = v3Color;
				gl_Position = mProjection * mView * mObject * vec4(v3Position, 1.0);
				v2TexCoord = vec2(v3Position[0], v3Position[1]);
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
	
	oState.oDpBase = oG.oCreateDrawPackage(TestPackages.oCoords(oG));
	
	//oState.oDpSphere = oG.oCreateDrawPackage(oG.oCreateAttributeBufferGroup(oMakeSphereAttributes(.2, 4)), Math3D.mTranslation([2,.5,2]));
	
	var aCols = [[1,0,0], [0,1,0], [1,1,1]];
	var mPos = Math3D.mTranslation([2,0.5,0.5])
	
	var aDirs = [[1,0,0], [0,1,0]];
	aDirs.push(Math3D.pPxP(aDirs[0], aDirs[1]));
	
	oState.aDpPointers = [];
	for (var iP = 0; iP < aDirs.length; iP ++) {
		oState.aDpPointers.push(oG.oCreateDrawPackage(TestPackages.oPointer(oG, {aColor: aCols[iP], pDir: aDirs[iP]}), {mObject: mPos}));
	}
	
	oState.oView = {};
	oState.oView.nRV = 0;
	oState.oView.nRH = 0;
	oState.oView.pPosition = [2,0.5,3];
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
			oState.oTextures[sKey] = oG.oCreateImageTexture(oState.oImages[sKey]);
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
	
	//oState.oDpSphere.vDraw();
	
	oState.aDpPointers.forEach(function(oDpPointer){
		oDpPointer.vDraw();
	});
	
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




var oMakeSphereAttributes = function (iRadius, iDepth) {
	
	var oSphereAttrData = {
		v3Color: [],
		v3Position: [],
		v3Corner: [],
	};
	
	var iSize = iRadius;
	for (var iBits = 0; iBits < 8; iBits ++) {
		var aTriangle = [];
		for (var iV = 0; iV < 3; iV ++) {
			var aPush = [0,0,0];
			aPush[iV] = 1;
			if (Math.pow(2, iV) & iBits) aPush[iV] *= -1;
			aTriangle.push(aPush);
		}
		var aTriangles = aRecTriangles([0,0,0], aTriangle, iDepth);
		var iTNr = -1;
		aTriangles.forEach(function(aPoints){
			iTNr ++;
			var iCorner = -1;
			aPoints.forEach(function(aPoint){
				var aScaledPoint = [ iSize * aPoint[0] , iSize * aPoint[1] , iSize * aPoint[2] ];
				oSphereAttrData.v3Position.push(aScaledPoint);
				var aColor = [0,0,0];
				if (iTNr % 4 == 0) {
					aColor = [1,1,1];
				} else {
					aColor[(iTNr % 4) - 1] = 1;
				}
				oSphereAttrData.v3Color.push(aColor);
				iCorner ++;
				var aCorner = [0,0,0];
				aCorner[iCorner] = 1;
				oSphereAttrData.v3Corner.push(aCorner);
			});
		});
	}
	
	return oSphereAttrData;
	
};




var aRecTriangles = function (pCenter, aTriangle, iDepth) {
	
	if (iDepth == 0) return [aTriangle];
	
	var aPoints = [];
	
	for (var iV = 0; iV < 3; iV ++) {
		var pV = aTriangle[iV];
		var pNext = aTriangle[(iV + 1) % 3];
		aPoints.push([pV[0], pV[1], pV[2]]);
		var pBetween = [0,0,0];
		for (var iI = 0; iI < 3; iI ++) {
			pBetween[iI] = (pV[iI] + pNext[iI]) / 2;
		}
		pBetween = Math3D.pNormalize(pBetween);
		pBetween = [pBetween[0],pBetween[1],pBetween[2]];
		aPoints.push(pBetween);
	}
	
	var aTriangles = [];
	
	aTriangles.push([aPoints[1], aPoints[3], aPoints[5]]);
	for (var iV = 0; iV < 3; iV ++) {
		aTriangles.push([aPoints[(2 * iV)], aPoints[(2 * iV + 1) % 6], aPoints[(2 * iV + 5) % 6]]);
	}
	
	var aSubTriangles = [];
	aTriangles.forEach(function(aTriangle){
		aSubTs = aRecTriangles(pCenter, aTriangle, iDepth - 1);
		aSubTs.forEach(function(aSubT){
			aSubTriangles.push(aSubT);
		});
	});
	aTriangles = aSubTriangles;
	
	return aTriangles;
	
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



