(function(){
	
	
	
	
	window.vBind = function (oHost, sKey, f, aArguments) {
		
		if (typeof sKey != 'string') {
			aArguments = f; f = sKey; sKey = oHost; oHost = window;
		}
		
		if (typeof oHost.oBinds == 'undefined') {
			oHost.oBinds = {};
		}
		if (typeof oHost.oBinds[sKey] == 'undefined') {
			oHost.oBinds[sKey] = [];
		}
		
		if (typeof f == 'function') {
			oHost.oBinds[sKey].push(f);
		} else {
			if (typeof aArguments == 'undefined') {
				aArguments = [];
			}
			oHost.oBinds[sKey].forEach(function(f){
				f.apply(oHost, aArguments);
			});
		}
		
	};
	
	
	
	
})();