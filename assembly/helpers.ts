/** @format */

import { base64, math } from 'near-sdk-as'
import { maxBaseValue, pokemonTypes } from './constants'
import {
    orderedPokemonList,
    Pokemon,
    pokemonByOwner,
    PokemonIdList,
    pokemonMap
} from './models'

/**
 * Gets all the pokemon ids for a specified owner
 * @param owner
 * @returns
 */
export function getPokemonIdsForOwner(owner: string): Array<string> {
    const pokemonIdList = pokemonByOwner.get(owner)
    return !pokemonIdList ? new Array<string>() : pokemonIdList.id
}

/**
 * Removes a pokemon from an owner
 * @param owner
 * @param id
 */
export function removePokemonFromOwner(owner: string, id: string): void {
    const pokeIds = getPokemonIdsForOwner(owner)
    for (let i = 0; i < pokeIds.length; i++) {
        if (id == pokeIds[i]) {
            pokeIds.splice(i, 1)
            break
        }
    }
    pokemonByOwner.set(owner, new PokemonIdList(pokeIds))
}

/**
 * Adds a pokemon to the pokemonMap (key: uint8arrary, value: pokemon); it adds the id to the owner's pokemonList in the pokemonByOwner map
 * @param pokemon
 * @param owner
 * @param id
 */
export function addPokemon(
    pokemon: Pokemon,
    owner: string,
    addToGlobal: boolean
): void {
    pokemonMap.set(base64.decode(pokemon.id), pokemon)
    if (addToGlobal) {
        updateOrderedPokemonList(pokemon.id)
    }
    const pokemonIds = getPokemonIdsForOwner(owner)
    pokemonIds.push(pokemon.id)
    pokemonByOwner.set(owner, new PokemonIdList(pokemonIds))
}

/**
 * Gets all the ids of the pokemon.
 * @returns
 */
export function getAllPokemonIds(): Array<string> {
    const pokemonIdList = orderedPokemonList.get('all')
    return pokemonIdList ? pokemonIdList.id : new Array<string>()
}

/**
 * Updates the ordered pokemon list
 * @param id
 */
export function updateOrderedPokemonList(id: string): void {
    const allPokemonIds = getAllPokemonIds()
    allPokemonIds.push(id)
    const pokemon = new PokemonIdList(allPokemonIds)
    orderedPokemonList.set('all', pokemon)
}

/**
 * Deletes a pokemon from the ordered pokemon list with the given id.
 * @param id
 */
export function deleteFromOrderedPokemonList(id: string): void {
    const globalIds = getAllPokemonIds()
    for (let i = 0; i < globalIds.length; i++) {
        if (id == globalIds[i]) {
            globalIds.splice(i, 1)
            break
        }
    }
    orderedPokemonList.set('all', new PokemonIdList(globalIds))
}

/**
 * returns a random number between 0 and 99
 * @returns
 */
export function randomNumber(): i32 {
    return math.hash32Bytes(math.randomBuffer(4)) % 100
}

/**
 * Returns list of random numbers of $amount length
 * @param amount
 * @returns
 */
export function randomNumbers(amount: number): i32[] {
    let nums: Array<i32> = []
    for (let i = 0; i < amount; i++) {
        nums.push(randomNumber())
    }
    return nums
}

/**
 * Returns a random integer between 0 and maxBaseValue
 * @returns
 */
export function randomBaseValue(): i32 {
    const num = randomNumber()
    const modifier = 99 / maxBaseValue
    const randomIndex = num / modifier
    return randomIndex < maxBaseValue ? randomIndex : maxBaseValue
}

/**
 * Returns a random pokemon type
 * @returns
 */
export function randomPokemonType(): string {
    const num = randomNumber()
    const modifier = 99 / pokemonTypes.length
    let randomIndex = num / modifier
    if (randomIndex > pokemonTypes.length - 1) {
        randomIndex = pokemonTypes.length
    }
    return pokemonTypes[randomIndex]
}

/**
 * Gets a pokemon by a specified id.
 * @param id
 * @returns
 */
export function pokemonById(id: string): Pokemon {
    return pokemonMap.getSome(base64.decode(id))
}

/**
 * Calculates the damage for a given interaction
 * @param level
 * @param basePower
 * @param attack
 * @param defense
 * @returns
 */
export function calculateDamage(
    level: i32,
    basePower: i32,
    attack: i32,
    defense: i32
): i32 {
    return (((2 * level) / 5 + 2) * basePower * attack) / defense / 50 + 2
}
