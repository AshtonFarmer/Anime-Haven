import {
  ANIME_META,
  ANIME_SEED as RELEASE_62_ANIME_SEED
} from './library-seed-release62.js';

// Release 62 assigned the same ID to the original series and the Ω sequel.
// Keep both titles, but give the sequel a stable unique ID so progress actions
// can never update the wrong card.
export const ANIME_SEED = RELEASE_62_ANIME_SEED.map(item => (
  item.id === 'seed-how-not-to-summon-a-demon-lord'
  && item.title === 'How Not to Summon a Demon Lord Ω'
    ? { ...item, id: 'seed-how-not-to-summon-a-demon-lord-omega' }
    : item
));

export { ANIME_META };
