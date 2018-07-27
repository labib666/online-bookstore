export function checkAtNthLoop (fn, n) {
    if (n) {
        setTimeout(() => {
            checkAtNthLoop(fn, n - 1);
        }, 1);
        return;
    }

    setTimeout(fn, 0);
}

export function type (wrapper, selector, text) {
    const node = wrapper.find(selector);
    node.element.value = text;
    node.trigger('input');
}

export function click (wrapper, selector) {
    wrapper.find(selector).trigger('click');
}
