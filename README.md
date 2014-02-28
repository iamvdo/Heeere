Heeere
======

Are you heeere?

A small library to check whether a DOM element is above, inside or below the actual viewport. Adds `.past`, `.show` or `.future` classes.

## Usage

Just bind heeere!

```javascript
// Bind
heeere.bind();

// Bind with options
heeere.bind({
  elems: '.item',
  viewportFactor: .15
});

```

## Options:

* `elems`: a DOM selector (default: `.heeere-item`)
* `viewportFactor`: represents the percentage of height from which an element is in the viewport or not (from 0 to 1) (default: `.15`)

## Notes

Inspired by [Stroll.js](https://github.com/hakimel/stroll.js)
