(function(){
	
	
	
	
	window.Graphics3D = function (oCanvas) {
		
		var oG = this;
		
		oG.oCanvas = oCanvas;
		
		oG.o3D = oG.oCanvas.getContext("webgl");
		
		oG.oTextureState = {iAtTexture: 1};
		
		oG.iResizeIntervalID = null;
		
		oG.aOnResize = [];
		
		oG.vCheckResize();
		
	};
	
	
	
	
	Graphics3D.prototype.oCreateDrawPackage = function (oABG, oUniforms) {
		
		return new Graphics3D.DrawPackage(this, oABG, oUniforms);
		
	};
	
	
	
	
	Graphics3D.DrawPackage = function (oG, oABG, oUniforms) {
		
		var oDP = this;
		
		if (typeof oUniforms == 'undefined') oUniforms = {};
		if (typeof oUniforms.mObject == 'undefined') oUniforms.mObject = Math3D.mIdentity();
		
		oDP.oG = oG;
		oDP.oABG = oABG;
		oDP.oUniforms = oUniforms;
		oDP.aSubPackages = [];
		oDP.oUserSpace = {};
		
	};
	
	
	
	
	Graphics3D.DrawPackage.prototype.vDraw = function () {
		
		var oDP = this;
		
		var oG = oDP.oG;
		
		var oUniforms = oG.oCurrentProgram.oUniforms;
		
		for (var sKey in oDP.oUniforms) {
			oUniforms[sKey].vSet(oDP.oUniforms[sKey]);
		}
		
		oDP.oABG.vDraw();
		
		oDP.aSubPackages.forEach(function(oSubPackage){
			oSubPackage.vDraw();
		});
		
		for (var sKey in oDP.oUniforms) {
			oUniforms[sKey].vSet(null);
		}
		
	};
	
	
	
	
	Graphics3D.prototype.oCreateAttributeBufferGroup = function (sUsage, sMode, oAttributeGroup, aIndices) {
		return new Graphics3D.AttributeBufferGroup(this, sUsage, sMode, oAttributeGroup, aIndices);
	};
	Graphics3D.prototype.oCreateABG = Graphics3D.prototype.oCreateAttributeBufferGroup;
	
	
	
	
	Graphics3D.AttributeBufferGroup = function (oG, sUsage, sMode, oAttributeGroup, aIndices) {
		
		var oABG = this;
		
		oABG.oG = oG;
		
		if (typeof sUsage == 'object'){
			oAttributeGroup = sUsage;
			if (typeof sMode == 'object') {
				aIndices = sMode;
			}
			sMode = 'triangles';
			sUsage = 'dynamic';
		}
		
		oABG.iUsageConstant = oG.o3D[sUsage.toUpperCase() + '_DRAW'];
		oABG.iModeConstant = oG.o3D[sMode.toUpperCase()];
		
		oABG.oAttributeFillers = {};
		
		for (var sAttribute in oAttributeGroup) {
			
			var oAttrContent = oAttributeGroup[sAttribute];
			if (typeof oAttrContent.aChunks == 'undefined') {
				oAttrContent = {aChunks: oAttrContent};
			}
			if (typeof oAttrContent.sType == 'undefined') {
				oAttrContent.sType = 'float';
			}
			var sType = oAttrContent.sType;
			var aChunks = oAttrContent.aChunks;
			var iChunks = aChunks.length;
			var iChunkSize = 1;
			var aBufferData = [];
			if (iChunks) {
				iChunkSize = aChunks[0].length;
				aChunks.forEach(function(aChunk){
					for (var iC = 0; iC < aChunk.length; iC ++) {
						aBufferData.push(aChunk[iC]);
					}
				});
			}
			
			var oAttributeData = {
				sAttribute: sAttribute,
				gBuffer: oG.o3D.createBuffer(),
				iTypeConstant: oG.o3D[sType.toUpperCase()],
				iNormalizedConstant: oG.o3D.FALSE,
				iChunkSize: iChunkSize,
				iChunks: iChunks,
				iStride: 0,
				iOffset: 0,
			};
			
			oABG.oAttributeFillers[sAttribute] = oAttributeData;
			
			oG.o3D.bindBuffer(oG.o3D.ARRAY_BUFFER, oAttributeData.gBuffer);
			oG.o3D.bufferData(oG.o3D.ARRAY_BUFFER, new Float32Array(aBufferData), oABG.iUsageConstant);
			oG.o3D.bindBuffer(oG.o3D.ARRAY_BUFFER, null);
			
			oABG.iVertices = iChunks;
			
		}
		
		oG.o3D.bindBuffer(oG.o3D.ARRAY_BUFFER, null);
		
		oABG.oIndexBuffer = null;
		if (typeof aIndices != 'undefined') {
			var gIndexBuffer = oG.o3D.createBuffer();
			oG.o3D.bindBuffer(oG.o3D.ELEMENT_ARRAY_BUFFER, gIndexBuffer);
			oG.o3D.bufferData(oG.o3D.ELEMENT_ARRAY_BUFFER, new Uint16Array(aIndices), oG.o3D.STATIC_DRAW);
			oG.o3D.bindBuffer(oG.o3D.ELEMENT_ARRAY_BUFFER, null);
			oABG.oIndexBuffer = {
				gBuffer: gIndexBuffer,
				iCount: aIndices.length,
				iTypeConstant: oG.o3D.UNSIGNED_SHORT,
				iModeConstant: oG.o3D[sMode.toUpperCase()],
			};
		}
		
	};
	
	
	
	
	Graphics3D.AttributeBufferGroup.prototype.vModify = function (oAttributeGroup) {
		
		var oABG = this;
		
		var oG = oABG.oG;
		
		for (var sAttribute in oAttributeGroup) {
			
			var oAttributeData = oABG.oAttributeFillers[sAttribute];
			
			var oAttrContent = oAttributeGroup[sAttribute];
			if (typeof oAttrContent.aChunks == 'undefined') {
				oAttrContent = {aChunks: oAttrContent};
			}
			var aChunks = oAttrContent.aChunks;
			
			var aBufferData = [];
			aChunks.forEach(function(aChunk){
				for (var iC = 0; iC < aChunk.length; iC ++) {
					aBufferData.push(aChunk[iC]);
				}
			});
			
			oG.o3D.bindBuffer(oG.o3D.ARRAY_BUFFER, oAttributeData.gBuffer);
			oG.o3D.bufferData(oG.o3D.ARRAY_BUFFER, new Float32Array(aBufferData), oABG.iUsageConstant);
			oG.o3D.bindBuffer(oG.o3D.ARRAY_BUFFER, null);
			
		}
		
	};
	
	
	
	
	Graphics3D.AttributeBufferGroup.prototype.vDraw = function () {
		
		var oABG = this;
		
		var oG = oABG.oG;
		
		for (var sAttribute in oG.oCurrentProgram.oAttributes) {
			var oAttributeFiller = null;
			if (typeof oABG.oAttributeFillers[sAttribute] != 'undefined') {
				var oAttributeFiller = oABG.oAttributeFillers[sAttribute];
			}
			oG.oCurrentProgram.oAttributes[sAttribute].vSet(oAttributeFiller);
		}
		
		if (oABG.oIndexBuffer) {
			var oIBD = oABG.oIndexBuffer;
			oG.o3D.bindBuffer(oG.o3D.ELEMENT_ARRAY_BUFFER, oIBD.gBuffer);
			oG.o3D.drawElements(oIBD.iModeConstant, oIBD.iCount, oIBD.iTypeConstant, 0);
		} else {
			oG.o3D.drawArrays(oABG.iModeConstant, 0, oABG.iVertices);
		}
		
		oG.o3D.bindBuffer(oG.o3D.ARRAY_BUFFER, null);
		
	};
	
	
	
	
	Graphics3D.prototype.oAutoIndex = function (oAttributeGroup) {
		
		var iVertices = 0;
		var aAttributeKeys = [];
		for (var sKey in oAttributeGroup) {
			if (typeof oAttributeGroup[sKey].aChunks == 'undefined') {
				oAttributeGroup[sKey] = {aChunks: oAttributeGroup[sKey]};
			}
			iVertices = oAttributeGroup[sKey].aChunks.length;
			aAttributeKeys.push(sKey);
		}
		
		var oHashes = {};
		var aIndices = [];
		var aVertices = [];
		for (var iV = 0; iV < iVertices; iV ++) {
			var oVertex = {};
			var aHash = [];
			aAttributeKeys.forEach(function(sKey){
				var mDatum = oAttributeGroup[sKey].aChunks[iV];
				oVertex[sKey] = mDatum;
				var aHashPart = [];
				if (typeof mDatum.length != 'undefined') {
					mDatum.forEach(function(mDatumElement){
						aHashPart.push(mDatumElement);
					});
				} else {
					aHashPart.push(mDatum);
				}
				aHash.push(aHashPart.join(':'));
			});
			var sHash = aHash.join('|');
			if (typeof oHashes[sHash] == 'undefined') {
				oHashes[sHash] = aVertices.length;
				aVertices.push(oVertex);
			}
			aIndices.push(oHashes[sHash]);
		}
		
		var oReturn = {
			iVertices: aVertices.length,
			aIndices: aIndices,
			oAttributeGroup: {},
		};
		
		aAttributeKeys.forEach(function(sKey){
			var aKeyChunks = [];
			oReturn.oAttributeGroup[sKey] = {aChunks: aKeyChunks};
			aVertices.forEach(function(oVertex){
				aKeyChunks.push(oVertex[sKey]);
			});
		});
		
		return oReturn;
		
	};
	
	
	
	
	Graphics3D.prototype.oCreateImageTexture = function (dImage, bFlip) {
		
		var oG = this;
		var oGL = oG.o3D;
		
		if (typeof bFlip == 'undefined') bFlip = true;
		
		var oTexture = oG.oCreateTexture();
		
		oTexture.dImage = dImage;
		oTexture.iW = dImage.clientWidth;
		oTexture.iH = dImage.clientHeight;
		
		oGL.bindTexture(oGL.TEXTURE_2D, oTexture.gTexture);
		
		oGL.texImage2D(oGL.TEXTURE_2D, 0, oGL.RGBA, oGL.RGBA, oGL.UNSIGNED_BYTE, oTexture.dImage);
		
		if (bFlip) oGL.pixelStorei(oGL.UNPACK_FLIP_Y_WEBGL, true);
		
		oGL.bindTexture(oGL.TEXTURE_2D, null);
		
		return oTexture;
		
	};
	
	
	
	
	Graphics3D.prototype.oCreateFramebufferTexture = function (iWidth, iHeight) {
		
		var oG = this;
		var oGL = oG.o3D;
		
		var oTexture = oG.oCreateTexture();
		
		oTexture.iW = iWidth;
		oTexture.iH = iHeight;
		
		oTexture.gFrameBuffer = oGL.createFramebuffer();
		oGL.bindTexture(oGL.TEXTURE_2D, oTexture.gTexture);
		oGL.bindFramebuffer(oGL.FRAMEBUFFER, oTexture.gFrameBuffer);
		
		oGL.texImage2D(oGL.TEXTURE_2D, 0, oGL.RGBA, iWidth, iHeight, 0, oGL.RGBA, oGL.UNSIGNED_BYTE, null);
		
		oGL.framebufferTexture2D(oGL.FRAMEBUFFER, oGL.COLOR_ATTACHMENT0, oGL.TEXTURE_2D, oTexture.gTexture, 0);
		
		oGL.bindFramebuffer(oGL.FRAMEBUFFER, null);
		oGL.bindTexture(oGL.TEXTURE_2D, null);
		
		return oTexture;
		
	};
	
	
	
	
	Graphics3D.prototype.oCreateTexture = function () {
		
		var oG = this;
		var oGL = oG.o3D;
		
		var oTexture = {
			gTexture: null,
			iBindSlot: oG.oTextureState.iAtTexture ++,
		}
		
		oTexture.gTexture = oGL.createTexture();
		oGL.bindTexture(oGL.TEXTURE_2D, oTexture.gTexture);
		
		oGL.texParameteri(oGL.TEXTURE_2D, oGL.TEXTURE_MIN_FILTER, oGL.NEAREST);
		oGL.texParameteri(oGL.TEXTURE_2D, oGL.TEXTURE_MAG_FILTER, oGL.NEAREST);
		oGL.texParameteri(oGL.TEXTURE_2D, oGL.TEXTURE_WRAP_S, oGL.CLAMP_TO_EDGE);
		oGL.texParameteri(oGL.TEXTURE_2D, oGL.TEXTURE_WRAP_T, oGL.CLAMP_TO_EDGE);
		
		oGL.bindTexture(oGL.TEXTURE_2D, null);
		
		return oTexture;
		
	};
	
	
	
	
	Graphics3D.prototype.vLoadImages = function (oImages, fOnReady) {
		
		var oG = this;
		
		var iRemaining = 0;
		
		var vOnImageLoad = function () {
			iRemaining --;
			if (!iRemaining) fOnReady(oImages);
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
			if (!mValue) mValue = 0;
			o3D.uniform1i(gLocation, mValue);
		} else if (sType == 'int') {
			if (!mValue) mValue = 0;
			o3D.uniform1i(gLocation, mValue);
		} else if (sType == 'float') {
			if (!mValue) mValue = 0;
			o3D.uniform1f(gLocation, mValue);
		} else if (sType == 'vec2') {
			if (!mValue) mValue = [0,0];
			o3D.uniform2f(gLocation, mValue[0], mValue[1]);
		} else if (sType == 'vec3') {
			if (!mValue) mValue = [0,0,0];
			o3D.uniform3f(gLocation, mValue[0], mValue[1], mValue[2]);
		} else if (sType == 'vec4') {
			if (!mValue) mValue = [0,0,0,0];
			o3D.uniform4f(gLocation, mValue[0], mValue[1], mValue[2], mValue[3]);
		} else if (sType == 'mat4') {
			if (!mValue) mValue = Math3D.mIdentity();
			o3D.uniformMatrix4fv(gLocation, 0, mValue);
		} else if (sType == 'sampler2D') {
			if (!mValue) mValue = {gTexture: null, iBindSlot: 0};
			oG.o3D.activeTexture(oG.o3D['TEXTURE' + mValue.iBindSlot]);
			oG.o3D.bindTexture(oG.o3D.TEXTURE_2D, mValue.gTexture);
			o3D.uniform1i(gLocation, mValue.iBindSlot);
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
			console.log('shader error: ' + oG.o3D.getShaderInfoLog(gShader));
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
	
	
	
	
	Graphics3D.prototype.mProjection = function (nNearViewDistance, nFarViewDistance, nHFOVinDegrees, nAspectRatioWpH) {
		
		if (typeof nAspectRatioWpH == 'undefined') {
			nAspectRatioWpH =  this.iGetW() / this.iGetH();
		}
		
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
	
	
	
	
	Graphics3D.prototype.vOnResize = function (fFunc) {
		
		var oG = this;
		
		if (typeof fFunc == 'function') {
			oG.aOnResize.push(fFunc);
		} else {
			oG.aOnResize.forEach(function(fFunc){
				fFunc(oG.iViewPortW, oG.iViewPortH);
			});
		}
		
	};
	
	
	
	
	Graphics3D.prototype.vCheckResize = function (iIntervalMillis) {
		
		var oG = this;
		
		if (oG.iGetW() != oG.iViewPortW || oG.iGetH() != oG.iViewPortH) {
			oG.vSetViewPort();
		}
		
		if (typeof iIntervalMillis != 'undefined') {
			clearInterval(oG.iResizeIntervalID);
			if (typeof iIntervalMillis == 'number' && iIntervalMillis) {
				setInterval(function(){
					oG.vCheckResize();
				}, iIntervalMillis);
			}
		}
		
	};
	
	
	
	
	Graphics3D.prototype.vSetViewPort = function (iW, iH) {
		
		var oG = this;
		
		if (!iW) iW = oG.iGetW();
		if (!iH) iH = oG.iGetH();
		
		oG.iViewPortW = iW;
		oG.iViewPortH = iH;
		
		oG.o3D.viewport(0, 0, oG.iViewPortW, oG.iViewPortH);
		
		oG.vOnResize();
		
	};
	
	
	
	
	Graphics3D.prototype.iGetW = function () {
		
		return this.oCanvas.clientWidth;
		
	};
	
	
	
	
	Graphics3D.prototype.iGetH = function () {
		
		return this.oCanvas.clientHeight;
		
	};
	
	
	
	
})();
