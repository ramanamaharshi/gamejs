


var oGame = new Game(400, 400, '3D');
var oG = oGame.oG;
var oI = oGame.oI;

var oState = {};




var vInit = function (fOnReady) {
	
	oGame.oCanvas.style.float = 'right';
	
	var oProgram = oG.oCreateProgram(
		'\
			\n\
			uniform mat4 mProjection; \n\
			uniform mat4 mView; \n\
			uniform mat4 mObject; \n\
			\n\
			attribute vec4 v4Position; \n\
			attribute vec3 v3Color; \n\
			\n\
			varying vec3 v3FragColor; \n\
			varying vec2 v2TexCoord; \n\
			\n\
			void main() { \n\
				v3FragColor = v3Color; \n\
				gl_Position = mProjection * mView * mObject * v4Position; \n\
				v2TexCoord = vec2(v4Position[0], v4Position[1]); \n\
				float nNearZ = 11.0; \n\
				float nRangeZ = 8.0; \n\
				//gl_Position.z = (gl_Position.z * (2.0 / nRangeZ)) + ( - 1.0 - nNearZ * (2.0 / nRangeZ)); \n\
				//gl_Position.z = ((gl_Position.z - nNearZ) * (2.0 / nRangeZ)) - 1.0; \n\
			} \n\
		',
		'\
			precision mediump float; \n\
			uniform sampler2D sSamplerA; \n\
			uniform sampler2D sSamplerB; \n\
			uniform bool bSamplerA; \n\
			varying vec3 v3FragColor; \n\
			varying vec2 v2TexCoord; \n\
			void main() { \n\
				vec2 v2TexC = (vec2(0.5,0.5)+v2TexCoord/vec2(2,2)); \n\
				//v2TexC += 0.001 * vec2(texture2D(sSamplerA, v2TexC)[0], texture2D(sSamplerB, v2TexC)[0]); \n\
				gl_FragColor = vec4(v3FragColor, 1); \n\
				if (texture2D(sSamplerA, vec2(0,0)) != vec4(0,0,0,1)) { \n\
					gl_FragColor *= texture2D(sSamplerA, v2TexC)[0]; \n\
				} \n\
				if (texture2D(sSamplerB, vec2(0,0)) != vec4(0,0,0,1)) { \n\
					gl_FragColor *= texture2D(sSamplerB, v2TexC); \n\
				} \n\
			} \n\
		'
	);
	
	oState.oOpacity = oProgram.oUniforms.v1Opacity;
	
	oG.vSetProgram(oProgram);
	
	oG.o3D.enable(oG.o3D.DEPTH_TEST);
	
	oState.mProjection = oG.mProjection(60, oG.iW / oG.iH, 0.1, 100);
	oState.mView = Math3D.mIdentity();
	oState.mObject = Math3D.mIdentity();
	
	oState.oView = {};
	oState.oView.nRV = 0;
	oState.oView.nRH = 0;
	oState.oView.vPosition = [0,0,3];
	oState.oView.mMakeMatrix = function(){
		var oView = this;
		var mTranslation = Math3D.mTranslation(Math3D.mMultiplyNV(-1, oView.vPosition));
		var mRH = Math3D.mRotationY(-oView.nRH);
		var mRV = Math3D.mRotationX(-oView.nRV);
		var mReturn = Math3D.mMultiplyMM(Math3D.mMultiplyMM(mRV, mRH), mTranslation);
		return mReturn;
	};
	
	oState.nObjectRotation = 0;
	
	var rnd = Math.random;
	
	var oFigureA = function (iZ, iSize, fColorGen) {
		var aColors = [];
		var aPositions = [];
		var aCorners = [[+1,+1],[+1,-1],[-1,-1],[-1,+1]];
		var iPrevC = aCorners.length - 1;
		for (var iC = 0; iC < aCorners.length; iC ++) {
			aColors.push(fColorGen());
			aColors.push(fColorGen());
			aColors.push(fColorGen());
			aPositions.push([0 , 0 , iZ]);
			aPositions.push([iSize * aCorners[iC][0] , iSize * aCorners[iC][1] , iZ]);
			aPositions.push([iSize * aCorners[iPrevC][0] , iSize * aCorners[iPrevC][1] , iZ]);
			iPrevC = iC;
		}
		var oFigure = oG.oCreateVertexPackage({
			v4Position: {aChunks: aPositions},
			v3Color: {aChunks: aColors},
		});
		return oFigure;
	};
	
	oState.oPackageA = oFigureA(-0.1, 0.9, function(){return [rnd(),rnd(),rnd()];});
	oState.oPackageB = oFigureA(+0.1, 0.7, function(){return [1,1,1];});
	
	var aColors = [];
	var aPositions = [];
	var aDirColors = [[0,1,0],[0,0,1],[1,0,0]];
	for (var iDir = 0; iDir < 3; iDir ++) {
		for (var iCorner = 0; iCorner < 3; iCorner ++) {
			var aPosition = [0,0,0];
			var aColor = aDirColors[iDir];
			if (iCorner == iDir) {
				aPosition[iCorner] = 1;
			} else {
				aPosition[iCorner] = 0.1;
			}
			aPositions.push(aPosition);
			aColors.push(aColor);
		}
	}
	oState.oPackageC = oG.oCreateVertexPackage({
		v4Position: {aChunks: aPositions},
		v3Color: {aChunks: aColors},
	})
	
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
		var nLookSpeed = 0.003;
		oState.oView.nRH += nLookSpeed * oI.oMouseMoved.iX;
		oState.oView.nRV += nLookSpeed * oI.oMouseMoved.iY;
		if (oState.oView.nRV < -(Math.PI / 2)) oState.oView.nRV = -(Math.PI / 2);
		if (oState.oView.nRV > +(Math.PI / 2)) oState.oView.nRV = +(Math.PI / 2);
	}
	
	var nMoveSpeed = 0.05;
	var nR = oState.oView.nRH;
	var vMoveDir = [Math.sin(nR),0,-Math.cos(nR)];
	nR -= Math.PI / 2;
	var vStrafeDir = [Math.sin(nR),0,-Math.cos(nR)];
	
	if (oI.bKey(65)) { /// a
		oState.oView.vPosition[0] += nMoveSpeed * vStrafeDir[0];
		oState.oView.vPosition[1] += nMoveSpeed * vStrafeDir[1];
		oState.oView.vPosition[2] += nMoveSpeed * vStrafeDir[2];
	}
	if (oI.bKey(68)) { /// d
		oState.oView.vPosition[0] -= nMoveSpeed * vStrafeDir[0];
		oState.oView.vPosition[1] -= nMoveSpeed * vStrafeDir[1];
		oState.oView.vPosition[2] -= nMoveSpeed * vStrafeDir[2];
	}
	if (oI.bKey(87)) { /// w
		oState.oView.vPosition[0] += nMoveSpeed * vMoveDir[0];
		oState.oView.vPosition[1] += nMoveSpeed * vMoveDir[1];
		oState.oView.vPosition[2] += nMoveSpeed * vMoveDir[2];
	}
	if (oI.bKey(83)) { /// s
		oState.oView.vPosition[0] -= nMoveSpeed * vMoveDir[0];
		oState.oView.vPosition[1] -= nMoveSpeed * vMoveDir[1];
		oState.oView.vPosition[2] -= nMoveSpeed * vMoveDir[2];
	}
	
	oI.vStep();
	
};




var vCalc = function (iMillis) {
	
	oState.nRotation = ((2 * Math.PI) * iMillis / 1000);
	
	//if (Math.random() < 0.01) {
	//	var iW = oG.iW;
	//	var iH = oG.iH;
	//	// iW = 600 * (0.75 + 0.25 * Math.random());
	//	// iH = 400 * (0.75 + 0.25 * Math.random());
	//	console.log('set bounds', iW, iH);
	//	oG.vSetBounds(iW, iH);
	//}
	
};




var vDraw = function () {
	
	oG.o3D.clearColor(0,0,0,1);
	oG.o3D.clear(oG.o3D.COLOR_BUFFER_BIT);
	
	var oUniforms = oG.oCurrentProgram.oUniforms;
	
	oUniforms.mProjection.vSet(oState.mProjection);
	oUniforms.mView.vSet(oState.oView.mMakeMatrix());
	
//oUniforms.mProjection.vSet(Math3D.mIdentity());
//oUniforms.mView.vSet(Math3D.mIdentity());
	
	//oState.mObject = Math3D.mIdentity();
	//oState.mObject = Math3D.mTranslation([1,1,1]);
	//oState.mObject = Math3D.mRotationX(+0.1 * oState.nRotation);
	
	//oUniforms.mObject.vSet(oState.mObject);
	//oUniforms.sSamplerB.vSet(oState.oTextures.oA);
	//oUniforms.sSamplerA.vSet(null);
	//oState.oPackageA.vDraw();
	//
	//oUniforms.mObject.vSet(oState.mObject);
	//oUniforms.sSamplerB.vSet(oState.oTextures.oB);
	//oUniforms.sSamplerA.vSet(oState.oTextures.oC);
	//oState.oPackageB.vDraw();
	
	oUniforms.mObject.vSet(Math3D.mIdentity());
	oState.oPackageC.vDraw();
	
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



