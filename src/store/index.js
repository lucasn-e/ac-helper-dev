import Vue from 'vue';
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    displayData: 'fish',
    sortType: 'name',
    fish: '',
    insects: ''
  },
  mutations: {
    assignDisplayData(state, data) {
      state.displayData = data;
    },
    assignSortType(state, data) {
      state.sortType = data;
    },
    storeFish(state, data) {
      if (state.fish.includes(data)) {
        state.fish = state.fish.replace(data, '');
      } else {
        state.fish = state.fish + data;
      }
    },
    storeInsect(state, data) {
      if (state.insects.includes(data)) {
        state.insects = state.insects.replace(data, '');
      } else {
        state.insects = state.insects + data;
      }
    }
  },
  actions: {
    getData({ commit }) {
      const fish = localStorage.getItem('myfishies');
      const insects = localStorage.getItem('myinsecties');
      const data = JSON.parse(localStorage.getItem('selection'));
      commit('assignDisplayData', data.displayData);
      commit('assignSortType', data.sortType);
      commit('storeFish', fish);
      commit('storeInsect', insects);
    },
    storeData({ state }) {
      localStorage.setItem('myfishies', state.fish);
      localStorage.setItem('myinsecties', state.insects);
    },
    storeSelection({ state }) {
      const data = {
        displayData: state.displayData,
        sortType: state.sortType
      }
      localStorage.setItem('selection', JSON.stringify(data));
    }
  }
});

export default store;