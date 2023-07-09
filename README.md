# Mathemagical.js
A p5.js library for programming web-based mathematical figures, animations, and interactives in 2D and 3D. Designed for math learners, math educators, and math creators.

## Why this project?
Math concepts are easier to understand when we can see them in motion and interact with them. Today, it’s possible for mathematicians and educators to share what they see in their minds by writing programs with a software library.

Software libraries are more versatile than software applications, and they open more doors, since learning to use them means learning to program. Unfortunately, existing libraries for math graphics are inaccessible to most of the math community, due to their complexity.

To bridge this gap, we propose Mathemagical.js: a software library that makes it easier to program web-based mathematical figures, animations, and interactives in 2D and 3D (like the ones in this [demo video](https://youtu.be/Br40z-lpC3o)). To make it intuitive enough for beginners and flexible enough for experts, we are building on [p5.js](https://github.com/processing/p5.js/tree/main), which has already managed this feat in the visual arts.

## Who’s behind it?
This is an open-source, community-driven project. We plan to follow the [All Contributors specification](https://allcontributors.org/) and will set this up soon; for now, we include a description of early contributions here: 

* @GregStanton proposed the library and leads the project.
* @tfadali has provided regular feedback and thoughtful discussion about design choices.
* @jesi-rgb designed [the site for our initial proposal](https://fellowship-proposal.vercel.app/en), provided expertise on existing software libraries, and named the project.
* Many others have provided feedback, made helpful suggestions, and shared our work on social media.

## How to contribute?
If you want to start a [discussion](https://github.com/Mathemagical-Community/Mathemagical.js/discussions) by asking a question or sharing an idea, that would be super helpful! If you want to start an [issue](https://github.com/Mathemagical-Community/Mathemagical.js/issues) that's likely to result in action items, that would also be great! If you're not sure whether to start a discussion or an issue, flip a coin. We can convert one to the other if needed.

# Interface proposal: Sample features
Here, we outline an initial design of some core features, focusing on what the user will see. Each type of feature is illustrated with a minimal selection of examples. For instance, we show how to draw an arrow as an indication of how other shapes can be drawn. We also include links to demos that you can run in the browser, based on a prototype library. _Other features that we describe are planned but not yet implemented_.

For the purposes of this proposal, we do assume basic familiarity with computer programming; we need to be confident our design will work at all before we can test whether it will be intuitive to beginners. If you're wondering about the rationale for our design decisions, or other details, you can check out the [Mathemagical.js wiki](https://github.com/Mathemagical-Community/Mathemagical.js/wiki/Mathemagical.js-wiki).

## Environment
Mathemagical extends p5’s graphical environment by introducing custom **graph windows**. Beyond allowing the user to work within a right-handed coordinate system if desired, this allows the user to…

* specify the origin, axis orientations, units of length, and scale (e.g. linear or logarithmic) 
* provide custom dimensions for graph windows that occupy only part of the canvas
* create multiple graph windows per canvas (e.g. for side-by-side plots or scenes)
* work within non-Cartesian coordinate systems

Graph windows are created and used like canvas elements and graphics buffers in p5. In particular, p5 functions like `stroke()` and `point()` continue to work as usual.

