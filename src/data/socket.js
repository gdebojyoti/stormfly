// list of messages via Socket

import { PlayerPublicProfile, BattleMove } from './models'

export const messagesFromClient = [
  {
    key: 'PLAYER_ENQUIRY',
    data: {
      id: 0 // ID of player whose details are needed
    }
  },
  {
    key: 'BATTLE_REQUEST',
    data: {
      id: 0 // ID of player against whom battle is to be fought
    }
  },
  {
    // when player selects a move
    key: 'BATTLE_TURN',
    data: {
      moves: [BattleMove]
    }
  }
]

export const messagesFromServer = [
  {
    key: 'PLAYER_DETAILS_PUBLIC',
    data: {
      ...PlayerPublicProfile
    }
  },
  {
    key: 'BATTLE_REQUEST_INITIATED', // when a player sends battle request to another player
    data: {
      ...PlayerPublicProfile // details of player who has made the request
    }
  },
  {
    key: 'BATTLE_TURN_RESULT',
    data: {
      creatures: [
        {
          creatureId: '',
          overallStats: {
            hp: 0,
            atk: 0,
            def: 0,
            sta: 0,
            crtCnc: 0,
            crtDmg: 0
          },
          buffs: [] // list of buff IDs
        }
      ]
    }
  }
]
