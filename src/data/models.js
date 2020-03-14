export const Player = {
  id: 0,
  username: '',
  firstName: '',
  lastName: '',
  joinedOn: '', // timestamp when player joined
  creatures: [
    {
      id: '', // a unique ID is generated & assigned when a player captures a creature; {playerId}_{creatureId}_{timestamp}
      creatureId: 0, // reference to creature's ID
      nickName: '', // nickname of creature that owner might have given
      capturedTimestamp: '', // when was the creature captured
      level: 0,
      movesActive: [], // list of moves that are currently active (max: 4)
      movesUnlocked: [], // list of moves that have been unlocked
      stats: {
        hp: 0,
        atk: 0,
        def: 0,
        stm: 0
      }
    }
  ],
  squad: [], // list (array of IDs) of tamed creatures that are in the squad (max: 6)
  primary: '', // ID of primary creature
  secondary: '', // ID of secondary creature; only primary & secondary are active in a battle
  wardrobe: {},
  inventory: {}
}

export const PlayerPublicProfile = {
  id: 0,
  username: '',
  firstName: '',
  lastName: '',
  joinedOn: '',
  squad: [
    {
      id: '',
      creatureId: 0,
      nickName: '',
      level: 0,
      movesActive: [],
      stats: {
        hp: 0,
        atk: 0,
        def: 0,
        sta: 0,
        crtCnc: 0,
        crtDmg: 0
      }
    }
  ],
  primaryCreature: '' // ID of creature
}

export const Creature = {
  id: 0,
  name: '',
  types: [], // list (array of IDs) of types (max: 2)
  moves: [], // list (array of IDs) of all possible moves for this creature
  baseStats: {
    hp: 100, // total health
    atk: 30, // damage it can cause
    def: 10, // amount by which damage can be reduced
    sta: 70, // stamina
    crtCnc: 5, // probability of critical damage occurring
    crtDmg: 20 // amount of critical damage that can be done
  },
  evolvesAt: 18 // level at which it will evolve; set to 0 if no further evolution is possible
}

export const CreatureType = {
  id: 0,
  name: '',
  strongAgainst: [0], // ID of weakness type(s)
  weakAgainst: [0] // ID of strength type(s)
}

// actual damage caused = (7 + Level/200 x Technique Damage x Attack/Defense) x Modifier
// https://www.ign.com/wikis/temtem/How_Combat_Works_(Tips)#How_Technique_Damage_is_Calculated
const MOVE_TARGET = {
  SELF: 'SELF',
  SINGLE: 'SINGLE', // any single entity - including self
  SINGLE_OTHER: 'SINGLE_OTHER', // any single entity - excluding self
  SELF_TEAM: 'SELF_TEAM', // all same team members
  OPP_TEAM: 'OPP_TEAM', // all opponent team members
  ALL: 'ALL' // all creatures in battle
}
export const CreatureMove = {
  id: 0,
  name: '',
  description: {
    text: '',
    links: [] // optional references to other moves
  },
  type: '', // ID of type of attack
  target: MOVE_TARGET.SINGLE, // whom the move targets
  stats: {
    dmg: 0, // amount of damage it can cause; positive values only
    sta: 0, // stamina cost; positive values only
    hp: 0, // amount of healing it can cause; positive values only
    atk: 0, // affects attack of target; positive or negative values
    def: 0 // affects defense of target; positive or negative values
  },
  buffs: [] // IDs of buffs applied; optional
}

// passive abilities of creatures; TODO: decide whether to merge them with MOVES or keep them separate
export const Passive = {
  id: 0,
  name: '',
  description: {
    text: '',
    links: []
  },
  buffs: [] // IDs of buffs applied
}

export const Buff = {
  id: 0,
  name: '',
  text: '',
  stats: {
    atk: 0, // affects attack of target; positive or negative values
    def: 0, // affects defense of target; positive or negative values
    turns: 0 // number of turns the buff lasts
  }
}

export const CreatureEvolutions = [
  [1, 11, 47],
  [2],
  [9, 10]
]

export const BattleMove = {
  sourceCreatureId: '', // ID of creature that makes the move
  moveId: 0, // ID of CreatureMove being used
  targetCreatureId: '' // ID of target creature; can be same as source
}
