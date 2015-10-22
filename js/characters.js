(function() {
    var dh = {};

    dh.chooseDog = function(dogId) {
    	var dog = dh.getDog(dogId);
    	if (dog)	{
    		dog.chosen = 'dog';
    		dh.storeCharacters(dh.characters);
    	}
    };

    dh.chooseNotDog = function(dogId) {
    	var dog = dh.getDog(dogId);
    	if (dog)	{
    		dog.chosen = 'not dog';
    		dh.storeCharacters(dh.characters);
    	}
    };

    dh.getDog = function(dogId) {
    	var dog;
    	dh.characters.forEach(function(val) {
    		if (val.id === dogId) {
    			dog = val;
    		}
    	});
    	return dog;
    };

    dh.isMaybeDog = function(dog) {
    	return !dog.chosen ||
    		(dog.isDog && dog.chosen !== 'dog') ||
    		(!dog.isDog && dog.chosen !== 'not dog');
    };

    dh.isRightDog = function(dog) {
    	return dog.isDog && dog.chosen === 'dog';
    };

    dh.isRightNotDog = function(dog) {
    	return !dog.isDog && dog.chosen === 'not dog';
    };

    dh.getNumberOfCharacters = function() {
      var dogWidth = 320,
          charactersPadding = 80;
      return Math.floor((window.innerWidth - charactersPadding) / dogWidth) * 2;
    };

    dh.getPaginatedCharacters = function(characters) {
      var params = Characters.parseUrl(),
          dogPage = params.page || 1,
    			dogCount = dh.getNumberOfCharacters(),
    			start = (dogPage - 1) * dogCount,
    			stop = dogPage * dogCount;
      return characters.slice(start, stop);
    };

    dh.getFilteredCharacters = function(characters) {
      var params = Characters.parseUrl(),
          tempCharacters = characters;
      if(params.filter) {
    		tempCharacters = characters.filter(function(dog) {
    			switch(params.filter) {
    				case 'characters':
    					return Characters.isRightDog(dog);
    				case 'not_characters':
    					return Characters.isRightNotDog(dog);
    				case 'maybe_characters':
    					return Characters.isMaybeDog(dog);
    				default:
    					return false;
    			}
    		});
    	}
      return tempCharacters;
    };

    function Character(id, image, name, isDog, chosen) {
      this.id = id;
      this.image = image;
      this.name = name;
      this.isDog = isDog;
      this.chosen = chosen;
      this.isCorrect = function() {
        return (this.chosen === 'dog' && this.isDog) ||
      		(this.chosen === 'not dog' && !this.isDog);
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
          val.image, val.name, val.isDog, val.chosen));
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
      $.each(characters, function(ix, dog) {
        if (dog.chosen) {
          incomplete--;
          if (dog.isCorrect()) {
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
            yep: 'Dog',
            nope: 'Not',
            correctInd: 'Correct!',
            incorrectInd: 'Try Again!',
            noCharactersMessage: 'Sorry! There are no characters here...'
          },
          highValyrian = {
            langId: 'highValyrian',
            siteTitle: 'Morghot iā Daor?',
            charactersFilter: 'doar',
            notCharactersFilter: 'ni doar',
            incompleteFilter: 'doar?',
            languageFilter: 'english?',
            languageFilterId: 'english',
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
