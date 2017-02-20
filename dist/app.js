"use strict";var GAME={colors:["green","red","blue","yellow"],pauseInput:true,gameWin:false,gameLoss:false,// Basic Game Logic
setupGame:function setupGame(){var strictMode=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;// Resets the game object and initializes a new game.
this.strictMode=this.strictMode||strictMode;this.sequence=[];for(var i=0;i<20;i++){var newColor=this.colors[Math.floor(Math.random()*this.colors.length)];this.sequence.push(newColor)}this.gameWin=false;this.gameLoss=false;this.playerLevel=1;this.playerSequence=[];this.pauseInput=false;this.setLevelField();this.setStrictField()},checkInput:function checkInput(inputArray){// Checks that the input array matches the current sequence up to
// its length. Returns true if it matches, else returns false.
for(var i=0,len=inputArray.length;i<len;i++){if(inputArray[i]===this.sequence[i]){continue}return false}return true},resetPlayerInput:function resetPlayerInput(){// Clears the player's input array.
this.playerSequence=[]},input:function input(color){// Validate input before adding it on to (a copy of) the user sequence.
// Then checks the input against the current game sequence, and updates
// the game state according to whether the input was valid or not.
// Returns true if the input was correct/valid, or false if it was not.
if(!this.colors.includes(color)){throw new Error("Tried to input an invalid color: "+color);return}var newSeq=this.playerSequence.slice(0);newSeq.push(color);if(this.checkInput(newSeq)){// The input was correct. Check to see how long the user's input array is.
// If it is as long as the current player level, increase player level.
this.playerSequence=newSeq;if(this.playerSequence.length>=this.playerLevel){console.log("Increasing level");this.increasePlayerLevel()}return true}else{// The input was not correct. Call the functionality to determine the
// game's fail state.
this.doFailureState();return false}},increasePlayerLevel:function increasePlayerLevel(){// Increases the player level by one.
// Calls a victory state and resets the game if the level has
// reached twenty.
this.playerLevel++;this.resetPlayerInput();if(this.playerLevel>=20){console.log("You win! Resetting the game.");this.gameWin=true}},doFailureState:function doFailureState(){// Determine the penalty for an incorrect input. If strict mode is on,
// reset the game entirely. Otherwise, just clear the player's input
// array.
if(this.strictMode){this.setupGame();return}this.resetPlayerInput()},// Game/DOM Interface
init:function init(){// Captures relevant DOM elements, and sets up listeners.
var colorButtons=document.querySelectorAll(".button");for(var i=0,len=colorButtons.length;i<len;i++){var btn=colorButtons[i];btn.addEventListener("mousedown",this.colorInput.bind(this,btn.id))}},setLevelField:function setLevelField(){var level=this.playerLevel||0;document.querySelector("#info-level").innerHTML=level},setStrictField:function setStrictField(){var res="Strict Mode "+(this.strictMode?"On":"Off");document.querySelector("#info-strict").innerHTML=res},// Input Handling
colorInput:function colorInput(input){// Don't allow input if the game is currently paused.
// Returns true if the input was sucessful.
if(this.pauseInput){return false}this.animateButton(input);console.log(input);var correct=this.input(input);// If the result was valid (correct), call inputSucceed()
// Otherwise, play the failure sound and call inputFail()
if(correct){this.inputSucceed(input);return true}else{this.inputFail();return false}},inputSucceed:function inputSucceed(input){// Play the sound effect corresponding to the button pressed.
console.log("Correct! Sound effect for "+input+" goes here.")},inputFail:function inputFail(){// Play the failure sound effect.
console.log("Failure! Sound effect for failure goes here.")},// Sound and animation
animateButton:function animateButton(color){// Plays the activation animation for the button of the given color.
var target=document.querySelector("."+color);if(!target){return}var baseClasses="button "+color;var classes=target.getAttribute("class").split(" ");if(!classes.includes("active")){classes.push("active")}else{// If the class is already set, we'll want to restart the animation.
// Since we're using CSS keyframes for this, this means removing the
// target entirely and replacing it with a clone.
var newTarget=target.cloneNode(true);newTarget.setAttribute("class",baseClasses);newTarget.addEventListener("mousedown",this.colorInput.bind(this,target.id));target.parentNode.replaceChild(newTarget,target);target=newTarget}target.setAttribute("class",classes.join(" "));// Clear the "active" class after a short interval.
setTimeout(function(){if(target.getAttribute("class")==baseClasses){return}target.setAttribute("class",baseClasses)},600)},playSequence:function playSequence(level){// Animates each button in the game sequence, up to the level specified.
// Plays the entire animation if no level is given.
// Returns a promise that resolves after each step of the animation has
// played.
var sequence=this.sequence;level=level||sequence.length}};GAME.init();GAME.setupGame();
