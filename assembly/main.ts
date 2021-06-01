/** @format */

import { context, base64, math, storage } from 'near-sdk-as'
import {
    Blockemon,
    blockemonMap,
    Monkey,
    monkeyIdMap,
    MonkeySpecies,
    monkeySpeciesIdMap,
    orderedMonkeyIdList,
    orderedMonkeySpeciesIdList,
} from './models'
import {
    deleteFromOrderedBlockemonList,
    getAllBlockemonIds,
    getBlockemonIdsForOwner,
    removeBlockemonFromOwner,
    blockemonById,
    assertHasInit,
    assertIsCEO,
    isCEO,
    assertIsOwner,
    addNewMonkeySpecies,
    addNewMonkey,
    getMonkeyById,
    assertCanTransfer,
    addMonkeyToOwner,
    removeMonkeyFromOwner,
} from './helpers'

/************************/
/* INITIALIZE CONTRACT */
/**********************/

/**
 * Creates the contract
 */
export function initializeContract(): string {
    assert(!storage.hasKey('init'), 'Already initialized')
    storage.set<string>('init', '1')
    storage.set<string>('ceo', context.sender)
    return context.sender
}

/*******************/
/* CHANGE METHODS */
/*****************/

/**
 * Create a monkey species with an auto generated id
 * @param maxMonkeys
 * @returns
 */
export function createMonkeySpecies(maxMonkeys: u64): MonkeySpecies {
    assertIsCEO()
    const speciesIdList = orderedMonkeySpeciesIdList.get('all')
    let numSpecies: u64 = 0
    if (speciesIdList) {
        numSpecies = speciesIdList.id.length as u64
    }
    let speciesDex = numSpecies + 1
    while (monkeySpeciesIdMap.contains(speciesDex)) {
        speciesDex++
    }

    const species = addNewMonkeySpecies(speciesDex, maxMonkeys)
    return species
}

/**
 * Create a monkey species with a specified id.
 * @param id
 * @param maxMonkeys
 * @returns
 */
export function createMonkeySpeciesWithId(
    id: u64,
    maxMonkeys: u64
): MonkeySpecies {
    assertIsCEO()
    assert(
        !monkeySpeciesIdMap.contains(id),
        'Error: specified id already exists'
    )
    const species = addNewMonkeySpecies(id, maxMonkeys)
    return species
}

/**
 * Creates a monkey with an auto generated id
 * @param speciesId
 * @param owner
 * @returns
 */
export function createMonkey(speciesId: u64, owner: string): Monkey {
    assertIsCEO()
    const monkeyIdList = orderedMonkeyIdList.get('all')
    let numMonkeys: u64 = 0
    if (monkeyIdList) {
        numMonkeys = monkeyIdList.id.length as u64
    }
    let monkeyId = numMonkeys + 1
    while (monkeyIdMap.contains(monkeyId)) {
        monkeyId++
    }
    const monkey = addNewMonkey(monkeyId, speciesId, owner)
    return monkey
}

/**
 * Creats a monkey by specifying the id
 * @param id
 * @param speciesId
 * @param owner
 * @returns
 */
export function createMonkeyWithId(
    id: u64,
    speciesId: u64,
    owner: string
): Monkey {
    assertIsCEO()
    assert(
        !monkeyIdMap.contains(id),
        'Error: monkey with specified id already exists'
    )
    const monkey = addNewMonkey(id, speciesId, owner)
    return monkey
}

export function transferMonkey(newOwner: string, id: u64): Monkey {
    const monkey = getMonkeyById(id)
    assertCanTransfer(monkey)
    removeMonkeyFromOwner(monkey, monkey.owner)
    addMonkeyToOwner(monkey, newOwner)
    return monkey
}

/**
 * Deletes a blockemon with a specified id.
 * @param id
 */
export function deleteBlockemon(id: string): void {
    assertHasInit()
    const blockemon = blockemonById(id)
    assertIsOwner(blockemon)
    removeBlockemonFromOwner(blockemon.owner, id)
    deleteFromOrderedBlockemonList(id)
    blockemonMap.delete(base64.decode(id))
}

/*****************/
/* VIEW METHODS */
/****************/

/**
 * Gets the list of blockemon for a the sender's account.
 * @param owner
 * @returns
 */
export function getUserBlockemon(): Blockemon[] {
    assertHasInit()
    const blockemonIds = getBlockemonIdsForOwner(context.sender)
    let blockemonList = new Array<Blockemon>()
    for (let i = 0; i < blockemonIds.length; i++) {
        const id = base64.decode(blockemonIds[i])
        if (blockemonMap.contains(id)) {
            blockemonList.push(blockemonMap.getSome(id))
        }
    }
    return blockemonList
}

/**
 * Gets a blockemon by a specified id. CEO can get any blockemon but users can only get blockemon they own.
 * @param id
 * @returns
 */
export function getBlockemonById(id: string): Blockemon {
    assertHasInit()
    const blockemon = blockemonById(id)
    if (isCEO()) {
        return blockemon
    }
    assertIsOwner(blockemon)
    return blockemon
}

/**
 * Gets all blockemon. Only available for CEO.
 * @returns
 */
export function getAllBlockemon(): Blockemon[] {
    assertHasInit()
    assertIsCEO()
    const allBlockemonIds = getAllBlockemonIds().reverse()
    const numberOfBlockemon = allBlockemonIds.length
    const result = new Array<Blockemon>(numberOfBlockemon)
    for (let i = 0; i < numberOfBlockemon; i++) {
        result[i] = blockemonById(allBlockemonIds[i])
    }
    return result
}
