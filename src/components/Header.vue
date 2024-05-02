<template>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title class="mr-auto">Todo App</v-toolbar-title> <!-- Align to left -->
    <v-spacer></v-spacer>
    <v-btn icon @click="toggleDarkMode" class="toggle-button">
      <v-icon>{{ darkMode ? 'mdi-weather-night' : 'mdi-weather-sunny' }}</v-icon>
    </v-btn>
  </v-app-bar>
</template>


<script>
export default {
  name: 'HeaderTodo',
  computed: {
    darkMode() {
      return this.$store.state.darkMode;
    }
  },
  methods: {
    toggleDarkMode() {
      this.$store.dispatch('toggleDarkMode');
    }
  }
};
</script>

<style scoped>
.toggle-button {
  border-radius: 50%; /* Make the button circular */
  background-color: transparent; /* Transparent background */
  padding: 8px; /* Add some padding */
  transition: all 0.3s ease;
}

.toggle-button:hover {
  background-color: rgba(255, 255, 255, 0.1); /* Semi-transparent white background on hover */
}
</style>
