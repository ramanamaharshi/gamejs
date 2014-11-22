



var World = function () {
	
	var oWorld = this;
	
	oWorld.aBuildings = [];
	oWorld.aVehicles = [];
	oWorld.aObjects = [];
	oWorld.aBeings = [];
	
};




World.prototype.oCreateBuilding = function (oData) {
	var oWorld = this;
	var oNewBuilding = {
	};
	oWorld.aBuildings.push(oNewBuilding);
	return oNewBuilding;
};
World.prototype.oCreateVehicle = function (oData) {
	var oWorld = this;
	var oNewVehicle = {
		nX: 0, nY: 0, nDir: 0,
	};
	oWorld.aVehicles.push(oNewVehicle);
	return oNewVehicle;
};
World.prototype.oCreateObject = function (oData) {
	var oWorld = this;
	var oNewObject = {
	};
	oWorld.aObjects.push(oNewObject);
	return oNewObject;
};
World.prototype.oCreateBeing = function (oData) {
	var oWorld = this;
	var oNewBeing = {
		nX: 0, nY: 0, nDir: 0,
	};
	oWorld.aBeings.push(oNewBeing);
	return oNewBeing;
};




World.prototype.vCalc = function () {
	
	
	
};




World.prototype.vDraw = function (oCamera) {
	
	
	
};



