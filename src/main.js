import { createApp } from 'vue';
import App from './App.vue';
import store from './store'; // Import your Vuex store
import 'vuetify/dist/vuetify.min.css'; // Import Vuetify CSS
import { createVuetify } from 'vuetify'; // Import createVuetify from Vuetify
import * as components from 'vuetify/lib/components'; // Import Vuetify components from vuetify/lib
import * as directives from 'vuetify/lib/directives'; // Import Vuetify directives from vuetify/lib
import '@mdi/font/css/materialdesignicons.css';

// Create Vuetify instance
const vuetify = createVuetify({
  components,
  directives,
});

// Create Vue app instance
const app = createApp(App);

// Use Vuex store and Vuetify plugin
app.use(store);
app.use(vuetify);

// Mount the app to the '#app' element in your HTML
app.mount('#app');
