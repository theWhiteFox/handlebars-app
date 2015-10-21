(function () {
	
	renderPage();
	
	function renderPage() {
			var template = $('#index-template').html(),
			compliled = Handlebars.compile(template),
			rendered = compliled(window.language);
		$('#main').html(rendered);
		$('#lanuageSwitch').click(function() {
			Characters.switchLanuage();
		});
	}

})();