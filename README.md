bootpag - dynamic pagination
============================

This jQuery plugin helps you create dynamic pagination with [Bootstrap](http://getbootstrap.com/) or in any other html pages.

#Example

Snippet that dynamic loads number of pages.
More examples can be found on [project homepage](http://botmonster.com/jquery-bootpag/)

```html
<p id="content">Dynamic page content</p>
<p id="pagination-here"></p>
```

```javascript
$('#pagination-here').bootpag({
    total: 7,          // total pages
    page: 1,            // default page
    maxVisible: 5,     // visible pagination
    leaps: true         // next/prev leaps through maxVisible
}).on("page", function(event, num){
    $("#content").html("Page " + num); // or some ajax content loading...
    // ... after content load -> change total to 10
    $(this).bootpag({total: 10, maxVisible: 10});
});

```
#License

Plugin available under MIT license

Copyright (c) 2013 botmonster.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
