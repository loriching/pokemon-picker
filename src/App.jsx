import { useState } from 'react'
import './App.css'
import APIForm from './components/APIForm';

function App() {
  const [pokemon, setPokemon] = useState({
    id: 0,
    name: "",
    primary_type: "",
    secondary_type: "",
    ability: [],
    sprite: ""
  });

  const [bannedTypes, setBannedTypes] = useState(new Set());
  const [bannedAbilities, setBannedAbilities] = useState(new Set());

  const makeQuery = () => {
    let randomDexNumber = Math.floor(Math.random() * 1025 + 1);

    let query = `https://pokeapi.co/api/v2/pokemon/${randomDexNumber}`;
    callAPI(query).catch(console.error);
  }

  const callAPI = async (query) => {
    const response = await fetch(query);
    const json = await response.json();

    if (!json || !json.sprites) {
      alert("Please try again.");
      return;
    } 

    const types = json.types;

    const primaryType = types[0].type.name;
    const secondaryType = (types.length > 1) ? types[1].type.name : "";

    const abilities = json.abilities;
    const abilityList = [];

    for (let i = 0; i < abilities.length; ++i) {
      abilityList.push(capitalize(json.abilities[i].ability.name));
    }

    if (bannedTypes.has(capitalize(primaryType)) || bannedTypes.has(capitalize(secondaryType)) || bannedAbilities.has(abilityList[0])) {
      makeQuery();
      return;
    }

    setPokemon({
      id: json.id,
      name: capitalize(json.name),
      primary_type: capitalize(primaryType),
      secondary_type: capitalize(secondaryType),
      ability: abilityList[0],
      sprite: json.sprites.front_default
    })
  }

  function capitalize(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }

  const handleTypeBan = (type) => {
    if (type !== "") {
      setBannedTypes(prevSet => {
        const newSet = new Set(prevSet);
        newSet.add(type);
        return newSet;
      });
    }
  };

  const handleAbilityBan = (ability) => {
    if (ability !== "") {
      setBannedAbilities(prevSet => {
        const newSet = new Set(prevSet);
        newSet.add(ability);
        return newSet;
      });
    }
  };

  const handleTypeUnban = (type) => {
    setBannedTypes(prevSet => {
      const newSet = new Set(prevSet);
      newSet.delete(type);
      return newSet;
    });
  };

  const handleAbilityUnban = (ability) => {
    setBannedAbilities(prevSet => {
      const newSet = new Set(prevSet);
      newSet.delete(ability);
      return newSet;
    });
  };

  return (
    <>
      <div className="whole-page">
        <h1>Pokémon Picker</h1>
        
        <APIForm onSubmit={makeQuery} />

        {pokemon.id != 0 &&
          <div>
            <p>Pokédex ID: {pokemon.id}</p>
            <p>Pokémon Name: {pokemon.name}</p>
            <img className="sprite" src={pokemon.sprite} alt="Found the Pokémon"/>

            <br></br>
            <button type="button" onClick={() => handleTypeBan(pokemon.primary_type)}>Primary Type: {pokemon.primary_type}</button>

            <br></br>
            <button type="button" onClick={() => handleTypeBan(pokemon.secondary_type)}>Secondary Type: {pokemon.secondary_type}</button>

            <br></br>
            <button type="button" onClick={() => handleAbilityBan(pokemon.ability)}>Ability: {pokemon.ability}</button>
            
          </div>
        }

        <h4>Banlist</h4>
        
        <div className="banlist">
          {[...bannedTypes].map((type) => (
            <button key={type} type="button" onClick={() => handleTypeUnban(type)}>{type}</button>
          ))}
          {[...bannedAbilities].map((ability) => (
            <button key={ability} type="button" onClick={() => handleAbilityUnban(ability)}>{ability}</button>
          ))}
        </div>


      <br></br>

      </div>
      
    </>
  )
}

export default App
