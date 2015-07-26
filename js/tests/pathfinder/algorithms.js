

var oAlgos = {
	
	
	naive: {
		
		
		vParseMap: function (aMap) {
			
			var aSquares = [];
			for (var iY = 0; iY < aMap.length; iY ++) {
				for (var iX = 0; iX < aMap[0].length; iX ++) {
					aSquares.push(aMap[iY][iX] ? -11 : -1);
				}
			}
			
			this.oParsedMap = {
				iW: aMap[0].length,
				iH: aMap.length,
				aSquares: aSquares,
			};
			
		},
		
		
		aFindPath: function (aStart, aTarget) {
			
			var oMap = this.oParsedMap;
			var aSquares = oMap.aSquares;
			
			var iStart = aStart[1] * oMap.iW + aStart[0];
			var iTarget = aTarget[1] * oMap.iW + aTarget[0];
			
			for (var iS = 0; iS < aSquares.length; iS ++) {
				if (aSquares[iS] != -11) aSquares[iS] = -1;
			}
//console.log(aSquares);
			
			var aQueue = [iStart];
			
			var iCurrent = null;
			while (aQueue.length) {
				iCurrent = aQueue.shift();
//console.log(iCurrent);
				if (iCurrent == iTarget) break;
				var aNeighbors = this.aGetNeighbors(iCurrent);
				for (var iN = 0; iN < aNeighbors.length; iN ++) {
					var iNeighbor = aNeighbors[iN];
//console.log(iNeighbor, aSquares[iNeighbor]);
					if (aSquares[iNeighbor] == -1) {
						aSquares[iNeighbor] = iCurrent;
						aQueue.push(iNeighbor);
					}
				}
			}
console.log(iCurrent, iTarget);
			
			var aPath = null;
			if (iCurrent == iTarget) {
				aPath = [iTarget];
				while (iCurrent != iStart) {
					iCurrent = aSquares[iCurrent];
					aPath.unshift(this.aGetSquareCoords(iCurrent));
				}
			}
			
			return aPath;
			
		},
		
		
		aGetSquareCoords: function (iSquare) {
			
			var iW = this.oParsedMap.iW;
			
			return [iSquare % iW, Math.floor(iSquare / iW)];
			
		},
		
		
		iGetSquare: function (iX, iY) {
			
			return iGetNeighbor(0, iX, iY);
			
		},
		
		
		iGetNeighbor: function (iSquare, iPlusX, iPlusY) {
			
			var oMap = this.oParsedMap;
			
			var iReturn = -11;
			
			var aCoords = this.aGetSquareCoords(iSquare);
			
			aCoords[0] += iPlusX;
			aCoords[1] += iPlusY;
			
			if (
				   (-1 < aCoords[0]) && (aCoords[0] < oMap.iW)
				&& (-1 < aCoords[1]) && (aCoords[1] < oMap.iH)
			) {
				var iReturn = iSquare + iPlusY * oMap.iW + iPlusX;
				if (!(-1 < iReturn && iReturn < oMap.aSquares.length)) iReturn = -11;
			}
			
			return iReturn;
			
		},
		
		
		aGetNeighbors: function (iSquare) {
			
			return [
				//this.iGetNeighbor(iSquare, -1, -1),
				this.iGetNeighbor(iSquare,  0, -1),
				//this.iGetNeighbor(iSquare,  1, -1),
				this.iGetNeighbor(iSquare, -1,  0),
				this.iGetNeighbor(iSquare,  1,  0),
				//this.iGetNeighbor(iSquare, -1,  1),
				this.iGetNeighbor(iSquare,  0,  1),
				//this.iGetNeighbor(iSquare,  1,  1),
			];
			
		},
		
		
	},
	
	
	a_star: {
		
		
		vParseMap: function (aMap) {
			
			
			
		},
		
		
		aFindPath: function (aStart, aTarget) {
			
			
			
		},
		
		
	},
	
	
	olli: {
		
		
		vParseMap: function (aMap) {
			
			
			
		},
		
		
		aFindPath: function (aStart, aTarget) {
			
			
			
		},
		
		
	},
	
	
};


