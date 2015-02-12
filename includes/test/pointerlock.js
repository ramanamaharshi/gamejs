document.addEventListener("click", function (e) {
		
		var oE = document.body;
		
		oE.vPointerLock = 
			    oE.requestPointerLock
			 || oE.mozRequestPointerLock
			 || oE.webkitRequestPointerLock
		;
		
		oE.vPointerLock();
		
});
