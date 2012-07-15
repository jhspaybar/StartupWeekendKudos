
(function(){
    
    var ovid = 'modal_container',
        $ovcon = $('#'+ovid);
    
    // Clicking on the Compose button:
    $('.compose_kudo').click(function(){
        if($ovcon.length < 1){
            $('body').append('<div id="'+ovid+'" class="modal hide" />');
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
    $('#kudo_form').submit(function(e){
        $.ajax({
            type: 'get',
            dataType: 'html',
            data: $('#kudo_form').serialize(),
            url: '/kudo/submit',
            success: function(data, textStatus, jqXHR){
                $('#'+ovid).html(data);                
            }
        });
        return false;
    });
    
})();
    