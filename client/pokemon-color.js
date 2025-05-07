// client/js/pokemon-color.js

function getAverageRGB(imgEl) {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imgEl.src;
  
    return new Promise((resolve) => {
      img.onload = function () {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
  
        if (!context) return resolve({ r: 100, g: 100, b: 100 });
  
        canvas.width = this.width;
        canvas.height = this.height;
        context.drawImage(this, 0, 0);
  
        try {
          const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
          let r = 0, g = 0, b = 0, count = 0;
  
          for (let i = 0; i < data.length; i += 20) {
            if (data[i + 3] < 128) continue;
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
          }
  
          resolve(count > 0 ? {
            r: Math.floor(r / count),
            g: Math.floor(g / count),
            b: Math.floor(b / count)
          } : { r: 120, g: 120, b: 180 });
        } catch {
          resolve({ r: 120, g: 120, b: 180 });
        }
      };
  
      img.onerror = () => resolve({ r: 120, g: 120, b: 180 });
    });
  }
  
  function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  
  async function setPokemonColors(imgElement) {
    try {
      const rgb = await getAverageRGB(imgElement);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      const colorBox = document.getElementById('dominant-color');
      const hexText = document.getElementById('color-hex');
      const card = document.querySelector('.pokemon-detail-card');
  
      if (colorBox) colorBox.style.backgroundColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      if (hexText) hexText.textContent = `RGB: ${rgb.r}, ${rgb.g}, ${rgb.b} | HEX: ${hex}`;
  
      document.querySelectorAll('.stat-bar').forEach(bar => {
        bar.style.backgroundColor = hex;
      });
  
      if (card) card.style.borderColor = hex;
    } catch (err) {
      console.error("Color error", err);
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const img = document.getElementById('pokemon-sprite');
    if (img) {
      img.complete ? setPokemonColors(img) : img.onload = () => setPokemonColors(img);
    }
  });
  