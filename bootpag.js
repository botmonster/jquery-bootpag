/*
 * BootPag - jQuery plugin for bootstrap pagination
 *
 * Copyright (c) 2012 botmonster@7items.com
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://botmonster.com
 *
 * Version:  1.0
 *
 */
(function($, window) {

    $.fn.bootpag = function(options){

        var settings = $.extend({
            total: 0,
            current: 0,
            maxVisible: 10  
        }, options);

        if(settings.total <= 0)
                return this;

        return this.each(function(){

            $el = $(this);

            var pagination = [];
            pagination.push('<ul>');
            pagination.push('<ul><li data-lp="0" class="disabled"><a href="#">Prev</a></li>');
            for(var c = 0; c < Math.max(settings.total, settings.maxVisible); c++){
                pagination.push('<li data-lp="'+c+'"><a href="#">'+(c+1)+'</a></li>');
            }
            pagination.push('<li data-lp="1"><a href="#">Next</a></li>');
            pagination.push('</ul>');
                
            $el.append(pagination.join('')).addClass('pagination');
            $('.pagination li[data-lp=0]').addClass('disabled');
            $('.pagination li').click(function(){
                var me = $(this);
                if(me.hasClass('disabled')){
                    return;
                }
                var page = parseInt(me.data('lp'), 10);
                // console.log(page, (page+1) * perPage, contactList.length)
                render_avatars(contactList.slice(page * perPage, (page+1) * perPage), page, contactList.length);
                $('.pagination li').removeClass('disabled');
                $('.pagination li[data-lp='+page+']').addClass('disabled');
                $('.pagination li')
                    .first()
                    .toggleClass('disabled', page === 0)
                    .data('lp', page - 1 < 0 ? 0 : page -1);
                $('.pagination li')
                    .last()
                    .toggleClass('disabled', (page+1) * perPage >= contactList.length)
                    .data('lp', page + 1 > contactList.length ? Math.ceil(contactList.length / perPage) : page + 1);

            });

        });
    }

})(jQuery, window);
