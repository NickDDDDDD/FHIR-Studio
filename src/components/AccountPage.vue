<template>
    <div>
      
      <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
        <div>
          <img :src="userPhoto" alt="User Photo" class="rounded-circle" style="width: 100px; height: 100px;">
          <h2>{{ userName }}</h2>
        </div>
      </v-main>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        userName: "John Leider", // Replace with the actual user's name
        userPhoto: "https://randomuser.me/api/portraits/men/85.jpg", // Replace with the actual user's photo URL
      };
    },
  };
  </script>
  
  <style scoped>
  /* Add any additional CSS styles as needed */
  </style>
  