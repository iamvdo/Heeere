Heeere
======

Are you heeere?

A small library to check whether a DOM element is above, below or inside the actual viewport. Adds `.past`, `.future` and `.inside` classes. **It's up to you to do whatever you want with these classes!** It adds a `.seen` class too, to elements that have `.past` or `.inside` classes.

See it in action using CSS3D Transforms and transitions [in my personal website](http://iamvdo.me)

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
