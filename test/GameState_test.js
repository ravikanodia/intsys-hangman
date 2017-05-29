const GameState = require('../js/GameState');

describe('GameState', function() {
  var gameState;
  beforeEach(function() {
    gameState = GameState({
      gameId: "TEST_GAME_ID",
      word: "______",
      guessesLeft: 10,
      active: true,
      msg: "TEST_MSG"
    });
  });

  it('Holds state responses', function(done) {
    gameState.gameId.should.equal("TEST_GAME_ID");
    gameState.guessesLeft.should.equal(10);
    done();
  });

  it('Tells when the game is won', function(done) {
    gameState.isGameWon().should.equal(false);

    gameState.word = "KANGAROO";
    gameState.isGameWon().should.equal(true);

    done();
  });

  it('Tells when the game is lost', function(done) {
    gameState.isGameLost().should.equal(false);

    gameState.guessesLeft = 0;
    gameState.isGameLost().should.equal(true);

    done();
  });

  it('Should not say the game is lost and won', function(done) {
    gameState.word = 'KANGAROO';
    gameState.guessesLeft = 0;
    gameState.isGameWon().should.equal(true);
    gameState.isGameLost().should.equal(false);
    done();
  });

  it('Starts with all letters available', function(done) {
    gameState.lettersToGuess.should.equal('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    done();
  });

  it('Removes letters that are guessed', function(done) {
    gameState.removeLetter('C');
    gameState.removeLetter('G');
    gameState.removeLetter('Z');
    gameState.lettersToGuess.should.equal('ABDEFHIJKLMNOPQRSTUVWXY');

    done();
  });

  it('Lets you know if you remove the same letter twice', function(done) {
    gameState.removeLetter('C');
    try {
      gameState.removeLetter('C');
    } catch (err) {
      done();
    }

    throw new Error("expected removeLetter to throw");
  });
});
