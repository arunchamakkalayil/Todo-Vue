import Vuex from 'vuex';
import { db } from './firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

const store = new Vuex.Store({
  state: {
    todos: [],
    darkMode: false // Add darkMode state
  },
  mutations: {
    SET_TODOS(state, todos) {
      state.todos = todos;
    },
    ADD_TODO(state, todo) {
      state.todos.push(todo);
    },
    DELETE_TODO(state, id) {
      state.todos = state.todos.filter(todo => todo.id !== id);
    },
    EDIT_TODO(state, updatedTodo) {
      state.todos = state.todos.map(todo => {
        if (todo.id === updatedTodo.id) {
          return { ...todo, ...updatedTodo };
        } else {
          return todo;
        }
      });
    },
 
  SET_DARK_MODE(state, value) {
    state.darkMode = value;
  }
  },
  actions: {
    async fetchTodos({ commit }) {
      try {
        const querySnapshot = await getDocs(collection(db, 'todos'));
        const todos = [];
        querySnapshot.forEach(doc => {
          todos.push({ id: doc.id, ...doc.data() });
        });
        commit('SET_TODOS', todos);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    },
    async addTodo({ commit }, todo) {
      try {
        const createdAt = Timestamp.now();
        const newTodo = { ...todo, createdAt, updatedAt: createdAt };
        const docRef = await addDoc(collection(db, 'todos'), newTodo);
        commit('ADD_TODO', { id: docRef.id, ...newTodo });
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    },
    async deleteTodo({ commit }, id) {
      try {
        await deleteDoc(doc(db, 'todos', id));
        commit('DELETE_TODO', id);
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    },
    async editTodo({ commit }, editedTodo) {
      try {
        const updatedAt = Timestamp.now();
        const updatedTodo = { ...editedTodo, updatedAt };
        await updateDoc(doc(db, 'todos', editedTodo.id), updatedTodo);
        commit('EDIT_TODO', updatedTodo);
      } catch (error) {
        console.error('Error editing todo:', error);
      }
    },
    toggleDarkMode({ commit, state }) { // Pass state to access current darkMode value
      const newValue = !state.darkMode; // Toggle the current darkMode value
      commit('SET_DARK_MODE', newValue); // Commit mutation to update dark mode state
    }
}});

export default store;
