/** @format */

import { PersistentMap } from 'near-sdk-as'

@nearBindgen
export class MonkeyIdList {
    constructor(public id: Array<u64>) {}
}

@nearBindgen
export class EscrowMonkeyIds {
    constructor(public id: Array<string>) {}
}

@nearBindgen
export class Monkey {
    constructor(public id: u64, public speciesId: u64, public owner: string) {}
}

// mapping of monkey

// genes
// 3 => AA | 2 => Aa | 1 => aa
@nearBindgen
export class MonkeySpecies {
    numberIssued: u64
    constructor(public id: u64, public maxMonkeys: u64) {}
}

// key => Monkey.id; value => Monkey
export const monkeyIdMap = new PersistentMap<u64, Monkey>('mon')

// key => owner; value => list of Monkey.id the owner has access to
export const monkeyIdOwnerMap = new PersistentMap<string, MonkeyIdList>('own')

// key => 'all'; value => list of all the monkey ids
export const orderedMonkeyIdList = new PersistentMap<string, MonkeyIdList>(
    'oml'
)

// key => MonkeySpecies.id; value => MonkeySpecies
export const monkeySpeciesIdMap = new PersistentMap<u64, MonkeySpecies>('ms')

// key => 'all'; value => list of all the monkey species ids
export const orderedMonkeySpeciesIdList = new PersistentMap<
    string,
    MonkeyIdList
>('omsl')

// key => Monkey.id; value => list of account ids other than the owner account and the contract account that can transfer
export const monkeyEscrowMap = new PersistentMap<u64, EscrowMonkeyIds>('e')
