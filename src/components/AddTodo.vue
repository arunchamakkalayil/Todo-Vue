<template>
  <div>
    <!-- Floating button -->
    <v-col cols="auto">
      <v-btn icon="mdi-plus" size="large" class="floating-button" fab color="primary" @click="showDialog"></v-btn>
    </v-col>

    <!-- Dialog for adding todo -->
    <v-dialog v-model="dialog" max-width="500" :class="{ 'dark-mode': darkMode }"><!-- Apply dark-mode class conditionally -->
      <v-card :class="{ 'dark-mode': darkMode }">
        <v-card-title>Add Todo</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="validateAndAddTodo" :class="{ 'dark-mode': darkMode }">
            <v-text-field v-model="title" label="Task" placeholder="Type todo" outlined required></v-text-field>
            <v-select v-model="status" label="Status" :items="statusOptions" outlined required></v-select>
            <v-btn type="submit" color="primary">Save</v-btn> &nbsp;
            <v-btn @click="cancelEdit">Cancel</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- v-alert to display error message -->
    <v-alert v-if="showAlert" dense outlined type="error" class="validation-alert" colored-border>
      <template #icon>
        <v-icon color="error">mdi-alert-circle-outline</v-icon>
      </template>
      {{ alertMessage }}
    </v-alert>

    <!-- v-alert to display success message -->
    <v-alert v-if="showSuccess" dense type="success" class="validation-alert" colored-border>
      <template #icon>
        <v-icon color="success">mdi-checkbox-marked-circle</v-icon>
      </template>
      {{ alertMessage }}
    </v-alert>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      status: '', // Default status value
      statusOptions: ['completed', 'in-progress', 'not-started'], // Define status options
      dialog: false, // Flag to control visibility of dialog
      showAlert: false,
      showSuccess: false, // Flag to control visibility of v-alert
      alertMessage: '', // Error message to display in v-alert
      darkMode: false // Toggle dark mode
    };
  },
  methods: {
    showDialog() {
      this.dialog = true; // Show the dialog when the floating button is clicked
    },
    cancelEdit() {
      if (this.cancelEdit) {
        this.dialog = false;
      }
    },
    validateAndAddTodo() {
      if (this.title.trim() === '') {
        this.showAlert = true;
        this.alertMessage = 'Task is required';
        setTimeout(() => {
          this.showAlert = false; // Hide the alert after 2 seconds
        }, 2000);
        return;
      }
      if (this.status.trim() === '') {
        this.showAlert = true;
        this.alertMessage = 'Status is required';
        setTimeout(() => {
          this.showAlert = false; // Hide the alert after 2 seconds
        }, 2000);
        return;
      }
      const newTodo = { title: this.title, status: this.status };
      this.$store.dispatch('addTodo', newTodo);
      this.title = '';
      this.status = '';
      this.dialog = false; // Close the dialog after saving todo
      this.showSuccess = true;
      this.alertMessage = 'Todo Added Successfully';
      setTimeout(() => {
        this.showSuccess = false; // Hide the alert after 2 seconds
      }, 2000);
      return;
    }
  }
};
</script>

<style scoped>
.floating-button {
  position: fixed;
  bottom: 70px;
  right: 40px;
  z-index: 1000;
}

.validation-alert {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 1000;
  border-radius: 8px; /* Rounded corners */
  padding: 12px 16px; /* Padding */
}

.validation-alert .v-icon {
  margin-right: 8px; /* Right margin for the icon */
}

/* Add styles for dark mode */
.dark-mode {
  background-color: #333; /* Dark background color */
  color: #fff; /* Light text color */
  border-color: #555; /* Dark border color */
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
</style>
