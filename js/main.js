var debugmode = false;

var velocity = 0;
var position = 180;
var score = 0;

var enimies = new Array();

//loops
var loopGameloop;
var loopEnemyloop;
$(document).ready(function(){
    //updateEnemies();
    showSplash();
    if(window.location.search == "?debug")
      debugmode = true;
    startGame();
});


function showSplash(){
  //set the defaults (again)
   position = 180;
   score = 0;
   //make everything animated again
   $(".animated").css('animation-play-state', 'running');
   $(".animated").css('-webkit-animation-play-state', 'running');
}

function startGame(){
    //start up our loops
    if(debugmode)
   {
      //show the bounding boxes
      $(".aircraft").show();
   }
    var updaterate = 1000.0 / 60.0 ; //60 times a second
    loopGameloop = setInterval(gameloop, updaterate);
    loopEnemyloop = setInterval(updateEnemies, 700);
}

function gameloop(){
    //colision to be done
}

function updateEnemies(){
   //Do any pipes need removal?
   $(".enemy").filter(function() { return $(this).position().top >=  $(window).height() - 90; }).remove()
   var randomId = Math.floor(Math.random()*1000);
   randomId = randomId.toString();
   var newenemy = $('<div class="enemy animated" id= "'+ randomId + '" ></div>');
   //set the position of enemies randomly
   newenemy.css('top','0px');
   newenemy.css('left',Math.floor(Math.random()*($(window).width()- 48) )+'px'); 
   $("#gamecontainer").append(newenemy);
   enimies.push(newenemy);
}
//handle mouse drag
$('#player').on('mousedown', function (e) {

    $(this).addClass('active').parents().on('mousemove', function (e) {
        
        $('.active').offset({

            top: e.pageY - $('.active').outerHeight() / 2,
            left: e.pageX - $('.active').outerWidth() / 2

        }).on('mouseup', function () {

            $(this).removeClass('active');            

        });

    });
    return false;    
});




