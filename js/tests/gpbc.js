



var iWH = 12;
var iGameWH = 120;
var nFieldWH = iGameWH / iWH;

var oGame = new Game(iGameWH, iGameWH);
var oG = oGame.oG;
var oI = oGame.oI;




var oStuff = {};




var vInit = function () {
	
	oG.iDrawShift = 0.5;
	
	oI.iMouseCorrectionX = -1;
	oI.iMouseCorrectionY = -2;
	
	oG.vSetColor('#FFF');
	oG.vFillRect(0, 0, oG.iGetW(), oG.iGetH());
	
	var aCheck = '01000111 01101111 01100100 00100000 01000101 01101101 01110000 01100101 01110010 01101111 01110010 00100000 01000100 01101111 01101110 01100001 01101100 01100100 00100000 01010100 01110010 01110101 01101101 01110000'.replace(/ /g, '').split('');
	
	var sText = '\
§ 355\n\
Widerrufsrecht bei Verbraucherverträgen\n\
\n\
(1) Wird einem Verbraucher durch Gesetz ein Widerrufsrecht nach dieser Vorschrift eingeräumt, so sind der Verbraucher und der Unternehmer an ihre auf den Abschluss des Vertrags gerichteten Willenserklärungen nicht mehr gebunden, wenn der Verbraucher seine Willenserklärung fristgerecht widerrufen hat. Der Widerruf erfolgt durch Erklärung gegenüber dem Unternehmer. Aus der Erklärung muss der Entschluss des Verbrauchers zum Widerruf des Vertrags eindeutig hervorgehen. Der Widerruf muss keine Begründung enthalten. Zur Fristwahrung genügt die rechtzeitige Absendung des Widerrufs.\n\
\n\
(2) Die Widerrufsfrist beträgt 14 Tage. Sie beginnt mit Vertragsschluss, soweit nichts anderes bestimmt ist.\n\
\n\
(3) Im Falle des Widerrufs sind die empfangenen Leistungen unverzüglich zurückzugewähren. Bestimmt das Gesetz eine Höchstfrist für die Rückgewähr, so beginnt diese für den Unternehmer mit dem Zugang und für den Verbraucher mit der Abgabe der Widerrufserklärung. Ein Verbraucher wahrt diese Frist durch die rechtzeitige Absendung der Waren. Der Unternehmer trägt bei Widerruf die Gefahr der Rücksendung der Waren.\
';
	var sText = 'Die Widerrufsfrist beträgt 14 Tage. Sie beginnt mit Vertragsschluss, soweit nichts anderes bestimmt ist.';
	
	var sText = 'Really disgusting that the failing New York Times allows dishonest writers to totally fabricate stories.';
	var sText = ' .@realDonaldTrump: "Wow, new polls just out have Trump up and Cruz down - he is a nervous wreck!" ';
	var sText = 'I am self-funding my campaign - putting up my own money, not controlled.  Cruz is spending $millions on ads paid for by his N.Y. bosses.';
	var sText = 'As a presidential candidate, I have instructed my long-time doctor to issue, within two weeks, a full medical report-it will show perfection';
	
	var a8 = aStringToByteArray(sText);
	
	var a4 = [];
	for (var iI = 0; iI < a8.length; iI ++) {
		a4.push(Math.floor(a8[iI] / 16));
		a4.push(a8[iI] % 16);
	}
	
	var a2 = [];
	for (var iI = 0; iI < a4.length; iI ++) {
		a2.push(Math.floor(a4[iI] / 4));
		a2.push(a4[iI] % 4);
	}
	
	var a1 = [];
	for (var iI = 0; iI < a2.length; iI ++) {
		a1.push(Math.floor(a2[iI] / 2));
		a1.push(a2[iI] % 2);
	}
	
	var aValues = a8;
	
	oG.vSetColor('#000');
	
	for (var iV = 0; iV < aValues.length; iV ++) {
		
		var iX = iV % iWH;
		var iY = Math.floor(iV / iWH);
		var iValue = aValues[iV];
		
		//oG.vFillOval(iX * nFieldWH + 1, iY * nFieldWH + 1, nFieldWH - 2, nFieldWH - 2);
		
		var aBC = [0,0,0];
		aBC = [1.75 * iValue, 1.75 * iValue, 1.75 * iValue];
		//aBC = [ 64 * a2[4 * iV + 1] , 64 * a2[4 * iV + 2] , 64 * a2[4 * iV + 3] ];
		oG.vSetColor(aBC);
		//oG.vFillRect(iX * nFieldWH, iY * nFieldWH, nFieldWH, nFieldWH);
		
		for (var iSubNr = 0; iSubNr < 4; iSubNr ++) {
			
			var iSubX = iSubNr % 2;
			var iSubY = Math.floor(iSubNr / 2);
			var iSubV = a2[4 * iV + iSubNr];
			
			var nMargin = 1;
			
			var aColor = [64 * iSubV, 64 * iSubV, 64 * iSubV];
			oG.vSetColor(aColor);
			oG.vFillRect(
				iX * nFieldWH + nMargin + (iSubX * (nFieldWH / 2 - nMargin)),
				iY * nFieldWH + nMargin + (iSubY * (nFieldWH / 2 - nMargin)),
				nFieldWH / 2 - nMargin,
				nFieldWH / 2 - nMargin
			);
			
		}
		
	}
	
	oStuff.aPixelColor = oG.aGetPixelColor(0,0);
	
};




var vInput = function () {
	
	oI.vStep();
	
};




var vCalc = function () {};




var vDraw = function () {};




var aStringToByteArray = function (sInput) {
	
	var utf8 = unescape(encodeURIComponent(sInput));
	
	var arr = [];
	for (var i = 0; i < utf8.length; i++) {
	    arr.push(utf8.charCodeAt(i));
	}
	
	return arr;
	
};




vInit();

oGame.vStartLoop(function(iUT, iDeltaUT){
	vInput();
	vCalc();
	vDraw();
});



