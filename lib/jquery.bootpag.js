/*
 * bootpag - jQuery plugin for dynamic pagination
 *
 * Copyright (c) 2013 botmonster@7items.com
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://botmonster.github.com/jquery-bootpag
 *
 * Version:  1.0.2
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
                hrefVariable: '{{number}}',
                next: '&raquo;',
                prev: '&laquo;'
            }, 
            $owner.settings || {}, 
            options || {});

        if(settings.total <= 0)
            return this;

        if(!settings.maxVisible){
            settings.maxVisible = settings.total;
        }

        $owner.settings = settings;

        function renderPage($bootpag, page){
        
            var lp,
                vis = Math.floor(page / settings.maxVisible) * settings.maxVisible,
                $page = $bootpag.find('li');

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
            if(!$currPage.not('.next,.prev').length){
                var d = page <= vis ? -settings.maxVisible : 0;
                $page.not('.next,.prev').each(function(index){
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

            var $bootpag, lp, me = $(this),
                p = ['<ul class="bootpag">'],
                prev = Math.max(settings.page - 1, 1),
                next = Math.min(settings.page + 1, settings.total),
                start = (settings.page - settings.maxVisible/2) < 1 ? 1 : (settings.page - settings.maxVisible/2);
            start = start > settings.total ? start - 1: start;
            var end = Math.min((start + settings.maxVisible), settings.total);

            if(settings.prev){
                p.push('<li data-lp="" class="prev"><a href="'+href(prev)+'">'+settings.prev+'</a></li>');
            }
            for(var c = start; c <= end; c++){
                p.push('<li data-lp="'+c+'"><a href="'+href(c)+'">'+c+'</a></li>');
            }
            if(settings.next){
                p.push('<li data-lp="'+lp+'" class="next"><a href="'+href(next)+'">'+settings.next+'</a></li>');
            }
            p.push('</ul>');
            me.find('ul.bootpag').remove();
            me.append(p.join('')).addClass('pagination');
            $bootpag = me.find('ul.bootpag');
            me.find('li').click(function paginationClick(){
            
                var me = $(this);
                if(me.hasClass('disabled')){
                    return;
                }
                renderPage($bootpag, parseInt(me.attr('data-lp'), 10));
            });
            renderPage($bootpag, settings.page);
        });
    }

})(jQuery, window);