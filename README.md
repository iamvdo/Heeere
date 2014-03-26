Heeere
======

Are you heeere?

A small library to check whether a DOM element is above, below or inside the actual viewport. Adds `.past`, `.future` and `.inside` classes. **It's up to you to do whatever you want with these classes!** It adds a `.seen` class too, to elements that have `.past` or `.inside` classes.

See it in action using [Greeed](https://github.com/iamvdo/Greeed), CSS3D Transforms and transitions [in my personal website](http://iamvdo.me)

## Usage

Just bind heeere!

```javascript
// Bind
heeere.bind();

// Bind with options
heeere.bind({
  elems: '.item',
  viewportFactor: .15,
  smooth: true,
  smoothSpeed: 250,
  smoothLimit: 3

});

```

## Options:

* `elems`: a DOM selector (default: `.heeere-item`)
* `viewportFactor`: represents the percentage of height from which an element is in the viewport or not (from 0 to 1) (default: `.15`)
* `smooth`: boolean for "smooth scroll mode". "Smooth scroll mode" adds a delay for each element before switching classes. This delay depends on elements position when entering the viewport. Useful for adding offsets to your animations. (default: `false`)
* `smoothSpeed`: speed for "smooth scroll mode". (default: `250`)
* `smoothLimit`: represents a fraction of the viewport's height. For example, when set to 3, elements in the first third will be animated instantly, and elements in the two-thirds will be animated depending on their position. (default: `3`)

## Notes

Inspired by [Stroll.js](https://github.com/hakimel/stroll.js)
