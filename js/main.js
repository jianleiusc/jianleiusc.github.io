var debugmode = false;

var velocity = 0;
var position = 180;
var score = 0;

var enimies = new Array();


//Handle mouse event OR touch event
var isTouchSupported = 'ontouchstart' in window;
var startEvent = isTouchSupported ? 'touchstart' : 'mousedown';
var moveEvent = isTouchSupported ? 'touchmove' : 'mousemove';
var endEvent = isTouchSupported ? 'touchend' : 'mouseup'; 

//loops
var loopBulletloop;
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
    loopBulletloop = setInterval(shootbullet,200);
    loopGameloop = setInterval(gameloop, updaterate);
    loopEnemyloop = setInterval(updateEnemies, 700);
}
function shootbullet(){
   $(".bullet").filter(function() { return $(this).position().top <= 1; }).remove()
   var randomId = Math.floor(Math.random()*1000);
   randomId = randomId.toString();
   var bullet = $('<div class="bullet animated" id= "'+ randomId + '" ></div>');
   //create the bounding box
   var box = document.getElementById('player').getBoundingClientRect();
   var boxwidth = 84;
   var boxheight = 100;
   //set the position of bullet 
   
   bullet.css('top', box.top + 100 + 'px');
   bullet.css('left',boxwidth/2 + box.left - 8 + 'px');
   $("#gamecontainer").append(bullet);
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
//handle mouse drag or touch
//if(!isTouchSupported){

//    $('#player').on(startEvent, function (e) {
//
//    $(this).addClass('active').parents().on(moveEvent, function (e) {
//        
//        $('.active').offset({
//            
//            top: e.pageY - $('.active').outerHeight() / 2,
//            left: e.pageX - $('.active').outerWidth() / 2
//
//        }).on(endEvent, function () {
//
//            $(this).removeClass('active');            
//
//        });
//
//    });
//    return false;    
//    });

    //window.alert(5 + 6);  
//}
//else

//    $('#player').on('touchstart', function(e) {
//  // If there's exactly one finger inside this element
//    window.alert(5 + 6);
//    var touch = e.targetTouches[0];
//    // Place element where the finger is
//    $('.active').offset({top:touch.pageY,left:touch.pageX});
//  
//}); 


//$('#player').on({ 'mousedown' : function(e){ /* do something... */ } });


    $('#player').on('touchstart', function (e) {

    $(this).addClass('active').parents().on('touchmove', function (e) {
        
        $('.active').offset({
            
            top: e.targetTouches[0].pageY - $('.active').outerHeight() / 2,
            left: e.targetTouches[0].pageX - $('.active').outerWidth() / 2

        }).on('touchend', function () {

            $(this).removeClass('active');            

        });

    });
    window.alert(5 + 6);
    return false;    
    });



