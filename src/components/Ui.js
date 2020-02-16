const triggers = {}

class UI {
  static triggerByCollision (owner, triggeredBy = '', data) {
    if (!owner) {
      console.warn('Invalid trigger. Every trigger should have an owner')
      return
    }

    // exit if new trigger is same as current
    if (triggeredBy === triggers[owner]) {
      return
    }

    // update current trigger value
    triggers[owner] = triggeredBy

    console.log(`Showing ${owner}'s UI for ${triggeredBy}`, data)
  }
}

export default UI
