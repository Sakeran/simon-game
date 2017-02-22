"use strict";var GAME={colors:["green","red","blue","yellow"],started:false,pauseInput:true,gameSounds:{loaded:false,loading:false},// Basic Game Logic
setupGame:function setupGame(){// Resets the game object and initializes a new game.
this.sequence=[];for(var i=0;i<20;i++){var newColor=this.colors[Math.floor(Math.random()*this.colors.length)];this.sequence.push(newColor)}this.playerLevel=1;this.playerSequence=[];this.pauseInput=true;this.playCurrentLevel()},playCurrentLevel:function playCurrentLevel(){// Sets pauseInput to true while the current level sequence plays,
// then sets it back to false to allow input.
// Should also set the UI components at this stage.
this.setLevelField();this.setStrictField();this.pauseInput=true;// Wait one second before beginning the animation.
setTimeout(function(){this.playSequence(this.playerLevel).then(function(){this.pauseInput=false}.bind(this))}.bind(this),1000)},checkInput:function checkInput(inputArray){// Checks that the input array matches the current sequence up to
// its length. Returns true if it matches, else returns false.
for(var i=0,len=inputArray.length;i<len;i++){if(inputArray[i]===this.sequence[i]){continue}return false}return true},resetPlayerInput:function resetPlayerInput(){// Clears the player's input array.
this.playerSequence=[]},input:function input(color){// Validate input before adding it on to (a copy of) the user sequence.
// Then checks the input against the current game sequence, and updates
// the game state according to whether the input was valid or not.
// Returns true if the input was correct/valid, or false if it was not.
if(this.colors.indexOf(color)==-1){throw new Error("Tried to input an invalid color: "+color);return}var newSeq=this.playerSequence.slice(0);newSeq.push(color);if(this.checkInput(newSeq)){// The input was correct. Check to see how long the user's input array is.
// If it is as long as the current player level, increase player level.
this.playerSequence=newSeq;if(this.playerSequence.length>=this.playerLevel){console.log("Increasing level");this.increasePlayerLevel()}return true}else{// The input was not correct. Call the functionality to determine the
// game's fail state.
this.doFailureState();return false}},increasePlayerLevel:function increasePlayerLevel(){// Increases the player level by one.
// Calls a victory state and resets the game if the level has
// reached twenty.
this.playerLevel++;this.resetPlayerInput();if(this.playerLevel>=20){console.log("You win! Resetting the game.");this.setupGame();return}this.playCurrentLevel()},doFailureState:function doFailureState(){// Determine the penalty for an incorrect input. If strict mode is on,
// reset the game entirely. Otherwise, just clear the player's input
// array.
if(this.strictMode){this.setupGame();return}this.resetPlayerInput();this.playCurrentLevel()},// Game/DOM Interface
init:function init(){// Captures relevant DOM elements, and sets up listeners.
var colorButtons=document.querySelectorAll(".button");for(var i=0,len=colorButtons.length;i<len;i++){var btn=colorButtons[i];btn.addEventListener("touchstart",this.handleColorInput.bind(this,btn.id));btn.addEventListener("mousedown",this.handleColorInput.bind(this,btn.id))}var mainBtn=document.querySelector("#info-main-btn");mainBtn.addEventListener("click",this.handleMainBtn.bind(this))},initSounds:function initSounds(){// Loads in the game's sound effects.
// Retuns a promise that resolves when all sounds have loaded.
if(this.gameSounds.loaded||this.gameSounds.loading){return}var sounds=this.colors.concat("wrong");var srcs={green:"assets/sounds/NFF-good-tip-high.wav",red:"assets/sounds/NFF-good-tip-low.wav",yellow:"assets/sounds/NFF-good-tip-high-2.wav",blue:"assets/sounds/NFF-good-tip-low-2.wav",wrong:"assets/sounds/NFF-wrong.wav"};this.gameSounds.green=new Audio;this.gameSounds.red=new Audio;this.gameSounds.yellow=new Audio;this.gameSounds.blue=new Audio;this.gameSounds.wrong=new Audio;this.gameSounds.loading=true;var promises=[];var game=this;var _loop=function _loop(i,len){promises.push(new Promise(function(resolve,reject){game.gameSounds[sounds[i]].oncanplaythrough=function(){resolve(true)};game.gameSounds[sounds[i]].play();game.gameSounds[sounds[i]].src=srcs[sounds[i]]}))};for(var i=0,len=sounds.length;i<len;i++){_loop(i,len)}return new Promise(function(resolve,reject){Promise.all(promises).then(function(){game.gameSounds.loading=false;game.gameSounds.loaded=true;resolve(true)})})},setMainBtn:function setMainBtn(msg){document.querySelector("#info-main-btn").innerHTML=msg},setLevelField:function setLevelField(){var level=this.playerLevel||0;document.querySelector("#info-level").innerHTML=level},setStrictField:function setStrictField(){var res="Strict Mode "+(this.strictMode?"On":"Off");document.querySelector("#info-strict").innerHTML=res},// Input Handling
handleMainBtn:function handleMainBtn(){// If the game has not been started yet, load in the game sounds
// and start the game.
if(!this.started){this.started=true;this.setMainBtn("Loading...");var game=this;this.initSounds().then(function(){game.setMainBtn("Reset");game.setupGame()})}else{// Reset the game.
this.setupGame()}},handleColorInput:function handleColorInput(input){// Don't allow input if the game is currently paused.
// Returns true if the input was sucessful.
if(this.pauseInput){return false}this.animateButton(input);console.log(input);var correct=this.input(input);// If the result was valid (correct), call inputSucceed()
// Otherwise, play the failure sound and call inputFail()
if(correct){this.inputSucceed(input);return true}else{this.inputFail();return false}},inputSucceed:function inputSucceed(input){// Play the sound effect corresponding to the button pressed.
console.log("Correct! Sound effect for "+input+" goes here.");this.playSound(input)},inputFail:function inputFail(){// Play the failure sound effect.
console.log("Failure! Sound effect for failure goes here.");this.playSound("wrong")},// Sound and animation
animateButton:function animateButton(color){// Plays the activation animation for the button of the given color.
// Returns a promise that resolves after the animation has played out
var target=document.querySelector("."+color);if(!target){return}var baseClasses="button "+color;var classes=target.getAttribute("class").split(" ");if(classes.indexOf("active")==-1){classes.push("active")}else{// If the class is already set, we'll want to restart the animation.
// Since we're using CSS keyframes for this, this means removing the
// target entirely and replacing it with a clone.
var newTarget=target.cloneNode(true);newTarget.setAttribute("class",baseClasses);newTarget.addEventListener("mousedown",this.handleColorInput.bind(this,target.id));target.parentNode.replaceChild(newTarget,target);target=newTarget}target.setAttribute("class",classes.join(" "));return new Promise(function(resolve,reject){// Clear the "active" class after a short interval.
setTimeout(function(){if(target.getAttribute("class")==baseClasses){return}target.setAttribute("class",baseClasses);resolve(true)},600)})},playSequence:function playSequence(level,speed){// Animates each button in the game sequence, up to the level specified.
// Plays the entire animation if no level is given.
// Returns a promise that resolves after each step of the animation has
// played.
// Speed parameter is given in seconds, and converted to ms.
var sequence=this.sequence;level=level||sequence.length;speed=Math.floor(speed*1000)||1000;var game=this;var animations=[];var _loop2=function _loop2(i){animations.push(new Promise(function(resolve,reject){setTimeout(function(){game.playSound(sequence[i]);game.animateButton(sequence[i]).then(function(){resolve()})},speed*i)}))};for(var i=0;i<level;i++){_loop2(i)}var res=Promise.all(animations);return res},playSound:function playSound(sound){if(this.gameSounds.hasOwnProperty(sound)){// Play the given sound.
var curSound=this.gameSounds[sound];if(!curSound.paused){curSound.pause()}curSound.currentTime=0;curSound.play()}}};GAME.init();// GAME.setupGame();
