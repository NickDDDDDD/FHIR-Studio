/*client Id：a9802d26-c409-472b-9b79-d11c4c215133*/

<template>
  <v-app>
    <v-layout class="rounded rounded-md">
      <v-app-bar class="app-bar" :title="appBarTitle"></v-app-bar>

      <v-navigation-drawer
        class="nav-board"
        v-model="drawer"
        :rail="rail"
        permanent
      >
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
          title="John Leider"
          nav
        >
        </v-list-item>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item
            class="icon-button"
            prepend-icon="mdi-home-city"
            @click="navigateToHomePage"
            title="Home"
            value="home"
          >
          </v-list-item>

          <v-list-item
            class="icon-button"
            prepend-icon="mdi-account"
            @click="navigateToPage"
            title="Patient Details"
            value="patientDetails"
            v-if="route.name !== 'home'"
            >
          </v-list-item>

          <v-list-item @click="toggleRail">
            <v-icon v-if="rail === true" class="icon-button"
              >mdi-chevron-right</v-icon
            >
            <v-icon v-else class="icon-button">mdi-chevron-left</v-icon>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main class="main-content" style="min-height: 300px">
        <!-- Your main content goes here -->
        <router-view></router-view>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const drawer = ref(true); // Initially open the navigation drawer
const rail = ref(true); // Control rail visibility

const route = useRoute(); // Get current route
const router = useRouter(); // Get router instance

const appBarTitle = computed(() => {
  // Access the current route's name
  const currentRouteName = route.name;

  // Define a mapping of route names to titles
  const routeToTitleMap = {
    launch: "Launch Page",
    home: "Home Page",
    account: "My Account",
    patientDetails: "Patient Details",
    newchart: "New Dataset Generation Chart",
    chart: "Dataset Chart Editing",
    generator: "Data Generator",
    // Add more route titles as needed
  };

  // Return the appropriate title based on the current route name
  return routeToTitleMap[currentRouteName] || "Default Title";
});

const toggleRail = () => {
  rail.value = !rail.value;
};

const navigateToHomePage = () => {
  router.push("/");
};

const navigateToPage = () => {
  // Programmatically navigate to the specified route
  const patientId = localStorage.getItem('patientId');
  console.log("app.vue" + patientId);
  router.push({path: "/patient-detail", query:{patientId: patientId}});
};
</script>

<style scoped>
.app-bar {
  background-color: #6c979b; /* Set the background color to #c8d0c8 */
  font-family: "Lucida Grande", sans-serif;
  font-size: 24px;
  font-weight: bold;
  color: white;
}
.icon-button {
  color: #325c41; /* Set the color of the icon buttons to #679771 */
}

.main-content {
  background-color: #f5f5f5; /* Set the background color of the main content area to #f5f5f5 */
}

.nav-board {
  background-color: #f5f5f5; /* Set the background color of the main content area to #f5f5f5 */
}
</style>
