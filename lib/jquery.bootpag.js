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
                page: 1,
                maxVisible: null,
                leaps: true,
                href: 'javascript:void(0);',
                hrefVariable: '{{number}}'
            }, options || {});

        if(settings.total <= 0)
            return this;
        if(!settings.maxVisible){
            settings.maxVisible = settings.total;
        }

        function paginationClick(){
            
            var me = $(this), lp;

            if(me.hasClass('disabled')){
                return;
            }
            var page = parseInt(me.attr('data-lp'), 10),
                vis = Math.floor(page / settings.maxVisible) * settings.maxVisible,
                $page = me.parent().find('li');

            $page.removeClass('disabled');
            lp = page - 1 < 1 ? 1 : 
                    settings.leaps && page - 1 > settings.maxVisible ? 
                        Math.floor((page - 1) / settings.maxVisible) * settings.maxVisible : page - 1;
            $page
                .first()
                .toggleClass('disabled', page === 1)
                .attr('data-lp', lp)
                .find('a').attr('href', href(lp));
            lp = page + 1 > settings.total ? settings.total : 
                    settings.leaps && page + 1 < settings.total - settings.maxVisible ? 
                        vis + settings.maxVisible + 1: page + 1;
            $page
                .last()
                .toggleClass('disabled', page === settings.total)
                .attr('data-lp', lp)
                .find('a').attr('href', href(lp));;

            var $currPage = $page.filter('[data-lp='+page+']');
            if(!$currPage.not('.nav').length){
                var d = page <= vis ? -settings.maxVisible : 0;
                $page.not('.nav').each(function(index){
                    lp = index + 1 + vis + d;
                    $(this)
                        .attr('data-lp', lp)
                        .toggle(lp <= settings.total)
                        .find('a').html(lp).attr('href', href(lp));
                });
                $currPage = $page.filter('[data-lp='+page+']');
            }
            $currPage.addClass('disabled');
            $owner.trigger('page', page);
        }

        function href(c){

            return settings.href.replace(settings.hrefVariable, c);
        }

        return this.each(function(){

            var lp, me = $(this),
                p = [];

            p.push('<ul><li data-lp="1" class="prev nav"><a href="'+href(1)+'">Prev</a></li>');
            for(var c = 1; c <= Math.min(settings.total, settings.maxVisible); c++){
                p.push('<li data-lp="'+c+'"><a href="'+href(c)+'">'+c+'</a></li>');
            }
            lp = settings.leaps && settings.total > settings.maxVisible
                ? Math.min(settings.maxVisible + 1, settings.total) : 2;
            p.push('<li data-lp="'+lp+'" class="next nav"><a href="'+href(lp)+'">Next</a></li></ul>');
            me.append(p.join('')).addClass('pagination');
            me.find('li[data-lp=1]').addClass('disabled');
            me.find('li').click(paginationClick);
        });
    }

})(jQuery, window);
