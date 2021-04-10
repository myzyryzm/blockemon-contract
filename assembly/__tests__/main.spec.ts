/** @format */

import {
    createPokemon,
    getPokemonByOwner,
    getAllPokemon,
    deletePokemon,
    transferPokemon,
    getPokemonById
} from '../main'

describe('Get Pokemon', () => {
    it('Should return an array of 1 pokemon', () => {
        const pokemon = createPokemon('reptar')
        expect(getPokemonByOwner(pokemon.owner).length).toBe(
            1,
            'Should return an array of the pokemon created above.'
        )
    })

    it('Should return a single pokemon', () => {
        const pokemon = createPokemon('reptar')
        expect(getPokemonById(pokemon.id).id).toBe(
            pokemon.id,
            'Should return the same pokemon that was created'
        )
    })

    it('Should return all the pokemon', () => {
        createPokemon('reptar')
        createPokemon('dr. zhivago')
        expect(getAllPokemon().length).toBe(
            2,
            'Should return the same pokemon that was created'
        )
    })
})

describe('Delete pokemon', () => {
    it('Should return no pokemon after deleting the pokemon', () => {
        const pokemon = createPokemon('reptar')
        expect(getAllPokemon().length).toBe(
            1,
            'Should return the same pokemon that was created'
        )
        deletePokemon(pokemon.id)
        expect(getAllPokemon().length).toBe(
            0,
            'Should return no pokemon after deletion'
        )
    })
})

describe('Transfer pokemon', () => {
    it('Should return no pokemon after deleting the pokemon', () => {
        const pokemon = createPokemon('reptar')
        const originalOwner = pokemon.owner
        expect(getPokemonByOwner(originalOwner).length).toBe(
            1,
            'Should return the pokemon just create.'
        )
        const newOwner = 'git'
        transferPokemon(newOwner, pokemon.id)
        expect(getPokemonByOwner(originalOwner).length).toBe(
            0,
            'Should return no pokemon for the original owner because the pokemon has been transferred.'
        )
        expect(getPokemonByOwner(newOwner).length).toBe(
            1,
            'Should return the single pokemon for the new owner.'
        )
    })
})
