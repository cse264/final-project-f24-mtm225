<script lang="ts">
    import { onMount, tick } from 'svelte';
    import axios from 'axios';
    import { Chart, registerables } from 'chart.js';
    import { createAuth0Client } from '@auth0/auth0-spa-js';
    import "../app.css";

    Chart.register(...registerables);

    let pokemonName = '';
    let abilityName = '';
    let pokemonData = null;
    let abilityData = null;
    let abilityPokemons = [];
    let error = '';
    let radarChart = null;
    let showTypeChart = false;
    let additionalInfo = '';
    let userPokemonInfo = [];

    // Auth0 variables
    let auth0 = null;
    let isAuthenticated = false;
    let user = null;

    // Initializing Auth0 client
    const initializeAuth = async () => {
        auth0 = await createAuth0Client({
            domain: "dev-3ychcwan7aapwp8t.us.auth0.com",
            clientId: "7TxURWuAy4msyaDbklwZPj9HgKQc8SBw",
                authorizationParams: {
                    //audience: REACT_APP_AUTH0_AUDIENCE,
                    redirect_uri: window.location.origin,
                  //  scope: REACT_APP_AUTH0_SCOPES,
  }
         //   redirect_uri: window.location.origin,
        });

        // Handle redirect callback if needed
        if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
            await auth0.handleRedirectCallback();
            window.history.replaceState({}, document.title, '/');
        }

        // Check authentication status
        isAuthenticated = await auth0.isAuthenticated();
        if (isAuthenticated) {
            user = await auth0.getUser();
        }
    };

    const login = async () => {
        await auth0.loginWithRedirect();
    };

    const logout = async () => {
        await auth0.logout({ returnTo: window.location.origin });
        user = null;
        isAuthenticated = false;
    };

    const savePokemonInfo = async () => {
        try {
            const token = await auth0.getTokenSilently();
            await axios.post(
                '/api/pokemon-info',
                { userId: user.sub, pokemonName, info: additionalInfo },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchUserPokemonInfo();
        } catch (err) {
            console.error('Error saving Pokémon info:', err);
        }
    };

    const fetchUserPokemonInfo = async () => {
        try {
            const token = await auth0.getTokenSilently();
            const res = await axios.get(`/api/pokemon-info/${user.sub}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            userPokemonInfo = res.data;
        } catch (err) {
            console.error('Error fetching user Pokémon info:', err);
        }
    };

    // Pokémon search functions
    const fetchPokemon = async () => {
        error = '';
        pokemonData = null;
        abilityData = null;
        try {
            const res = await axios.get(`/api/pokemon/${pokemonName.toLowerCase()}`);
            pokemonData = res.data;
            updateRadarChart();
        } catch (e) {
            console.error('Fetch Pokémon error:', e);
            error = 'Pokémon not found!';
        }
    };

    const fetchAbility = async () => {
        error = '';
        abilityData = null;
        abilityPokemons = [];
        pokemonData = null;
        try {
            const res = await axios.get(`/api/ability/${abilityName.toLowerCase()}`);
            abilityData = res.data;
            abilityPokemons = res.data.pokemon || [];
        } catch (e) {
            console.error('Fetch ability error:', e);
            error = 'Ability not found!';
        }
    };

    const updateRadarChart = async () => {
        await tick();

        const ctx = document.getElementById('radarChart')?.getContext('2d');
        if (!ctx) {
            console.error('Canvas element not found for radar chart.');
            return;
        }

        if (radarChart) {
            radarChart.destroy();
        }

        const labels = pokemonData.stats.map((stat) => stat.stat.name);
        const data = pokemonData.stats.map((stat) => stat.base_stat);

        radarChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels,
                datasets: [
                    {
                        label: `${pokemonData.name}'s Base Stats`,
                        data,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                    },
                },
            },
        });
    };

    onMount(async () => {
    // Initialize Auth0 client
    await initializeAuth();

    // Check if the user is already authenticated
    isAuthenticated = await auth0.isAuthenticated();
    if (isAuthenticated) {
        user = await auth0.getUser();
        fetchUserPokemonInfo();
    } else {
        console.log("User is not logged in.");
    }
});
</script>

<style>
    .search-container {
        margin: 20px;
    }
    .result {
        margin-top: 20px;
        border: 1px solid #ddd;
        padding: 15px;
        border-radius: 5px;
        background: #f9f9f9;
    }
    .list-item {
        margin: 5px 0;
    }
    .chart-container {
        margin: 20px auto;
        width: 70%;
        max-width: 500px;
        height: 500px;
    }
    .button-container {
        margin-top: 20px;
    }
    .type-chart {
        text-align: center;
    }
    .credit {
        font-size: 12px;
        color: gray;
    }
    .auth-container {
        margin-bottom: 20px;
        text-align: center;
    }
    .user-info {
        margin-top: 10px;
        padding: 10px;
        background: #f0f8ff;
        border-radius: 5px;
    }
</style>

<div class="search-container">
    <h1 class="text-3xl font-bold text-center">InstaDex</h1>

    <!-- Auth0 Login/Logout -->
    <div class="auth-container">
        {#if !isAuthenticated}
            <button on:click={login} class="p-2 bg-blue-500 text-white rounded">Log In</button>
        {:else}
            <div class="user-info">
                <p>Welcome, {user?.name}</p>
                <button on:click={logout} class="p-2 bg-red-500 text-white rounded">Log Out</button>
            </div>

            <div>
            <input
                type="text"
                placeholder="Pokémon Name"
                class="p-2 border"
                bind:value={pokemonName}
            />
            <textarea
                placeholder="Enter information"
                class="p-2 border w-full"
                bind:value={additionalInfo}
            ></textarea>
            <button on:click={savePokemonInfo} class="p-2 bg-green-500 text-white rounded">
                Save Info
            </button>
        </div>

        <h3>Your Saved Pokémon Info:</h3>
        <ul>
            {#each userPokemonInfo as info}
                <li>{info.pokemon_name}: {info.info}</li>
            {/each}
        </ul>
        {/if}
    </div>

    <!-- Search Pokémon -->
    <div class="mt-4">
        <input
            type="text"
            class="p-2 border border-gray-300 rounded"
            placeholder="Search Pokémon (e.g., Pikachu)"
            bind:value={pokemonName}
        />
        <button class="ml-2 p-2 bg-blue-500 text-white rounded" on:click={fetchPokemon}>
            Search Pokémon
        </button>
    </div>

    <!-- Search Ability -->
    <div class="mt-4">
        <input
            type="text"
            class="p-2 border border-gray-300 rounded"
            placeholder="Search Ability (e.g., Overgrow)"
            bind:value={abilityName}
        />
        <button class="ml-2 p-2 bg-green-500 text-white rounded" on:click={fetchAbility}>
            Search Ability
        </button>
    </div>

    <!-- Display Pokémon Details -->
    {#if pokemonData}
        <div class="result">
            <h2 class="text-xl font-bold">{pokemonData.name}</h2>
            <img src={pokemonData.sprites.front_default} alt={pokemonData.name} class="mt-2" />
            <p>Height: {pokemonData.height}</p>
            <p>Weight: {pokemonData.weight}</p>
            <h3 class="font-semibold">Types</h3>
            <ul>
                {#each pokemonData.types as type}
                    <li class="list-item">{type.type.name}</li>
                {/each}
            </ul>
            <h3 class="font-semibold">Base Stats</h3>
            <ul>
                {#each pokemonData.stats as stat}
                    <li class="list-item">{stat.stat.name}: {stat.base_stat}</li>
                {/each}
            </ul>
            <h3 class="font-semibold">Games</h3>
            <ul>
                {#each pokemonData.game_indices as game}
                    <li class="list-item">{game.version.name}</li>
                {/each}
            </ul>
            <div class="chart-container">
                <canvas id="radarChart"></canvas>
            </div>
        </div>
    {/if}

    <!-- Display Ability Details -->
    {#if abilityData}
        <div class="result">
            <h2 class="text-xl font-bold">{abilityData.name}</h2>
            <p>{abilityData.effect_entries[1]?.effect}</p>
            <h3 class="font-semibold">Pokémon with this Ability</h3>
            <ul>
                {#each abilityPokemons as pokemon}
                    <li class="list-item">{pokemon.pokemon.name}</li>
                {/each}
            </ul>
        </div>
    {/if}

    <!-- Display Type Chart -->
    <div class="button-container">
        <button
            class="p-2 bg-purple-500 text-white rounded"
            on:click={() => (showTypeChart = !showTypeChart)}
        >
            {showTypeChart ? 'Hide Type Chart' : 'Display Type Chart'}
        </button>
    </div>

    {#if showTypeChart}
        <div class="type-chart mt-4">
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/9/97/Pokemon_Type_Chart.svg"
                alt="Pokémon Type Chart"
                class="mx-auto"
            />
            <p class="credit">Image Credit: Wikimedia Commons</p>
        </div>
    {/if}

    {#if error}
        <p class="text-red-500 mt-4">{error}</p>
    {/if}
</div>
