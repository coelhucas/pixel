# Pixel
![image](https://user-images.githubusercontent.com/28108272/138191631-0a688635-b693-4c47-b75c-f7881a145bce.png)

[First version](https://user-images.githubusercontent.com/28108272/138012642-4d242127-aa56-4949-a1db-2e905ca5c4a6.png)

Pixel is a tiny editor meant to be used within a tiny game creation tool I'm planning. At its current state you can only create 8x8 stuff with black pixels and download it.

## Usage
Pixel by itself is stackless, which means it uses only standard HTML, CSS and JS.
```bash
git clone git@github.com:coelhucas/pixel.git
cd pixel
open index.html
```

Click and drag to draw

<kbd>⌘</kbd> + <kbd>R</kbd> to reset on macOS

<kbd>F5</kbd> to reset on windows/linux

Press download to download your pixel art as png

## TODO
- [ ] Add a small default palette
- [ ] Make it responsive
- [ ] Add eraser
- [x] Add reset button
- [x] Make it possible to download it in other scales
- [ ] 1x previewer (I can use the virtual canvas)
- [x] Bucket [reference](http://www.williammalone.com/articles/html5-canvas-javascript-paint-bucket-tool/)
  - [ ] (Extra?) Move floodfill recursion to data structure

*Maybe other sizes layer?
