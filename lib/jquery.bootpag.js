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

        var $owner = this, 
            settings = $.extend({
                total: 0,
                page: 0,
                maxVisible: null,
                leaps: true
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
            var page = parseInt(me.attr('data-lp'), 10),
                vis = Math.floor(page / settings.maxVisible) * settings.maxVisible,
                $page = me.parent().find('li');

            $page.removeClass('disabled');
            $page
                .first()
                .toggleClass('disabled', page === 1)
                .attr('data-lp', page - 1 < 1 ? 1 : 
                    settings.leaps && page - 1 > settings.maxVisible ? 
                        Math.floor((page - 1) / settings.maxVisible) * settings.maxVisible : page - 1);
            $page
                .last()
                .toggleClass('disabled', page === settings.total)
                .attr('data-lp', page + 1 > settings.total ? settings.total : 
                    settings.leaps && page + 1 < settings.total - settings.maxVisible ? 
                        vis + settings.maxVisible + 1: page + 1);

            var $currPage = $page.filter('[data-lp='+page+']');
            if(!$currPage.not('.nav').length){
                var d = page <= vis ? -settings.maxVisible : 0;
                $page.not('.nav').each(function(index){
                    var lp = index + 1 + vis + d;
                    $(this)
                        .attr('data-lp', lp)
                        .toggle(lp <= settings.total)
                        .find('a').html(lp);
                });
                $currPage = $page.filter('[data-lp='+page+']');
            }
            $currPage.addClass('disabled');
            $owner.trigger('page', page);
        }

        return this.each(function(){

            var me = $(this),
                p = [];

            p.push('<ul><li data-lp="1" class="prev nav"><a href="#">Prev</a></li>');
            for(var c = 1; c <= Math.min(settings.total, settings.maxVisible); c++){
                p.push('<li data-lp="'+c+'"><a href="#">'+c+'</a></li>');
            }
            p.push('<li data-lp="'+(settings.leaps && settings.total > settings.maxVisible
                ? Math.min(settings.maxVisible + 1, settings.total) : 2)+'" class="next nav"><a href="#">Next</a></li></ul>');
            me.append(p.join('')).addClass('pagination');
            me.find('li[data-lp=1]').addClass('disabled');
            me.find('li').click(paginationClick);
        });
    }

})(jQuery, window);
