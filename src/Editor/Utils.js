import { saveToLocalStorage, getFromLocalStorage } from 'utilities'

const defaultLevelData = {
  v: 0, // version details
  zone1: []
}

class Utils {
  static addModel (modelId, mesh) {
    const levelData = getFromLocalStorage('levelData') || defaultLevelData

    // check entry for modelId in level data
    const entry = levelData.zone1.find(model => model && model.modelId === modelId)

    // if entry is found, ensure instance with same id doesn't exist
    if (entry) {
      const instance = entry.instances.find(instance => instance && instance.id === mesh.id)

      // exit if such an entry is found
      if (instance) {
        console.warn(`Instance with id ${mesh.id} already exists`)
        return
      }
    }

    const instanceData = {
      id: mesh.id,
      position: {
        x: mesh.position.x,
        y: mesh.position.y,
        z: mesh.position.z
      },
      rotation: {
        x: 0,
        y: 0,
        z: 0
      },
      scale: {
        x: mesh.scaling.x,
        y: mesh.scaling.y,
        z: mesh.scaling.z
      }
    }

    if (!entry) {
      // for new entry
      levelData.zone1.push({
        modelId,
        instances: [instanceData]
      })
    } else {
      // for existing entry, push new data into its list of instances
      entry.instances.push(instanceData)
    }

    saveToLocalStorage('levelData', levelData)
    console.info('Model added. New level data:', levelData)
  }

  static updateModel (mesh) {
    const modelId = mesh.data.modelId

    // exit if modelId not found
    if (!modelId) {
      return
    }

    const levelData = getFromLocalStorage('levelData') || defaultLevelData

    // check entry for modelId in level data
    const entry = levelData.zone1.find(model => model && model.modelId === modelId)

    // exit if model is not available in level data
    if (!entry) {
      console.warn(`No models with id ${modelId} exist`)
      return
    }

    const index = entry.instances.findIndex(instance => instance && instance.id === mesh.id)

    // exit if instance of model with id does not exist
    if (index === -1) {
      console.warn(`No instance with id ${mesh.id} exists`)
      return
    }

    const eulerAngles = mesh.rotationQuaternion ? mesh.rotationQuaternion.toEulerAngles() : { x: 0, y: 0, z: 0 }
    console.log('quaternion', mesh.rotationQuaternion, eulerAngles)

    entry.instances[index] = {
      ...entry.instances[index],
      position: {
        x: mesh.position.x,
        y: mesh.position.y,
        z: mesh.position.z
      },
      rotation: {
        x: eulerAngles.x,
        y: eulerAngles.y,
        z: eulerAngles.z
      },
      scale: {
        x: mesh.scaling.x,
        y: mesh.scaling.y,
        z: mesh.scaling.z
      }
    }

    saveToLocalStorage('levelData', levelData)
    console.info('Model updated. New level data:', mesh.position.x, levelData)
  }
}

export default Utils
