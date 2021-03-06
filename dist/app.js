"use strict";var GAME={colors:["green","red","blue","yellow"],started:false,pauseInput:true,gameSounds:{loaded:false,loading:false},animationId:-1,resetting:false,touchTimeout:false,// Basic Game Logic
setupGame:function setupGame(){// Resets the game object and initializes a new game.
this.sequence=[];for(var i=0;i<20;i++){var newColor=this.colors[Math.floor(Math.random()*this.colors.length)];this.sequence.push(newColor)}this.playerLevel=1;this.playerSequence=[];this.pauseInput=true;this.playCurrentLevel()},startGame:function startGame(){// Starts the game for the first time.
this.started=true;this.setMainBtn("Loading...");var game=this;this.initSounds().then(function(){game.setMainBtn("Reset");game.setupGame()})},resetGame:function resetGame(){// Pause for 1.5 seconds before starting a new game.
this.pauseInput=true;this.resetting=true;this.animationId=-1;this.setMainBtn("Loading...");setTimeout(function(){this.setupGame();this.setMainBtn("Reset");this.resetting=false}.bind(this),1500)},playCurrentLevel:function playCurrentLevel(){// Sets pauseInput to true while the current level sequence plays,
// then sets it back to false to allow input.
// Should also set the UI components at this stage.
this.setLevelField();this.setStrictField();this.pauseInput=true;// Wait 1.5 seconds before beginning the animation.
setTimeout(function(){this.playSequence(this.playerLevel).then(function(){this.pauseInput=false}.bind(this))}.bind(this),1500)},checkInput:function checkInput(inputArray){// Checks that the input array matches the current sequence up to
// its length. Returns true if it matches, else returns false.
for(var i=0,len=inputArray.length;i<len;i++){if(inputArray[i]===this.sequence[i]){continue}return false}return true},resetPlayerInput:function resetPlayerInput(){// Clears the player's input array.
this.playerSequence=[]},input:function input(color){// Validate input before adding it on to (a copy of) the user sequence.
// Then checks the input against the current game sequence, and updates
// the game state according to whether the input was valid or not.
// Returns true if the input was correct/valid, or false if it was not.
if(this.colors.indexOf(color)==-1){throw new Error("Tried to input an invalid color: "+color);return}var newSeq=this.playerSequence.slice(0);newSeq.push(color);if(this.checkInput(newSeq)){// The input was correct. Check to see how long the user's input array is.
// If it is as long as the current player level, increase player level.
this.playerSequence=newSeq;if(this.playerSequence.length>=this.playerLevel){this.increasePlayerLevel()}return true}else{// The input was not correct. Call the functionality to determine the
// game's fail state.
this.doFailureState();return false}},increasePlayerLevel:function increasePlayerLevel(){// Increases the player level by one.
// Calls a victory state and resets the game if the level has
// reached twenty.
this.playerLevel++;this.resetPlayerInput();if(this.playerLevel>=20){this.setupGame();return}this.playCurrentLevel()},doFailureState:function doFailureState(){// Determine the penalty for an incorrect input. If strict mode is on,
// reset the game entirely. Otherwise, just clear the player's input
// array.
if(this.strictMode){this.resetGame();return}this.resetPlayerInput();this.playCurrentLevel()},// Game/DOM Interface
init:function init(){// Captures relevant DOM elements, and sets up listeners.
var colorButtons=document.querySelectorAll(".button");for(var i=0,len=colorButtons.length;i<len;i++){var btn=colorButtons[i];btn.addEventListener("touchstart",this.handleColorInput.bind(this,btn.id,true));btn.addEventListener("mousedown",this.handleColorInput.bind(this,btn.id))}var mainBtn=document.querySelector("#info-main-btn");mainBtn.addEventListener("click",this.handleMainBtn.bind(this));var strictBtn=document.querySelector("#info-strict");strictBtn.addEventListener("click",this.handleStrictBtn.bind(this))},initSounds:function initSounds(){// Loads in the game's sound effects.
// Retuns a promise that resolves when all sounds have loaded.
if(this.gameSounds.loaded||this.gameSounds.loading){return}if(typeof Howl!="function"){return Promise.reject(new Error("Sound effects require Howler.js to be loaded"))}var sounds=this.colors.concat("wrong");var srcs={green:"assets/sounds/NFF-good-tip-high",red:"assets/sounds/NFF-good-tip-low",yellow:"assets/sounds/NFF-good-tip-high-2",blue:"assets/sounds/NFF-good-tip-low-2",wrong:"assets/sounds/NFF-wrong"};for(var src in srcs){if(srcs.hasOwnProperty(src)){var paths=[srcs[src]+".mp3",srcs[src]+".ogg"];this.gameSounds[src]=new Howl({src:paths})}}this.gameSounds.loading=true;var promises=[];var game=this;var _loop=function _loop(i,len){promises.push(new Promise(function(resolve,reject){game.gameSounds[sounds[i]].once("load",function(){resolve(true)})}))};for(var i=0,len=sounds.length;i<len;i++){_loop(i,len)}return new Promise(function(resolve,reject){Promise.all(promises).then(function(){game.gameSounds.loading=false;game.gameSounds.loaded=true;resolve(true)})})},setMainBtn:function setMainBtn(msg){document.querySelector("#info-main-btn").innerHTML=msg},setLevelField:function setLevelField(){var level=this.playerLevel||0;document.querySelector("#info-level").innerHTML=level},setStrictField:function setStrictField(){var res="Strict Mode "+(this.strictMode?"On":"Off");document.querySelector("#info-strict").innerHTML=res},// Input Handling
handleMainBtn:function handleMainBtn(){// If the game has not been started yet, load in the game sounds
// and start the game.
if(!this.started){this.startGame()}else{if(this.resetting){return}this.resetGame()}},handleStrictBtn:function handleStrictBtn(){this.strictMode=!this.strictMode;var btn=document.querySelector("#info-strict");var classes=this.strictMode?"strict":"";var msg="Strict Mode ";msg+=this.strictMode?"On":"Off";btn.innerHTML=msg;btn.setAttribute("class",classes)},handleColorInput:function handleColorInput(input,isTouch){// Don't allow input if the game is currently paused.
// Returns true if the input was sucessful.
if(this.pauseInput||this.touchTimeout){return false}// If the event was a touchstart, prevent further color button inputs
// for a short time, to prevent accidental double inputs on sensitve
// screens that might lead to accidental player loss.
if(isTouch){this.touchTimeout=true;setTimeout(function(){this.touchTimeout=false}.bind(this),300)}this.animateButton(input);var correct=this.input(input);// If the result was valid (correct), call inputSucceed()
// Otherwise, play the failure sound and call inputFail()
if(correct){this.inputSucceed(input);return true}else{this.inputFail();return false}},inputSucceed:function inputSucceed(input){// Play the sound effect corresponding to the button pressed.
this.playSound(input)},inputFail:function inputFail(){// Play the failure sound effect.
this.playSound("wrong")},// Sound and animation
animateButton:function animateButton(color){// Plays the activation animation for the button of the given color.
// Returns a promise that resolves after the animation has played out
var target=document.querySelector("."+color);if(!target){return}var baseClasses="button "+color;var classes=target.getAttribute("class").split(" ");if(classes.indexOf("active")==-1){classes.push("active")}else{// If the class is already set, we'll want to restart the animation.
// Since we're using CSS keyframes for this, this means removing the
// target entirely and replacing it with a clone.
var newTarget=target.cloneNode(true);newTarget.setAttribute("class",baseClasses);newTarget.addEventListener("mousedown",this.handleColorInput.bind(this,target.id));target.parentNode.replaceChild(newTarget,target);target=newTarget}target.setAttribute("class",classes.join(" "));return new Promise(function(resolve,reject){// Clear the "active" class after a short interval.
setTimeout(function(){if(target.getAttribute("class")!=baseClasses){target.setAttribute("class",baseClasses)}resolve(true)},600)})},playSequence:function playSequence(level,speed){// Animates each button in the game sequence, up to the level specified.
// Plays the entire animation if no level is given.
// Returns a promise that resolves after each step of the animation has
// played.
// Speed parameter is given in seconds, and converted to ms.
var sequence=this.sequence;level=level||sequence.length;speed=Math.floor(speed*1000)||1000;var game=this;var animations=[];var animId=Math.floor(Math.random()*10000);this.animationId=animId;var _loop2=function _loop2(i){animations.push(new Promise(function(resolve,reject){setTimeout(function(){// If the animation id has changed (thanks to a reset, etc),
// don't play the animation.
if(game.animationId!=animId){resolve(false);return}game.playSound(sequence[i]);game.animateButton(sequence[i]).then(function(){resolve()})},speed*i)}))};for(var i=0;i<level;i++){_loop2(i)}var res=Promise.all(animations);return res},playSound:function playSound(sound){if(this.gameSounds.hasOwnProperty(sound)){// Play the given sound.
var curSound=this.gameSounds[sound];curSound.currentTime=0;curSound.play()}}};GAME.init();// GAME.setupGame();
