<template>
  <div>


    <!-- Main content -->
    <div :class="[mode === 'compact' ? 'input-section-compact' : 'input-section']">
      <!-- Search bar -->
      <v-text-field v-model="search" label="Search" variant="outlined" hide-details dense prepend-inner-icon="mdi-magnify" :style="{ paddingBottom: '20px' }"></v-text-field>
      &nbsp;
      <!-- Filter dropdown -->
      <v-select v-model="selectedStatus" :items="[null, ...statusOptions]" label="Filter by Status" variant="outlined" ></v-select>
   </div>
 
    <v-data-table 
      :headers="headers"
      :items="filteredTodos"
      item-key="id"
      class="rounded-table"
      :class="{ 'dark-mode': darkMode }"
    >
      <!-- Slot for customizing created at column -->
      <template v-slot:[`item.createdAt`]="{ item }">
        {{ item && item.createdAt ? formatDate(item.createdAt) : '' }}
      </template>
      <!-- Slot for customizing updated at column -->
      <template v-slot:[`item.updatedAt`]="{ item }">
        {{ item && item.updatedAt ? formatDate(item.updatedAt) : '' }}
      </template>
      <!-- Slot for customizing actions column -->
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn color="error" @click="openDeleteDialog(item)">Delete</v-btn>
        <v-btn color="primary" @click="editTodo(item)">Edit</v-btn>
      </template>
      
      <!-- Include the table headings within the <thead> element -->
      <template v-slot:thead>
        <thead>
          <tr>
            <th v-for="header in headers" :key="header.value">{{ header.text }}</th>
          </tr>
        </thead>
      </template>

      <!-- Main body of the table -->
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.title }}</td>
          <td>
            <v-badge :content="item.status" :color="getStatusBadgeColor(item.status)" overlap>
              <v-icon>{{ getStatusIcon(item.status) }}</v-icon>
            </v-badge>
          </td>
          <td>{{ formatDate(item.createdAt) }}</td>
          <td>{{ formatDate(item.updatedAt) }}</td>
          <td>
            <v-icon color="primary" @click="editTodo(item)" class="icon-padding">mdi-pencil</v-icon>
            <v-icon color="error" @click="openDeleteDialog(item)" class="icon-padding">mdi-delete</v-icon>
          </td>
        </tr>
      </template>
    </v-data-table>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="500" :class="{ 'dark-mode': darkMode }">
      <v-card>
        <v-card-title>Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete this todo?
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="deleteTodo">Yes</v-btn>
          <v-btn @click="closeDeleteDialog">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Edit Todo Form -->
    <v-dialog v-model="editMode" max-width="500" >
      <v-card >
        <v-card-title>Edit Todo</v-card-title>
        <v-card-text :class="{ 'dark-mode': darkMode }">
          <v-form @submit.prevent="saveEditedTodo" :class="{ 'dark-mode': darkMode }">
            <v-text-field v-if="editingTodo" v-model="editingTodo.title" label="Title"  required ></v-text-field>
            <v-select v-if="editingTodo" v-model="editingTodo.status" label="Status" :items="statusOptions" ></v-select>
            <v-btn v-if="editingTodo" type="submit" color="primary">Save</v-btn>
            <v-btn v-if="editingTodo" @click="cancelEdit">Cancel</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Edit Todo Success Alert -->
    <v-snackbar v-model="editAlert"  color="success" top right>
      Todo edited successfully.
    </v-snackbar>

    <!-- Toast notification for todo deletion -->
    <v-snackbar v-model="alert"  color="success" top right>
      Todo deleted successfully.
    </v-snackbar>
    
    <v-alert v-if="error" dense outlined type="error" class="validation-alert" colored-border>
  <template #icon>
    <v-icon color="error">mdi-alert-circle-outline</v-icon>
  </template>
  {{ error }}
</v-alert>

<FooterTodo />
  </div>
</template>

<script>

import FooterTodo from '../components/Footer.vue'
export default {
  components: {
    FooterTodo, // Register the Footer component
  },
  props: ['todos'],
  data() {
    return {
      editMode: false,
      darkMode: false, // Toggle dark mode
      editingTodo: {
        title: '',
        status: '', // Initial state as an empty string
        createdAt: null,
        updatedAt: null,
      },
      statusOptions: ['completed', 'in-progress', 'not-started'],
      deleteDialog: false,
      todoToDelete: null, // Store the todo item to be deleted
      alert: false,
      editAlert: false, 
      search: '',
      selectedStatus: null,// eslint-disable-line
      error: null, // Error message
    };
  },
  computed: {
    filteredTodos() {
      let filtered = [];

      // Check if todos is an array
      if (Array.isArray(this.todos)) {
        filtered = this.todos;

        // Filter by search input
        if (this.search) {
          const searchTerm = this.search.toLowerCase();
          filtered = filtered.filter(todo => todo.title.toLowerCase().includes(searchTerm));
        }

        // Filter by selected status
        if (this.selectedStatus !== null) {
          filtered = filtered.filter(todo => todo.status === this.selectedStatus);
        }
      }

      return filtered;
    },
    headers() {
      return [
        { text: 'Task', value: 'title', align: 'start' },
        { text: 'Status', value: 'status' },
        { text: 'Created At', value: 'createdAt' },
        { text: 'Last Updated At', value: 'updatedAt' },
        { text: 'Actions', value: 'actions', sortable: false },
      ];
    }
  },
  methods: {
    openDeleteDialog(todo) {
      this.todoToDelete = todo; // Store the todo item to be deleted
      this.deleteDialog = true; // Open the delete confirmation dialog
    },
    
    closeDeleteDialog() {
      this.deleteDialog = false; // Close the delete confirmation dialog
      this.todoToDelete = null; // Reset the todo to delete
    },
    editTodo(todo) {
      this.editingTodo = { ...todo };
      this.editMode = true;
    },
    async saveEditedTodo() {
      try {
        if (this.editingTodo) {
          await this.$store.dispatch('editTodo', this.editingTodo);
          this.editMode = false;
          this.editingTodo = null;

          this.editAlert = true;
          setTimeout(() => {
            this.editAlert = false;
          }, 2000);

          // Close edit mode
          this.cancelEdit();
        }
      } catch (error) {
        this.error = 'An error occurred while saving the todo.'; // Set error message
        console.error('Error saving todo:', error); // Log the error for debugging
      }
    },
    async deleteTodo() {
      try {
        if (this.todoToDelete) {
          await this.$store.dispatch('deleteTodo', this.todoToDelete.id); // Delete the todo
          this.closeDeleteDialog(); // Close the delete confirmation dialog
          this.alert = true; // Show the toast notification
          setTimeout(() => {
            this.alert = false;
          }, 2000);
        }
      } catch (error) {
        this.error = 'An error occurred while deleting the todo.'; // Set error message
        console.error('Error deleting todo:', error); // Log the error for debugging
      }
    },
    cancelEdit() {
      if (this.editingTodo) {
        this.editMode = false;
        this.editingTodo = null;
      }
    },
    formatDate(timestamp) {
      const date = timestamp.toDate(); // Convert Firebase Timestamp to JavaScript Date object
      return date.toLocaleString(); // Format date as desired
    },
    getStatusBadgeColor(status) {
      // Define badge colors based on status
      switch (status) {
        case 'completed':
          return 'green'; // Green badge for completed status
        case 'in-progress':
          return 'orange'; // Orange badge for in-progress status
        case 'not-started':
          return 'red'; // Red badge for not-started status
        default:
          return 'gray'; // Gray badge for other statuses
      }
    },
    getStatusIcon(status) {
      // Define icon based on status
      switch (status) {
        case 'completed':
          return 'mdi-check-circle-outline'; // Checkmark icon for completed status
        case 'in-progress':
          return 'mdi-progress-clock'; // Clock icon for in-progress status
        case 'not-started':
          return 'mdi-alert-circle-outline'; // Warning icon for not-started status
        default:
          return 'mdi-help-circle-outline'; // Question mark icon for other statuses
      }
    }
  }
};
</script>

<style scoped>
/* Add custom styles for the table */
.v-data-table {
  border: 1px solid #ccc;
}

.v-data-table thead th {
  background-color: #f5f5f5;
}
.icon-padding {
  padding: 15px; 
}
.v-data-table tbody td {
  border-top: 1px solid #ddd;
}

.v-btn {
  margin-right: 5px;
}
.rounded-table  {
  border-radius: 10px; /* Add border radius to the table */
}

/* Custom styles for search bar */
.v-text-field, .v-select {
  margin-bottom: 10px; /* Add some space between search bar and table */
}

/* Custom animation for input fields */
.v-input__slot {
  transition: all 0.3s ease;
}

/* Custom animation for input fields when focused */
.v-text-field:focus-within .v-input__control, 
.v-select:focus-within .v-input__control {
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1); /* Example: Adds a shadow when focused */
}

.input-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.buttons {
  display: flex;
  justify-content: flex-end; /* Align buttons to the right */
}
/* Compact mode style */
.input-section-compact {
  display: flex;
  align-items: center;
}

.input-section-compact .v-text-field,
.input-section-compact .v-select {
  max-width: 150px; /* Adjust as needed for compact mode */
  margin-right: 10px; /* Adjust spacing between search bar and filter dropdown */
}
/* Remove border when input field is focused */
.v-text-field .v-text-field__details--focused {
  border-color: transparent !important; /* Set border color to transparent */
}

/* Remove border when select field is focused */
.v-select .v-input__control--is-focused {
  border-color: transparent !important; /* Set border color to transparent */
}

.floating-button {
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 1000;
}

.validation-alert {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  border-radius: 8px; /* Rounded corners */
  padding: 12px 16px; /* Padding */
}

.validation-alert .v-icon {
  margin-right: 8px; /* Right margin for the icon */
}

</style>
<style scoped>
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
  background-color: #222;
}



/* Update styles for dark mode */
.dark-mode .rounded-table {
  background-color: #222; /* Dark background color for the table */
  color: #fff; /* Dark text color for the table */
}

.dark-mode .v-data-table thead th {
  background-color: #444; /* Dark background color for table header */
}

.dark-mode .v-data-table tbody td {
  border-top: 1px solid #555; /* Dark border color for table rows */
}

.dark-mode .v-select{
  background-color: #222;
  color: #fff;
}
.dark-mode .v-form{
  background-color: #222;
  color: #fff;
}
.dark-mode .v-text-field{
  background-color: #222;
  color: #fff;
}
</style>
