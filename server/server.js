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


app.get('/liked', async (req, res) => {
  return res.send(renderTemplate('server/views/liked.liquid', {
    title: 'Your Liked Pokémon',
    likedPokemons: [],
  }));
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


    return res.send(renderTemplate('server/views/detail.liquid', {
      title: `Details van ${item.name}`,
      item,
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