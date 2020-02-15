import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader'
import { Vector3, Matrix, Axis } from '@babylonjs/core/Maths/math'

const total = 360
let counter = 0 // to keep track of number of trees loaded

class Scene {
  // set basic info
  static initialize (scene, camera) {
    this.scene = scene
    this.camera = camera
  }

  // world coordinates to screen coordinates
  static mapPointToScreen (point = new Vector3(0, 0, 0)) {
    if (!this.camera) {
      return null
    }
    const { x, y } = Vector3.Project(
      point,
      Matrix.Identity(),
      this.scene.getTransformMatrix(),
      this.camera.viewport
    )

    return {
      x: Math.floor(window.innerWidth * x),
      y: Math.floor(window.innerHeight * y)
    }
  }

  // add 120 instances each of 3 different tree models
  static addDemoTrees (scene) {
    const assets = {
      trees: new Array(total / 3).fill(['TreePine1.glb', 'TreePine2.glb', 'TreePine3.glb']).flat()
    }
    this.gameObjects = {
      trees: []
    }

    console.info(`Loading ${total} trees...`)

    assets.trees.forEach((tree, index) => {
      const treeGO = new Mesh(`tree${index}`, scene) // empty game object
      this.gameObjects.trees.push(treeGO)
    })

    const rowCount = 17
    assets.trees.forEach((tree, index) => {
      SceneLoader.ImportMesh(
        null,
        'assets/models/',
        tree,
        scene,
        (meshes) => {
          // TODO: find a better way of assigning parent to an imported model
          meshes.forEach(mesh => { mesh.setParent(this.gameObjects.trees[index]) })
          this.gameObjects.trees[index].position.x = -Math.floor(index % (rowCount)) * 7
          this.gameObjects.trees[index].position.z = -Math.floor(index / (rowCount)) * 7

          this.gameObjects.trees[index].data = {
            rotationFactor: Math.random() * (index % 2 === 0 ? 1 : -1) // alternate clockwise & anti-clockwise rotations; randomize rotation speed
          }

          counter++
          if (counter === total) {
            console.info(`All ${total} trees have been loaded. Starting animation...`)
          }
        },
        // on progress handler
        progress => {}
      )
    })
  }

  // rotate demo trees
  static update () {
    // exit unless all trees have been loaded
    if (counter !== total) {
      return
    }

    this.gameObjects.trees.forEach((tree, index) => {
      tree.data && tree.rotate(Axis.Y, tree.data.rotationFactor * Math.PI / 150)
    })
  }
}

export default Scene
