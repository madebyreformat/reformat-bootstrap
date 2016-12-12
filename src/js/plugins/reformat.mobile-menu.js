(function($){

	$('#mobile-toggle').sidr({
	  name: 'sidr-navbar',
	  source: '#navbar',
	  side: 'right',
	  onOpen : function(){
	    $('#mobile-toggle').addClass('icon-close').removeClass('icon-toggle');
	  },
	  onClose : function(){
	    $('#mobile-toggle').removeClass('icon-close').addClass('icon-toggle');
	  }
	});
	
})(jQuery);