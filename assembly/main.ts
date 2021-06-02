/** @format */

import { context, base64, math, storage } from 'near-sdk-as'
import {
    Monkey,
    monkeyIdMap,
    MonkeySpecies,
    monkeySpeciesIdMap,
    orderedMonkeyIdList,
    orderedMonkeySpeciesIdList,
} from './models'
import {
    assertHasInit,
    assertIsCEO,
    isCEO,
    addNewMonkeySpecies,
    addNewMonkey,
    monkeyById,
    assertCanTransfer,
    addMonkeyToOwner,
    removeMonkeyFromOwner,
    assertIsOwner,
    deleteFromMonkeyBlockemonList,
    getMonkeyIdsForOwner,
    getAllMonkeyIds,
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
    const monkey = monkeyById(id)
    assertCanTransfer(monkey)
    removeMonkeyFromOwner(monkey, monkey.owner)
    addMonkeyToOwner(monkey, newOwner)
    return monkey
}

export function deleteMonkey(id: u64): void {
    assertHasInit()
    const monkey = monkeyById(id)
    assertIsOwner(monkey)
    removeMonkeyFromOwner(monkey, monkey.owner)
    deleteFromMonkeyBlockemonList(id)
    monkeyIdMap.delete(id)
}

/*****************/
/* VIEW METHODS */
/****************/

/**
 * Gets the list of monkeys for a the sender's account.
 * @param owner
 * @returns
 */
export function getUserMonkeys(): Monkey[] {
    assertHasInit()
    const monkeyIds = getMonkeyIdsForOwner(context.sender)
    let monkeyList = new Array<Monkey>()
    const numIds = monkeyIds.length
    for (let i = 0; i < numIds; i++) {
        const id = monkeyIds[i]
        if (monkeyIdMap.contains(id)) {
            monkeyList.push(monkeyIdMap.getSome(id))
        }
    }
    return monkeyList
}

/**
 * Gets a monkey by a specified id. CEO can get any monkey but users can only get monkey they own.
 * @param id
 * @returns
 */
export function getMonkeyById(id: u64): Monkey {
    assertHasInit()
    const monkey = monkeyById(id)
    if (isCEO()) {
        return monkey
    }
    assertIsOwner(monkey)
    return monkey
}

/**
 * Gets all monkeys. Only available for CEO.
 * @returns
 */
export function getAllMonkeys(): Monkey[] {
    assertHasInit()
    assertIsCEO()
    const allMonkeyIds = getAllMonkeyIds().reverse()
    const numberOfBlockemon = allMonkeyIds.length
    const result = new Array<Monkey>(numberOfBlockemon)
    for (let i = 0; i < numberOfBlockemon; i++) {
        result[i] = monkeyById(allMonkeyIds[i])
    }
    return result
}
