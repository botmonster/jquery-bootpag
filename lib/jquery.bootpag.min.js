/*
 
 bootpag - jQuery plugin for dynamic pagination

 Copyright (c) 2013 botmonster@7items.com

 Licensed under the MIT license:
   http://www.opensource.org/licenses/mit-license.php

 Project home:
   http://botmonster.com/jquery-bootpag/

 Version:  1.0.3

*/
(function(h){h.fn.bootpag=function(m){function j(e,b){var c,d=Math.floor(b/a.maxVisible)*a.maxVisible,f=e.find("li");a.page=b=0>b?0:b>a.total?a.total:b;f.removeClass("disabled");c=1>b-1?1:a.leaps&&b-1>a.maxVisible?Math.floor((b-1)/a.maxVisible)*a.maxVisible:b-1;f.first().toggleClass("disabled",1===b).attr("data-lp",c).find("a").attr("href",g(c));c=b+1>a.total?a.total:a.leaps&&b+1<a.total-a.maxVisible?d+a.maxVisible+1:b+1;f.last().toggleClass("disabled",b===a.total).attr("data-lp",c).find("a").attr("href",
g(c));var l=f.filter("[data-lp="+b+"]");if(!l.not(".next,.prev").length){var j=b<=d?-a.maxVisible:0;f.not(".next,.prev").each(function(b){c=b+1+d+j;h(this).attr("data-lp",c).toggle(c<=a.total).find("a").html(c).attr("href",g(c))});l=f.filter("[data-lp="+b+"]")}l.addClass("disabled");k.trigger("page",b);k.data("settings",a)}function g(e){return a.href.replace(a.hrefVariable,e)}var k=this,a=h.extend({total:0,page:1,maxVisible:null,leaps:!0,href:"javascript:void(0);",hrefVariable:"{{number}}",next:"&raquo;",
prev:"&laquo;"},k.data("settings")||{},m||{});if(0>=a.total)return this;a.maxVisible||(a.maxVisible=a.total);k.data("settings",a);return this.each(function(){var e,b,c=h(this),d=['<ul class="bootpag">'];a.prev&&d.push('<li data-lp="1" class="prev"><a href="'+g(1)+'">'+a.prev+"</a></li>");for(b=1;b<=Math.min(a.total,a.maxVisible);b++)d.push('<li data-lp="'+b+'"><a href="'+g(b)+'">'+b+"</a></li>");a.next&&(b=a.leaps&&a.total>a.maxVisible?Math.min(a.maxVisible+1,a.total):2,d.push('<li data-lp="'+b+'" class="next"><a href="'+
g(b)+'">'+a.next+"</a></li>"));d.push("</ul>");c.find("ul.bootpag").remove();c.append(d.join("")).addClass("pagination");e=c.find("ul.bootpag");c.find("li").click(function(){var a=h(this);a.hasClass("disabled")||j(e,parseInt(a.attr("data-lp"),10))});j(e,a.page)})}})(jQuery,window);
