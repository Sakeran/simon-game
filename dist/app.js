"use strict";var GAME={colors:["green","red","blue","yellow"],// Basic Game Logic
setupGame:function setupGame(){var strictMode=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;// Resets the game object and initializes a new game.
this.strictMode=strictMode;this.sequence=[];for(var i=0;i<20;i++){var newColor=this.colors[Math.floor(Math.random()*this.colors.length)];this.sequence.push(newColor)}this.playerLevel=1;this.playerSequence=[]},checkInput:function checkInput(inputArray){// Checks that the input array matches the current sequence up to
// its length. Returns true if it matches, else returns false.
for(var i=0,len=inputArray.length;i<len;i++){if(inputArray[i]===this.sequence[i]){continue}return false}return true},input:function input(color){// Validates input before adding it on to (a copy of) the user sequence.
// Then checks the input against the current sequence.
// Updates the playerLevel and userSequence if it matches, otherwise
// returns false.
if(!this.colors.includes(color)){return false}var newSeq=this.playerSequence.slice(0);newSeq.push(color);if(this.checkInput(newSeq)){this.playerLevel++;this.playerSequence=newSeq;return true}return false},// Game/DOM Interface
init:function init(){// Captures relevant DOM elements, and sets up listeners.
var colorButtons=document.querySelectorAll(".main-game div");for(var i=0,len=colorButtons.length;i<len;i++){var btn=colorButtons[i];btn.addEventListener("mousedown",this.colorInput.bind(this,btn.id))}},setLevelField:function setLevelField(){var level=this.playerLevel||0;document.querySelector("#info-level").innerHTML=level},setStrictField:function setStrictField(){var res="Strict Mode "+(this.strictMode?"On":"Off");document.querySelector("#info-strict").innerHTML=res},// Input Handling
colorInput:function colorInput(input){console.log(input)}};GAME.init();GAME.setupGame();
