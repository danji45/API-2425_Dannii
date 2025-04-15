// import 'dotenv/config';
// import { App } from '@tinyhttp/app';
// import { logger } from '@tinyhttp/logger';
// import { Liquid } from 'liquidjs';
// import sirv from 'sirv';

// const APIKey = process.env.API_KEY

// const API = `https://api.openweathermap.org/data/2.5/weather?lat=52.3695322&lon=5.1678131&appid=${APIKey}`

// fetch(API)
// .then(response => response.json())
// .then(data=>{
//   console.log(data);
// })

// .catch(error=>{
// console.error("ERROR");
// }


// );


// const data = {
//   'beemdkroon': {
//     id: 'beemdkroon',
//     name: 'Beemdkroon',
//     image: {
//       src: 'https://i.pinimg.com/736x/09/0a/9c/090a9c238e1c290bb580a4ebe265134d.jpg',
//       alt: 'Beemdkroon',
//       width: 695,
//       height: 1080,
//     }
//   },
//   'wilde-peen': {
//     id: 'wilde-peen',
//     name: 'Wilde Peen',
//     image: {
//       src: 'https://mens-en-gezondheid.infonu.nl/artikel-fotos/tom008/4251914036.jpg',
//       alt: 'Wilde Peen',
//       width: 418,
//       height: 600,
//     }
//   }
// }

// const engine = new Liquid({
//   extname: '.liquid',
// });

// const app = new App();

// app
//   .use(logger())
//   .use('/', sirv('dist'))
//   .listen(3000, () => console.log('Server available on http://localhost:3000'));

// app.get('/', async (req, res) => {
//   return res.send(renderTemplate('server/views/index.liquid', { title: 'Home', items: Object.values(data) }));
// });

// app.get('/plant/:id/', async (req, res) => {
//   const id = req.params.id;
//   const item = data[id];
//   if (!item) {
//     return res.status(404).send('Not found');
//   }
//   return res.send(renderTemplate('server/views/detail.liquid', { title: `Detail page for ${id}`, item }));
// });

// const renderTemplate = (template, data) => {
//   const templateData = {
//     NODE_ENV: process.env.NODE_ENV || 'production',
//     ...data
//   };

//   return engine.renderFileSync(template, templateData);
// };

 import 'dotenv/config';
import { App } from '@tinyhttp/app';
import { logger } from '@tinyhttp/logger';
import { Liquid } from 'liquidjs';
import sirv from 'sirv';

const pokemonLimit = 1000; // Aantal Pokémon dat je wilt ophalen
const pokemonAPI = `https://pokeapi.co/api/v2/pokemon?limit=${pokemonLimit}&offset=0`;

const engine = new Liquid({
  extname: '.liquid',
});

const app = new App();

app
  .use(logger())
  .use('/', sirv(process.env.NODE_ENV === 'development' ? 'client' : 'dist'))
  .listen(3000, () => console.log('Server draait op http://localhost:3000'));
  async function fetchAllPokemon() {
    const maxPokemon = 1000; // Aantal Pokémon dat je wilt ophalen
    const amount = 20;
  
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
  
        return {
          id: details.id,
          name: details.name,
          sprite: details.sprites.front_default,
          types: details.types.map(t => t.type.name),
        };
      })
    );
  
    return detailedPokemon;
  }
  

// Homepagina route
app.get('/', async (req, res) => {
  const pokemonList = await fetchAllPokemon();

  return res.send(renderTemplate('server/views/index.liquid', {
    title: 'Pokédex',
    pokemons: pokemonList,
  }));
});

// Render-template functie
const renderTemplate = (template, data) => {
  const templateData = {
    NODE_ENV: process.env.NODE_ENV || 'production',
    ...data
  };

  return engine.renderFileSync(template, templateData);
};

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
      stats: details.stats.map(stat => ({
        name: stat.stat.name,
        value: stat.base_stat,
      })),
    };

    return res.send(renderTemplate('server/views/detail.liquid', {
      title: `Details van ${item.name}`,
      item,
    }));
  } catch (err) {
    console.error(err);
    return res.status(500).send('Er is iets misgegaan met het ophalen van de data.');
  }
});

 