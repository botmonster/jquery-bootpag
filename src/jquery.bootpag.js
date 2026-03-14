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
 * Version:  1.0.7
 *
 */

/**
 * @typedef {Object} BootpagOptions
 * @property {number} total - Total number of pages
 * @property {number} page - Current active page (1-based)
 * @property {?number} maxVisible - Maximum number of visible page buttons (defaults to total)
 * @property {boolean} leaps - Whether next/prev jump through maxVisible ranges
 * @property {string} href - Href template for page links (use hrefVariable as placeholder)
 * @property {string} hrefVariable - Placeholder string replaced with page number in href
 * @property {?string} next - Text/HTML for the next button (null to hide)
 * @property {?string} prev - Text/HTML for the prev button (null to hide)
 * @property {boolean} firstLastUse - Whether to show first/last page buttons
 * @property {string} first - Text/HTML for the first page button
 * @property {string} last - Text/HTML for the last page button
 * @property {string} wrapClass - CSS class for the pagination ul element
 * @property {string} activeClass - CSS class for the active page li
 * @property {string} disabledClass - CSS class for disabled nav buttons
 * @property {string} nextClass - CSS class for the next button li
 * @property {string} prevClass - CSS class for the prev button li
 * @property {string} lastClass - CSS class for the last button li
 * @property {string} firstClass - CSS class for the first button li
 */
(function($) {

    function isNumeric(value) {
        return value !== null && value !== '' && !isNaN(parseFloat(value)) && isFinite(value);
    }

    /**
     * Initialize or reconfigure bootpag pagination on matched elements.
     * Emits a "page" event on the owner element when a page is clicked.
     * @param {BootpagOptions} options - Pagination configuration options
     * @returns {jQuery} The jQuery object for chaining
     */
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
                prev: '&laquo;',
                firstLastUse: false,
                first: '<span aria-hidden="true">&larr;</span>',
                last: '<span aria-hidden="true">&rarr;</span>',
                wrapClass: 'pagination',
                activeClass: 'active',
                disabledClass: 'disabled',
                nextClass: 'next',
                prevClass: 'prev',
                lastClass: 'last',
                firstClass: 'first'
            },
            $owner.data('settings') || {},
            options || {});

        if(settings.total <= 0)
            return this;

                    if(!isNumeric(settings.maxVisible) && !settings.maxVisible){
            settings.maxVisible = parseInt(settings.total, 10);
        }

        $owner.data('settings', settings);

        /**
         * Re-render pagination state for a given page number.
         * Updates active/disabled classes and shifts the visible page window.
         * @param {jQuery} $bootpag - The pagination ul element
         * @param {number} page - The page number to render as active
         */
        function renderPage($bootpag, page){

            page = parseInt(page, 10);
            var lp,
                maxV = settings.maxVisible == 0 ? 1 : settings.maxVisible,
                step = settings.maxVisible == 1 ? 0 : 1,
                vis = Math.floor((page - 1) / maxV) * maxV,
                $page = $bootpag.find('li');
            settings.page = page = page < 0 ? 0 : page > settings.total ? settings.total : page;
            $page.removeClass(settings.activeClass);
            lp = page - 1 < 1 ? 1 :
                    settings.leaps && page - 1 >= settings.maxVisible ?
                        Math.floor((page - 1) / maxV) * maxV : page - 1;

            if(settings.firstLastUse) {
                $page
                    .first()
                    .toggleClass(settings.disabledClass, page === 1);
            }

            var lfirst = $page.first();
            if(settings.firstLastUse) {
                lfirst = lfirst.next();
            }

            lfirst
                .toggleClass(settings.disabledClass, page === 1)
                .attr('data-lp', lp)
                .find('a').attr('href', href(lp));

            step = settings.maxVisible == 1 ? 0 : 1;

            lp = page + 1 > settings.total ? settings.total :
                    settings.leaps && page + 1 <= settings.total - settings.maxVisible ?
                        vis + settings.maxVisible + step: page + 1;

            var llast = $page.last();
            if(settings.firstLastUse) {
                llast = llast.prev();
            }

            llast
                .toggleClass(settings.disabledClass, page === settings.total)
                .attr('data-lp', lp)
                .find('a').attr('href', href(lp));

            $page
                .last()
                .toggleClass(settings.disabledClass, page === settings.total);


            var $currPage = $page.filter('[data-lp='+page+']');

            var clist = "." + [settings.nextClass,
                               settings.prevClass,
                               settings.firstClass,
                               settings.lastClass].join(",.");
            if(!$currPage.not(clist).length){
                var d = page <= vis ? -settings.maxVisible : 0;
                $page.not(clist).each(function(index){
                    lp = index + 1 + vis + d;
                    $(this)
                        .attr('data-lp', lp)
                        .toggle(lp <= settings.total)
                        .find('a').html(lp).attr('href', href(lp));
                });
                $currPage = $page.filter('[data-lp='+page+']');
            }
            $currPage.not(clist).addClass(settings.activeClass);
            $owner.data('settings', settings);
        }

        /**
         * Generate an href string by replacing the placeholder with a page number.
         * @param {number} c - The page number to insert into the href template
         * @returns {string} The resolved href string
         */
        function href(c){

            return settings.href.replace(settings.hrefVariable, c);
        }

        return this.each(function(){

            var $bootpag, lp, me = $(this),
                p = ['<ul class="', settings.wrapClass, ' bootpag">'];

            if(settings.firstLastUse){
                p = p.concat(['<li data-lp="1" class="', settings.firstClass,
                       '"><a href="', href(1), '">', settings.first, '</a></li>']);
            }
            if(settings.prev){
                p = p.concat(['<li data-lp="1" class="', settings.prevClass,
                       '"><a href="', href(1), '">', settings.prev, '</a></li>']);
            }
            for(var c = 1; c <= Math.min(settings.total, settings.maxVisible); c++){
                p = p.concat(['<li data-lp="', c, '"><a href="', href(c), '">', c, '</a></li>']);
            }
            if(settings.next){
                lp = settings.leaps && settings.total > settings.maxVisible
                    ? Math.min(settings.maxVisible + 1, settings.total) : 2;
                p = p.concat(['<li data-lp="', lp, '" class="',
                             settings.nextClass, '"><a href="', href(lp),
                             '">', settings.next, '</a></li>']);
            }
            if(settings.firstLastUse){
                p = p.concat(['<li data-lp="', settings.total, '" class="last"><a href="',
                             href(settings.total),'">', settings.last, '</a></li>']);
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

})(jQuery);
