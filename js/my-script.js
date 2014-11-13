// JavaScript Document
jQuery(document).ready(function ($) {
    $(window).bind('resize', function (eventData) {
        $('.arquivo').each(function (index, value) {
            var valor = $(this).find('input').width() - parseInt($(this).find('label span').css('padding-left').replace('px', ''));
            $(this).find('label').width(valor);
        })
    }).resize();
    $('input:radio').bind('change', function (eventData) {
        $('form').attr('action', $(this).val());
    });
    $('.arquivo input').bind('change', function (eventData) {
        var arquivo;
		$(this).parent().find('label').addClass('on');
		if ($(this).val()) {
		    try {
		        arquivo = $(this).val();
		        if (parseInt($(this).get(0).files.length) > 1) {
		            arquivo = $(this).get(0).files.length + " arquivo(s) selecionado(s)";
		        }
		    } catch(ex)
		    {
		        arquivo = $(this).val();
		    }
		    $(this).parent().find('label span').text(arquivo);
		}
	});
	$('form').bind('reset', function (eventData) {
	    $(this).find('.arquivo label')
            .removeClass('on')
            .find('span').text('Selecione um arquivo...');
	});
});