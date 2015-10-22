(function () {
	
	renderPage();
	renderCharacters();
	
	function renderPage() {
		var template = $('#index-template').html(),
			compiled = Handlebars.compile(template),
			rendered = compiled(window.language);
		$('#main').html(rendered);
		$('#languageSwitch').click(function() {
			Characters.switchLanguage();
		});
	}
	
	function renderCharacters() {
		var template = $('#characters-template').html(),
			compiled = Handlebars.compile(template),
			rendered = compiled({ characters: Characters.characters, language: window.language});
		$('#theCharacters').html(rendered);
	}
})();