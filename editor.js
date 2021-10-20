const tile_size = 8;
const zoom = 64;
const canvas = document.getElementById('canvas');
const downloadButton = document.getElementById('download');
const resetButton = document.getElementById('reset');
const ctx = canvas.getContext('2d');

let isDrawing = false;

ctx.imageSmoothingEnabled = false;
  ctx.mozImageSmoothingEnabled = false;
  ctx.webkitImageSmoothingEnabled = false;
  ctx.msImageSmoothingEnabled = false;


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
  downloadButton.href = canvas.toDataURL('image/png');

}

canvas.addEventListener('mousedown', () => {
  isDrawing = true;
});

canvas.addEventListener('mouseup', () => {
  isDrawing = false;
})

canvas.addEventListener('click', draw);
canvas.addEventListener('mousemove', (e) => draw(e, true));

resetButton.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  downloadButton.href = canvas.toDataURL('image/png');
});