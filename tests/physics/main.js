



var oGame = new Game(500, 400);
var oG = oGame.oG;
var oI = oGame.oI;

var oP = new Physics2D();



var vInit = function () {
	
	for (var iT = 0; iT < 99; iT ++) {
		
		var oP1 = oP.oNewParticle(oG.iW / 2, oG.iH / 2);
		var oP2 = oP.oNewParticle(oG.iW / 2, oG.iH / 2);
		var oP3 = oP.oNewParticle(oG.iW / 2, oG.iH / 2);
		
		oP.oNewDistantRestraint(333, oP1, oP2);
		oP.oNewDistantRestraint(333, oP2, oP3);
		oP.oNewDistantRestraint(333, oP3, oP1);
		
	}
	
};




var vInput = function () {
	
	
};




var vCalc = function () {
	
	oP.vStep();
	
};




var vDraw = function () {
	
	oG.vSetColor('#000');
	oG.vFillRect(0, 0, oG.iW, oG.iH);
	
	oG.vSetColor('#0F0');
	oP.aParticles.forEach(function(oP){
		oG.vFillCircle(oP.pP, 2);
	});
	oP.oRestraints.aDistance.forEach(function(oR){
		oG.vDrawLine(oR.oPA.pP, oR.oPB.pP);
	});
	
	oG.vSetColor('#FFF');
	oG.vSetFont('13px monospace');
	oG.vDrawString(oGame.oG.iW - 8, 8, (oGame.nGetFrameRate() / 2).toFixed(0), 'left bottom');
	
};




vInit();

var iFrameNr = 0;
oGame.vStartLoop(function(){
	iFrameNr ++;
	if (iFrameNr % 2 == 0) return;
	vInput();
	vCalc();
	vDraw();
});



