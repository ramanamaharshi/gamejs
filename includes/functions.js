



var oMakeWall = function (aWallArray) {
	
	var aWallDelta = [aWallArray[2] - aWallArray[0], aWallArray[3] - aWallArray[1]];
	
	var mMatrix = oLA.mMatrixFromCenterNormal(aWallArray, aWallDelta, true);
	
	console.log(oLA.pMultiplyMP(oLA.mInverseRotation(aWallDelta), aWallDelta));
	console.log(oLA.pMultiplyMP(mMatrix, [aWallArray[2], aWallArray[3]]));
	
	var nLength = oLA.nLength(aWallDelta);
	
	var oWall = {aArray: aWallArray, mMatrix: mMatrix, nLength: nLength};
	
	return oWall;
	
};



