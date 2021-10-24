const canvasSize = 8;
const scale = 8;
const zoom = 64;

const canvas = document.getElementById('canvas');
const downloadButton = document.getElementById('download');
const resetButton = document.getElementById('reset');
const buttonPen = document.getElementById('button-pen');
const buttonBucket = document.getElementById('button-bucket');
const colorPicker = document.getElementById('color-picker')
const scaleSelector = document.getElementById('scale-select');

const ctx = canvas.getContext('2d');

const tools = {
  pen: 'pen',
  eraser: 'eraser',
  bucket: 'bucket',
};

let isDrawing = false;
let currentColor = colorPicker.value;
let currentTool = tools.pen;
let customScale = scaleSelector.value;

ctx.scale(scale, scale);
setCustomExportScale();

function positionToCoordinates(event) {
  const { clientX, clientY } = event;
  const rect = canvas.getBoundingClientRect();

  return [
    Math.floor((clientX - rect.left) / zoom),
    Math.floor((clientY - rect.top) / zoom),
  ]

}

function coordinatesToPosition(x, y) {
  return [
    x * scale,
    y * scale,
   ];
}

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
  
  const [xCoords, yCoords] = positionToCoordinates(e);
  const [x, y] = coordinatesToPosition(xCoords, yCoords);
  
  ctx.fillStyle = currentColor;
  ctx.fillRect(x, y, scale, scale);
  setCustomExportScale();
  
}

/**
 * Returns neighbors coordinates filtered within canvas boundaries
 * and having the same initial color as the initial pixel.
 * 
 * @param {number} x 
 * @param {number} y 
 * @param {Uint8ClampedArray} initialColor - RGBA array such as [0, 0, 0, 255]
 * @returns 
 */
function getNeighbors(x, y, initialColor) {
  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  return directions
  .map(([dirX, dirY]) => {
    const [nX, nY] = [dirX + x, dirY + y];
    return [nX, nY];
  })
  .filter(([nX, nY]) => {
    const [r, g, b, a] = ctx.getImageData(nX * zoom, nY * zoom, 1, 1).data;
    return r === initialColor[0] && g === initialColor[1] && b === initialColor[2] && a === initialColor[3];  
  })
  .filter(([nX, nY]) => {
    return nX >= 0 && nX < 8 && nY >= 0 && nY < 8;
  });
}

function isSameColor(color1, color2) {
  const [r1, g1, b1, a1] = color1;
  const [r2, g2, b2, a2] = color2;
  
  return r1 === r2 && g1 === g2 && b1 === b2 && a1 === a2;
}

function hexToRGBA(hex) {
  const isShorterHex = hex.length <= 4;
  const matchHex = isShorterHex ? /.{1,1}/g : /.{1,2}/g
  const spreadColor = value => parseInt(isShorterHex ? `${value}${value}` : value, 16);
  
  return [
    ...hex
      .replace('#', '')
      .match(matchHex)
      .map(spreadColor),
      255
  ]
}

/**
 * Recursively fills remaining area by flood filling.
 * 
 * This doesn't seem to perform well. Needs more investigation and see if it can be improved.
 * 
 * @param {number} x - x coordinate
 * @param {number} y - y coordinate
 * @param {Uint8ClampedArray} initialColor - RGBA array, such as [0, 0, 0, 255]
 * @param {Uint8ClampedArray} newColor - RGBA array, such as [255, 255, 255, 255]
 * @returns 
 */
function fill(x, y, initialColor) {
  const newColor = new Uint8ClampedArray(hexToRGBA(currentColor));

  if (isSameColor(newColor, initialColor)) {
    return;
  }
  
  const [xPos, yPos] = coordinatesToPosition(x, y);
  
  const [r, g, b, a] = newColor;
  ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
  ctx.fillRect(xPos, yPos, scale, scale);
  
  
  getNeighbors(x, y, initialColor)
  .forEach(([nX, nY]) => {
    fill(nX, nY, initialColor, newColor);
  });
};

function getColorFromPicker(e){
  currentColor = e.target.value;
}

function startFilling(e) {
  const [xCoords, yCoords] = positionToCoordinates(e);
  const initialColor = ctx.getImageData(xCoords * zoom, yCoords * zoom, 1, 1).data;
  fill(xCoords, yCoords, initialColor);
}

canvas.addEventListener('mousedown', () => {
  isDrawing = true;
});

canvas.addEventListener('mouseup', () => {
  isDrawing = false;
})

canvas.addEventListener('click', (e) => {
  switch (currentTool) {
    case tools.pen:
      draw(e);
      break;
    case tools.bucket:
      startFilling(e);
      break;
    default:
      console.warn('unkown tool');
      break;
  }
});

canvas.addEventListener('mousemove', (e) => {
  switch (currentTool) {
    case tools.pen:
      draw(e, true);
    default:
      break;
  }
});

resetButton.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setCustomExportScale();
});

colorPicker.addEventListener('input', getColorFromPicker);

scaleSelector.addEventListener('change', (e) => {
  customScale = +e.target.value;
  setCustomExportScale();
});

buttonPen.addEventListener('click', () => {
  currentTool = tools.pen;
});

buttonBucket.addEventListener('click', () => {
  currentTool = tools.bucket;
});

/**
 * It will generate a virtual canvas to update download image size. Works for any scale.
 * This will use 'customScale' value as reference.
 * 
 * Won't use [OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas) due to lack of support.
 * 
 * **TODO(?):** Maybe receive it as a parameter instead of using customScale?
 */
function setCustomExportScale() {
  const virtualCanvas = document.createElement('canvas');
  const virtualContext = virtualCanvas.getContext('2d');

  virtualCanvas.width = canvasSize * customScale;
  virtualCanvas.height = canvasSize * customScale;

  for (let x = 0; x < scale; x++) {
    for (let y = 0; y < scale; y++) {
      const [r, g, b, a] = ctx.getImageData(x * zoom, y * zoom, 1, 1).data;

      virtualContext.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
      virtualContext.fillRect(x * customScale, y * customScale, customScale, customScale); 
    }
  }

  downloadButton.href = virtualCanvas.toDataURL('image/png'); 
}