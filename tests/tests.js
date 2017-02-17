QUnit.test("Sequence Matching(checkInput(),input())", function(assert) {
  GAME.setupGame();
  var copySequence = GAME.sequence.slice(0);
  assert.ok(GAME.checkInput(copySequence),"Validates correct input sequences.");
  var wrongInput =  (copySequence[1] == "blue") ? "red" : "blue";
  copySequence[1] = wrongInput;
  assert.notOk(GAME.checkInput(copySequence), "Rejects invalid sequences");
  copySequence[1] = GAME.sequence[1];
  assert.ok(GAME.input(copySequence[0]),"Accepts correct input");
  assert.equal(GAME.playerLevel, 2, "Increases player level");
  assert.equal(GAME.playerSequence.length, 1, "Adds to current player sequnce.");
  assert.notOk(GAME.input(wrongInput),"Rejects incorrect input.");
  var allValid = true;
  GAME.playerSequence = [];
  GAME.playerLevel = 1;
  for (var i = 0; i < copySequence.length; i++) {
    if (!GAME.input(copySequence[i])) {
      allValid = false;
      break;
    }
  }
  assert.ok(allValid,"Can validate a whole game");
});
