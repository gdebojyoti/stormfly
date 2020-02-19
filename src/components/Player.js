import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader'
import { Ray } from '@babylonjs/core/Culling/ray'
import { Vector3 } from '@babylonjs/core/Maths/math'

import '@babylonjs/loaders/glTF' // OBJ loader

import Controls from 'utilities/Controls'
import Messenger from './Messenger'
import Ui from './Ui'

const DEFAULT_ANIMATION = 'idle'
const WALK_SPEED_FACTOR = 0.05
const GRAVITY_FACTOR = -2.45

class Player {
  constructor (scene, data) {
    this.initialize(scene, data)
  }

  initialize (scene, { canvas, colliders = [] } = {}) {
    this._scene = scene

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
    this.mesh = null // main mesh for 3d model; used to affect movement
    this.dirX = 0 // horizontal direction (along X axis)
    this.dirY = 0 // vertical direction (along Z axis)
    this.colliders = colliders // array of objects with which the player can collide

    this.importAsset(scene)
    this.addControls(canvas)
  }

  importAsset (scene) {
    SceneLoader.ImportMesh(
      null,
      'assets/models/',
      'vincent.glb',
      scene,
      this.onImportSuccess.bind(this)
    )
  }

  onImportSuccess (meshes, particleSystems, skeletons, animationGroups) {
    this.mesh = meshes[0]
    this.mesh.position = new Vector3(0, 5, 0)

    animationGroups[0].stop() // stop default animation

    this.assignAnimations(animationGroups)
    this.toggleAnimation(this.currentAnimation)

    // TODO: more accurate dimensions needed
    this.mesh.ellipsoid = new Vector3(0.5, 0.5, 0.5)

    Messenger.publish('PLAYER_LOADED', this.mesh)
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
        this.dirY = 1
      },
      down: () => {
        this.dirY = -1
      },
      left: () => {
        this.dirX = -1
      },
      right: () => {
        this.dirX = 1
      }
    })

    Controls.addListener('keyup', {
      up: () => {
        this.dirY = 0
      },
      down: () => {
        this.dirY = 0
      },
      left: () => {
        this.dirX = 0
      },
      right: () => {
        this.dirX = 0
      }
    })
  }

  // this method runs every frame
  update () {
    this.collisionOps()

    let anim = DEFAULT_ANIMATION
    if (this.dirX || this.dirY) {
      anim = 'run'
      this.movePlayer()
    } else {
      this.gravityOps()
    }

    // exit if current animation remains unchanged
    if (this.currentAnimation === anim) {
      return
    }

    // update current animation
    this.currentAnimation = anim

    // TODO: Blend animations to create a more seamless experience
    Object.keys(this.animations).forEach(key => {
      // play current animation; stop other animations
      this.toggleAnimation(key, { isPlaying: key === anim })
    })
  }

  // do stuff if colliding
  collisionOps () {
    const collidedObject = this.checkForCollisions() || {}
    if (collidedObject.id) {
      Ui.triggerByCollision('PLAYER', collidedObject.id)
    } else {
      Ui.triggerByCollision('PLAYER')
    }
  }

  checkForCollisions () {
    // return false if model hasn't been loaded yet
    if (!this.mesh) {
      return null
    }

    // return this.colliders.some(collider => this.mesh.intersectsMesh(collider))
    let collidedObject = null

    this.colliders.forEach(collider => {
      if (this.mesh.intersectsMesh(collider)) {
        collidedObject = collider
      }
    })

    return collidedObject
  }

  // cause player to fall if no ground is detected underneath
  gravityOps () {
    console.log('detecting...', this.detectGround())
    if (!this.detectGround()) {
      this.fallFromGravity()
    }
  }

  // detect if there is a ground (with slope < 10 degrees) underneath player
  detectGround () {
    // exit if model hasn't been loaded yet
    if (!this.mesh) {
      return
    }

    const ray = new Ray(this.mesh.position, new Vector3(0, -1, 0), 0.6)
    const intersectedPoint = this._scene.pickWithRay(ray)

    // intersectedPoint.hit is false if ray did not hit anything
    if (!intersectedPoint.hit) {
      return
    }

    const normal = intersectedPoint.getNormal(true)
    const gravity = new Vector3(0, 1, 0)

    const angle = Math.round(Math.acos(Vector3.Dot(normal, gravity)) * 180 / Math.PI)
    return angle < 10
  }

  // player falls down when unobstructed (i.e., when no ground underneath)
  // TODO: Find fix to avoid sliding in case of gentle slopes
  // TODO: Find a better place for this functionality
  fallFromGravity () {
    // exit if model hasn't been loaded yet
    if (!this.mesh) {
      return
    }

    this.mesh.moveWithCollisions(new Vector3(0, GRAVITY_FACTOR * WALK_SPEED_FACTOR, 0))
  }

  movePlayer () {
    const vector = new Vector3(this.dirX, 0, this.dirY).normalize()
    this.mesh.moveWithCollisions(new Vector3(vector.x * WALK_SPEED_FACTOR, GRAVITY_FACTOR * WALK_SPEED_FACTOR, vector.z * WALK_SPEED_FACTOR))
    this.mesh.rotation = new Vector3(0, Math.atan2(this.dirY, -this.dirX) + Math.PI / 2, 0)
  }
}

export default Player
