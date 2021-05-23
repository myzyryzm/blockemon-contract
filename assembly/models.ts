/** @format */

import { PersistentMap } from 'near-sdk-as'

/**
 * Handles data relevant to the contract (e.g. the address of the account )
 */
@nearBindgen
export class BlockemonContract {
    constructor(public ceoAddress: string = '') {}
}

@nearBindgen
export class BlockemonIdList {
    constructor(public id: Array<string>) {}
}

@nearBindgen
export class Blockemon {
    distanceRan: u64 = 0
    coinsCollected: u64 = 0
    gene1: u8 = 10
    bodyPrimaryColor: u8 = 0
    bodySecondaryColor: u8 = 1

    constructor(public id: string, public owner: string) {}
}

@nearBindgen
export class MonkeyIdList {
    constructor(public id: Array<u64>) {}
}

@nearBindgen
export class EscrowMonkeyIds {
    constructor(public id: Array<string>) {}
}

// @nearBindgen
// export class

@nearBindgen
export class Monkey {
    constructor(public id: u64, public speciesId: u64, public owner: string) {}
}

// mapping of monkey
// key => Monkey.id; value => list of account ids other than the owner account and the contract account that can transfer
export const monkeyEscrowMap = new PersistentMap<u64, EscrowMonkeyIds>('e')

// genes
// 3 => AA | 2 => Aa | 1 => aa
@nearBindgen
export class MonkeySpecies {
    numberIssued: u64
    constructor(public id: u64, public maxMonkeys: u64) {}
}

// key => pokemon id in Unit8Array; value => pokemon
export const blockemonMap = new PersistentMap<Uint8Array, Blockemon>('m')

// key => ownerId; value => list of ids of pokemon
export const blockemonByOwner = new PersistentMap<string, BlockemonIdList>('o')

// key => 'all'; value => list of all the pokemon ids
export const orderedBlockemonList = new PersistentMap<string, BlockemonIdList>(
    'l'
)

export const blockemonContract: BlockemonContract = new BlockemonContract()

// key => Monkey.id; value => Monkey
export const monkeyIdMap = new PersistentMap<u64, Monkey>('mon')

// key => owner; value => list of Monkey.id the owner has access to
export const monkeyIdOwnerMap = new PersistentMap<string, MonkeyIdList>('own')

// key => MonkeySpecies.id; value => MonkeySpecies
export const monkeySpeciesIdMap = new PersistentMap<u64, MonkeySpecies>('ms')

// key => 'all'; value => list of all the monkey species ids
export const orderedMonkeySpeciesList = new PersistentMap<string, MonkeyIdList>(
    'omsl'
)

// key => 'all'; value => list of all the monkey ids
export const orderedMonkeyIdList = new PersistentMap<string, MonkeyIdList>(
    'oml'
)
