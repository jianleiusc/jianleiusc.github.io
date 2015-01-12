

$(document).ready(function(){
    showSplash();
});


function showSplash(){
    
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