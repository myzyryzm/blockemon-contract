/** @format */

import { PokemonValue } from './models'

export const maxLevel = 100
export const maxBaseValue = 32
// chance the cpu will attack in any given turn (percentage)
export const cpuAggression = 50
export const pokemonTypes = ['bulbasaur', 'charmander', 'squirtle']

const bulbasaurValues = new PokemonValue(
    'bulbasaur',
    [210, 274],
    [190, 254],
    [210, 274],
    [200, 264]
)

const charmanderValues = new PokemonValue(
    'charmander',
    [200, 264],
    [210, 274],
    [180, 244],
    [220, 284]
)

const squirtleValues = new PokemonValue(
    'squirtle',
    [200, 264],
    [200, 264],
    [220, 284],
    [190, 254]
)

export const pokemonValues: PokemonValue[] = [
    bulbasaurValues,
    charmanderValues,
    squirtleValues
]
