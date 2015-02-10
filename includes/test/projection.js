
var nNear = 11;
var nFar = 19;

var nZ = 18;

var aEquations = [
	
	'a < z < b',
	
	'-1 < 2 * (((1/z) - (1/b)) / ((1/a - 1/b))) - 1 < 1',
	
	'-1 < 2 * (((1/z) / ((1/a) - (1/b))) - ((1/b) / ((1/a) - (1/b)))) - 1< 1',
	
	'-1 < (1/z) * (2 / ((1/a) - (1/b))) + (-1 - 2 * (1/b) / ((1/a) - (1/b))) < 1',
	
];

aEquations.forEach(function(sEquation){
	
	var sA = sEquation;
	var sB = sA.replace(/a/g, nNear).replace(/z/g, nZ).replace(/b/g, nFar);
	
	var aB = sB.split('<');
	var sC = aB[0] + '<' + aB[1] + ' && ' + aB[1] + '<' + aB[2];
	var sD = '[failed]';
	eval('sD = (' + sC + ');');
	
	console.log(' ');
	console.log(sA + '    ' + sB);
	console.log(sC + '    ' + sD);
	console.log(' ');
	
});

