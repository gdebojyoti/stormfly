/** @jsx h */
import { h } from 'preact'

import creatures from 'data/creatures.json'

console.log('creatures', creatures)

const Player = () => {
  return (
    <div>
      <h3>P1</h3>
      <Creature />
    </div>
  )
}

const Creature = () => {
  return (
    <div>
      Creature name
      <Stats />
      <Moves />
    </div>
  )
}

const Stats = () => {
  return (
    <div>
      <Stat />
    </div>
  )
}

const Stat = () => {
  return (
    <div>
      stat: value
    </div>
  )
}

const Moves = () => {
  return (
    <div>
      <Move />
    </div>
  )
}

const Move = () => {
  return (
    <div>
      move: value
    </div>
  )
}

export default Player
