(function(){
	
	
	
	
	window.Graphics3D = function (iW, iH) {
		
		var oG = this;
		
		oG.oCanvas = document.createElement('canvas');
		oG.oCanvas.style.border = '1px solid #ccc';
		oG.oCanvas.style.position = 'relative';
		oG.oCanvas.style.left = '10px';
		oG.oCanvas.style.top = '10px';
		
		document.body.appendChild(oG.oCanvas);
		
		oG.o3D = oG.oCanvas.getContext("webgl");
		
		oG.vSetBounds(iW, iH);
		
	};
	
	
	
	
	Graphics3D.prototype.oCreateVertexPackage = function (sUsage, sMode, oAttributesData) {
		
		var oG = this;
		
		var iUsageConstant = oG.o3D[sUsage.toUpperCase() + '_DRAW'];
		
		var oVertexPackage = {oAttributes: {}};
		
		oVertexPackage.iModeConstant = oG.o3D[sMode.toUpperCase()];
		
		for (var sAttribute in oAttributesData) {
			
			var gBuffer = oG.o3D.createBuffer();
			oG.o3D.bindBuffer(oG.o3D.ARRAY_BUFFER, gBuffer);
			
			var oAttrData = oAttributesData[sAttribute]
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
			oG.o3D.bufferData(oG.o3D.ARRAY_BUFFER, new Float32Array(aBufferData), iUsageConstant);
			
			oVertexPackage.oAttributes[sAttribute] = {
				sAttribute: sAttribute,
				gBuffer: gBuffer,
				iTypeConstant: oG.o3D[sType.toUpperCase()],
				iNormalizedConstant: oG.o3D.FALSE,
				iStride: 0,
				iOffset: 0,
				iChunks: iChunks,
				iChunkSize: iChunkSize,
			};
			
		}
		
		oG.o3D.bindBuffer(oG.o3D.ARRAY_BUFFER, null);
		
		return oVertexPackage;
		
	};
	
	
	
	
	Graphics3D.prototype.vDrawVertexPackage = function (oVertexPackage) {
		
		var oG = this;
		
		for (var sAttribute in oVertexPackage.oAttributes) {
			
			var oAttribute = oVertexPackage.oAttributes[sAttribute];
			
			oG.o3D.bindBuffer(oG.o3D.ARRAY_BUFFER, oAttribute.gBuffer);
			
			var oProgramAttribute = oG.oCurrentProgram.oAttributes[oAttribute.sAttribute];
			oG.o3D.enableVertexAttribArray(oProgramAttribute);
			oG.o3D.vertexAttribPointer(
				oProgramAttribute,
				oAttribute.iChunkSize,
				oAttribute.iTypeConstant,
				oAttribute.iNormalizedConstant,
				oAttribute.iStride,
				oAttribute.iOffset
			);
			
		}
		
		oG.o3D.drawArrays(oVertexPackage.iModeConstant, 0, oAttribute.iChunks);
		
		oG.o3D.bindBuffer(oG.o3D.ARRAY_BUFFER, null);
		
	};
	
	
	
	
	Graphics3D.prototype.oCreateProgram = function (sVertexShader, sFragmentShader, oUniforms, oAttributes, bUse) {
		
		var oG = this;
		
		var oShaderProgram = {};
		
		if (typeof sVertexShader != 'string') sVertexShader = sVertexShader.text;
		if (typeof sFragmentShader != 'string') sFragmentShader = sFragmentShader.text;
		
		if (typeof oUniforms == 'undefined') oUniforms = {};
		if (oUniforms === '[auto]') {
			var aUniforms = [];
			oG.vFindUniformsAndAttributes(sVertexShader, aUniforms, []);
			oG.vFindUniformsAndAttributes(sFragmentShader, aUniforms, []);
			oUniforms = aUniforms;
		}
		if (oUniforms instanceof Array) {
			var aUniforms = oUniforms;
			oUniforms = {};
			aUniforms.forEach(function(sUniform){
				oUniforms[sUniform] = sUniform;
			});
		}
		if (typeof oAttributes == 'undefined') oAttributes = {};
		if (oAttributes === '[auto]') {
			var aAttributes = [];
			oG.vFindUniformsAndAttributes(sVertexShader, [], aAttributes);
			oG.vFindUniformsAndAttributes(sFragmentShader, [], aAttributes);
			oAttributes = aAttributes;
		}
		if (oAttributes instanceof Array) {
			var aAttributes = oAttributes;
			oAttributes = {};
			aAttributes.forEach(function(sAttribut){
				oAttributes[sAttribut] = sAttribut;
			});
		}
		
		if (typeof bUse == 'undefined') bUse = true;
		
		var gVertexShader = oG.gCreateShader('vertex', sVertexShader);
		var gFragmentShader = oG.gCreateShader('fragment', sFragmentShader);
		
		oShaderProgram.gProgram = oG.o3D.createProgram();
		oG.o3D.attachShader(oShaderProgram.gProgram, gVertexShader);
		oG.o3D.attachShader(oShaderProgram.gProgram, gFragmentShader);
		oG.o3D.linkProgram(oShaderProgram.gProgram);
		
		oShaderProgram.oUniforms = {}
		for (var sKey in oUniforms) {
			oShaderProgram.oUniforms[sKey] = oG.o3D.getUniformLocation(oShaderProgram.gProgram, oUniforms[sKey]);
		}
		oShaderProgram.oAttributes = {}
		for (var sKey in oAttributes) {
			oShaderProgram.oAttributes[sKey] = oG.o3D.getAttribLocation(oShaderProgram.gProgram, oAttributes[sKey]);
		}
		
		if (bUse) oG.vSetProgram(oShaderProgram);
		
		return oShaderProgram;
		
	};
	
	
	
	
	Graphics3D.prototype.vFindUniformsAndAttributes = function (sShader, aUniforms, aAttributes) {
		
		var aMatches;
		var rxUniformFinder = /[\;\s]uniform\s+\S+\s+(\S+)\s*\;/g;
		var rxAttributeFinder = /[\;\s]attribute\s+\S+\s+(\S+)\s*\;/g;
		while (aMatches = rxUniformFinder.exec(sShader)) {
			aUniforms.push(aMatches[1]);
		}
		while (aMatches = rxAttributeFinder.exec(sShader)) {
			aAttributes.push(aMatches[1]);
		}
		
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
	
	
	
	
	Graphics3D.prototype.vSetProgram = function (oShaderProgram) {
		
		var oG = this;
		
		oG.oCurrentProgram = oShaderProgram;
		
		oG.o3D.useProgram(oShaderProgram.gProgram);
		
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