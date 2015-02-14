(function(){
	
	
	
	
	window.Graphics3D = function (oCanvas, iW, iH) {
		
		var oG = this;
		
		oG.oCanvas = oCanvas;
		
		oG.o3D = oG.oCanvas.getContext("webgl");
		
		oG.vSetBounds(iW, iH);
		
		oG.oTextureState = {iAtTexture: 0, aBoundTextures: []};
		for (var iT = 0; iT < 30; iT ++) {
			oG.oTextureState.aBoundTextures.push(null);
		}
		
	};
	
	
	
	
	Graphics3D.prototype.oCreateVertexPackage = function (sUsage, sMode, oAttributeData) {
		
		var oG = this;
		
		if (typeof sUsage == 'object' && typeof sMode == 'undefined' && typeof oAttributeData == 'undefined') {
			oAttributeData = sUsage;
			sMode = 'triangles';
			sUsage = 'dynamic';
		}
		
		var oVertexPackage = {};
		
		oVertexPackage.iUsageConstant = oG.o3D[sUsage.toUpperCase() + '_DRAW'];
		oVertexPackage.iModeConstant = oG.o3D[sMode.toUpperCase()];
		
		oVertexPackage.oAttributeFillers = {};
		
		for (var sAttribute in oAttributeData) {
			
			var gBuffer = oG.o3D.createBuffer();
			oG.o3D.bindBuffer(oG.o3D.ARRAY_BUFFER, gBuffer);
			
			var oAttrData = oAttributeData[sAttribute]
			if (typeof oAttrData.sType == 'undefined') {
				oAttrData.sType = 'float';
			}
			var sType = oAttrData.sType;
			var aChunks = oAttrData.aChunks;
			var iChunks = aChunks.length;
			var iChunkSize = 1;
			var aBufferData = [];
			if (iChunks) {
				iChunkSize = aChunks[0].length;
				aChunks.forEach(function(aChunk){
					aChunk.forEach(function(mComponent){
						aBufferData.push(mComponent);
					});
				});
			}
			oG.o3D.bufferData(oG.o3D.ARRAY_BUFFER, new Float32Array(aBufferData), oVertexPackage.iUsageConstant);
			
			oVertexPackage.oAttributeFillers[sAttribute] = {
				sAttribute: sAttribute,
				gBuffer: gBuffer,
				iTypeConstant: oG.o3D[sType.toUpperCase()],
				iNormalizedConstant: oG.o3D.FALSE,
				iStride: 0,
				iOffset: 0,
				iChunks: iChunks,
				iChunkSize: iChunkSize,
			};
			
			oVertexPackage.iVertices = iChunks;
			
		}
		
		oG.o3D.bindBuffer(oG.o3D.ARRAY_BUFFER, null);
		
		oVertexPackage.vDraw = function () {
			oG.vDrawVertexPackage(oVertexPackage);
		};
		
		return oVertexPackage;
		
	};
	
	
	
	
	Graphics3D.prototype.vDrawVertexPackage = function (oVertexPackage) {
		
		var oG = this;
		
		for (var sAttribute in oG.oCurrentProgram.oAttributes) {
			var oAttributeFiller = null;
			if (typeof oVertexPackage.oAttributeFillers[sAttribute] != 'undefined') {
				var oAttributeFiller = oVertexPackage.oAttributeFillers[sAttribute];
			}
			oG.oCurrentProgram.oAttributes[sAttribute].vSet(oAttributeFiller);
		}
		
		oG.o3D.drawArrays(oVertexPackage.iModeConstant, 0, oVertexPackage.iVertices);
		
		oG.o3D.bindBuffer(oG.o3D.ARRAY_BUFFER, null);
		
	};
	
	
	
	
	Graphics3D.prototype.oCreateTexture = function (dImage) {
		
		var oG = this;
		
		oG.oTextureState.iAtTexture ++;
		
		var oTexture = {
			dImage: dImage,
			gTexture: null,
			iBoundOn: oG.oTextureState.iAtTexture,
		}
		
		oTexture.gTexture = oG.o3D.createTexture();
		
		oG.o3D.activeTexture(oG.o3D['TEXTURE' + oTexture.iBoundOn]);
		oG.o3D.bindTexture(oG.o3D.TEXTURE_2D, oTexture.gTexture);
		
		oG.o3D.texImage2D(oG.o3D.TEXTURE_2D, 0, oG.o3D.RGBA, oG.o3D.RGBA, oG.o3D.UNSIGNED_BYTE, oTexture.dImage);
		
		oG.o3D.pixelStorei(oG.o3D.UNPACK_FLIP_Y_WEBGL, true);
		oG.o3D.texParameteri(oG.o3D.TEXTURE_2D, oG.o3D.TEXTURE_MIN_FILTER, oG.o3D.NEAREST);
		oG.o3D.texParameteri(oG.o3D.TEXTURE_2D, oG.o3D.TEXTURE_MAG_FILTER, oG.o3D.NEAREST);
		oG.o3D.texParameteri(oG.o3D.TEXTURE_2D, oG.o3D.TEXTURE_WRAP_S, oG.o3D.CLAMP_TO_EDGE);
		oG.o3D.texParameteri(oG.o3D.TEXTURE_2D, oG.o3D.TEXTURE_WRAP_T, oG.o3D.CLAMP_TO_EDGE);
		
		return oTexture;
		
	};
	
	
	
	
	Graphics3D.prototype.vLoadImages = function (oImages, fOnReady) {
		
		var oG = this;
		
		var iRemaining = 0;
		
		var vOnImageLoad = function () {
			iRemaining --;
			if (!iRemaining) fOnReady();
		};
		
		for (var sKey in oImages) {
			iRemaining ++;
			var sSrc = oImages[sKey];
			var oImage = new Image();
			oImages[sKey] = oImage;
			oImage.onload = vOnImageLoad;
			oImage.src = sSrc;
		}
		
	};
	
	
	
	
	Graphics3D.prototype.vSetAttribute = function (oAttribute, oAttributeFiller) {
		
		var oG = this;
		
		if (!oAttributeFiller) {
			oG.o3D.disableVertexAttribArray(oAttribute.gLocation);
			return;
		}
		
		oG.o3D.enableVertexAttribArray(oAttribute.gLocation);
		
		oG.o3D.bindBuffer(oG.o3D.ARRAY_BUFFER, oAttributeFiller.gBuffer);
		
		oG.o3D.vertexAttribPointer(
			oAttribute.gLocation,
			oAttributeFiller.iChunkSize,
			oAttributeFiller.iTypeConstant,
			oAttributeFiller.iNormalizedConstant,
			oAttributeFiller.iStride,
			oAttributeFiller.iOffset
		);
		
		oG.o3D.bindBuffer(oG.o3D.ARRAY_BUFFER, null);
		
	};
	
	
	
	
	Graphics3D.prototype.vSetUniform = function (oUniform, mValue) {
		
		var oG = this;
		
		var o3D = oG.o3D;
		var sType = oUniform.sType;
		var gLocation = oUniform.gLocation;
		
		if (sType == 'bool') {
			o3D.uniform1i(gLocation, mValue);
		} else if (sType == 'int') {
			o3D.uniform1i(gLocation, mValue.iBoundOn);
		} else if (sType == 'float') {
			o3D.uniform1f(gLocation, mValue);
		} else if (sType == 'vec2') {
			o3D.uniform2f(gLocation, mValue[0], mValue[1]);
		} else if (sType == 'vec3') {
			o3D.uniform3f(gLocation, mValue[0], mValue[1], mValue[2]);
		} else if (sType == 'vec4') {
			o3D.uniform4f(gLocation, mValue[0], mValue[1], mValue[2], mValue[3]);
		} else if (sType == 'mat4') {
			o3D.uniformMatrix4fv(gLocation, 0, mValue);
		} else if (sType == 'sampler2D') {
			var iValue = 0;
			if (mValue) iValue = mValue.iBoundOn;
			o3D.uniform1i(gLocation, iValue);
		}
		
	};
	
	
	
	
	Graphics3D.prototype.oCreateProgram = function (sVertexShader, sFragmentShader, bUse) {
		
		var oG = this;
		
		var oProgram = {};
		
		if (typeof sVertexShader != 'string') sVertexShader = sVertexShader.text;
		if (typeof sFragmentShader != 'string') sFragmentShader = sFragmentShader.text;
		
		if (typeof bUse == 'undefined') bUse = false;
		
		var gVertexShader = oG.gCreateShader('vertex', sVertexShader);
		var gFragmentShader = oG.gCreateShader('fragment', sFragmentShader);
		
		oProgram.gProgram = oG.o3D.createProgram();
		oG.o3D.attachShader(oProgram.gProgram, gVertexShader);
		oG.o3D.attachShader(oProgram.gProgram, gFragmentShader);
		oG.o3D.linkProgram(oProgram.gProgram);
		
		var sShaders = sVertexShader + '\n' + sFragmentShader;
		
		oProgram.oUniforms = {};
		var aMatchU;
		var rxUniformFinder = /(^|\n)[\;\s]*uniform\s+(\S+)\s+(\S+)\s*\;/g;
		while (aMatchU = rxUniformFinder.exec(sShaders)) {
			var oUniform = {sType: aMatchU[2], sName: aMatchU[3]};
			oUniform.gLocation = oG.o3D.getUniformLocation(oProgram.gProgram, oUniform.sName);
			oUniform.vSet = function (mValue) {
				oG.vSetUniform(this, mValue);
			};
			oProgram.oUniforms[oUniform.sName] = oUniform;
		}
		
		oProgram.oAttributes = {};
		var aMatchA;
		var rxAttributeFinder = /(^|\n)[\;\s]*attribute\s+(\S+)\s+(\S+)\s*\;/g;
		while (aMatchA = rxAttributeFinder.exec(sShaders)) {
			var oAttribute = {sType: aMatchA[2], sName: aMatchA[3]};
			oAttribute.gLocation = oG.o3D.getAttribLocation(oProgram.gProgram, oAttribute.sName);
			oG.o3D.enableVertexAttribArray(oAttribute.gLocation);
			oAttribute.vSet = function (oAttributeFiller) {
				oG.vSetAttribute(this, oAttributeFiller);
			};
			oProgram.oAttributes[oAttribute.sName] = oAttribute;
		}
		
		if (bUse) oG.vSetProgram(oProgram);
		
		return oProgram;
		
	};
	
	
	
	
	Graphics3D.prototype.gCreateShader = function (sType, sCode) {
		
		var oG = this;
		
		if (typeof sCode != 'string') sCode = sCode.text;
		
		var iTypeConstant = oG.o3D[sType.toUpperCase() + '_SHADER'];
		
		var gShader = oG.o3D.createShader(iTypeConstant);
		oG.o3D.shaderSource(gShader, sCode);
		oG.o3D.compileShader(gShader);
		
		if (!oG.o3D.getShaderParameter(gShader, oG.o3D.COMPILE_STATUS)) {
			alert('error: ' + oG.o3D.getShaderInfoLog(gShader));
			oG.o3D.deleteShader(gShader);
			oShader = null;
		}
		
		return gShader;
		
	};
	
	
	
	
	Graphics3D.prototype.vSetProgram = function (oProgram) {
		
		var oG = this;
		
		oG.oCurrentProgram = oProgram;
		
		oG.o3D.useProgram(oProgram.gProgram);
		
	};
	
	
	
	
	Graphics3D.prototype.mProjection = function (nHFOVinDegrees, nAspectRatioWpH, nNearViewDistance, nFarViewDistance) {
		
		var nHFOVinRadians = nHFOVinDegrees * (2 * Math.PI / 360);
		var nHFOVT = Math.abs(Math.tan(0.5 * nHFOVinRadians));
		var nVFOVT = nHFOVT / nAspectRatioWpH;
		
		var nA = 1 / nNearViewDistance;
		var nB = 1 / nFarViewDistance;
		var nAddend = (1 + 2 * nB / (nA + nB));
		var nFactor = (2 / (nB - nA));
		
		var mProjection = [
			1 / nHFOVT, 0, 0, 0,
			0, 1 / nVFOVT, 0, 0,
			0, 0, -nAddend, -1,
			0, 0, nFactor, 0,
		];
		
		mProjection = new Float32Array(mProjection);
		
		return mProjection;
		
	};
	
	
	
	
	Graphics3D.prototype.vSetBounds = function (iW, iH) {
		
		var oG = this;
		
		oG.iW = iW;
		oG.iH = iH;
		
		oG.oCanvas.width = oG.iW;
		oG.oCanvas.height = oG.iH;
		
		oG.o3D.viewport(0, 0, oG.iW, oG.iH);
		
	};
	
	
	
	
	Graphics3D.prototype.oGetCanvas = function () {
		
		return this.oCanvas;
		
	};
	
	
	
	
})();
