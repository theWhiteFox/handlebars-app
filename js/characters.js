(function() {
    var dh = {};

    dh.chooseCharacter = function(characterId) {
    	var character = dh.getCharacter(characterId);
    	if (character)	{
    		character.chosen = 'dead';
    		dh.storeCharacters(dh.characters);
    	}
    };

    dh.chooseNotCharacter = function(characterId) {
    	var character = dh.getCharacter(characterId);
    	if (character)	{
    		character.chosen = 'not dead';
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
    		(character.isDead && character.chosen !== 'dead') ||
    		(!character.isDead && character.chosen !== 'not dead');
    };

    dh.isRightCharacter = function(character) {
    	return character.isDead && character.chosen === 'dead';
    };

    dh.isRightNotCharacter = function(character) {
    	return !character.isDead && character.chosen === 'not dead';
    };

    dh.getNumberOfCharacters = function() {
      var characterWidth = 320,
          charactersPadding = 80;
      return Math.floor((window.innerWidth - charactersPadding) / characterWidth) * 2;
    };

    dh.getPaginatedCharacters = function(characters) {
      var params = Characters.parseUrl(),
          characterPage = params.page || 1,
    			characterCount = dh.getNumberOfCharacters(),
    			start = (characterPage - 1) * characterCount,
    			stop = characterPage * characterCount;
      return characters.slice(start, stop);
    };

    dh.getFilteredCharacters = function(characters) {
      var params = Characters.parseUrl(),
          tempCharacters = characters;
      if(params.filter) {
    		tempCharacters = characters.filter(function(character) {
    			switch(params.filter) {
    				case 'characters':
    					return Characters.isRightCharacter(character);
    				case 'not_characters':
    					return Characters.isRightNotCharacter(character);
    				case 'maybe_characters':
    					return Characters.isMaybeCharacter(character);
    				default:
    					return false;
    			}
    		});
    	}
      return tempCharacters;
    };

    function Character(id, image, name, isDead, chosen) {
      this.id = id;
      this.image = image;
      this.name = name;
      this.isDead = isDead;
      this.chosen = chosen;
      this.isCorrect = function() {
        return (this.chosen === 'dead' && this.isDead) ||
      		(this.chosen === 'not dead' && !this.isDead);
      }
      return this;
    }

    dh.initCharacters = function() {
    	var characters = [
        new Character('arya', 'arya-stark.jpg', 'Arya', true),
    		new Character('bran', 'bran-stark.jpg', 'Bran', false),
    	  new Character('brienne', 'brienne-of-tarth.jpg', 'Brienne', true),
    		new Character('cersei', 'cersei-lannister.jpg', 'Cersei Lannister', false),
    		new Character('daenerys', 'daenerys-targaryen.jpg', 'Daenerys', false),
    		new Character('davos', 'davos-seaworth.jpg', 'Davos', false),
    		new Character('ellaria', 'ellaria_sand.jpg', 'Ellaria', false),
    		new Character('grey', 'grey-worm.jpg', 'Grey Worm\'', true),
    		new Character('jaime', 'jaime-lannister.jpg', 'Jaime', true),
    		new Character('John', 'john-snow.jpg', 'John Snow', false),
    		new Character('mance', 'mance-rayder.jpg', 'Mance', false),
    		new Character('melisandre', 'melisandre.jpg', 'Melisandre', false),
    		new Character('missandei', 'missandei.jpg', 'Missandei', true),
        new Character('petyr', 'petyr-baelish.jpg', 'Petyr', true),
    		new Character('ramsay', 'ramsay-snow.jpg', 'Ramsay', false),
    		new Character('sam', 'sam-tarly.jpg', 'Sam', true),
    		new Character('sansa', 'sansa-stark.jpg', 'Sansa', false),
    		new Character('stannis', 'stannis-baratheon.jpg', 'Stannis', true),
    		new Character('theon', 'theon-greyjoy.jpg', 'Theon', true),
    		new Character('tormund', 'tormund-giantsbane.jpg', 'tormund', false),
    		new Character('tyrion', 'tyrion-lannister.jpg', 'Tyrion', true),
    		new Character('varys', 'varys.jpg', 'Varys', true)
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
          val.image, val.name, val.isDead, val.chosen));
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
      var lang = window.language.langId === 'english' ?
            'highValyrian' : 'english',
          filters = dh.generateUrlParameters(['language']);
  		window.location.href = filters + 'language=' + lang;
    };

    dh.initLanguages = function(lang) {
      var english = {
            langId: 'english',
            siteTitle: 'Dead or Not?',
            charactersFilter: 'dead',
            notCharactersFilter: 'not dead',
            incompleteFilter: 'maybe dead',
            languageFilter: 'high valyrian?',
            languageFilterId: 'highValyrian',
            reset: 'reset',
            correct: 'correct',
            incorrect: 'incorrect',
            incomplete: 'incomplete',
            yep: 'Dead',
            nope: 'Not',
            correctInd: 'Correct!',
            incorrectInd: 'Try Again!',
            noCharactersMessage: 'Sorry! There are no characters here...'
          },
          highValyrian = {
            langId: 'highValyrian',
            siteTitle: 'Morghe iā Daor?',
            charactersFilter: 'Morghe',
            notCharactersFilter: 'Daor Morghe',
            incompleteFilter: 'Morghe?',
            languageFilter: 'english?',
            languageFilterId: 'english',
            reset: 'ruhuh',
            correct: 'kessa',
            incorrect: 'lugon!',
            incomplete: 'daor!',
            yep: 'morghe',
            nope: 'daor',
            correctInd: 'Morghe!',
            incorrectInd: 'Sigligon',
            noCharactersMessage: 'Ruh-roh! Konīr issi riña kesīr...'
          },
          languageFilter = dh.parseUrl();
      if ((lang || languageFilter.language) === 'highValyrian') {
        return highValyrian;
      } else {
        return english;
      }
    };

    dh.characters = dh.initCharacters();

    window.language = dh.initLanguages();
    window.Characters = dh;
})();
