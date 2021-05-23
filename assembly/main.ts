/** @format */

import { context, base64, math, storage } from 'near-sdk-as'
import {
    Blockemon,
    blockemonMap,
    MonkeySpecies,
    monkeySpeciesIdMap,
    orderedMonkeyIdList,
    orderedMonkeySpeciesList,
} from './models'
import {
    addBlockemon,
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
 * Creates a blockemon and assigns its owner as specified in the transaction.
 * @param owner
 */
export function createBlockemon(owner: string): Blockemon {
    assertHasInit()
    assertIsCEO()
    const id = base64.encode(math.randomBuffer(16))
    const blockemon = new Blockemon(id, owner)
    addBlockemon(blockemon, owner, true)
    return blockemon
}

/**
 * Create a monkey species with an auto generated id
 * @param maxMonkeys
 * @returns
 */
export function createMonkeySpecies(maxMonkeys: u64): MonkeySpecies {
    assertIsCEO()
    const speciesIdList = orderedMonkeySpeciesList.get('all')
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

// /**
//  * Transfers a blockemon with specified id from the sender to a newOwner.
//  * @param newOwner
//  * @param id
//  */
export function transferBlockemon(newOwner: string, id: string): void {
    assertHasInit()
    const blockemon = blockemonById(id)
    assertIsOwner(blockemon)
    removeBlockemonFromOwner(blockemon.owner, id)
    blockemon.owner = newOwner
    addBlockemon(blockemon, newOwner, false)
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
