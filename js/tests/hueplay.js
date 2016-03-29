


var oGame = new Game(400, 400, '3D');
var oG = oGame.oG;
var oI = oGame.oI;
var oState = {};




var vInit = function (fOnReady) {
	
	document.body.style['text-align'] = 'center';
	
	oG.o3D.clearColor(0,0,0,1);
	
	oG.o3D.enable(oG.o3D.DEPTH_TEST);
	
	var oProgram = oG.oCreateProgram(
		
		/// PARSE: multiline string begin
			
			uniform mat4 mObject;
			uniform mat4 mProjection;
			
			attribute vec2 v2Position;
			attribute vec2 v2TexCoord;
			
			varying vec2 v2FragmentTexCoord;
			varying vec2 v2FragmentColor;
			
			void main() {
				v2FragmentTexCoord = vec2(v2TexCoord[0], 1.0 - v2TexCoord[1]);
				gl_Position = mProjection * vec4(v2Position, 0, 1);
			}
			
		/// PARSE: multiline string end
		
		,
		
		/// PARSE: multiline string begin
			
			precision mediump float;
			
			uniform sampler2D sSampler;
			uniform mat4 mColorChanger;
			
			varying vec2 v2FragmentTexCoord;
			
			void main() {
				gl_FragColor = mColorChanger * texture2D(sSampler, v2FragmentTexCoord);
			}
			
		/// PARSE: multiline string end
		
	);
	
	oG.vSetProgram(oProgram);
	
	oState.oPkImage = oG.oCreateDrawPackage(oG.oCreateAttributeBufferGroup({
		v2Position: [[0,0] , [1,0] , [0,1] , [0,1] , [1,0] , [1,1]],
		v2TexCoord: [[0,0] , [1,0] , [0,1] , [0,1] , [1,0] , [1,1]],
	}));
	
	oState.mColorChanger = Math3D.mIdentity();
	
	oG.vOnResize(function(iNewW, iNewH){
		oState.mProjection = [
			1.8 , 0 , 0 , 0 ,
			0 , 1.8 , 0 , 0 ,
			0 , 0 , 1 , 0 ,
			-0.9 , -0.9 , 0 , 1 ,
		];
	});
	
	oG.vOnResize(1000);
	
	oG.vLoadImages({oImageTexture: 'res/images/boy.gif'}, function(oImages){
		oState.oImageTexture = oG.oCreateImageTexture(oImages.oImageTexture);
		fOnReady();
	});
	
};




var vCalc = function (iMillis) {
	
	for (var i = 0; i < 4; i ++) {
		
		var iFieldNr = Math.floor(Math.random() * 16);
		var nChange = 0.01 * (1 - 2 * Math.random());
		
		oState.mColorChanger[iFieldNr] = Math.max(0,Math.min(1,oState.mColorChanger[iFieldNr] + nChange));
		
	}
	
};




var vDraw = function () {
	
	oG.o3D.clear(oG.o3D.COLOR_BUFFER_BIT);
	
	var oUniforms = oG.oCurrentProgram.oUniforms;
	
	/// PROJECTION
	
	oUniforms.mProjection.vSet(oState.mProjection);
	
	/// DRAW
	
	oUniforms.mColorChanger.vSet(oState.mColorChanger);
	
	oUniforms.sSampler.vSet(oState.oImageTexture);
	oState.oPkImage.vDraw();
	
};




var vInput = function () {
	
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



