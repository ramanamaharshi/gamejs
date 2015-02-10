



var oGame = new Game(400, 400, '3D');
var oG = oGame.oG;
var oI = oGame.oI;

var oState = {};




var vInit = function (fOnReady) {
	
	var oProgram = oG.oCreateProgram(
		'\
			\n\
			uniform mat4 mProjection; \n\
			\n\
			attribute vec4 v4Position; \n\
			attribute vec3 v3Color; \n\
			\n\
			varying vec3 v3FragColor; \n\
			varying vec2 v2TexCoord; \n\
			\n\
			void main() { \n\
				v3FragColor = v3Color; \n\
				gl_Position = mProjection * v4Position; \n\
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
				//gl_FragColor *= texture2D(sSamplerB, v2TexC)[0]; \n\
				gl_FragColor *= texture2D(sSamplerB, v2TexC)[0]; \n\
				if (texture2D(sSamplerA, vec2(0,0)) != vec4(0,0,0,1)) { \n\
					gl_FragColor *= texture2D(sSamplerA, v2TexC); \n\
				} \n\
			} \n\
		'
	);
	
	oState.oOpacity = oProgram.oUniforms.v1Opacity;
	
	oG.vSetProgram(oProgram);
	
	oG.o3D.enable(oG.o3D.DEPTH_TEST);
	
	oState.mProjection = oG.mProjection(90, oG.iW / oG.iH, 0.5, 2);
	
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
		var oFigure = oG.oCreateVertexPackage('dynamic', 'triangles', {
			v4Position: {aChunks: aPositions},
			v3Color: {aChunks: aColors},
		});
		return oFigure;
	};
	
	oState.oPackageA = oFigureA(1.00002, 0.9, function(){return [rnd(),rnd(),rnd()];});
	oState.oPackageB = oFigureA(1.00001, 0.7, function(){return [1,1,1];});
	
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
	//oState.oOpacity.vSet(1);
	
	var oUniforms = oG.oCurrentProgram.oUniforms;
	
	oUniforms.mProjection.vSet(oState.mProjection);
	
	oUniforms.sSamplerB.vSet(oState.oTextures.oA);
	oUniforms.sSamplerA.vSet(null);
	oUniforms.bSamplerA.vSet(false);
	oState.oPackageA.vDraw();
	
	oUniforms.sSamplerB.vSet(oState.oTextures.oB);
	oUniforms.sSamplerA.vSet(oState.oTextures.oC);
	oUniforms.bSamplerA.vSet(true);
	oState.oPackageB.vDraw();
	
};




vInit(function(){
	var iFrameNr = 0;
	oGame.vStartLoop(function(){
		iFrameNr ++;
		vInput();
		if (iFrameNr % 22 != 0) return;
		//if (iFrameNr != 0) return;
		vCalc();
		vDraw();
	});
});



