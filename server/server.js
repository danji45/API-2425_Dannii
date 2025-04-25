// server.js - Main server file

import 'dotenv/config';
import { App } from '@tinyhttp/app';
import { logger } from '@tinyhttp/logger';
import { Liquid } from 'liquidjs';
import sirv from 'sirv';
import { createServer } from 'http';

const engine = new Liquid({
  extname: '.liquid',
});

const app = new App();

app
app.engine('liquid', engine.renderFile)
  .use(logger())
  .use('/', sirv('dist'))
  .use('/client', sirv('client'))
  .use('/server', sirv('server'))
  .listen(3000, () => console.log('Server available on http://localhost:3000'));

// Define client-side JavaScript for color analysis
const colorAnalysisScript = `
function getAverageRGB(imgEl) {
  // Create a new Image object to handle cross-origin issues
  const img = new Image();
  img.crossOrigin = "Anonymous"; // This is crucial for avoiding CORS issues
  img.src = imgEl.src;
  
  // Return a promise that resolves with the color
  return new Promise((resolve) => {
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) {
        console.error("No canvas context available");
        resolve({r:100, g:100, b:100}); // Default gray
        return;
      }
      
      const width = this.width;
      const height = this.height;
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw image to canvas
      context.drawImage(this, 0, 0);
      
      try {
        // Get image data
        const imageData = context.getImageData(0, 0, width, height).data;
        
        // Calculate average color
        let r = 0, g = 0, b = 0;
        let count = 0;
        
        // Sample pixels (every 5th pixel)
        for (let i = 0; i < imageData.length; i += 20) {
          // Skip fully transparent pixels
          if (imageData[i+3] < 128) continue;
          
          r += imageData[i];
          g += imageData[i+1];
          b += imageData[i+2];
          count++;
        }
        
        if (count > 0) {
          resolve({
            r: Math.floor(r/count),
            g: Math.floor(g/count),
            b: Math.floor(b/count)
          });
        } else {
          console.warn("No valid pixels found");
          resolve({r:120, g:120, b:180}); // Default color
        }
      } catch (e) {
        console.error("Error processing image data:", e);
        resolve({r:120, g:120, b:180}); // Default color
      }
    };
    
    img.onerror = function() {
      console.error("Error loading image");
      resolve({r:120, g:120, b:180}); // Default color
    };
  });
}

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

async function setPokemonColors(imgElement) {
  try {
    // Get RGB color
    const rgb = await getAverageRGB(imgElement);
    const hexColor = rgbToHex(rgb.r, rgb.g, rgb.b);
    
    // Update the DOM
    const dominantColorEl = document.getElementById('dominant-color');
    const colorHexEl = document.getElementById('color-hex');
    
    if (dominantColorEl) {
      dominantColorEl.style.backgroundColor = \`rgb(\${rgb.r}, \${rgb.g}, \${rgb.b})\`;
    }
    
    if (colorHexEl) {
      colorHexEl.textContent = \`RGB: \${rgb.r}, \${rgb.g}, \${rgb.b} | HEX: \${hexColor}\`;
    }

    // Apply color to other elements
    const cardEl = document.querySelector('.pokemon-detail-card');
    if (cardEl) {
      cardEl.style.borderColor = hexColor;
    }
    
    const statBars = document.querySelectorAll('.stat-bar');
    statBars.forEach(bar => {
      bar.style.backgroundColor = hexColor;
    });


  } catch (err) {
    console.error("Error setting colors:", err);
  }



}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const img = document.getElementById('pokemon-sprite');
  if (img) {
    if (img.complete) {
      setPokemonColors(img);
    } else {
      img.onload = function() {
        setPokemonColors(this);
      };
    }
  }
});
`;

app.get('/plant/:id/', async (req, res) => {
  const id = req.params.id;
  const item = data[id];
  if (!item) {
    return res.status(404).send('Not found');
  }
  return res.send(renderTemplate('server/views/detail.liquid', {
    title: `Detail page for ${id}`,
    item: item
  }));
});

async function fetchAllPokemon() {
  const maxPokemon = 1000; // Number of Pokémon to fetch
  const amount = 20; ;

  function getRandomInt(max) {
    return Math.floor(Math.random() * max) + 1;
  }

  const ids = new Set();
  while (ids.size < amount) {
    ids.add(getRandomInt(maxPokemon));
  }

  const detailedPokemon = await Promise.all(
    Array.from(ids).map(async (id) => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const details = await res.json();

// 1. Eerst pak je het eerste type
const firstType = details.types[0].type.name;

// 2. Fetch weaknesses van dat type
const typeRes = await fetch(`https://pokeapi.co/api/v2/type/${firstType}`);
const typeData = await typeRes.json();

// 3. Pak de eerste 2 weaknesses
const weaknesses = typeData.damage_relations.double_damage_from
  .map(w => w.name)
  .slice(0, 2);

  const resistances = typeData.damage_relations.half_damage_from
  .map(r => r.name)
  .slice(0, 2); // Alleen eerste 2


// 4. Voeg het toe in je return!
return {
  id: details.id,
  name: details.name,
  sprite: details.sprites.front_default,
  types: details.types.map(t => t.type.name),
  hp: details.stats.find(stat => stat.stat.name === 'hp').base_stat,
  attack: details.stats.find(stat => stat.stat.name === 'attack').base_stat,
  defense: details.stats.find(stat => stat.stat.name === 'defense').base_stat,
  speed: details.stats.find(stat => stat.stat.name === 'speed').base_stat,
  weaknesses: weaknesses,
  resistances: resistances
};

    })
  );

  return detailedPokemon;
}

// Home page route - Tinder-like swiping interface
app.get('/', async (req, res) => {
  const pokemonList = await fetchAllPokemon();

  return res.send(renderTemplate('server/views/index.liquid', {
    title: 'PokéSwipe',
    pokemons: pokemonList,
  }));
});

// // Liked Pokémon page route
// app.get('/liked', async (req, res) => {
//   // In a real app, use a cookie or session to identify the user
//   const userId = req.query.userId || 'default-user';
//   const userLikes = likedPokemon.get(userId) || [];

//   return res.send(renderTemplate('server/views/liked.liquid', {
//     title: 'Your Liked Pokémon',
//     likedPokemons: userLikes,
//   }));
// });


app.get('/liked', async (req, res) => {
  return res.send(renderTemplate('server/views/liked.liquid', {
    title: 'Your Liked Pokémon',
    likedPokemons: [],
  }));
});

// Serve the color analysis JavaScript
app.get('/client/js/pokemon-color.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(colorAnalysisScript);
});

// Detailed Pokémon page
app.get('/pokemon/:id', async (req, res) => {
  const id = req.params.id;

  if (isNaN(id) || id < 1 || id > 1000) {
    return res.status(404).send('Pokémon not found');
  }

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const details = await response.json();

    const item = {
      id,
      name: details.name,
      sprite: details.sprites.front_default,
      types: details.types.map(t => t.type.name),
      stats: details.stats.map(stat => ({
        name: stat.stat.name,
        value: stat.base_stat,
      })),
    };

    // Add CSS styles for the color display
    const colorStyles = `
      .color-info {
        margin: 20px 0;
        text-align: center;
      }
      
      .color-display {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        margin: 10px 0;
      }
      
      .color-box {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        margin-bottom: 10px;
        border: 2px solid #ddd;
      }
      
      .color-text {
        font-family: monospace;
        font-size: 14px;
      }
    `;

    return res.send(renderTemplate('server/views/detail.liquid', {
      title: `Details van ${item.name}`,
      item,
      colorStyles,
      colorScript: true, // Flag to include the color script
    }));
  } catch (err) {
    console.error(err);
    return res.status(500).send('Er is iets misgegaan met het ophalen van de data.');
  }
});

// Render template function
const renderTemplate = (template, data) => {
  const templateData = {
    ...data
  };

  return engine.renderFileSync(template, templateData);
};