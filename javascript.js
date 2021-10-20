const tile_size = 8;
const zoom = 64;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let isDrawing = false;

ctx.scale(8, 8);

/**
 * Draw a pixel onto canvas
 * 
 * @param {Event} e - event triggered when clicking on the canvas or moving mouse while holding LMB
 * @param {*} requiresHold - if true, the mouse must be held down to draw
 */
function draw(e, requiresHold = false) {
  if (!isDrawing && requiresHold) {
  return;
  }
  const rect = canvas.getBoundingClientRect();
  // console.log(e.clientX - rect.left);
  const [x, y] = [
    Math.floor((e.clientX - rect.left) / zoom),
    Math.floor((e.clientY - rect.top) / zoom),
  ];

  ctx.fillStyle = '#000';
  ctx.fillRect(x * tile_size, y * tile_size, tile_size, tile_size);
}

canvas.addEventListener('mousedown', () => {
  isDrawing = true;
});

canvas.addEventListener('mouseup', () => {
  isDrawing = false;
})

canvas.addEventListener('click', draw);
canvas.addEventListener('mousemove', (e) => draw(e, true));