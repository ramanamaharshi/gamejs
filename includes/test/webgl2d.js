



var oGame = new Game(400, 400, '3D');
var oG = oGame.oG;
var oI = oGame.oI;

var oState = {};



var vInit = function () {
console.log('vInit');
	
	var oProgram = oG.oCreateProgram(
		"\
			attribute vec3 v3Color; \n\
			attribute vec2 v2Position; \n\
			varying vec3 v3FragColor; \n\
			varying vec2 v2TexCoord; \n\
			void main() { \n\
				v3FragColor = v3Color; \n\
				gl_Position = vec4(v2Position, 0, 1); \n\
				v2TexCoord = v2Position; \n\
			} \n\
		",
		'\
			precision mediump float; \n\
			uniform sampler2D s2A; \n\
			uniform sampler2D s2B; \n\
			uniform float v1Opacity; \n\
			varying vec3 v3FragColor; \n\
			varying vec2 v2TexCoord; \n\
			void main() { \n\
				vec2 v2TexC = (vec2(0.5,0.5)+v2TexCoord/vec2(2,2)); \n\
				gl_FragColor = vec4(v3FragColor ,v1Opacity); \n\
				gl_FragColor *= texture2D(s2A, v2TexC)[0]; \n\
				gl_FragColor *= texture2D(s2B, v2TexC)[0]; \n\
			} \n\
		'
	);
	
	oState.oOpacity = oProgram.oUniforms.v1Opacity;
	oState.oS2A = oProgram.oUniforms.s2A;
	oState.oS2B = oProgram.oUniforms.s2B;
	
	oG.vSetProgram(oProgram);
	
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
			[-0.7, -0.7],
			[ 0.7, -0.7],
			[-0.7,  0.7],
			[-0.7,  0.7],
			[ 0.7, -0.7],
			[ 0.7,  0.7],
		]},
		v3Color: {aChunks: [
			[0.5, 0.5, 0.5],
			[0.5, 0.5, 0.5],
			[0.5, 0.5, 0.5],
			[0.5, 0.5, 0.5],
			[0.5, 0.5, 0.5],
			[0.5, 0.5, 0.5],
		]},
	});
	
	//oState.oTextureA = oG.oCreateTexture('res/images/paper02.jpg');
	
	oState.oTextureA = oG.oCreateTexture('res/images/paper05.jpg');
	oState.oTextureB = oG.oCreateTexture('res/images/leaves.jpg');
console.log('textures created');
	
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
	
	//var nOpacity = 0.5 + 0.5 * (0.5 + 0.5 * Math.cos(iFrameNr / (4 * Math.PI)));
	//oState.oOpacity.vSet(nOpacity);
	oState.oOpacity.vSet(1);
	
	
//console.log(oState.oTexture);
	//oG.o3D.bindTexture(oG.o3D.TEXTURE_2D, oState.oTexture);
	
	var gl = oG.o3D;
	
	//oState.oTexA.vSet(oState.oTextureA);
	gl.activeTexture(gl.TEXTURE1);
	//gl.bindTexture(gl.TEXTURE_2D, oState.oTextureA.gTexture);
	gl.uniform1i(oState.oS2A.gUniform, 1);
	oState.oPackageA.vDraw();
	
	//oState.oTexA.vSet(oState.oTextureB);
	gl.activeTexture(gl.TEXTURE2);
	//gl.bindTexture(gl.TEXTURE_2D, oState.oTextureB.gTexture);
	gl.uniform1i(oState.oS2A.gUniform, 2);
	oState.oPackageB.vDraw();
	
};




vInit();

var iFrameNr = 0;
oGame.vStartLoop(function(){
	iFrameNr ++;
	vInput();
	if (iFrameNr % 22 != 0) return;
	//if (iFrameNr != 0) return;
	vCalc();
	vDraw();
});



