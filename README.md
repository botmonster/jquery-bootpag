BootPag - boostrap dynamic pagination jQuery plugin
=====================================================

This jQuery plugin helps you create dynamic pagination in twitter bootstrap or simple html pages.

#Example

Page that loads dynamic number of pages.

```html
<p class="content">Dynamic page content</p>
<p class="pagination-here"></p>
```

```javascript

$('.pagination-here').bootpag({
    total: 38,          // total pages
    page: 1,            // default page
    maxVisible: 10,     // visible pagination
    leaps: true         // next/prev leaps through maxVisible
}).on("page", function(event, num){
    $(".content").html("Page " + num); // or some ajax content loading...
}); 

```
