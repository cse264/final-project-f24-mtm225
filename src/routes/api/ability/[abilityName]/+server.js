import { json } from '@sveltejs/kit';
import axios from 'axios';

export async function GET({ params }) {
    const { abilityName } = params;

    try {
        // Fetch ability data from PokeAPI
        const res = await axios.get(`https://pokeapi.co/api/v2/ability/${abilityName}`);
        return json(res.data);
    } catch (e) {
        return json({ error: 'Ability not found' }, { status: 404 });
    }
}