import { createStore } from "vuex"
let store = {
  state:<any> {},
  getters:<any> {},
  mutations:<any> {},
  actions:<any>{}
};

function initVuex() {
  const modules:any = import.meta.globEager("./modules/*.ts")
  const keys = Object.keys(modules)

  for (let i = 0; i < keys.length; i++) {
    store.state = { ...store.state, ...modules[keys[i]].default.state }
    store.getters = { ...store.getters, ...modules[keys[i]].default.getters }
    store.mutations = { ...store.mutations, ...modules[keys[i]].default.mutations }
    store.actions = { ...store.actions, ...modules[keys[i]].default.actions }
  }
}
initVuex();

export default createStore(store)