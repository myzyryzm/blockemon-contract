/** @format */

import { base64, context, math, storage } from 'near-sdk-as'
import {
    MonkeySpecies,
    monkeySpeciesIdMap,
    monkeyIdMap,
    Monkey,
    monkeyIdOwnerMap,
    MonkeyIdList,
    orderedMonkeyIdList,
    orderedMonkeySpeciesIdList,
    EscrowMonkeyIds,
    monkeyEscrowMap,
} from './models'

// GENERAL

/**
 * Has contract been initialized
 */
export function assertHasInit(): void {
    assert(storage.hasKey('init'), 'contract not initialized')
}

export function isCEO(): bool {
    return storage.get<string>('ceo') == context.sender
}

/**
 * If the user interacting with the contract the ceo
 */
export function assertIsCEO(): void {
    assert(isCEO(), 'User is not ceo')
}

/**
 * returns true if the context.sender is the owner of the blockemon
 * @param monkey
 */
export function assertIsOwner(monkey: Monkey): void {
    assert(
        monkey.owner == context.sender,
        'The blockemon does not belong to ' + context.sender
    )
}

/**
 * Checks to see if the context.sender
 * @param monkey
 */
export function assertCanTransfer(monkey: Monkey): void {
    // if not the owner of the monkey then we need to check
    if (monkey.owner !== context.sender) {
        const escrowIds: EscrowMonkeyIds = monkeyEscrowMap.getSome(monkey.id)
        assert(escrowIds.id.includes(context.sender))
    }
}

/**
 * returns a random number between 0 and 99
 * @returns
 */
export function randomNumber(): i32 {
    return math.hash32Bytes(math.randomBuffer(4)) % 100
}

// MONKEY SPECIES

/**
 * Creates a new monkey species
 * @param id
 * @param maxMonkeys
 * @returns the newly created MonkeySpecies
 */
export function addNewMonkeySpecies(id: u64, maxMonkeys: u64): MonkeySpecies {
    assert(
        !monkeySpeciesIdMap.contains(id),
        'Cannot create monkey species with that id'
    )
    const species = new MonkeySpecies(id, maxMonkeys)
    monkeySpeciesIdMap.set(species.id, species)
    addMonkeySpeciesToGlobalList(id)
    return species
}

export function getAllMonkeySpeciesIds(): Array<u64> {
    const monkeyIdList = orderedMonkeySpeciesIdList.get('all')
    return monkeyIdList ? monkeyIdList.id : new Array<u64>()
}

export function addMonkeySpeciesToGlobalList(speciesId: u64): void {
    const monkeyIds = getAllMonkeyIds()
    assert(
        !monkeyIds.includes(speciesId),
        'Error: Trying to add monkey to monkey id list that already exists'
    )
    monkeyIds.push(speciesId)
    const monkeyIdList = new MonkeyIdList(monkeyIds)
    orderedMonkeySpeciesIdList.set('all', monkeyIdList)
}

// MONKEY

/**
 * Creates a new monkey
 * @param id
 * @param speciesId
 * @param owner
 * @returns
 */
export function addNewMonkey(id: u64, speciesId: u64, owner: string): Monkey {
    assert(!monkeyIdMap.contains(id), 'Error: monkey with id already exists')
    const species = monkeySpeciesIdMap.getSome(speciesId)
    const monkey: Monkey = new Monkey(id, speciesId, owner)
    assert(
        species.numberIssued < species.maxMonkeys,
        'Error: all monkeys of this species have been issued'
    )
    addMonkeyToOwner(monkey, owner)
    addMonkeyToGlobalList(monkey.id)
    return monkey
}

/**
 * Gets all the monkey ids for a specified owner
 * @param owner
 * @returns
 */
export function getMonkeyIdsForOwner(owner: string): Array<u64> {
    const monkeyIdList = monkeyIdOwnerMap.get(owner)
    return !monkeyIdList ? new Array<u64>() : monkeyIdList.id
}

/**
 * Adds a monkey to the monkey owner map
 * @param monkeyId
 * @param owner
 */
export function addMonkeyToOwner(monkey: Monkey, owner: string): void {
    monkey.owner = owner
    const monkeyId = monkey.id
    const monkeyIds = getMonkeyIdsForOwner(owner)
    monkeyIds.push(monkeyId)
    monkeyIdOwnerMap.set(owner, new MonkeyIdList(monkeyIds))
}

/**
 * removes a monkey from the specified owner
 * @param monkeyId
 * @param owner
 */
export function removeMonkeyFromOwner(monkey: Monkey, owner: string): void {
    const monkeyId = monkey.id
    const monkeyIds = getMonkeyIdsForOwner(owner)
    for (let i = 0; i < monkeyIds.length; i++) {
        if (monkeyId === monkeyIds[i]) {
            monkeyIds.splice(i, 1)
            break
        }
    }
    monkeyIdOwnerMap.set(owner, new MonkeyIdList(monkeyIds))
}

// ALL MONKEYS

/**
 * adds a monkey to the orderedMonkeyIdList
 * @param monkeyId
 */
export function addMonkeyToGlobalList(monkeyId: u64): void {
    const monkeyIds = getAllMonkeyIds()
    assert(
        !monkeyIds.includes(monkeyId),
        'Error: Trying to add monkey to monkey id list that already exists'
    )
    monkeyIds.push(monkeyId)
    const monkeyIdList = new MonkeyIdList(monkeyIds)
    orderedMonkeyIdList.set('all', monkeyIdList)
}

/**
 * Deletes a blockemon from the ordered blockemon list with the given id.
 * @param id
 */
export function deleteFromMonkeyBlockemonList(id: u64): void {
    const globalIds = getAllMonkeyIds()
    for (let i = 0; i < globalIds.length; i++) {
        if (id == globalIds[i]) {
            globalIds.splice(i, 1)
            break
        }
    }
    orderedMonkeyIdList.set('all', new MonkeyIdList(globalIds))
}

/**
 *
 * @returns all the monkey ids from the monkeyid list
 */
export function getAllMonkeyIds(): Array<u64> {
    const monkeyIdList = orderedMonkeyIdList.get('all')
    return monkeyIdList ? monkeyIdList.id : new Array<u64>()
}

export function monkeyById(id: u64): Monkey {
    return monkeyIdMap.getSome(id)
}
