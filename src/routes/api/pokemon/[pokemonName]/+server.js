import { json } from '@sveltejs/kit';
import axios from 'axios';

export async function GET({ params }) {
    const { pokemonName } = params;
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        return json(response.data);
    } catch (error) {
        return json({ error: 'Pokémon not found' }, { status: 404 });
    }
}

