var hangul = {
//level one
'b':'ᄇ','j':'ᄌ','d':'ᄃ','g':'ᄀ',
's':'ᄉ','m':'ᄆ','n':'ᄂ','rl':'ᄅ'
,'h':'ᄒ','k':'ᄏ','t':'ᄐ','ch':'ᄎ'
,'p':'ᄑ',
//level two
'ng':'ᄋ','oo':'ᅮ','eu':'ᅳ','yo':'ᅭ',
'yeo':'ᅧ','ya':'ᅣ','yae':'ᅤ',
'ae':'ㅐ','e':'ㅔ','o':'ㅗ','eo':'ㅓ'
,'a':'ㅏ','i':'ㅣ',
//level three
'ye':'ᅨ','yu':'ᅲ','bb':'ᄈ','jj':'ᄍ',
'dd':'ᄄ','gg':'ᄁ','ss':'ᄊ','wa':'ᅪ',
'wi':'ᅱ','wo':'ᅯ','wae':'ᅫ','oe':'ᅬ',
'we':'ᅰ','ui':'ᅴ'
};


var guess = "";
level = 0;
var hangul_keys = Object.keys(hangul);
learning_count = 0; //for learning phase
tries = 0; //counting letter attempts
letter_history = [] //record past few letters to avoid to many repeats

function determineLevel(){
  if($("#one").length){
    level = 1;
  }
  if($("#two").length){
    level = 2;
  }
  if($("#three").length){
    level = 3;
  }
}



//Once a level is successfully learnt the program proceeds to give random letters
//to test user.
function pickLetter(){
  if(level == 1){
    //fix placeholder issue
    document.querySelector('#user_submission').placeholder = "";
    
    rdm_letter = hangul_keys[Math.floor(Math.random() * (13 - 0) + 0)];
    if(letter_history.indexOf(rdm_letter) != -1){
      pickLetter(); //recursion ftw :)
    }
    else{
      letter_history.push(rdm_letter);
      manageHistory();
      document.querySelector('#letter').innerHTML = hangul[rdm_letter];
    }
    
  }
  if(level == 2){
    
    rdm_letter = hangul_keys[Math.floor(Math.random() * (26 - 13) + 13)];
    if(letter_history.indexOf(rdm_letter) != -1){
      pickLetter();
    }
    else{
      letter_history.push(rdm_letter);
      manageHistory();
      document.querySelector('#letter').innerHTML = hangul[rdm_letter];
    }
  }
  if(level == 3){
    rdm_letter = hangul_keys[Math.floor(Math.random() * (40 - 26) + 26)];
    if(letter_history.indexOf(rdm_letter) != -1){
      pickLetter();
    }
    else{
      letter_history.push(rdm_letter);
      manageHistory();
      document.querySelector('#letter').innerHTML = hangul[rdm_letter];
    }
  }
}

function initiateLearning(count){
  if(level == 1){
    //not so random here aha
    rdm_letter = hangul_keys[count];
    document.querySelector('#user_submission').placeholder = rdm_letter;
    document.querySelector('#letter').innerHTML = hangul[rdm_letter] + " = " + rdm_letter;
  }
  if(level == 2){
    count += 13;
    rdm_letter = hangul_keys[count];
    document.querySelector('#letter').innerHTML = hangul[rdm_letter] + " = " + rdm_letter;
  }
  if(level == 3){
    count += 26;
    rdm_letter = hangul_keys[count];
    document.querySelector('#letter').innerHTML = hangul[rdm_letter] + " = " + rdm_letter;
  }
}


function checkSubmission(){
  
  var user_input = document.querySelector('#user_submission');
  guess = user_input.value;
  
  //if correctly identified hangul letter
  if(hangul[rdm_letter] == hangul[guess]){
    
    //reset tries
    $("#stuck").fadeOut();
    tries = 0;
    //change color back if was incorrect
    $("#letter_submit").css("background","#9BC53D");
    //clear input
    user_input.value = "";
    
    
    if(localStorage[level] == 'practicing' || localStorage[level] == 'completed'){
      //mark as correct in localstorage for progress
      if(localStorage.getItem(hangul[rdm_letter]) !== undefined){
        localStorage.setItem(hangul[rdm_letter], level);
        getProgress();
      }
      
      
      //pick a new rdm letter and play it's audio
      pickLetter();
      playAudio();
    }
    
    // if in learning phase
    else{
      learning_count+=1;
      if(level != 3){
        words = 13;
      }
      else{
        words = 14;
      }
      worth = (100 / words) * learning_count;
      document.querySelector('.learning_bar').style.width = worth + "%";
      
      //determine if the user has learnt all words in level
      if(learning_count % words === 0){
        alert("learning complete");
        localStorage.setItem(level, 'practicing');
        pickLetter();
        playAudio();
      }
      else{
        //continue learning advancing to next letter, hence learning_count+=1;
        initiateLearning(learning_count);
        playAudio();
      }
    }
  }
  
  else{
    //if wrong change color of submit btn
    $("#letter_submit").css("background","#E55934");
    if(localStorage[level] == 'practicing' || localStorage[level] == 'completed'){
      tries+=1;
      if(tries >= 3){
        $("#stuck").fadeIn();
      }
    }
  }
  user_input.focus();
}

function getProgress(){
  progress = 0;
  if(level != 3){
    // how much each letter correct for first time affects progress bar
    worth = (100 / 13);
  }
  else{
    worth = (100 / 14);
  }
  for(var x in localStorage){
    if(localStorage[x] == level){
      progress+=worth;
    }
  }
  document.querySelector('.learning_bar').style.width = "100%";
  document.querySelector('.progress_bar').style.width = progress + "%";
  
  if(Math.round(progress) == 100){
    localStorage.setItem(level, 'completed');
  }
}

function playAudio(){
  var audio = new Audio('../audio/' + rdm_letter.toString() + '.mp3');
  audio.play();
}

function manageHistory(){
  if(letter_history.length >= 4){
    letter_history.shift();
  }
}

function setPhase(){
  if(localStorage[level] === undefined){
    localStorage.setItem(level, 'learning');
  }
}

function resetProgress(){
  localStorage.removeItem(level);
  for(var x in localStorage){
    if(localStorage[x] == level){
      localStorage.removeItem(x);
    }
  }
  setPhase();
  getProgress();
  learning_count = 0;
  initiateLearning(0);
  tries = 0;
  document.querySelector('.learning_bar').style.width = "0%";
  document.querySelector('#user_submission').focus();
  $("#stuck").fadeOut();
  
}


window.onload = function(){
  //Determine what phase the user is on a paticular level
  determineLevel();
  //if learning phase needs to be set
  setPhase();
  
  
  if(localStorage[level] == 'practicing' || localStorage[level] == 'completed'){
    pickLetter();
    getProgress();
  }
  else{
    initiateLearning(0);
  }
  
  playAudio();
  document.querySelector('#letter_submit').addEventListener('click',checkSubmission);
  document.querySelector('#stuck').addEventListener('click',resetProgress);
  document.querySelector('#reset').addEventListener('click',resetProgress);
  document.querySelector('#user_submission').focus();
  //for input field not connected to form
  document.querySelector('#user_submission').addEventListener('keypress', function(e){
    var key = e.which || e.keyCode;
    if(key === 13){
      checkSubmission();
    }
  });
};
