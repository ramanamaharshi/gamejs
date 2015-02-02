



var oGame = new Game(500, 400);
var oG = oGame.oG;
var oI = oGame.oI;

var oP = new Physics2D();



var vInit = function () {
	
	for (var iT = 0; iT < 3; iT ++) {
		
		var oP1 = oP.oNewParticle(oG.iW / 2, oG.iH / 2);
		var oP2 = oP.oNewParticle(oG.iW / 2, oG.iH / 2);
		var oP3 = oP.oNewParticle(oG.iW / 2, oG.iH / 2);
		
		oP.oNewDistantRestraint(99, oP1, oP2);
		oP.oNewDistantRestraint(99, oP2, oP3);
		oP.oNewDistantRestraint(99, oP3, oP1);
		
	}
	
};




var vInput = function () {
	
	
};




var vCalc = function () {
	
	oP.vStep();
	
	if (Math.random() < 0.01) {
		console.log('fps', oGame.nGetFrameRate());
	}
	
};




var vDraw = function () {
	
	oG.vSetColor('#000');
	oG.vFillRect(0, 0, oG.iW, oG.iH);
	
	oG.vSetColor('#0F0');
	oP.aParticles.forEach(function(oP){
		oG.vFillCircle(oP.pP, 2);
	});
	
};




vInit();

oGame.vStartLoop(function(){
	vInput();
	vCalc();
	vDraw();
});



