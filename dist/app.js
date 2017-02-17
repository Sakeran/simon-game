"use strict";var GAME={colors:["green","red","blue","yellow"],pauseInput:true,// Basic Game Logic
setupGame:function setupGame(){var strictMode=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;// Resets the game object and initializes a new game.
this.strictMode=strictMode;this.sequence=[];for(var i=0;i<20;i++){var newColor=this.colors[Math.floor(Math.random()*this.colors.length)];this.sequence.push(newColor)}this.playerLevel=1;this.playerSequence=[];this.pauseInput=false;this.setLevelField();this.setStrictField()},checkInput:function checkInput(inputArray){// Checks that the input array matches the current sequence up to
// its length. Returns true if it matches, else returns false.
for(var i=0,len=inputArray.length;i<len;i++){if(inputArray[i]===this.sequence[i]){continue}return false}return true},input:function input(color){// Validates input before adding it on to (a copy of) the user sequence.
// Then checks the input against the current game sequence.
// Updates the playerLevel and playerSequence if it matches, otherwise
// returns false.
if(!this.colors.includes(color)){return false}var newSeq=this.playerSequence.slice(0);newSeq.push(color);if(this.checkInput(newSeq)){this.playerLevel++;this.playerSequence=newSeq;return true}return false},// Game/DOM Interface
init:function init(){// Captures relevant DOM elements, and sets up listeners.
var colorButtons=document.querySelectorAll(".button");for(var i=0,len=colorButtons.length;i<len;i++){var btn=colorButtons[i];btn.addEventListener("mousedown",this.colorInput.bind(this,btn.id))}},setLevelField:function setLevelField(){var level=this.playerLevel||0;document.querySelector("#info-level").innerHTML=level},setStrictField:function setStrictField(){var res="Strict Mode "+(this.strictMode?"On":"Off");document.querySelector("#info-strict").innerHTML=res},// Input Handling
colorInput:function colorInput(input){// Don't allow input if the game is currently paused.
if(this.pauseInput){return}console.log(input);var correct=this.input(input);// If the result was valid (correct), call inputSucceed()
// Otherwise, play the failure sound and call inputFail()
if(correct){this.inputSucceed(input)}else{this.inputFail()}},inputSucceed:function inputSucceed(input){// Play the sound effect corresponding to the button pressed.
console.log("Correct! Sound effect for "+input+" goes here.");// If the user's input array is as long as the entire sequence (20),
// display a win message and reset the game.
var userLen=this.playerSequence.length;if(userLen==20){console.log("You win! Win sequence goes here.");return}// If the user's input array is as long as the current level, clear the
// input array, increase the level by one, and play the pattern animation
// out.
if(userLen==this.playerLevel){console.log("You beat this level! Increasing the level...");this.playerLevel++;this.playerSequence=[];console.log("Playing the level animation.")}// Otherwise, do nothing else and wait for more input.
},inputFail:function inputFail(){// Play the failure sound effect. If in strict mode, reset the game.
// Otherwise, play the pattern animation up to the current level and reset
// the user's input array.
console.log("Failure!");if(this.strictMode){console.log("You are in strict mode! Resetting the game.");return}else{console.log("You got it wrong! Replaying the level animation.");this.playerSequence=[]}},// Sound and animation
animateButton:function animateButton(color){// Plays the activation animation for the button of the given color.
var target=document.querySelector("."+color);if(!target){return}var baseClasses="button "+color;var classes=target.getAttribute("class").split(" ");if(!classes.includes("active")){classes.push("active")}else{// If the class is already set, remove it before doing anything else
target.setAttribute("class",baseClasses)}target.setAttribute("class",classes.join(" "));// Clear the "active" class after a short interval.
setTimeout(function(){target.setAttribute("class",baseClasses)},600)},playSequence:function playSequence(level){// Animates each button in the game sequence, up to the level specified.
// Plays the entire animation if no level is given.
// Returns a promise that resolves after each step of the animation has
// played.
var sequence=this.sequence;level=level||sequence.length}};GAME.init();GAME.setupGame();
