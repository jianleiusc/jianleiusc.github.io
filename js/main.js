var debugmode = false;

var velocity = 0;
var position = 180;
var score = 0;

//var enimies = new Array();
//var bullets = new Array();

//Handle mouse event OR touch event
var isTouchSupported = 'ontouchstart' in window;
var startEvent = isTouchSupported ? 'touchstart' : 'mousedown';
var moveEvent = isTouchSupported ? 'touchmove' : 'mousemove';
var endEvent = isTouchSupported ? 'touchend' : 'mouseup'; 

//loops
var loopBulletloop;
var loopGameloop;
var loopEnemyloop;

//sound
var gameSound = new buzz.sound("assets/game_music.mp3");
var gameOver = new buzz.sound("assets/game_over.mp3");
var enemyDown = new buzz.sound("assets/enemy1_down.mp3");
buzz.all().setVolume(volume);

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
    gameSound.play();
    loopBulletloop = setInterval(shootbullet,200);
    loopEnemyloop = setInterval(updateEnemies, 700);
    loopGameloop = setInterval(gameloop, updaterate);

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
   //bullets.push(bullet);
}

function gameloop(){
    //collision detection between enemies and aircraft
    var aircraftBox = document.getElementById('player').getBoundingClientRect();
    var aircraftX = [aircraftBox.left + aircraftBox.width/2, aircraftBox.left, aircraftBox.left, aircraftBox.left + aircraftBox.width, aircraftBox.left + aircraftBox.width];
    var aircraftY = [aircraftBox.top, aircraftBox.top + aircraftBox.height*2/3, aircraftBox.top + aircraftBox.height, aircraftBox.top + aircraftBox.height, aircraftBox.top + aircraftBox.height*2/3];
    var enemies = $(".enemy"); 
    for( var i in enemies ){ 
        if(i < enemies.length ) { //i may equal to enimies.length because some enemycraft has been deleted
            var enemyBox = enemies[i].getBoundingClientRect();
            var enemyboxX = [enemyBox.left + enemyBox.width/3, enemyBox.left, enemyBox.left + enemyBox.width/2, enemyBox.left + enemyBox.width, enemyBox.left + enemyBox.width*2/3];
            var enemyboxY = [enemyBox.top, enemyBox.top + enemyBox.height*2/5, enemyBox.top + enemyBox.height, enemyBox.top + enemyBox.height*2/5 ,enemyBox.top];
            if (collisionConvexPolygon( aircraftX, aircraftY, enemyboxX, enemyboxY )) {
                // collision detected!
                    playerDead();
                }
            var bullets = $(".bullet");
            for(var j in bullets){
                if(j < bullets.length){
                    var bulletBox = bullets[j].getBoundingClientRect();
                    var bulletboxX = [bulletBox.left, bulletBox.left, bulletBox.right, bulletBox.right];
                    var bulletboxY = [bulletBox.top, bulletBox.bottom, bulletBox.bottom, bulletBox.top];
                    if(collisionConvexPolygon(enemyboxX, enemyboxY, bulletboxX, bulletboxY)){
                        playScore();
                        // to do animation and sound effets
                        enemies[i].remove();
                        bullets[j].remove();
                        enemyDown.play();
                    }
                
                }
            }
        }
    }
    $(".enemy").filter(function() { return $(this).position().top >=  $(window).height() - 90; }).remove();
    // collision detection between enemies and bullets   
}

function collisionConvexPolygon( vertsax, vertsay, vertsbx, vertsby ) {
    var alen = vertsax.length;
    var blen = vertsbx.length;
    // Loop for axes in Shape A
    for ( var i = 0, j = alen - 1; i < alen; j = i++ ) {
        // Get the axis
        var vx =    vertsay[ i ] - vertsay[ j ];
        var vy = -( vertsax[ i ] - vertsax[ j ] ); 
        var len = Math.sqrt( vx * vx + vy * vy );

        vx /= len;
        vy /= len;

        // Project shape A
        var max0 = vertsax[ 0 ] * vx + vertsay[ 0 ] * vy, min0 = max0;
        for ( k = 1; k < alen; k++ ) {
            var proja = vertsax[ k ] * vx + vertsay[ k ] * vy;

            if ( proja > max0 ) {
                max0 = proja;
            }
            else if ( proja < min0 ) {
                min0 = proja;
            }
        }
        // Project shape B
        var max1 = vertsbx[ 0 ] * vx + vertsby[ 0 ] * vy, min1 = max1;
        for ( var k = 1; k < blen; k++ ) {
            var projb = vertsbx[ k ] * vx + vertsby[ k ] * vy;

            if ( projb > max1 ) {
                max1 = projb;
            }
            else if ( projb < min1 ) {
                min1 = projb;
            }
        }
        // Test for gaps
        if ( !axisOverlap( min0, max0, min1, max1 ) ) {
            return false;
        }
    }
    // Loop for axes in Shape B (same as above)
    for ( var i = 0, j = blen - 1; i < blen; j = i++ ) {
        var vx =    vertsbx[ j ] - vertsbx[ i ];
        var vy = -( vertsby[ j ] - vertsby[ i ] );
        var len = Math.sqrt( vx * vx + vy * vy );

        vx /= len;
        vy /= len;

        var max0 = vertsax[ 0 ] * vx + vertsay[ 0 ] * vy, min0 = max0;
        for ( k = 1; k < alen; k++ ) {
            var proja = vertsax[ k ] * vx + vertsay[ k ] * vy;

            if ( proja > max0 ) {
                max0 = proja;
            }
            else if ( proja < min0 ) {
                min0 = proja;
            }
        }
        var max1 = vertsbx[ 0 ] * vx + vertsby[ 0 ] * vy, min1 = max1;
        for ( var k = 1; k < blen; k++ ) {
            var projb = vertsbx[ k ] * vx + vertsby[ k ] * vy;

            if ( projb > max1 ) {
                max1 = projb;
            }
            else if ( projb < min1 ) {
                min1 = projb;
            }
        }
        if ( !axisOverlap( min0, max0, min1, max1 ) ) {
            return false;
        }
    }
    return true;
}

function axisOverlap ( a0, a1, b0, b1 ) {
    return !( a0 > b1 || b0 > a1 );
}
 
function updateEnemies(){
   //Do any enemies need removal?
   var newenemy = $('<div class="enemy animated" ></div>');
   //set the position of enemies randomly
   newenemy.css('top','0px');
   newenemy.css('left',Math.floor(Math.random()*($(window).width()- 48) )+'px'); 
   $("#gamecontainer").append(newenemy);
   //enimies.push(newenemy);
}


//handle mouse drag or touch
if(!isTouchSupported){

    $('#player').on(startEvent, function (e) {

    $(this).addClass('active').parents().on(moveEvent, function (e) {
        
        $('.active').offset({
            
            top: e.pageY - $('.active').outerHeight() / 2,
            left: e.pageX - $('.active').outerWidth() / 2

        }).on(endEvent, function () {

            $(this).removeClass('active');            

        });

    });
    return false;    
    });
    }
else
    $('#player').on(startEvent, function (e) {

    $(this).addClass('active').parents().on(moveEvent, function (e) {
        $('.active').offset({
            top: e.originalEvent.targetTouches[0].pageY - $('.active').outerHeight() / 2,
            left: e.originalEvent.targetTouches[0].pageX - $('.active').outerWidth() / 2

        }).on(endEvent, function () {
           // window.alert(e.originalEvent.targetTouches[0].pageY);
            $(this).removeClass('active');            

        });

    });
    return false;    
    });
function playerDead(){
   //stop animating everything!
   $(".animated").css('animation-play-state', 'paused');
   $(".animated").css('-webkit-animation-play-state', 'paused');
    //destroy our loops
    gameOver.play();
    gameSound.stop();
    
    clearInterval(loopBulletloop);
    clearInterval(loopGameloop);
    clearInterval(loopEnemyloop);
    loopGameloop = null;
    loopGameloop = null;
    loopEnemyloop = null;
    //mobile browsers don't support buzz bindOnce event
    if(isIncompatible.any())
   {
      //skip right to showing score
      showScore();
   }
   else
   {
      //play the hit sound (then the dead sound) and then show score
//      soundHit.play().bindOnce("ended", function() {
//         soundDie.play().bindOnce("ended", function() {
//            showScore();
//         });
//      });
   }
}

function showScore(){
    //to do 
}

function setBigScore(erase)
{
   var elemscore = $("#bigscore");
   elemscore.empty();
   
   if(erase)
      return;
   
   var digits = score.toString().split('');
   for(var i = 0; i < digits.length; i++)
      elemscore.append("<img src='../assets/font_big_" + digits[i] + ".png' alt='" + digits[i] + "'>");
}
function playScore(){
    score += 100;
   //play hit sound
  // soundScore.stop();
   //soundScore.play();
   setBigScore();
}

var isIncompatible = {
   Android: function() {
   return navigator.userAgent.match(/Android/i);
   },
   BlackBerry: function() {
   return navigator.userAgent.match(/BlackBerry/i);
   },
   iOS: function() {
   return navigator.userAgent.match(/iPhone|iPad|iPod/i);
   },
   Opera: function() {
   return navigator.userAgent.match(/Opera Mini/i);
   },
   Safari: function() {
   return (navigator.userAgent.match(/OS X.*Safari/) && ! navigator.userAgent.match(/Chrome/));
   },
   Windows: function() {
   return navigator.userAgent.match(/IEMobile/i);
   },
   any: function() {
   return (isIncompatible.Android() || isIncompatible.BlackBerry() || isIncompatible.iOS() || isIncompatible.Opera() || isIncompatible.Safari() || isIncompatible.Windows());}
}

