var site = {
	rate : 500
};

Object.size = function(obj) {
	var size = 0, key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)){
			size++;
		}
	}
	return size;
};

(function($) {

	// javascript goes here instead of inside a $(document).ready

})(jQuery);