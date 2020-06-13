import Vue from "vue";
import Vuex from "vuex";
 
Vue.use(Vuex);
 
export default new Vuex.Store({
 state: {
    taskList:[],
    user:"",
 },
 getters: {},
 mutations: {
    setTaskList(state, list) {
        state.taskList = list
    },
    setUser(state, user) {
      state.user = user
  }
 },
 actions: {}
});