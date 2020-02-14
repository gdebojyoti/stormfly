import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader'
import { Axis } from '@babylonjs/core/Maths/math'

const total = 360
let counter = 0 // to keep track of number of trees loaded

class Scene {
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
