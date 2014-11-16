var reviewPrompt = (function () {
	
	var publicMethods = {};
	
	
	publicMethods.show = function () {
		
	  if (publicMethods.seenPrompt()) {
	  	  return false;
	  }		
				
	  var dialog = Ti.UI.createAlertDialog({
	      cancel: 0,
	      buttonNames: [L('review_prompt_btn_cancel'), L('review_prompt_btn_review')],
	      message: L('review_prompt_message'),
	      title: L('review_prompt_title')
	  });
	  dialog.addEventListener('click', function(e) {
	  	  console.log(e.index);
	      if (e.index === 1) {
	      	publicMethods.goToAppStore();	
	      }
	  });
	  dialog.show();
	  publicMethods.setSeenReviewPrompt();  
	};
	
	
	publicMethods.goToAppStore = function () {		
		var url = Alloy.CFG.app_store_url;
	    Ti.Platform.openURL(url); 		
	};
	
	
	publicMethods.setSeenReviewPrompt = function () {
		Ti.App.Properties.setBool("seenReviewPrompt", true);
	};
	
	publicMethods.seenPrompt = function () {
		return Ti.App.Properties.getBool("seenReviewPrompt");
	};
	
	
	return publicMethods;
})();


module.exports = reviewPrompt;