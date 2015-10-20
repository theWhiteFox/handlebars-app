(function() {
    var dh = {};

    dh.chooseCharacter = function(characterId) {
    	var character = dh.getCharacter(characterId);
    	if (character)	{
    		character.chosen = 'character';
    		dh.storeCharacters(dh.characters);
    	}
    };

    dh.chooseNotCharacter = function(characterId) {
    	var character = dh.getCharacter(characterId);
    	if (character)	{
    		character.chosen = 'not character';
    		dh.storeCharacters(dh.characters);
    	}
    };

    dh.getCharacter = function(characterId) {
    	var character;
    	dh.characters.forEach(function(val) {
    		if (val.id === characterId) {
    			character = val;
    		}
    	});
    	return character;
    };

    dh.isMaybeCharacter = function(character) {
    	return !character.chosen ||
    		(character.isCharacter && character.chosen !== 'character') ||
    		(!character.isCharacter && character.chosen !== 'not character');
    };

    dh.isRightCharacter = function(character) {
    	return character.isCharacter && character.chosen === 'character';
    };

    dh.isRightNotCharacter = function(character) {
    	return !character.isCharacter && character.chosen === 'not character';
    };

    dh.getNumberOfCharacters = function() {
      var characterWidth = 320,
          charactersPadding = 80;
      return Math.floor((window.innerWidth - charactersPadding) / characterWidth) * 2;
    };

    dh.getPaginatedCharacters = function(characters) {
      var params = CharacterPack.parseUrl(),
          characterPage = params.page || 1,
    			characterCount = dh.getNumberOfCharacters(),
    			start = (characterPage - 1) * characterCount,
    			stop = characterPage * characterCount;
      return characters.slice(start, stop);
    };

    dh.getFilteredCharacters = function(characters) {
      var params = CharacterPack.parseUrl(),
          tempCharacters = characters;
      if(params.filter) {
    		tempCharacters = characters.filter(function(character) {
    			switch(params.filter) {
    				case 'characters':
    					return CharacterPack.isRightCharacter(character);
    				case 'not_characters':
    					return CharacterPack.isRightNotCharacter(character);
    				case 'maybe_characters':
    					return CharacterPack.isMaybeCharacter(character);
    				default:
    					return false;
    			}
    		});
    	}
      return tempCharacters;
    };

    function Character(id, image, name, isCharacter, chosen) {
      this.id = id;
      this.image = image;
      this.name = name;
      this.isCharacter = isCharacter;
      this.chosen = chosen;
      this.isCorrect = function() {
        return (this.chosen === 'character' && this.isCharacter) ||
      		(this.chosen === 'not character' && !this.isCharacter);
      }
      return this;
    }

    dh.initCharacters = function() {
    	var characters = [
        new Character('goofy', 'goofy_character.jpg', 'Goofy', true),
    		new Character('baby', 'bubby_bunny.jpg', 'Baby', false),
    	  new Character('bunny', 'bunny_character.jpg', 'Bunny', true),
    		new Character('caged', 'caged_heat.jpg', 'Caged Heat', false),
    		new Character('cloudy', 'cloudy_bunny.jpg', 'Cloudy', false),
    		new Character('curious', 'curious_pig.jpg', 'Curious', false),
    		new Character('bootsy', 'cute_otter.jpg', 'Bootsy', false),
    		new Character('chillin', 'dgaf_character.jpg', 'Chillin\'', true),
    		new Character('posessed', 'exorcist_character.jpg', 'Possessed', true),
    		new Character('gremlin', 'gremlin_character.jpg', 'Gremlin', true),
    		new Character('zen', 'meditating_cat.jpg', 'Zen', false),
    		new Character('friendly', 'middlefinger_otter.jpg', 'Wassup', false),
    		new Character('moonwalker', 'moonwalking_goat.jpg', 'Moonwalking', false),
        new Character('panda', 'panda_character.jpg', 'Panda', true),
    		new Character('party', 'party_character.jpg', 'Partytime', true),
    		new Character('sad', 'sad_pony.jpg', 'Sad', false),
    		new Character('salary', 'salary_character.jpg', 'Salaryman', true),
    		new Character('surprised', 'startled_character.jpg', 'Surprised', true),
    		new Character('teacup', 'teacup_pig.jpg', 'Red Boots', false),
    		new Character('towel', 'towel_character.jpg', 'Towel Dry', true),
    		new Character('triple', 'triplethreat_character.jpg', 'Triple Threat', true),
    		new Character('happy', 'ultimate_quokka.jpg', 'Happy', false)
    	];
    	if (window.localStorage.getItem('characters')) {
    		return dh.rehydrateCharacters(JSON.parse(window.localStorage.getItem('characters')));
    	} else {
    		dh.storeCharacters(characters);
    		return characters;
    	}
    };

    dh.rehydrateCharacters = function(bunchaCharacters) {
      var backatchaCharacters = [];
      bunchaCharacters.forEach(function(val) {
        backatchaCharacters.push(new Character(val.id,
          val.image, val.name, val.isCharacter, val.chosen));
      });
      return backatchaCharacters;
    };

    dh.storeCharacters = function(someCharacters) {
    	window.localStorage.setItem('characters', JSON.stringify(someCharacters));
    };

    dh.clearCharacters = function() {
    	window.localStorage.removeItem('characters');
      dh.characters = dh.initCharacters();
    };

    dh.scoreCharacters = function(characters) {
      var correct = 0,
          incorrect = 0,
          incomplete = characters.length;
      $.each(characters, function(ix, character) {
        if (character.chosen) {
          incomplete--;
          if (character.isCorrect()) {
            correct++;
          } else {
            incorrect++;
          }
        }
      });
      return {
        correct: correct,
        incorrect: incorrect,
        incomplete: incomplete
      };
    };

    dh.parseUrl = function() {
    	var queryParams = window.location.search.slice(1).split('&'),
    	    paramsObj = {};
    	queryParams.forEach(function(val) {
    		if (val) {
    			paramsObj[val.split('=')[0]] = val.split('=')[1];
    		}
    	});
    	return paramsObj;
    };

    dh.generateUrlParameters = function(excludes) {
      var queryParams = dh.parseUrl(),
          returnString = '?';
      for (var key in queryParams) {
        if (!excludes || excludes.indexOf(key) < 0) {
          returnString += key + '=' + queryParams[key] + '&';
        }
      }
      return returnString;
    };

    dh.switchLanguage = function() {
      var lang = window.language.langId === 'human' ?
            'character' : 'human',
          filters = dh.generateUrlParameters(['language']);
  		window.location.href = filters + 'language=' + lang;
    };

    dh.initLanguages = function(lang) {
      var human = {
            langId: 'human',
            siteTitle: 'character or not?',
            charactersFilter: 'characters',
            notCharactersFilter: 'not characters',
            incompleteFilter: 'maybe characters',
            languageFilter: 'character?',
            languageFilterId: 'character',
            reset: 'reset',
            correct: 'correct',
            incorrect: 'incorrect',
            incomplete: 'incomplete',
            yep: 'Character',
            nope: 'Not',
            correctInd: 'Correct!',
            incorrectInd: 'Try Again!',
            noCharactersMessage: 'Sorry! There are no characters here...'
          },
          character = {
            langId: 'character',
            siteTitle: 'Roof? Grrr!',
            charactersFilter: 'roof',
            notCharactersFilter: 'grrr',
            incompleteFilter: 'aroo?',
            languageFilter: 'human?',
            languageFilterId: 'human',
            reset: 'ruhuh',
            correct: 'aroo!',
            incorrect: 'yipe!',
            incomplete: 'pant!',
            yep: 'aroo',
            nope: 'grrr',
            correctInd: 'Aroo!',
            incorrectInd: 'Yipe!',
            noCharactersMessage: 'Ruh-roh! Woof woof whine...'
          },
          languageFilter = dh.parseUrl();
      if ((lang || languageFilter.language) === 'character') {
        return character;
      } else {
        return human;
      }
    };

    dh.characters = dh.initCharacters();

    window.language = dh.initLanguages();
    window.CharacterPack = dh;
})();
