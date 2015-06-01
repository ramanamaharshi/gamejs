


var oGame = new Game(300, 360, '3D');
var oG = oGame.oG;
var oI = oGame.oI;

var oState = {};




var vInit = function (fOnReady) {
	
	document.body.style['text-align'] = 'center';
	
	//oGame.oCanvas.style.float = 'right';
	
	var oProgram = oG.oCreateProgram(
		'\
			\n\
			uniform mat4 mProjection; \n\
			uniform mat4 mView; \n\
			uniform mat4 mObject; \n\
			\n\
			attribute vec3 v3Position; \n\
			attribute vec3 v3Color; \n\
			attribute vec3 v3Corner; \n\
			\n\
			varying vec2 v2TexCoord; \n\
			varying vec3 v3FragColor; \n\
			varying vec3 v3FragCorner; \n\
			varying vec3 v3FragNormal; \n\
			\n\
			void main() { \n\
				v3FragColor = v3Color; \n\
				gl_Position = mProjection * mView * mObject * vec4(v3Position, 1.0); \n\
				v2TexCoord = vec2(v3Position[0], v3Position[1]); \n\
				float nNearZ = 11.0; \n\
				float nRangeZ = 8.0; \n\
				v3FragCorner = v3Corner; \n\
			} \n\
			\n\
		',
		'\
			\n\
			precision mediump float; \n\
			\n\
			uniform bool bOutline; \n\
			uniform sampler2D sSamplerA; \n\
			uniform sampler2D sSamplerB; \n\
			\n\
			varying vec2 v2TexCoord; \n\
			varying vec3 v3FragColor; \n\
			varying vec3 v3FragCorner; \n\
			varying vec3 v3FragNormal; \n\
			\n\
			void main() { \n\
				vec2 v2TexC = (vec2(0.5,0.5)+v2TexCoord/vec2(2,2)); \n\
				//v2TexC += 0.001 * vec2(texture2D(sSamplerA, v2TexC)[0], texture2D(sSamplerB, v2TexC)[0]); \n\
				gl_FragColor = vec4(v3FragColor, 1); \n\
				gl_FragColor *= gl_FragColor; \n\
				if (texture2D(sSamplerA, vec2(0,0)) != vec4(0,0,0,1)) { \n\
					gl_FragColor *= texture2D(sSamplerA, v2TexC)[0]; \n\
				} \n\
				if (texture2D(sSamplerB, vec2(0,0)) != vec4(0,0,0,1)) { \n\
					gl_FragColor *= texture2D(sSamplerB, v2TexC); \n\
				} \n\
				if (bOutline) { \n\
					if (v3FragCorner[0] < 0.03 || v3FragCorner[1] < 0.03 || v3FragCorner[2] < 0.03) { \n\
						gl_FragColor *= 0.0;//vec4(0,0,0,1); \n\
						//discard; \n\
					} else { \n\
						discard; \n\
					} \n\
					if (v3FragCorner[0] < 0.04 || v3FragCorner[1] < 0.04 || v3FragCorner[2] < 0.04) { \n\
						gl_FragColor *= 0.5; \n\
					} \n\
					//gl_FragColor *= v3FragCorner[0] * v3FragCorner[1] * v3FragCorner[2]; \n\
				} \n\
			} \n\
			\n\
		'
	);
	
	oG.vSetProgram(oProgram);
	
	oG.o3D.enable(oG.o3D.DEPTH_TEST);
	
	oState.mProjection = oG.mProjection(0.01, 99, 45);
	oState.mView = Math3D.mIdentity();
	oState.mObject = Math3D.mIdentity();
	
	oState.oView = {};
	oState.oView.nRV = 0;
	oState.oView.nRH = 0;
	oState.oView.pPosition = [2,0.5,7];
	oState.oView.mMakeMatrix = function(){
		var oView = this;
		var mTranslation = Math3D.mTranslation(Math3D.pNxP(-1, oView.pPosition));
		var mRH = Math3D.mRotationY(-oView.nRH);
		var mRV = Math3D.mRotationX(-oView.nRV);
		var mReturn = Math3D.mMxM(Math3D.mMxM(mRV, mRH), mTranslation);
		return mReturn;
	};
	
	oState.oPkBase = TestPackages.oCoords(oG);
	
	oState.oPkTester = TestPackages.oCoords(oG, {nSize: 0.333});
	
	var oSphereAttrData = {
		v3Color: [],
		v3Position: [],
		v3Corner: [],
	};
	
	var iSize = .2;
	for (var iBits = 0; iBits < 8; iBits ++) {
		var aTriangle = [];
		for (var iV = 0; iV < 3; iV ++) {
			var aPush = [0,0,0];
			aPush[iV] = 1;
			if (Math.pow(2, iV) & iBits) aPush[iV] *= -1;
			aTriangle.push(aPush);
		}
		var aTriangles = aRecTriangles([0,0,0], aTriangle, 3);
		var iTNr = -1;
		aTriangles.forEach(function(aPoints){
			iTNr ++;
			var iCorner = -1;
			aPoints.forEach(function(aPoint){
				var aScaledPoint = [ iSize * aPoint[0] , iSize * aPoint[1] , iSize * aPoint[2] ];
				oSphereAttrData.v3Position.push(aScaledPoint);
				var aColor = [1,1,1];
				oSphereAttrData.v3Color.push(aColor);
				iCorner ++;
				var aCorner = [0,0,0];
				aCorner[iCorner] = 1;
				oSphereAttrData.v3Corner.push(aCorner);
			});
		});
	}
	
	oState.oOldSphere = {nR: 0, pP: [2,.5,2], oPk: oG.oCreateAttributeBufferGroup(oSphereAttrData)};
	
	delete oSphereAttrData.v3Corner;
	
	var oSphereStuff = oG.oAutoIndex(oSphereAttrData);
	oState.oSphere = {nR: 0, pP: [2,.5,2], oPk: oG.oCreateAttributeBufferGroup(oSphereStuff.oAttributeData, oSphereStuff.aIndices)};
	
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




var vInput = function () {
	
	if (oI.bMouseCaptured) {
		var nLookSpeed = 0.003;
		oState.oView.nRH += nLookSpeed * oI.oMouseMoved.iX;
		oState.oView.nRV += nLookSpeed * oI.oMouseMoved.iY;
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
	
	oI.vStep();
	
};




var vCalc = function (iMillis) {};




var vDraw = function () {
	
	oG.o3D.clearColor(0,0,0,1);
	oG.o3D.clear(oG.o3D.COLOR_BUFFER_BIT);
	
	var oUniforms = oG.oCurrentProgram.oUniforms;
	
	oUniforms.mProjection.vSet(oState.mProjection);
	
	//oUniforms.mView.vSet(oState.oView.mMakeMatrix());
	
	var mRV = Math3D.mRotationX(oState.oView.nRV);
	var mRH = Math3D.mRotationY(oState.oView.nRH);
	var mLook = Math3D.mMxM(mRH, mRV);
	
	oUniforms.bOutline.vSet(false);
	
	var pLookDir = Math3D.pMxP(mLook, new Float32Array([0,0,-1]));
	
	var oPkLookArrow = oG.oCreateAttributeBufferGroup({
		v3Position: {aChunks: [
			[ 0 , +0.01 , 0 ],
			[ 0 , -0.01 , 0 ],
			[ 0 , 0 , -2 ],
			//[ pLookDir[0] , pLookDir[1] , pLookDir[2] ],
		]},
		v3Color: {aChunks: [
			[ 1 , 1 , 1 ],
			[ 1 , 1 , 1 ],
			[ 1 , 1 , 1 ],
		]},
	});
	
	//mLook = Math3D.oMatrixHelper.mDirToO(pLookDir);
	
	oUniforms.mObject.vSet(mLook);
	oPkLookArrow.vDraw();
	
	var mTranslation = Math3D.mInverse(Math3D.mTranslation(oState.oView.pPosition));
	//var mRVi = Math3D.mRotationX(-oState.oView.nRV);
	//var mRHi = Math3D.mRotationY(-oState.oView.nRH);
	//var mInverseLook = Math3D.mMxM(mRVi, mRHi);
	var mInverseLook2 = Math3D.mInverse(mLook);
	
	oUniforms.mView.vSet(Math3D.mMxM(mInverseLook2, mTranslation));
	
	oUniforms.mObject.vSet(Math3D.mIdentity());
	oState.oPkBase.vDraw();
	
	//oUniforms.bOutline.vSet(true);
	oUniforms.mObject.vSet(Math3D.mMxM(Math3D.mRotationZ(oState.oSphere.nR), Math3D.mTranslation(oState.oSphere.pP)));
	oState.oSphere.oPk.vDraw();
	
	//var aIndices = [0,1,2,3,4,5,6,7,8];
	//var gBuffer = oG.o3D.createBuffer();
	//oG.o3D.bindBuffer(oG.o3D.ELEMENT_ARRAY_BUFFER, gBuffer);
	//oG.o3D.bufferData(oG.o3D.ELEMENT_ARRAY_BUFFER, new Uint16Array(aIndices), oG.o3D.STATIC_DRAW);
	//var oBufferData = {
	//	gBuffer: gBuffer,
	//	iModeConstant: oG.o3D.TRIANGLES,
	//	iCount: aIndices.length,
	//	iTypeConstant: oG.o3D.UNSIGNED_SHORT,
	//};
	//oUniforms.mObject.vSet(Math3D.mMxM(Math3D.mRotationZ(oState.oOldSphere.nR), Math3D.mTranslation(oState.oOldSphere.pP)));
	//oState.oOldSphere.oPk.oIndexBuffer = oBufferData;
	//oG.vDrawAttributeBufferGroup(oState.oOldSphere.oPk);
	
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



