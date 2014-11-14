// JavaScript Document
jQuery(document).ready(function ($) {
    // Geral
    $(window).bind('resize', function (eventData) {
        $('.arquivo').each(function (index, value) {
            var valor = $(this).find('input').width() - parseInt($(this).find('label span').css('padding-left').replace('px', ''));
            $(this).find('label').width(valor);
        })
    }).resize();

    $('form').bind('reset', function (eventData) {
        $(this).find('.arquivo label')
            .removeClass('on')
            .find('span').text('Selecione um arquivo...');
    });

    $('input:radio').bind('change', function (eventData) {
        $('form').attr('action', $(this).val());
    });

    // Sem jqueryUpload
    $('#sem-jqueryUpload').not('#com-jquery').bind('change', function (eventData) {
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

    // Com jqueryUpload
	$('#com-jqueryUpload').fileupload({
	    dataType: 'json',
	    dropZone: $('.arraste-aqui'),
	    add: function (e, data) {
	        data.context = $('.item-file.model').clone().removeClass('esconder model').prependTo($('.list-file'));
	        for (pos in data.files) {
	            data.context.find('.titulo').text(data.files[pos].name);
	            break;
	        }
	        data.context.find('.cancela').bind('click', function () {
	            try { data.stop(); } catch (ex) { /* Ignorar */ }
	            $(this).parent().remove();
	            return false;
	        });
	        data.context.find('.envia').bind('click', function () {
	            if (!$(this).find('a').hasClass('off')) {
	                $(this).find('a').addClass('off');
	                data.context.find('.status').removeClass('esconder').find('span').text('Aguardando...');
	                data.submit();
	            }
	            return false;
	        });
	        data.context.find('.info').bind('click', function () {
	            if (!$(this).find('a').hasClass('off')) {
	                $(this).parent().find('.detalhes').stop().slideToggle();
	            }
	            return false;
	        });
	        data.context.find('.detalhes').hide();
	    },
	    done: function (e, data) {
	        data.context.find('.cancela, .envia').addClass('esconder');
	        data.context.find('.apaga').removeClass('esconder').bind('click', function () {
	            $(this).parent().remove();
	            return false;
	        });
	        data.context.find('.remove').removeClass('esconder').bind('click', function () {
	            $(this).parent().remove();
	            return false;
	        });
	        var items = [];
	        $.each(data.result.files, function (pos, obj) {
	            $.each(obj, function (key, val) {
	                items.push("<li id='" + key + "'><strong>" + key + '</strong>: ' + val + "</li>");
	            });
	        });
	        $("<ul/>", {
	            "class": "minha-lista",
	            html: items.join("")
	        }).appendTo(data.context.find('.detalhes'));
	        data.context.find('.info a').removeClass('off');
	    },
	    fail: function (e, data) {
	        
	    },
	    progress: function (e, data) {
	        var progress = parseInt(data.loaded / data.total * 100, 10);
	        progress = progress + '%';
	        data.context.find('.status span').text(progress);
	    },
	    progressall: function (e, data) {
	        
	    }
	});

});