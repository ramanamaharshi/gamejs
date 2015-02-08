



var oGame = new Game(400, 400, '3D');
var oG = oGame.oG;
var oI = oGame.oI;

var oState = {};



var vInit = function () {
	
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
//			uniform sampler2D s2A; \n\
//			uniform sampler2D s2B; \n\
			uniform sampler2D u_image; \n\
			uniform float v1Opacity; \n\
			varying vec3 v3FragColor; \n\
			varying vec2 v2TexCoord; \n\
			void main() { \n\
				gl_FragColor = vec4(v3FragColor ,v1Opacity); \n\
				gl_FragColor = vec4((vec2(0.5,0.5)+v2TexCoord/vec2(2,2)),0,1); \n\
				gl_FragColor = texture2D(u_image, v2TexCoord); \n\
			} \n\
		'
	);
	
	oState.oOpacity = oProgram.oUniforms.v1Opacity;
	oState.oTexA = oProgram.oUniforms.s2A;
	
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
	
	//oState.oTextureA = oG.oCreateTexture('res/images/paper02.jpg');
	
	function loadImage(url, callback) {
	  var image = new Image();
	  image.src = url;
	  image.onload = callback.call(image);
	  return image;
	}
	
	loadImage('res/images/leaves.jpg', function(image){
		// Create a texture.
		var texture = oG.o3D.createTexture();
		oG.o3D.bindTexture(oG.o3D.TEXTURE_2D, texture);
		// Set the parameters so we can render any size image.
		oG.o3D.texParameteri(oG.o3D.TEXTURE_2D, oG.o3D.TEXTURE_WRAP_S, oG.o3D.CLAMP_TO_EDGE);
		oG.o3D.texParameteri(oG.o3D.TEXTURE_2D, oG.o3D.TEXTURE_WRAP_T, oG.o3D.CLAMP_TO_EDGE);
		oG.o3D.texParameteri(oG.o3D.TEXTURE_2D, oG.o3D.TEXTURE_MIN_FILTER, oG.o3D.NEAREST);
		oG.o3D.texParameteri(oG.o3D.TEXTURE_2D, oG.o3D.TEXTURE_MAG_FILTER, oG.o3D.NEAREST);
		// Upload the image into the texture.
		oG.o3D.texImage2D(oG.o3D.TEXTURE_2D, 0, oG.o3D.RGBA, oG.o3D.RGBA, oG.o3D.UNSIGNED_BYTE, image);
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
	
	var nOpacity = 0.5 + 0.5 * (0.5 + 0.5 * Math.cos(iFrameNr / (4 * Math.PI)));
	oState.oOpacity.vSet(nOpacity);
	//oState.oTexA.vSet(oState.oTextureA);
	
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



