



var Environment = function () {
	
	var oE = this;
	
	oE.oOctTree = new Environment.OctTree();
	
};




Environment.OctTree = function (iLeafSize, iNodeBranchesSqrt) {
	
	var oT = this;
	
	oT.iLeafSize = iLeafSize;
	oT.iNodeBranchesSqrt = iNodeBranchesSqrt;
	
	oT.oCenterLeaf = {
		oParent: null,
		aRelPosition: [],
		oChildren: [],
	};
	
};




Environment.OctTree.prototype.vRegisterBuilding = function (iLeafX, iLeafY, oObject) {
	
	
	
};




Environment.Building = function (oEnvironment, pP, pNormal, oBlockSize, iBlocksX, iBlocksY) {
	
	var oB = this;
	
	oB.oEnvironment = oEnvironment;
	oB.pP = pP; 
	
};




Environment.Building



