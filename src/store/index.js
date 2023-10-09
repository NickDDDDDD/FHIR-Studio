import { createStore } from 'vuex';

export default createStore({
  state: {
    
    fhirData: null,
  },
  mutations: {
    
    setFhirData(state, payload) {
      state.fhirData = payload;
    },
  },
  actions: {
    
  },
  getters: {
    
  },
  modules: {
    
  },
});
