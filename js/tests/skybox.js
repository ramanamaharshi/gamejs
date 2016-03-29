



var oGame = new Game(400, 400, '3D');
var oG = oGame.oG;
var oI = oGame.oI;
//oI.bLog = true;

var oState = {};




var vInit = function (fOnReady) {
	
	oGame.oCanvas.style.float = 'right';
	
	oState.oGlPrograms = {};
	
	oState.oGlPrograms.oContent = oG.oCreateProgram(
		'\
			\n\
			uniform mat4 mProjection; \n\
			uniform mat4 mView; \n\
			uniform mat4 mObject; \n\
			\n\
			attribute vec3 v3Position; \n\
			attribute vec3 v3Color; \n\
			\n\
			varying vec3 v3FragColor; \n\
			varying vec2 v2TexCoord; \n\
			\n\
			void main() { \n\
				v3FragColor = v3Color; \n\
				gl_Position = mProjection * mView * mObject * vec4(v3Position, 1.0); \n\
				v2TexCoord = vec2(v3Position[0], v3Position[1]); \n\
				float nNearZ = 11.0; \n\
				float nRangeZ = 8.0; \n\
			} \n\
			\n\
		',
		'\
			\n\
			precision mediump float; \n\
			\n\
			uniform sampler2D sSamplerA; \n\
			uniform sampler2D sSamplerB; \n\
			\n\
			varying vec3 v3FragColor; \n\
			varying vec2 v2TexCoord; \n\
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
			} \n\
			\n\
		'
	);
	
	oG.o3D.enable(oG.o3D.DEPTH_TEST);
	
	oState.mProjection = oG.mProjection(0.01, 9, 55);
	oState.mView = Math3D.mIdentity();
	oState.mObject = Math3D.mIdentity();
	
	oState.oCam = {
		
		oPosRot: new PosRot([2,0,0], [Math.PI / 2, Math.PI / 2]),
		
		vMove: function (nForwards, nSideways) {
			this.oPosRot.vMove(nForwards, nSideways);
		},
		
		vTurn: function (nRH, nRV) {
			this.oPosRot.vTurn(nRH, nRV);
		},
		
		mGetView: function () {
			return this.oPosRot.mS();
		},
		
	};
	
	oState.oPackageA = TestPackages.oCoords(oG, {bWhite: true});
	
	oI.vActivateMouseCapturing();
	
	oState.oImages = {oA: 'res/images/paper02.jpg', oB: 'res/images/paper06.jpg', oC: 'res/images/leaves.jpg'};
	oG.vLoadImages(oState.oImages, function(){
		oState.oTextures = {};
		for (var sKey in oState.oImages) {
console.log(oState.oImages[sKey]);
			oState.oTextures[sKey] = oG.oCreateImageTexture(oState.oImages[sKey]);
		}
		fOnReady();
	});
	
};




var vInput = function () {
	
	var nCamMoveSpeed = 0.04;
	var nCamTurnSpeed = 0.004;
	
	if (oI.bMouseCaptured) {
		var oMouseMoved = oI.oGetMouseMoved();
		oState.oCam.vTurn(nCamTurnSpeed * - oMouseMoved.iX, nCamTurnSpeed * - oMouseMoved.iY);
	}
	
	var nForwards = 0;
	var nSideways = 0;
	if (oI.bKey(65)) nSideways -= 1; /// a
	if (oI.bKey(68)) nSideways += 1; /// d
	if (oI.bKey(87)) nForwards += 1; /// w
	if (oI.bKey(83)) nForwards -= 1; /// s
	oState.oCam.vMove(nCamMoveSpeed * nForwards, nCamMoveSpeed * nSideways, 0);
	
	oI.vStep();
	
};




var vCalc = function (iMillis) {
	
	oState.nRotation = ((2 * Math.PI) * iMillis / 1000);
	
};




var vDraw = function () {
	
	/// clear
	
	oG.o3D.clearColor(1,1,1,1);
	oG.o3D.clear(oG.o3D.COLOR_BUFFER_BIT);
	
	/// content
	
	oG.vSetProgram(oState.oGlPrograms.oContent);
	
	var oUniforms = oG.oCurrentProgram.oUniforms;
	oUniforms.mProjection.vSet(oState.mProjection);
	
	oUniforms.mView.vSet(oState.oCam.mGetView());
	
	oUniforms.mObject.vSet(Math3D.mIdentity());
	oState.oPackageA.vDraw();
	
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



