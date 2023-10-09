<script setup>
import { onMounted } from "vue";
import FHIR from "fhirclient";

onMounted(() => {
  FHIR.oauth2.authorize({
    client_id: "a9802d26-c409-472b-9b79-d11c4c215133",
    scope: "patient/*.*",
  });
});
</script>

<template>
  <div>
    <!-- Your Vue template here -->
  </div>
</template>
