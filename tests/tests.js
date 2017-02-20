function getWrongColor(color) {
  return (color == "blue") ? "red" : "blue";
}

QUnit.test("Sequence matching", function(assert) {
  GAME.setupGame();
  var copySequence = GAME.sequence.slice(0);
  assert.ok(GAME.checkInput(copySequence),"Validates correct input sequences.");
  var wrongInput =  getWrongColor(copySequence[1])
  copySequence[1] = wrongInput;
  assert.notOk(GAME.checkInput(copySequence), "Rejects invalid sequences");
});

QUnit.test("Sequence/Level mechanics", function(assert) {
  GAME.setupGame();
  assert.equal(GAME.sequence.length, 20, "Twenty colors in sequence queue");
  assert.equal(GAME.playerLevel, 1, "Player level starts at 1");
  assert.notOk(GAME.strictMode, "Strict mode is off by default");
  assert.ok(GAME.input(GAME.sequence[0]), "Accepts a single correct input");
  assert.equal(GAME.playerLevel, 2, "Player level increases properly.");
  assert.equal(GAME.playerSequence.length, 0, "Player entries update properly.");

  var wrong = GAME.input(getWrongColor(GAME.sequence[0]));
  assert.notOk(wrong,"Fails on a single incorrect input");
  assert.equal(GAME.playerSequence.length, 0, "Player sequence resets on failure.");
  assert.equal(GAME.playerLevel, 2, "Player level is unchanged on failure.")
  GAME.strictMode = true;
  var initialSequence = GAME.sequence;
  console.log(initialSequence);
  GAME.input(getWrongColor(GAME.sequence[0]));
  console.log(GAME.sequence);
  assert.notEqual(GAME.sequence,initialSequence, "New colors generated on fail"
  + " in strict mode.");
  assert.equal(GAME.playerLevel, 1, "Player level resets on strict mode fail.");
  var allValid = true;
  GAME.setupGame();
  GAME.playerLevel = 20;
  for (var i = 0; i < GAME.sequence.length; i++) {
    if (!GAME.input(GAME.sequence[i])) {
      allValid = false;
      console.log("Invalid: "+GAME.sequence[i]);
      break;
    }
  }
  assert.ok(allValid,"Can validate a whole game");
});

QUnit.test("Color button input", function(assert) {
  GAME.setupGame();
  GAME.pauseInput = true;
  var correct = GAME.sequence[0];
  assert.notOk(GAME.colorInput(correct), "Ignores input while paused.");
  GAME.playerSequence = [];
  GAME.pauseInput = false;
  assert.ok(GAME.colorInput(correct), "Calls succeeed() correctly");
  var wrongInput =  getWrongColor(GAME.sequence[1]);
  assert.notOk(GAME.colorInput(wrongInput),"Calls failure() correctly");
});
