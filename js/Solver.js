var _ = require('underscore');
var HangmanApi = require('./HangmanApi');
var GameState = require('./GameState');

var gameState = GameState(
  HangmanApi.startGame('ravileonkanodia@gmail.com')
);

// Based on http://www.datagenetics.com/blog/april12012/
const firstLetterCallingOrderBySize = [
  "AI",
  "AOEIUMBH",
  "AEOIUYHBCK",
  "AEOIUYSBF",
  "SEAOIUYH",
  "EAIOUSY",
  "EIAOUS",
  "EIAOU",
  "EIAOU",
  "EIAOU",
  "EIAOD",
  "EIOAF",
  "IEOA",
  "IEO",
  "IEA",
  "IEH",
  "IER",
  "IEA",
  "IEA",
  "IE"
];

// Regex heuristics that suggest a letter based on an existing pattern.
const wordHeuristics = [
  [/IT_$/i, "Y"],
  [/IL_$/i, "Y"],
  [/IN_$/i, "G"],
  [/ALL_$/i, "Y"],
  [/DL_$/i, "Y"],
  [/C_$/i, "K"],
  [/ON_$/i, "G"],
  [/H_P/i, "Y"],
  [/N_M/i, "Y"],
  [/Q_/i, "U"] // Not sure how we'd have Q before U is picked but hey why not.
];

function chooseNextLetter(gameState) {
  // Initial letter
  if (_.every(gameState.word, letter => letter == '_')) {
    var index = Math.min(gameState.word.length, firstLetterCallingOrderBySize.length - 1);
    var callingOrder = firstLetterCallingOrderBySize[index];
    var firstLetterGuess = _.find(callingOrder, letter => gameState.canGuessLetter(letter));
    if (firstLetterGuess) {
      return firstLetterGuess;
    }
  }

  // Check heuristics for ideas.
  var heuristic = _.find(wordHeuristics, rule => {
    return rule[0].test(gameState.word) && gameState.canGuessLetter(rule[1]) });
  if (heuristic) {
    return heuristic[1];
  }

  // Frequency of appearance in dictionary words, according to Wikipedia.
  // Note that this approach does not take into consideration the results
  // from the server.
  var frequencyOrder = "EARIOTNSLCUDPMHGBFYWKVXZJQ";
  var frequencyGuess = _.find(frequencyOrder, letter => gameState.canGuessLetter(letter));
  if (!frequencyGuess) {
    throw new Error("All letters have been chosen already!");
  }

  return frequencyGuess;
}

while (true) {
  if (gameState.isGameWon()) {
    console.log(`Solved! word is: ${gameState.word}`);
    break;
  } else if (gameState.isGameLost()) {
    console.log(`Lost! Ran out of guesses, and all we have is ${gameState.word}`);
    break;
  } else {
    console.log(`Word: ${gameState.word}; letters: ${gameState.lettersToGuess} (${gameState.guessesLeft} remaining)`);
    var letterToGuess = chooseNextLetter(gameState);
    gameState.update(HangmanApi.guessLetter(gameState.gameId, letterToGuess));
    gameState.removeLetter(letterToGuess);

    console.log(`Server message: ${gameState.msg}`);
  }
}
