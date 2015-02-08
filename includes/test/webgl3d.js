



var oGame = new Game(400, 400, '3D');
var oG = oGame.oG;
var oI = oGame.oI;

var oState = {};



var vInit = function () {
	
	oState.oProgram = oG.oCreateProgram(
		"\
			attribute vec3 v3Color; \n\
			attribute vec2 v2Position; \n\
			varying vec3 v3FragColor; \n\
			void main() { \n\
				v3FragColor = v3Color; \n\
				gl_Position = vec4(v2Position, 0, 1); \n\
			} \n\
		",
		'\
			precision mediump float; \n\
			uniform float v1Opacity; \n\
			varying vec3 v3FragColor; \n\
			void main() { \n\
				gl_FragColor = vec4(v3FragColor ,v1Opacity); \n\
			} \n\
		',
		'[auto]', '[auto]', true
	);
	
	var rnd = Math.random;
	
	oState.oPackageA = oG.oCreateVertexPackage('dynamic', 'triangles', {
		v2Position: {aChunks: [
			[-0.9, -0.9],
			[ 0.9, -0.9],
			[-0.9,  0.9],
			[-0.9,  0.9],
			[ 0.9, -0.9],
			[ 0.9,  0.9],
		]},
		v3Color: {aChunks: [
			[rnd(), rnd(), rnd()],
			[rnd(), rnd(), rnd()],
			[rnd(), rnd(), rnd()],
			[rnd(), rnd(), rnd()],
			[rnd(), rnd(), rnd()],
			[rnd(), rnd(), rnd()],
		]},
	});
	
	oState.oPackageB = oG.oCreateVertexPackage('dynamic', 'triangles', {
		v2Position: {aChunks: [
			[-0.45, -0.45],
			[ 0.45, -0.45],
			[-0.45,  0.45],
			[-0.45,  0.45],
			[ 0.45, -0.45],
			[ 0.45,  0.45],
		]},
		v3Color: {aChunks: [
			[rnd(), rnd(), rnd()],
			[rnd(), rnd(), rnd()],
			[rnd(), rnd(), rnd()],
			[rnd(), rnd(), rnd()],
			[rnd(), rnd(), rnd()],
			[rnd(), rnd(), rnd()],
		]},
	});
	
};




var vInput = function () {
	
	
};




var vCalc = function () {
	
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
	
	oG.o3D.clearColor(1,1,1,1);
	oG.o3D.clear(oG.o3D.COLOR_BUFFER_BIT);
	
	oG.o3D.uniform1f(oG.oCurrentProgram.oUniforms.v1Opacity, 0.5 + 0.5 * (0.5 + 0.5 * Math.cos(iFrameNr / (4 * Math.PI))));
	
	oState.oPackageA.vDraw();
	oState.oPackageB.vDraw();
	
};




vInit();

var iFrameNr = 0;
oGame.vStartLoop(function(){
	iFrameNr ++;
	vInput();
	//if (iFrameNr % 2 != 0) return;
	vCalc();
	vDraw();
});



