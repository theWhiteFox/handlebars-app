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
		attachCharacterButtons();
	}
	
	function attachCharacterButtons() {
		$('.character-button').click(function() {
			var id = $(this).closest('.character-card').data('character-id');
			Characters.chooseCharacter(id);
			renderCharacters();
		});
		
		$('.not-character-button').click(function() {
			var id = $(this).closest('.character-card').data('character-id');
			Characters.chooseNotCharacter(id);
			renderCharacters();
		});
	}
})();