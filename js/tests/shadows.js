



var oGame = new Game(400, 400, '3D');
var oG = oGame.oG;
var oI = oGame.oI;

var oState = {};




var vInit = function (fOnReady) {
	
	oGame.oCanvas.style.float = 'right';
	
	oG.o3D.enable(oG.o3D.DEPTH_TEST);
	oG.o3D.enable(oG.o3D.CULL_FACE);
	oG.o3D.cullFace(oG.o3D.BACK);
	
	oState.oGlPrograms = {};
	
	oState.oGlPrograms.oContent = oG.oCreateProgram(
		
		/// PARSE: multiline string begin
			
			uniform mat4 mProjection;
			uniform mat4 mView;
			uniform mat4 mObject;
			
			attribute vec3 v3Position;
			attribute vec2 v2TexCoord;
			attribute vec3 v3Color;
			
			varying vec3 v3FragColor;
			varying vec2 v2FragmentTexCoord;
			
			void main() {
				v3FragColor = v3Color;
				v2FragmentTexCoord = vec2(v2TexCoord[0], v2TexCoord[1]);
				gl_Position = mProjection * mView * mObject * vec4(v3Position, 1.0);
			}
			
		/// PARSE: multiline string end
		
		,
		
		/// PARSE: multiline string begin
			
			precision mediump float;
			
			uniform sampler2D sSampler;
			
			varying vec3 v3FragColor;
			varying vec2 v2FragmentTexCoord;
			
			void main() {
				gl_FragColor = vec4(v3FragColor, 1);
				if (texture2D(sSampler, vec2(0,0)) != vec4(0,0,0,1)) {
					gl_FragColor = texture2D(sSampler, v2FragmentTexCoord);
				}
			}
			
		/// PARSE: multiline string end
		
	);
	
	oState.mProjection = oG.mProjection(0.01, 9, 55);
	oState.mView = Math3D.mIdentity();
	oState.mObject = Math3D.mIdentity();
	
	oState.oCam = {
		
		oPosRot: new PosRot([0,0,2], [0,0]),
		//oPosRot: new PosRot([2,0,0], [Math.PI / 2, Math.PI / 2]),
		
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
	
	oState.oCoords = TestPackages.oCoords(oG, {bWhite: true});
	
	oI.vActivateMouseCapturing();
	
	oState.oImages = {oA: 'res/images/paper02.jpg', oB: 'res/images/boy.gif', oC: 'res/images/leaves.jpg'};
	oG.vLoadImages(oState.oImages, function(){
		
		oState.oTextures = {};
		for (var sKey in oState.oImages) {
			oState.oTextures[sKey] = oG.oCreateImageTexture(oState.oImages[sKey]);
		}
		
		oState.oTextures.oBuffer = oG.oCreateFramebufferTexture(32,32);
		
		oState.oFrame = TestPackages.oTextureFrame(oG, oState.oTextures.oB);
		oState.oFrame = TestPackages.oTextureFrame(oG, oState.oTextures.oBuffer);
		oState.oFrame.oUniforms.mObject = Math3D.mTranslation([0.5,0.5,0.1]);
		
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
	
	var oGL = oG.o3D;
	
	/// clear
	
	oGL.clearColor(1,1,1,1);
	oGL.clear(oGL.COLOR_BUFFER_BIT);
	
	/// content
	
	oG.vSetProgram(oState.oGlPrograms.oContent);
	
	var oUniforms = oG.oCurrentProgram.oUniforms;
	oUniforms.mProjection.vSet(oState.mProjection);
	
	oGL.bindFramebuffer(oGL.FRAMEBUFFER, oState.oTextures.oBuffer.gFrameBuffer);
	
	oG.vSetViewPort(oState.oTextures.oBuffer.iW, oState.oTextures.oBuffer.iH);
	oGL.clearColor(1,1,1,1);
	oGL.clear(oGL.COLOR_BUFFER_BIT);
	oUniforms.mView.vSet(oState.oCam.mGetView());
	oState.oCoords.vDraw();
	
	oGL.bindFramebuffer(oGL.FRAMEBUFFER, null);
	
	oG.vSetViewPort();
	
	oUniforms.mView.vSet(oState.oCam.mGetView());
	
	oState.oCoords.vDraw();
	
	oState.oFrame.vDraw();
	
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



