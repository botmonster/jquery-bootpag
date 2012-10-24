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

        var owner = this, settings = $.extend({
            total: 0,
            page: 0,
            maxVisible: null
        }, options || {});

        if(settings.total <= 0)
            return this;
        if(!settings.maxVisible){
            settings.maxVisible = settings.total;
        }

        function paginationClick(){
            
            var me = $(this);

            if(me.hasClass('disabled')){
                return;
            }
            var page = parseInt(me.data('lp'), 10),
                $page = me.parent().find('li');
            $page.removeClass('disabled');
            $page
                .first()
                .toggleClass('disabled', page === 1)
                .data('lp', page - 1 < 1 ? 1 : page - 1);
            $page
                .last()
                .toggleClass('disabled', page === settings.total)
                .data('lp', page + 1 > settings.total ? settings.total : page + 1);

            var $currPage = $page.filter('[data-lp='+page+']');
            if(!$currPage.length){
                var vis = Math.floor(page / settings.maxVisible) * settings.maxVisible,
                    $el = $page.not('nav');
                $page.not('.nav').each(function(index){
                    var lp = index + 1 + vis;
                    $(this).data('lp', lp).find('a').html(lp);
                });
                $currPage = $page.filter('[data-lp='+page+']');
            }
            $currPage.addClass('disabled');

            owner.trigger('page', page);
        }

        return this.each(function(){

            var me = $(this),
                p = [];

            p.push('<ul><li data-lp="1" class="disabled prev nav"><a href="#">Prev</a></li>');
            for(var c = 1; c <= Math.min(settings.total, settings.maxVisible); c++){
                p.push('<li data-lp="'+c+'"><a href="#">'+c+'</a></li>');
            }
            p.push('<li data-lp="2" class="next nav"><a href="#">Next</a></li></ul>');
            me.append(p.join('')).addClass('pagination');
            me.find('li[data-lp=1]').addClass('disabled');
            me.find('li').click(paginationClick);
        });
    }

})(jQuery, window);
