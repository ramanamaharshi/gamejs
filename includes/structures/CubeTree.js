



CubeTree = function (iBranchesCbrt) {
	
	var oT = this;
	
	oT.iBranchesCbrt = iBranchesCbrt;
	
	oT.aLevelSizes = [1];
	
	oT.oRoot = oT.oNewNode();
	oT.oRoot.iLevel = 0;
	oT.oRoot.iAbsPosX = 0;
	oT.oRoot.iAbsPosY = 0;
	oT.oRoot.iAbsPosZ = 0;
	oT.oRoot.oContents = {};
	
};




CubeTree.prototype.oGetLeaf = function (iLeafX, iLeafY, iLeafZ, bCreate) {
	
	var oT = this;
	
	var oNode = oT.oRoot;
	
	while (true) {
		
		var iNodeSize = oT.aLevelSizes[oNode.iLevel];
		
		var iRelPos = Math.floor(oT.iBranchesCbrt / 2);
		
		var bLeafInNodeSpace = 
			    oNode.iAbsPosX <= iLeafX && iLeafX < oNode.iAbsPosX + iNodeSize
			 && oNode.iAbsPosY <= iLeafY && iLeafY < oNode.iAbsPosY + iNodeSize
			 && oNode.iAbsPosZ <= iLeafZ && iLeafZ < oNode.iAbsPosZ + iNodeSize
		;
		if (bLeafInNodeSpace) break;
		if (!bCreate) return null;
		
		var oNewParent = oT.oNewNode();
		
		var iRelParentPos = iNodeSize * - iRelPos;
		
		oNode.oParent = oNewParent;
		oNode.iRelPosX = iRelPos;
		oNode.iRelPosY = iRelPos;
		oNode.iRelPosZ = iRelPos;
		
		oNewParent.iLevel = oNode.iLevel + 1;
		oNewParent.iAbsPosX = oNode.iAbsPosX + iRelParentPos;
		oNewParent.iAbsPosY = oNode.iAbsPosY + iRelParentPos;
		oNewParent.iAbsPosZ = oNode.iAbsPosZ + iRelParentPos;
		var iChildNr = 0;
		iChildNr += oNode.iRelPosZ * oT.iBranchesCbrt * oT.iBranchesCbrt;
		iChildNr += oNode.iRelPosY * oT.iBranchesCbrt;
		iChildNr += oNode.iRelPosX;
		oNewParent.aChildren[iChildNr] = oNode;
		
		oNode = oNewParent;
		
		oT.oRoot = oNode;
		
		oT.aLevelSizes.push(Math.pow(oT.iBranchesCbrt, oT.oRoot.iLevel));
		
//console.log('new parent', oNode);
	}
	
	while (oNode.iLevel > 0) {
		
		var iChildSize = oT.aLevelSizes[oNode.iLevel - 1];
		var iChildX = Math.floor((iLeafX - oNode.iAbsPosX) / iChildSize);
		var iChildY = Math.floor((iLeafY - oNode.iAbsPosY) / iChildSize);
		var iChildZ = Math.floor((iLeafZ - oNode.iAbsPosZ) / iChildSize);
		
		var iChildNr = 0;
		iChildNr += iChildZ * oT.iBranchesCbrt * oT.iBranchesCbrt;
		iChildNr += iChildY * oT.iBranchesCbrt;
		iChildNr += iChildX;
		
		if (!oNode.aChildren[iChildNr]) {
			if (!bCreate) return null;
			var oNewChild = oT.oNewNode();
			oNewChild.oParent = oNode;
			oNewChild.iLevel = oNode.iLevel - 1;
			oNewChild.iRelPosX = iChildX;
			oNewChild.iRelPosY = iChildY;
			oNewChild.iRelPosZ = iChildZ;
			oNewChild.iAbsPosX = oNode.iAbsPosX + oNewChild.iRelPosX * iChildSize;
			oNewChild.iAbsPosY = oNode.iAbsPosY + oNewChild.iRelPosY * iChildSize;
			oNewChild.iAbsPosZ = oNode.iAbsPosZ + oNewChild.iRelPosZ * iChildSize;
			if (oNewChild.iLevel == 0) {
				oNewChild.oContents = {};
			}
			oNode.aChildren[iChildNr] = oNewChild;
		}
		
		oNode = oNode.aChildren[iChildNr];
		
//console.log('new child', oNode);
	}
	
	return oNode;
	
};




CubeTree.prototype.oNewNode = function () {
	
	var oT = this;
	
	var aChildren = [];
	for (var iI = 0; iI < oT.iBranchesCbrt * oT.iBranchesCbrt * oT.iBranchesCbrt; iI ++) {
		aChildren.push(null);
	}
	
	var oNode = {
		oParent: null,
		iLevel: null,
		iAbsPosX: null, iAbsPosY: null, iAbsPosZ: null,
		iRelPosX: null, iRelPosY: null, iRelPosZ: null,
		aChildren: aChildren,
	};
	
	return oNode;
	
};



