



var Environment = function () {
	
	var oE = this;
	
	oE.oTree = new SquareTree(8);
	oE.aBuildings = [];
	
};




Environment.Building = function (oEnvironment, pP, pNormal, nBlockSize, iBlocksX, iBlocksY) {
	
	var oB = this;
	
	oB.pP = pP;
	oB.pNormal = pNormal;
	oB.nBlockSize = nBlockSize;
	oB.iBlocksX = iBlocksX;
	oB.iBlocksY = iBlocksY;
	
	oB.oEnvironment = oEnvironment;
	oB.oEnvironment.aBuildings.push(oB);
	
	oB.aBlocks = [];
	for (var iB = 0; iB < (oB.iBlocksY + 1) * (oB.iBlocksX + 1); iB ++) {
		oB.aBlocks.push({bWallHor: false, bWallVert: false});
	}
	
	oB.mMatrixS = oLA.mMatrixFromCenterNormal(oB.pP, oB.pNormal); /// to subjective
	oB.mMatrixO = oLA.mInverseMatrixFromCenterNormal(oB.pP, oB.pNormal); /// to objective
	
	var nW = oB.iBlocksX * oB.nBlockSize;
	var nH = oB.iBlocksY * oB.nBlockSize;
	oB.aCorners = [[0,0],[0,nH],[nW,nH],[nW,0]];
	oB.aCorners = aTransformPolygon(oB.mMatrixO, oB.aCorners);
	
};




Environment.Building.prototype.oGetBlock = function (iBlockX, iBlockY) {
	
	return this.aBlocks[(this.iBlocksX + 1) * iBlockY + iBlockX];
	
};




Environment.Building.prototype.vDraw = function (oGraphics, mGlobalDrawMatrix) {
	
	var oB = this;
	
	var aDrawCorners = oB.aCorners;//aTransformPolygon(mGlobalDrawMatrix, oB.aCorners);
	
	oGraphics.vSetColor('blue');
	oGraphics.vDrawPolygon(aDrawCorners);
	
}



