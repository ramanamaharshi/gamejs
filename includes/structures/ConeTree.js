



var ConeTree = function (iDepth) {
	
	var oT = this;
	
	oT.aLeafs = [];
	oT.aBaseNodes = [];
	
	for (var iBits = 0; iBits < 8; iBits ++) {
		var aTriangle = [];
		for (var iI = 0; iI < 3; iI ++) {
			var pPush = [0,0,0];
			pPush[iI] = 1;
			if (Math.pow(2, iI) & iBits) pPush[iI] *= -1;
			aTriangle.push(pPush);
		}
		if (aTriangle[0][0] * aTriangle[1][1] * aTriangle[2][2] < 0) {
			aTriangle = [aTriangle[2], aTriangle[1], aTriangle[0]];
		}
		oT.aBaseNodes.push(oT.oMakeNode(aTriangle, null, iDepth - 1));
	}
	
};




ConeTree.prototype.oMakeNode = function (aTriangle, oParent, iMakeChildren) {
	
	var oT = this;
	
	var oNode = {aTriangle: aTriangle, oParent: oParent, aChildren: [], bLeaf: false};
	
	oNode.mO = Math3D.mFromCoordinateSystem(aTriangle[0], aTriangle[1], aTriangle[2]);
	oNode.mS = Math3D.mInverse(oNode.mO);
	
	oNode.oUserSpace = {};
	
	if (iMakeChildren) {
		
		var aPoints = [];
		for (var iV = 0; iV < 3; iV ++) {
			var pV = aTriangle[iV];
			var pNext = aTriangle[(iV + 1) % 3];
			aPoints.push([pV[0], pV[1], pV[2]]);
			var pBetween = [0,0,0];
			for (var iI = 0; iI < 3; iI ++) {
				pBetween[iI] = (pV[iI] + pNext[iI]) / 2;
			}
			pBetween = Math3D.pNormalize(pBetween);
			pBetween = [pBetween[0],pBetween[1],pBetween[2]];
			aPoints.push(pBetween);
		}
		
		var aChildTriangles = [];
		aChildTriangles.push([aPoints[1], aPoints[3], aPoints[5]]);
		for (var iV = 0; iV < 3; iV ++) {
			aChildTriangles.push([aPoints[(2 * iV)], aPoints[(2 * iV + 1) % 6], aPoints[(2 * iV + 5) % 6]]);
		}
		
		aChildTriangles.forEach(function(aTriangle){
			oNode.aChildren.push(oT.oMakeNode(aTriangle, oNode, iMakeChildren - 1));
		});
		
	} else {
		
		oT.aLeafs.push(oNode);
		oNode.bLeaf = true;
		
	}
	
	return oNode;
	
};




ConeTree.prototype.oGetLeaf = function (pP) {
	
	var oT = this;
	
	var iBaseNodeNr = 0;
	for (var iP = 0; iP < 3; iP ++) {
		if (pP[iP] < 0) iBaseNodeNr += Math.pow(2, iP);
	}
	var oNode = oT.aBaseNodes[iBaseNodeNr];
	
	while (!oNode.bLeaf) {
		var iChildNr = 0;
		var aChildNrs = [3,1,2];
		var pS = Math3D.pMxP(oNode.aChildren[0].mS, pP);
		for (var iI = 0; iI < 3; iI ++) {
			if (pS[iI] < 0) iChildNr = aChildNrs[iI];
		}
		oNode = oNode.aChildren[iChildNr];
	}
	
	return oNode;
	
};




ConeTree.prototype.bInNode = function (oNode, pP) {
	
	var oT = this;
	
	var pS = Math3D.pMxP(oNode.mS, pP);
	
	var bReturn = !(pS[0] < 0 || pS[1] < 0 || pS[2] < 0);
	
	return bReturn;
	
};



