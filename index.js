window.onload = function(){
  if(localStorage[1] == 'completed'){
    document.querySelector("#level_one").style.background = '#9BC53D';
  }
  if(localStorage[2] == 'completed'){
    document.querySelector("#level_two").style.background = '#9BC53D';
  }
  if(localStorage[3] == 'completed'){
    document.querySelector("#level_three").style.background = '#9BC53D';
  }
}