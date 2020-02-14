import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader'
import { Vector3 } from '@babylonjs/core/Maths/math'

import '@babylonjs/loaders/gLTF' // OBJ loader

import Controls from 'utilities/Controls'

const DEFAULT_ANIMATION = 'idle'

class Player {
  constructor (scene, canvas) {
    this.initialize(scene, canvas)
  }

  initialize (scene, canvas) {
    this.isWalking = false // player is idle by default
    this.currentAnimation = DEFAULT_ANIMATION
    this.animations = {
      idle: null,
      walk: null,
      run: null,
      walkBack: null,
      strafeLeft: null,
      strafeRight: null
    }

    this.importAsset(scene)
    this.addControls(canvas)
  }

  importAsset (scene) {
    SceneLoader.ImportMesh(
      null,
      'assets/models/',
      'vincent.glb',
      scene,
      (meshes, particleSystems, skeletons, animationGroups) => {
        const player = meshes[0]
        player.position = new Vector3(0, 2, 0)

        animationGroups[0].stop() // stop default animation

        this.assignAnimations(animationGroups)
        this.toggleAnimation(this.currentAnimation)
      }
    )
  }

  assignAnimations (animationGroups) {
    animationGroups.forEach(animationGroup => {
      if (this.animations[animationGroup.name] !== undefined) {
        this.animations[animationGroup.name] = animationGroup
      }
    })
  }

  toggleAnimation (type, { isLooping = true, isPlaying = true } = {}) {
    isPlaying && this.animations[type] && this.animations[type].start(isLooping)
    !isPlaying && this.animations[type] && this.animations[type].stop()
  }

  addControls (canvas) {
    Controls.addListener('keydown', {
      up: () => {
        this.isWalking = true
      },
      down: () => {
        console.log('Pressing S')
      }
    })

    Controls.addListener('keyup', {
      up: () => {
        this.isWalking = false
      }
    })
  }

  // this method runs every frame
  update () {
    let anim = DEFAULT_ANIMATION
    if (this.isWalking) {
      anim = 'walk'
    }

    // exit if current animation remains unchanged
    if (this.currentAnimation === anim) {
      return
    }

    // update current animation
    this.currentAnimation = anim

    Object.keys(this.animations).forEach(key => {
      // play current animation; stop other animations
      this.toggleAnimation(key, { isPlaying: key === anim })
    })
  }
}

export default Player
