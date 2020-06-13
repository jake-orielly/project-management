import Vue from "vue";
import Vuex from "vuex";
 
Vue.use(Vuex);
 
export default new Vuex.Store({
 state: {
    taskList:[]
 },
 getters: {},
 mutations: {
    setTaskList (state, list) {
        state.taskList = list
    }
 },
 actions: {}
});