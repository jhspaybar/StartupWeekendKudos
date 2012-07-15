
(function(){
    
    var ovid = 'overlay_container',
        $ovcon = $('#'+ovid);
    
    // Clicking on the Compose button:
    $('#compose_kudo').click(function(){
        if($ovcon.length < 1){
            $('body').append('<div id="'+ovid+'" />');
        }
        $.ajax({
            type: 'get',
            dataType: 'html',
            url: '/kudo/compose',
            success: function(data, textStatus, jqXHR){
                $('#'+ovid).html(data).modal();                
            }
        });
    });
    
    // On submit of the Compose form:
    
})();
    