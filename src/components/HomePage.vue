<template>
  <div>
    <h1>Welcome to the Homepage</h1>
    <p>
      Please select a patient from the table below.
    </p>
    <p>{{ selectedData }}</p>
  </div>

  <div class="table-container">
    <!-- Your patient table -->
    <v-table
      class="custom-table"
      fixed-header
      height="500px"
      v-if="patientData && patientData.entry"
    >
      <thead>
        <tr>
          <th class="custom-header">Patient Name</th>
          <th class="custom-header">Patient ID</th>
        </tr>
      </thead>
      <tbody>
        <!-- Iterate over patient data, clicking on a row opens the observation dialog -->
        <tr
          v-for="entry in patientData.entry"
          :key="entry.resource.id"
          @click="openObservationDialog(entry.resource)"
        >
          <td>{{ getPatientName(entry.resource) }}</td>
          <td>{{ getPatientID(entry.resource) }}</td>
        </tr>
      </tbody>
    </v-table>
  </div>

  <!-- Observation type selection dialog -->
  <v-dialog v-model="observationDialog" max-width="600">
    <v-card>
      <v-card-title
        >Select Observation Type for {{ selectedPatientName }}</v-card-title
      >

      <v-card-text>
        <v-select
          v-model="selectedObservationType"
          :items="observationTypes"
          label="Observation Type"
        ></v-select>

        <!-- Start Date and End Date on the same line -->
        <div class="date-inputs">
          <v-text-field
            v-model="selectedStartDate"
            type="date"
            label="Start Date"
          ></v-text-field>

          <v-text-field
            v-model="selectedEndDate"
            type="date"
            label="End Date"
          ></v-text-field>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-btn @click="confirmObservationType" color="#40807a" variant="tonal"
          >Confirm</v-btn
        >
        <v-btn @click="closeObservationDialog">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import FHIR from "fhirclient";
import { useRouter } from "vue-router";
// import { useStore } from "vuex";

const client = ref(null);
const patientData = ref(null);

const observationDialog = ref(false);
const selectedPatientName = ref(""); // Initialize with an empty string

const selectedPatientId = ref("");
const selectedObservationType = ref("");
const selectedStartDate = ref(null); // Initialize as null
const selectedEndDate = ref(null); // Initialize as null
const selectedData = ref(null);

const observationTypes = ["Blood Pressure", "Blood Oxygen", "Heart Rate"];
const router = useRouter();
// const store = useStore();

// const fetchData = (client, patientID, observationCode, startDate, endDate) => {
//   let dateQuery = "";
//   if (startDate && endDate) {
//     dateQuery = `&date=ge${startDate}&date=le${endDate}`;
//   }
//
//   return client
//     .request(
//       `Observation?subject=Patient/${patientID}&code=${observationCode}${dateQuery}&_sort=-date`
//     )
//     .then((data) => {
//       console.log(data);
//       return data;
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// };

const fetchPatient = (client) => {
  return client.request("Patient?_sort=name").then((data) => {
    console.log("Patient data", data);
    //store.commit("setPatientData", data);
    return data;
  });
};

// const observationTypeToCode = {
//   "Heart Rate": "8867-4",
//   "Blood Pressure": "55284-4",
//   "Blood Oxygen": "20564-1",
// };

// // eslint-disable-next-line no-unused-vars
// const heartRate = "8867-4";
// // eslint-disable-next-line no-unused-vars
// const bloodPressure = "55284-4";
// // eslint-disable-next-line no-unused-vars
// const oxygenSaturation = "20564-1";

// let patientID = "152";

onMounted(() => {
  FHIR.oauth2
    .ready()
    .then((fhirClientInstance) => {
      client.value = fhirClientInstance;
      return fetchPatient(client.value); // 只调用 fetchPatient
    })
    .then((patientResponse) => {
      patientData.value = patientResponse;
    })
    .catch((error) => {
      console.error(error);
    });
});

const getPatientName = (resource) => {
  return `${resource.name[0].given.join(" ")} ${resource.name[0].family}`;
};

const getPatientID = (resource) => {


  return resource.id;
};

const openObservationDialog = (patientResource) => {
  // Extract and format the patient name from the resource
  selectedPatientName.value = getPatientName(patientResource);
  selectedPatientId.value = getPatientID(patientResource);
  //console.log(selectedPatientId.value);

  // Set the selected patient name and reset the observation type
  //selectedPatientName.value = patientName;
  //selectedObservationType.value = "";

  router.push({ name: "patientDetails", query: {patientId: getPatientID(patientResource)} });

  // Open the observation type selection dialog
  // observationDialog.value = true;
};

const closeObservationDialog = () => {
  observationDialog.value = false;
};

const confirmObservationType = () => {
  // console.log(`Selected Observation Type: ${selectedObservationType.value}`);
  // observationDialog.value = false;
  //
  // const observationCode = observationTypeToCode[selectedObservationType.value];
  // console.log(selectedPatientId);
  // console.log(observationCode);
  //
  // console.log(selectedStartDate.value);
  // console.log(selectedEndDate.value);
  //
  // // const startDateString = selectedStartDate.value._value;
  // // const endDateString = selectedEndDate.value._value;
  //
  // // console.log(startDateString);
  // // console.log(endDateString);
  //
  // if (!observationCode) {
  //   console.error("Invalid observation type selected");
  //   return;
  // }
  //
  // if (client.value) {
  //   fetchData(
  //     client.value,
  //     selectedPatientId.value,
  //     observationCode,
  //     selectedStartDate.value,
  //     selectedEndDate.value
  //   )
  //     .then((bundleResponse) => {
  //       selectedData.value = bundleResponse;
  //       store.commit('setFhirData', selectedData.value);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }

  // Implement navigation logic here
  router.push({ name: "patient-detail" });
};
</script>

<style scoped>
.table-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90%;
}
.custom-header {
  background-color: #6C979B !important;
  color: white !important;
}

.custom-table {
  border: 1px solid #ccc;
  width: 90%;
  justify-content: center;
  align-items: center;
  background-color: white !important;
}

.date-inputs {
  display: flex;
  justify-content: space-between;
}

/* Adjust the width of the date fields if needed */
.date-inputs .v-text-field {
  flex: 1;
  margin-right: 10px; /* Optional margin between the fields */
}
</style>
