/**
 * @preserve
 * bootpag - jQuery plugin for dynamic pagination
 *
 * Copyright (c) 2015 botmonster@7items.com
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://botmonster.com/jquery-bootpag/
 *
 * Version:  1.0.8
 *
 */
 
(function($, window) {

    $.fn.bootpag = function(options) {

        var $owner = this,
            settings = $.extend({
                pageSize: 1, //items per page
                total: 0, // total items
                page: 1,
                maxVisible: null,
                leaps: true,
                boundaryLeaps: true, //whether disable next/prev button when page is in the first/last set of pages
                href: 'javascript:void(0);',
                hrefVariable: '{{number}}',
                next: '&raquo;',
                prev: '&laquo;',
                firstLastUse: false,
                first: '<span aria-hidden="true">&larr;</span>',
                last: '<span aria-hidden="true">&rarr;</span>',
                infoUse: true, // total info
                infoPosition: 'right', // 'left', 'right',works only when infoUse is true
                info: '共{{total}}条/{{totalPage}}页',
                wrapClass: 'pagination',
                activeClass: 'active',
                disabledClass: 'disabled',
                nextClass: 'next',
                prevClass: 'prev',
                lastClass: 'last',
                firstClass: 'first',
                infoClass: 'info'
            },
            $owner.data('settings') || {},
            options || {});

        if (!settings.total || settings.total < 0) {
            settings.total = 0;
        }

        if(!$.isNumeric(settings.maxVisible) && !settings.maxVisible){
            settings.maxVisible = parseInt(settings.total, 10);
        }

        if (!settings.pageSize || settings.pageSize < 1) {
	        settings.pageSize = 1;
        }

        $owner.data('settings', settings);

        function renderPage($bootpag, page){
            page = parseInt(page, 10);
            var lp,
                vis,
                totalPage,
                info,
                maxV = settings.maxVisible || 1,
                $page = $bootpag.find('li'),
                lfirst = $page.first(),
                llast = $page.last();

            totalPage = Math.ceil(settings.total/settings.pageSize) || 1;
            settings.page = page = page < 1 ? 1 : page > totalPage ? totalPage : page;
            vis = Math.floor((page - 1) / maxV) * maxV;
            info = settings.info.replace('{{total}}', settings.total).replace('{{totalPage}}', totalPage);

            $page.removeClass(settings.activeClass);

            if (settings.infoUse && settings.infoPosition === 'left') {
            	lfirst.addClass(settings.disabledClass).find('a').html(info);
            	lfirst = lfirst.next();
            }

            if(settings.firstLastUse) {
                lfirst.toggleClass(settings.disabledClass, page === 1);
                lfirst = lfirst.next();
            }

            lp = page - 1 < 1 ? 1 :
                    settings.leaps && page - 1 >= maxV ?
                        vis : page - 1;

            lfirst
                .toggleClass(settings.disabledClass, page === 1 || (settings.leaps && !settings.boundaryLeaps && vis == 0))
                .attr('data-lp', lp)
                .find('a').attr('href', href(lp));

            if (settings.infoUse && settings.infoPosition === 'right') {
            	llast.addClass(settings.disabledClass).find('a').html(info);
            	llast = llast.prev();
            }

            if(settings.firstLastUse) {
            	llast.toggleClass(settings.disabledClass, page === totalPage);
                llast = llast.prev();
            }

            lp = page + 1 > totalPage ? totalPage :
                    settings.leaps && vis < totalPage - maxV ?
                        vis + maxV + 1: page + 1;

            llast
                .toggleClass(settings.disabledClass, page === totalPage || (settings.leaps && !settings.boundaryLeaps && vis + maxV >= totalPage))
                .attr('data-lp', lp)
                .find('a').attr('href', href(lp));

            var $currPage = $page.filter('[data-lp='+page+']');

            var clist = "." + [settings.nextClass,
                               settings.prevClass,
                               settings.firstClass,
                               settings.lastClass,
                               settings.infoClass].join(",.");
            if(!$currPage.not(clist).length){
                $page.not(clist).each(function(index){
                    lp = index + 1 + vis;
                    $(this)
                        .attr('data-lp', lp)
                        .toggle(lp <= totalPage)
                        .find('a').html(lp).attr('href', href(lp));
                });
                $currPage = $page.filter('[data-lp='+page+']');
            }
            $currPage.not(clist).addClass(settings.activeClass);
            $owner.data('settings', settings);
        }

         function href(c){

            return settings.href.replace(settings.hrefVariable, c);
        }

        return this.each(function(){

            var $bootpag, lp, me = $(this),
            	maxV = settings.maxVisible || 1,
            	totalPage = Math.ceil(settings.total/settings.pageSize),
            	info = settings.info.replace('{{total}}', settings.total).replace('{{totalPage}}', totalPage),
                p = ['<ul class="', settings.wrapClass, ' bootpag">'];

            if (settings.infoUse && settings.infoPosition === 'left') {
            	p = p.concat(['<li class="', settings.infoClass,
            		'"><a href="javascript:void(0)">', info, '</a></li>']);
            }

            if(settings.firstLastUse){
                p = p.concat(['<li data-lp="1" class="', settings.firstClass,
                       '"><a href="', href(1), '">', settings.first, '</a></li>']);
            }
            if(settings.prev){
                p = p.concat(['<li data-lp="1" class="', settings.prevClass,
                       '"><a href="', href(1), '">', settings.prev, '</a></li>']);
            }
            for(var c = 1; c <= Math.min(totalPage||1, maxV); c++){
                p = p.concat(['<li data-lp="', c, '"><a href="', href(c), '">', c, '</a></li>']);
            }
            if(settings.next){
                lp = settings.page + 1 > totalPage ? totalPage :
                	settings.leaps && totalPage > maxV ?
                    	maxV + 1: settings.page + 1;
                p = p.concat(['<li data-lp="', lp, '" class="',
                             settings.nextClass, '"><a href="', href(lp),
                             '">', settings.next, '</a></li>']);
            }
            if(settings.firstLastUse){
                p = p.concat(['<li data-lp="', totalPage, '" class="', settings.lastClass,
                	'"><a href="', href(totalPage),'">', settings.last, '</a></li>']);
            }

            if (settings.infoUse && settings.infoPosition === 'right') {
                p = p.concat(['<li class="', settings.infoClass,
                    '"><a href="javascript:void(0)">', info, '</a></li>']);
            }
            p.push('</ul>');
            me.find('ul.bootpag').remove();
            me.append(p.join(''));
            $bootpag = me.find('ul.bootpag');

            me.find('li').click(function paginationClick(){

                var me = $(this);
                if(me.hasClass(settings.disabledClass) || me.hasClass(settings.activeClass)){
                    return;
                }
                var page = parseInt(me.attr('data-lp'), 10);
                $owner.find('ul.bootpag').each(function(){
                    renderPage($(this), page);
                });

                $owner.trigger('page', page);
            });
            renderPage($bootpag, settings.page);
        });

    };

})(jQuery, window);
