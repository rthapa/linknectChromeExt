chrome.storage.local.get('currentLocation', function(items) {
	if(items.currentLocation != undefined && $.trim(items.currentLocation) != ''){
		window.location.href = items.currentLocation;
	}else{
		window.location.href = 'login.html';
	}
});
