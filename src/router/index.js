import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../components/HomePage.vue";
import AccountPage from "../components/AccountPage.vue";
import LaunchPage from "../components/LaunchPage.vue";
import GraphPage from "../components/GraphPage.vue";
import PatientDetailPage from "../components/PatientDetailPage.vue";
import GeneratorPage from "../components/DataSetGenerator.vue";
import Chart from "../components/DraggableChart.vue";
import NewChart from "../components/DraggableNewChart.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: HomePage, // Route for the HomePage component
      name: "home", // Provide a name for the route
    },
    {
      path: "/account",
      component: AccountPage, // Route for the AccountPage component
      name: "account", // Provide a name for the route
    },
    {
      path: "/launch",
      component: LaunchPage,
      name: "launch",
    },
    {
      path: "/graph",
      component: GraphPage,
      name: "graph",
    },
    {
      path: "/patient-detail",
      component: PatientDetailPage,
      name: "patientDetails",
    },
    {
      path: "/generator",
      component: GeneratorPage,
      name: "generator",
    },
    {
      path: "/chart",
      component: Chart,
      name: "chart",
    },
    {
      path: "/newchart",
      component: NewChart,
      name: "newchart",
    },
    // Other routes if needed
  ],
});

export default router;
