// The xmlhttprequest package is a wrapper which makes it easy to use the same
// XMLHttpRequest objects whether you are running in the node environment or in
// a real browser.
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const HANGMAN_API_BASE_URL = "http://int-sys.usr.space/hangman/games";
const HANGMAN_API_GUESSES_PATH = "/guesses";

var HangmanApi = {};

HangmanApi.startGame = function(email) {
  // Make HTTP POST to the url, with 'email' post content.
  // Use synchronous requests for the moment. Promises could also work here.
  var request = new XMLHttpRequest();
  request.responseType = 'json';
  request.open("POST", HANGMAN_API_BASE_URL, false);
  request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  request.send(`email=${encodeURIComponent(email)}`);

  var response = JSON.parse(request.responseText);
  return {
    gameId: response.gameId,
    word: response.word,
    guessesLeft: response.guessesLeft
  };
};

HangmanApi.getGameStatus = function(gameId) {
  // Make HTTP GET to the url, with /${gameId} appended.
  var request = new XMLHttpRequest();
  request.responseType = 'json';
  request.open("GET", `${HANGMAN_API_BASE_URL}/${gameId}`, false);
  request.send();

  var response = JSON.parse(request.responseText);
  return {
    gameId: response.gameId,
    word: response.word,
    guessesLeft: response.guessesLeft,
    active: response.active
  };
};

HangmanApi.guessLetter = function(gameId, letter) {
  // Make HTTP POST to the url, with /${gameId}/guesses appended, and a data
  // field of 'char' with the value of ${letter}.
  var request = new XMLHttpRequest();
  request.responseType = 'json';
  request.open(
    "POST",
    `${HANGMAN_API_BASE_URL}/${gameId}${HANGMAN_API_GUESSES_PATH}`,
    false);
  request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  request.send(`char=${encodeURIComponent(letter)}`);

  var response = JSON.parse(request.responseText);

  return {
    gameId: response.gameId,
    word: response.word,
    guessesLeft: response.guessesLeft,
    active: response.active,
    msg: response.msg
  };
};

module.exports = HangmanApi;
