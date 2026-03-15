/* global $, jQuery */

beforeEach(() => {
  document.body.innerHTML = '<div id="pag"></div>';
});

// Helper: get page numbers as array of integers from visible li elements (excluding nav buttons)
function pageNumbers(selector) {
  var nums = [];
  $(selector || '#pag').find('ul.bootpag li').not('.next,.prev,.first,.last').each(function () {
    if ($(this).css('display') !== 'none') {
      nums.push(parseInt($(this).find('a').text(), 10));
    }
  });
  return nums;
}

// ─── Basic Rendering ──────────────────────────────────────────────────────────

describe('Basic Rendering', () => {
  test('creates a ul.bootpag element inside the container', () => {
    $('#pag').bootpag({ total: 5 });
    expect($('#pag ul.bootpag').length).toBe(1);
  });

  test('renders correct number of page li elements', () => {
    $('#pag').bootpag({ total: 5 });
    // 5 pages + prev + next = 7 li elements
    var allLi = $('#pag ul.bootpag li');
    var pageLi = allLi.not('.prev,.next');
    expect(pageLi.length).toBe(5);
  });

  test('renders prev and next buttons by default', () => {
    $('#pag').bootpag({ total: 5 });
    expect($('#pag li.prev').length).toBe(1);
    expect($('#pag li.next').length).toBe(1);
  });

  test('sets page 1 as active by default', () => {
    $('#pag').bootpag({ total: 5 });
    var activeLi = $('#pag li.active');
    expect(activeLi.length).toBe(1);
    expect(activeLi.attr('data-lp')).toBe('1');
  });

  test('each page li has an anchor with correct text', () => {
    $('#pag').bootpag({ total: 3 });
    var pages = $('#pag ul.bootpag li').not('.prev,.next');
    pages.each(function (i) {
      expect($(this).find('a').text()).toBe(String(i + 1));
    });
  });
});

// ─── Page Navigation ──────────────────────────────────────────────────────────

describe('Page Navigation', () => {
  test('clicking a page number marks it as active', () => {
    $('#pag').bootpag({ total: 5 });
    // Click page 3
    $('#pag li[data-lp="3"]').not('.prev,.next').trigger('click');
    expect($('#pag li.active').attr('data-lp')).toBe('3');
  });

  test('clicking a disabled element does nothing', () => {
    $('#pag').bootpag({ total: 5, page: 1 });
    // Prev is disabled on page 1
    expect($('#pag li.prev').hasClass('disabled')).toBe(true);
    $('#pag li.prev').trigger('click');
    expect($('#pag li.active').attr('data-lp')).toBe('1');
  });

  test('clicking an already-active page does nothing', () => {
    var handler = jest.fn();
    $('#pag').bootpag({ total: 5, page: 2 }).on('page', handler);
    $('#pag li.active').trigger('click');
    expect(handler).not.toHaveBeenCalled();
  });

  test('clicking next advances the page', () => {
    $('#pag').bootpag({ total: 5, maxVisible: 5, leaps: false });
    // On page 1, click next
    $('#pag li.next').trigger('click');
    expect($('#pag li.active').attr('data-lp')).toBe('2');
  });

  test('clicking prev goes back', () => {
    $('#pag').bootpag({ total: 5, maxVisible: 5, page: 3, leaps: false });
    $('#pag li.prev').trigger('click');
    expect($('#pag li.active').attr('data-lp')).toBe('2');
  });
});

// ─── Events ───────────────────────────────────────────────────────────────────

describe('Events', () => {
  test('triggers "page" event with correct page number on click', () => {
    var handler = jest.fn();
    $('#pag').bootpag({ total: 5 }).on('page', handler);
    $('#pag li[data-lp="3"]').not('.prev,.next').trigger('click');
    expect(handler).toHaveBeenCalledTimes(1);
    // jQuery triggers event with (event, pageNum)
    expect(handler.mock.calls[0][1]).toBe(3);
  });

  test('event fires on next button click', () => {
    var handler = jest.fn();
    $('#pag').bootpag({ total: 5, maxVisible: 5, leaps: false }).on('page', handler);
    $('#pag li.next').trigger('click');
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][1]).toBe(2);
  });

  test('event fires on prev button click', () => {
    var handler = jest.fn();
    $('#pag').bootpag({ total: 5, maxVisible: 5, page: 3, leaps: false }).on('page', handler);
    $('#pag li.prev').trigger('click');
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][1]).toBe(2);
  });
});

// ─── maxVisible ───────────────────────────────────────────────────────────────

describe('maxVisible', () => {
  test('only renders maxVisible page buttons', () => {
    $('#pag').bootpag({ total: 20, maxVisible: 5 });
    var pages = $('#pag ul.bootpag li').not('.prev,.next');
    expect(pages.length).toBe(5);
  });

  test('page numbers shift when navigating beyond visible window', () => {
    $('#pag').bootpag({ total: 20, maxVisible: 5 });
    expect(pageNumbers()).toEqual([1, 2, 3, 4, 5]);
    // Click next (with leaps, jumps to page 6)
    $('#pag li.next').trigger('click');
    expect(pageNumbers()).toEqual([6, 7, 8, 9, 10]);
  });

  test('defaults maxVisible to total when not specified', () => {
    $('#pag').bootpag({ total: 4 });
    var pages = $('#pag ul.bootpag li').not('.prev,.next');
    expect(pages.length).toBe(4);
  });
});

// ─── Leaps ────────────────────────────────────────────────────────────────────

describe('Leaps', () => {
  test('with leaps: true, next jumps past the visible window', () => {
    var handler = jest.fn();
    $('#pag').bootpag({ total: 20, maxVisible: 5, leaps: true }).on('page', handler);
    // Next should jump to page 6 (maxVisible + 1)
    $('#pag li.next').trigger('click');
    expect(handler.mock.calls[0][1]).toBe(6);
  });

  test('with maxVisible: 1, next advances to the next page', () => {
    var handler = jest.fn();
    $('#pag').bootpag({ total: 5, maxVisible: 1, leaps: true }).on('page', handler);
    $('#pag li.next').trigger('click');
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][1]).toBe(2);
    expect($('#pag li.active').attr('data-lp')).toBe('2');
  });

  test('with leaps: false, next advances by 1', () => {
    var handler = jest.fn();
    $('#pag').bootpag({ total: 20, maxVisible: 5, leaps: false }).on('page', handler);
    $('#pag li.next').trigger('click');
    expect(handler.mock.calls[0][1]).toBe(2);
  });
});

// ─── firstLastUse ─────────────────────────────────────────────────────────────

describe('firstLastUse', () => {
  test('renders first and last buttons when enabled', () => {
    $('#pag').bootpag({ total: 10, maxVisible: 5, firstLastUse: true });
    expect($('#pag li.first').length).toBe(1);
    expect($('#pag li.last').length).toBe(1);
  });

  test('does not render first/last buttons by default', () => {
    $('#pag').bootpag({ total: 10, maxVisible: 5 });
    expect($('#pag li.first').length).toBe(0);
    expect($('#pag li.last').length).toBe(0);
  });

  test('first button is disabled on page 1', () => {
    $('#pag').bootpag({ total: 10, maxVisible: 5, firstLastUse: true, page: 1 });
    expect($('#pag li.first').hasClass('disabled')).toBe(true);
  });

  test('last button is disabled on last page', () => {
    $('#pag').bootpag({ total: 10, maxVisible: 5, firstLastUse: true, page: 10 });
    expect($('#pag li.last').hasClass('disabled')).toBe(true);
  });

  test('first button uses custom content', () => {
    $('#pag').bootpag({
      total: 10, maxVisible: 5, firstLastUse: true,
      first: 'FIRST'
    });
    expect($('#pag li.first a').html()).toBe('FIRST');
  });
});

// ─── href ─────────────────────────────────────────────────────────────────────

describe('href', () => {
  test('default href is javascript:void(0);', () => {
    $('#pag').bootpag({ total: 3 });
    var firstPageHref = $('#pag li[data-lp="1"]').not('.prev').find('a').attr('href');
    expect(firstPageHref).toBe('javascript:void(0);');
  });

  test('custom href template replaces {{number}} with page number', () => {
    $('#pag').bootpag({ total: 3, href: '#page-{{number}}' });
    var page2 = $('#pag li[data-lp="2"]').not('.prev,.next').find('a').attr('href');
    expect(page2).toBe('#page-2');
  });

  test('custom hrefVariable is respected', () => {
    $('#pag').bootpag({ total: 3, href: '#page-{p}', hrefVariable: '{p}' });
    var page2 = $('#pag li[data-lp="2"]').not('.prev,.next').find('a').attr('href');
    expect(page2).toBe('#page-2');
  });
});

// ─── CSS Classes ──────────────────────────────────────────────────────────────

describe('CSS Classes', () => {
  test('wrapClass is applied to the ul', () => {
    $('#pag').bootpag({ total: 3, wrapClass: 'my-pagination' });
    expect($('#pag ul.my-pagination').length).toBe(1);
  });

  test('activeClass is applied to the current page', () => {
    $('#pag').bootpag({ total: 3, activeClass: 'current' });
    expect($('#pag li.current').length).toBe(1);
  });

  test('disabledClass is applied to prev on page 1', () => {
    $('#pag').bootpag({ total: 3, disabledClass: 'off' });
    expect($('#pag li.prev').hasClass('off')).toBe(true);
  });

  test('nextClass and prevClass are applied', () => {
    $('#pag').bootpag({ total: 3, nextClass: 'my-next', prevClass: 'my-prev' });
    expect($('#pag li.my-next').length).toBe(1);
    expect($('#pag li.my-prev').length).toBe(1);
  });
});

// ─── Dynamic Reconfiguration ──────────────────────────────────────────────────

describe('Dynamic Reconfiguration', () => {
  test('calling bootpag again with new total rebuilds pagination', () => {
    $('#pag').bootpag({ total: 5 });
    expect($('#pag ul.bootpag li').not('.prev,.next').length).toBe(5);
    $('#pag').bootpag({ total: 10, maxVisible: 10 });
    expect($('#pag ul.bootpag li').not('.prev,.next').length).toBe(10);
  });

  test('calling again with new page sets the correct active page', () => {
    $('#pag').bootpag({ total: 5 });
    expect($('#pag li.active').attr('data-lp')).toBe('1');
    $('#pag').bootpag({ total: 5, page: 4 });
    expect($('#pag li.active').attr('data-lp')).toBe('4');
  });

  test('settings persist via jQuery .data()', () => {
    $('#pag').bootpag({ total: 5 });
    var settings = $('#pag').data('settings');
    expect(settings).toBeDefined();
    expect(settings.total).toBe(5);
    expect(settings.page).toBe(1);
  });
});

// ─── Edge Cases ───────────────────────────────────────────────────────────────

describe('Edge Cases', () => {
  test('total: 0 returns early, no pagination rendered', () => {
    $('#pag').bootpag({ total: 0 });
    expect($('#pag ul.bootpag').length).toBe(0);
  });

  test('total: 1 renders single page, both prev and next disabled', () => {
    $('#pag').bootpag({ total: 1 });
    expect($('#pag li.active').length).toBe(1);
    expect($('#pag li.prev').hasClass('disabled')).toBe(true);
    expect($('#pag li.next').hasClass('disabled')).toBe(true);
  });

  test('page exceeding total is clamped to total', () => {
    $('#pag').bootpag({ total: 5, page: 99 });
    var settings = $('#pag').data('settings');
    expect(settings.page).toBe(5);
  });

  test('page below 1 is clamped', () => {
    $('#pag').bootpag({ total: 5, page: -5 });
    var settings = $('#pag').data('settings');
    expect(settings.page).toBe(0);
  });

  test('prev: null omits the prev button', () => {
    $('#pag').bootpag({ total: 5, prev: null });
    expect($('#pag li.prev').length).toBe(0);
    // Next should still be there
    expect($('#pag li.next').length).toBe(1);
  });

  test('clicking page 1 with prev: null fires page 1 event (pro example)', () => {
    var handler = jest.fn();
    $('#pag').bootpag({
      total: 9,
      page: 5,
      maxVisible: 6,
      href: '#pro-page-{{number}}',
      leaps: false,
      next: 'next',
      prev: null
    }).on('page', handler);

    // Click the visible li whose anchor text is "1" (the first page-number button)
    $('#pag ul.bootpag li').not('.next').first().trigger('click');

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][1]).toBe(1);
    expect($('#pag li.active').attr('data-lp')).toBe('1');
  });

  test('next: null omits the next button', () => {
    $('#pag').bootpag({ total: 5, next: null });
    expect($('#pag li.next').length).toBe(0);
    // Prev should still be there
    expect($('#pag li.prev').length).toBe(1);
  });

  test('multiple bootpag instances on same selector sync pages', () => {
    document.body.innerHTML = '<div id="wrap"><div class="pag1"></div><div class="pag2"></div></div>';
    var $both = $('.pag1,.pag2');
    var handler = jest.fn();
    $both.bootpag({ total: 5, maxVisible: 5 }).on('page', handler);

    // Click page 3 on the first instance
    $('.pag1 li[data-lp="3"]').not('.prev,.next').trigger('click');

    // Both should now show page 3 as active
    expect($('.pag1 li.active').attr('data-lp')).toBe('3');
    expect($('.pag2 li.active').attr('data-lp')).toBe('3');
  });
});
