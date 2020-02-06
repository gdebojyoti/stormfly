import { Engine } from '@babylonjs/core/Engines/engine'
import { Scene } from '@babylonjs/core/scene'
import { Vector3 } from '@babylonjs/core/Maths/math'
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera'
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'
import { Mesh } from '@babylonjs/core/Meshes/mesh'

import '@babylonjs/core/Materials/standardMaterial' // allow standard material to be used as default
import '@babylonjs/core/Meshes/meshBuilder' // allow Mesh to create default shapes (sphere, ground)
// import '@babylonjs/core/Meshes/Builders/sphereBuilder'
// import '@babylonjs/core/Meshes/Builders/boxBuilder'

import 'stylesheets/main.css'

const canvas = document.getElementById('canvas')
const engine = new Engine(canvas)
const scene = new Scene(engine)

const camera = new FreeCamera('camera1', new Vector3(0, 5, -10), scene)
camera.setTarget(Vector3.Zero()) // target camera towards scene origin
camera.attachControl(canvas, true) // attach camera to canvas

const light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene)
light.intensity = 0.7

const sphere = Mesh.CreateSphere('sphere1', 16, 2, scene) // Params: name, subdivs, size, scene
sphere.position.y = 2

Mesh.CreateGround('ground1', 6, 6, 2, scene) // Params: name, width, depth, subdivs, scene

engine.runRenderLoop(() => {
  scene.render()
})
