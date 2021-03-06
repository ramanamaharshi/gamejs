



SquareTree = function (iBranchesSqrt) {
	
	var oT = this;
	
	oT.iBranchesSqrt = iBranchesSqrt;
	
	oT.aLevelSizes = [1];
	
	oT.oRoot = oT.oNewNode();
	oT.oRoot.iLevel = 0;
	oT.oRoot.iAbsPosX = 0;
	oT.oRoot.iAbsPosY = 0;
	oT.oRoot.oContents = {};
	
};




SquareTree.prototype.oGetLeaf = function (iLeafX, iLeafY, bCreate) {
	
	var oT = this;
	
	var oNode = oT.oRoot;
	
	while (true) {
		
		var iNodeSize = oT.aLevelSizes[oNode.iLevel];
		
		var iRelPos = Math.floor(oT.iBranchesSqrt / 2);
		
		var bLeafInNodeSpace = 
			    oNode.iAbsPosX <= iLeafX && iLeafX < oNode.iAbsPosX + iNodeSize
			 && oNode.iAbsPosY <= iLeafY && iLeafY < oNode.iAbsPosY + iNodeSize
		;
		if (bLeafInNodeSpace) break;
		if (!bCreate) return null;
		
		var oNewParent = oT.oNewNode();
		
		var iRelParentPos = iNodeSize * - iRelPos;
		
		oNode.oParent = oNewParent;
		oNode.iRelPosX = iRelPos;
		oNode.iRelPosY = iRelPos;
		
		oNewParent.iLevel = oNode.iLevel + 1;
		oNewParent.iAbsPosX = oNode.iAbsPosX + iRelParentPos;
		oNewParent.iAbsPosY = oNode.iAbsPosY + iRelParentPos;
		oNewParent.aChildren[oT.iBranchesSqrt * iRelPos + iRelPos] = oNode;
		
		oNode = oNewParent;
		
		oT.oRoot = oNode;
		
		oT.aLevelSizes.push(Math.pow(oT.iBranchesSqrt, oT.oRoot.iLevel));
		
//console.log('new parent', oNode);
	}
	
	while (oNode.iLevel > 0) {
		
		var iChildSize = oT.aLevelSizes[oNode.iLevel - 1];
		var iChildX = Math.floor((iLeafX - oNode.iAbsPosX) / iChildSize);
		var iChildY = Math.floor((iLeafY - oNode.iAbsPosY) / iChildSize);
		var iChildNr = oT.iBranchesSqrt * iChildY + iChildX;
		
		if (!oNode.aChildren[iChildNr]) {
			if (!bCreate) return null;
			var oNewChild = oT.oNewNode();
			oNewChild.oParent = oNode;
			oNewChild.iLevel = oNode.iLevel - 1;
			oNewChild.iRelPosX = iChildX;
			oNewChild.iRelPosY = iChildY;
			oNewChild.iAbsPosX = oNode.iAbsPosX + oNewChild.iRelPosX * iChildSize;
			oNewChild.iAbsPosY = oNode.iAbsPosY + oNewChild.iRelPosY * iChildSize;
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




SquareTree.prototype.oNewNode = function () {
	
	var oT = this;
	
	var aChildren = [];
	for (var iI = 0; iI < oT.iBranchesSqrt * oT.iBranchesSqrt; iI ++) {
		aChildren.push(null);
	}
	
	var oNode = {
		oParent: null,
		iLevel: null,
		iAbsPosX: null, iAbsPosY: null,
		iRelPosX: null, iRelPosY: null,
		aChildren: aChildren,
	};
	
	return oNode;
	
};



