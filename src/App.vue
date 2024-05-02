<template>
  <v-app :class="{ 'dark-mode': darkMode }">
    <v-container>
      <HeaderTodo />
      <main style="padding-top: 64px; padding-bottom: 56px;"> <!-- Adjust the padding-top and padding-bottom values according to your header and footer height -->
        <h1 style="color:cornflowerblue;">Todo App</h1>
        <!-- <v-btn @click="toggleDarkMode">Toggle Dark Mode</v-btn>  Add a button to toggle dark mode --> 

        <AddTodo :darkMode="darkMode" />
        <TodoList :todos="todos" :darkMode="darkMode" />
        <FooterTodo />
      </main>
    </v-container>
  </v-app>
</template>

<script>
import AddTodo from './components/AddTodo.vue'
import TodoList from './components/TodoList.vue'
import HeaderTodo from './components/Header.vue'
import FooterTodo from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    AddTodo,
    TodoList,
    HeaderTodo,
    FooterTodo
  },
  computed: {
    todos() {
      return this.$store.state.todos 
    },
    darkMode: {
    get() {
      return this.$store.state.darkMode; // Get dark mode state from store
    },
    set(value) {
      this.$store.commit('SET_DARK_MODE', value); // Commit mutation to update dark mode state
    }
  }
  },
  created() {
    this.$store.dispatch('fetchTodos')
    // Check for local storage preference and set dark mode accordingly
    const localStorageDarkMode = localStorage.getItem('darkMode');
    if (localStorageDarkMode !== null) {
      this.darkMode = localStorageDarkMode === 'true'; // Convert string to boolean
    }
  },
  methods: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode; // Toggle dark mode state
      // Store dark mode preference in local storage
      localStorage.setItem('darkMode', this.darkMode);
    }
  }
}
</script>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 3rem;
  margin-top: 3rem;
}

.dark-mode .v-text-field,
.dark-mode .v-select {
  background-color: #222; /* Dark background color for text field and select */
  color: #fff; /* Light text color for text field and select */
}

.dark-mode .v-label {
  color: #fff; /* Light text color for label */
}

.dark-mode .v-select__selection,
.dark-mode .v-select__selection--comma,
.dark-mode .v-select__selection--disabled {
  color: #fff; /* Light text color for select value */
}

/* Add styles for light mode */
body {
  background-color: #fff;
  color: #000;
}

/* Add styles for dark mode */
.dark-mode {
  background-color: #222;
  color: #fff;
}
</style>
