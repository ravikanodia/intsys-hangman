
var GameState = function(props) {

  var that = {
    // Properties defined by server responses
    gameId: props.gameId,
    word: props.word,
    guessesLeft: props.guessesLeft,
    active: props.active,
    msg: props.active,

    // Properties tracked locally
    lettersToGuess: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  };

  that.update = function(state) {
    var props = ['gameId', 'word', 'guessesLeft', 'active', 'msg'];
    for (var i in props) {
      if (state.hasOwnProperty(props[i])) {
        that[props[i]] = state[props[i]];
      }
    }
  };

  that.isGameWon = function() {
    return that.word.indexOf('_') == -1;
  };

  that.isGameLost = function() {
    return that.guessesLeft == 0 && !that.isGameWon();
  };

  that.removeLetter = function(letter) {
    var index = that.lettersToGuess.indexOf(letter);
    if (index == -1) {
      throw new Error(`Can't remove letter ${letter}; remaining letters are ${that.lettersToGuess}`);
    }
    that.lettersToGuess = that.lettersToGuess.slice(0, index) +
      that.lettersToGuess.slice(index + 1, that.lettersToGuess.length);
  };

  that.canGuessLetter = function(letter) {
    return that.lettersToGuess.indexOf(letter) != -1;
  };

  return that;
}


module.exports = GameState;
