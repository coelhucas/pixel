const canvasSize = 8;
const scale = 8;
const zoom = 64;
const canvas = document.getElementById('canvas');
const downloadButton = document.getElementById('download');
const resetButton = document.getElementById('reset');
const scaleSelector = document.getElementById('scale-select');
const ctx = canvas.getContext('2d');

let isDrawing = false;
let customScale = scale;

ctx.scale(scale, scale);
setCustomExportScale();

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
  const [x, y] = [
    Math.floor((e.clientX - rect.left) / zoom),
    Math.floor((e.clientY - rect.top) / zoom),
  ];

  ctx.fillStyle = '#000';
  ctx.fillRect(x * scale, y * scale, scale, scale);
  setCustomExportScale();

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
  setCustomExportScale();
});

scaleSelector.addEventListener('change', (e) => {
  customScale = +e.target.value;
  setCustomExportScale();
});

/**
 * It will generate a virtual canvas to update download image size. Works for any scale.
 * This will use 'customScale' value as reference.
 * 
 * TODO(?): Maybe receive it as a parameter instead of using customScale?
 */
function setCustomExportScale() {
  const virtualCanvas = document.createElement('canvas');
  const virtualContext = virtualCanvas.getContext('2d');

  virtualCanvas.width = canvasSize * customScale;
  virtualCanvas.height = canvasSize * customScale;

  for (let i = 0; i < scale; i++) {
    for (let j = 0; j < scale; j++) {
      const [r, g, b, a] = ctx.getImageData(i * zoom, j * zoom, 1, 1).data;

      virtualContext.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
      virtualContext.fillRect(i * customScale, j * customScale, customScale, customScale); 
    }
  }

  downloadButton.href = virtualCanvas.toDataURL('image/png'); 
}