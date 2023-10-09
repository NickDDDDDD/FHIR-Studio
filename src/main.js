import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import your router configuration
import vuetify from './plugins/vuetify'; // Import your Vuetify configuration
import store from './store';
import elementPlus from 'element-plus';
import 'element-plus/dist/index.css';

createApp(App)
  .use(router) // Use Vue Router
  .use(vuetify) // Use Vuetify
  .use(store).use(elementPlus)
  .mount('#app');
