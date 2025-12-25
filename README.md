# Word Rotator 

This is a responsive, animated word rotator component built with React and GSAP. It cycles through a set of words in a sentence, animating them vertically with smooth easing, while dynamically adjusting the container width to fit each word.

## Features

- Smooth vertical animation for words using GSAP timelines.
- Dynamically adjusts rotator width based on the current word.
- Tracks the current word to maintain state even after font size changes.
- Responsive to font size changes using `ResizeObserver`.

## Note

The height of the rotator depends on the **font type**. If you change the font, update the rotator height to maintain proper alignment.
