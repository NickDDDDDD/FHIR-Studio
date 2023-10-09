<template>
  <div style="background-color: #e6f4f1">
    <v-img src="../assets/ValiditronBlack.png" alt="Logo" class="title-img" />
  </div>
  <div>
    <!-- <p><b>Patient Name: </b>{{ patientName }}</p> -->
    <v-card class="card-details">
      <v-container v-if="patientData != null">
        <v-row>
          <v-col class="card-inner-border">
            <v-card-title class="card-title">
              <div style="margin-top: -5%">Patient ID</div>
            </v-card-title>
            <v-card-text>
              {{ patientData.id }}
            </v-card-text>
          </v-col>
          <v-col class="card-inner-border">
            <v-card-title class="card-title">
              <div style="margin-top: -5%">Patient Name</div>
            </v-card-title>
            <v-card-text>
              {{ patientData.name[0].given[0] }}
              {{ patientData.name[0].given[1] }}
              {{ patientData.name[0].family[0] }}
            </v-card-text>
          </v-col>
          <v-col class="card-inner-border">
            <v-card-title class="card-title">
              <div style="margin-top: -5%">Patient Gender</div>
            </v-card-title>
            <v-card-text>
              {{ patientData.gender }}
            </v-card-text>
          </v-col>
          <v-col class="card-inner-border">
            <v-card-title class="card-title">
              <div style="margin-top: -5%">Patient Birth Date</div>
            </v-card-title>
            <v-card-text>
              {{ patientData.birthDate }}
            </v-card-text>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>

  <br />

  <div class="div-custom">
    <v-row>
      <v-col cols="5">
        <div>
          <div class="div-center">
            <v-card class="card-100">
              <v-card-title>Observation Resources Summary</v-card-title>

              <v-container>
                <v-row>
                  <v-col class="col-limit">
                    <v-card-title class="card-title">
                      <div style="margin-top: -5%">Oxygen Saturation</div>
                    </v-card-title>
                    <v-card-text v-if="bloodOxygenSum != null">
                      {{ getTotal(bloodOxygenSum) }}
                    </v-card-text>
                  </v-col>
                  <v-col class="col-limit">
                    <v-card-title class="card-title">
                      <div style="margin-top: -5%">Blood Pressure</div>
                    </v-card-title>
                    <v-card-text v-if="bloodPressureSum != null">
                      {{ getTotal(bloodPressureSum) }}
                    </v-card-text>
                  </v-col>
                  <v-col class="col-limit">
                    <v-card-title class="card-title">
                      <div style="margin-top: -5%">Heart Rate</div>
                    </v-card-title>
                    <v-card-text v-if="heartRateSum != null">
                      {{ getTotal(heartRateSum) }}
                    </v-card-text>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </div>

          <br />

          <div>
            <v-card class="card-100">
              <v-card-title>Observation resources filter</v-card-title>

              <v-card-text>
                <v-select
                  v-model="selectedObservationType"
                  :items="observationTypes"
                  label="Observation Type"
                  clearable="true"
                ></v-select>

                <div class="date-inputs">
                  <v-row>
                    <v-col>
                      <!-- Start Date and End Date on the same line -->
                      <v-text-field
                        v-model="selectedStartDate"
                        type="date"
                        label="Start Date"
                      ></v-text-field>
                    </v-col>

                    <v-col>
                      <v-text-field
                        v-model="selectedEndDate"
                        type="date"
                        label="End Date"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </div>
              </v-card-text>

              <v-card-actions>
                <v-btn @click="goToChart" color="#40807a" variant="tonal">Show Graph</v-btn>
                <v-btn
                  @click="goToGeneratorPage"
                  color="#40807a"
                  variant="tonal"
                >
                  Generate Data
                </v-btn>
                <v-btn
                  @click="showDeleteConfirmation = true"
                  color="#40807a"
                  variant="tonal"
                >
                  Delete data
                </v-btn>
              </v-card-actions>
            </v-card>

            <!-- Delete Confirmation popup -->
            <v-dialog v-model="showDeleteConfirmation">
              <v-card class="custom-dialog">
                <v-card-title class="custom-dialog-title"
                  >Delete Confirmation</v-card-title
                >
                <v-card-text class="custom-dialog-text">
                  Are you sure you want to delete this data?
                </v-card-text>
                <v-card-actions class="custom-dialog-actions">
                  <v-btn
                    @click="showDeleteConfirmation = false"
                    color="#40807a"
                    variant="tonal"
                    >Cancel</v-btn
                  >
                  <v-btn @click="confirmDelete" color="#e32222" variant="tonal"
                    >Confirm Delete</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </div>
      </v-col>

      <v-col cols="7">
        <v-card>
          <v-table fixed-header height="100%" class="table-custom">
            <thead>
              <tr>
                <th class="custom-header">Observation Type</th>
                <th class="custom-header">value</th>
                <th class="custom-header">Effective Date Time</th>
              </tr>
            </thead>
            <tbody v-if="observationDataPage">
              <!-- Iterate over patient data, clicking on a row opens the observation dialog -->
              <tr v-for="entry in observationDataPage" :key="entry.id">
                <td v-if="entry.code && entry.code.coding[0]">
                  {{ entry.code.coding[0].display }}
                </td>
                <td v-else>null</td>

                <td v-if="entry.valueQuantity">
                  {{ entry.valueQuantity.value }} {{ entry.valueQuantity.unit }}
                </td>
                <td v-else-if="entry.component">
                  {{ entry.component[0].valueQuantity.value }}
                  {{ entry.component[0].valueQuantity.unit }}
                </td>
                <td v-else>null</td>

                <td v-if="entry.effectiveDateTime">
                  {{ entry.effectiveDateTime.slice(0, 10) }}
                </td>
                <td v-else>null</td>
              </tr>
            </tbody>
          </v-table>
          <v-pagination
            v-if="totalPages != null"
            v-model="currentPage"
            :length="totalPages"
            class="pagination-custom"
          ></v-pagination>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
// import { useRouter } from "vue-router";
import FHIR from "fhirclient";
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";



export default {
  setup() {
    const router = useRouter();
    const patientId = ref("");
    const client = ref(null);
    const patientData = ref(null);
    const observationTypes = [
      "Blood Pressure",
      "Oxygen Saturation",
      "Heart Rate",
    ];
    const observationData = ref(null);
    const selectedObservationType = ref("");
    const selectedStartDate = ref(null); // Initialize as null
    const selectedEndDate = ref(null); // Initialize as null
    const showDeleteConfirmation = ref(false);
    //const deleteConfirmation = ref(false);
    const observationTypeToCode = {
      "Heart Rate": "8867-4",
      "Blood Pressure": "55284-4",
      "Oxygen Saturation": "2710-2",
    };

    const observationTypesToModel = {
      "Heart Rate": "heartRateModel",
      "Blood Pressure": "bloodPressureModel",
      "Oxygen Saturation": "oxygenSaturationModel",
    };
    const bloodOxygenSum = ref(null);
    const bloodPressureSum = ref(null);
    const heartRateSum = ref(null);
    const currentPage = ref(1);
    const iterationItems = 20;
    const totalPages = ref(1);
    const observationDataPage = ref(null);
    const pageLimit = 5;

    const selectedCodes = ref(null);
    const requestUrl = ref("");

    watch(currentPage, (newValue) => {
      if (observationData.value) {
        observationDataPage.value = observationData.value.slice(
          20 * (newValue - 1),
          20 * newValue
        );
        console.log(observationDataPage.value);
      }
    });

    watch(
      [selectedObservationType, selectedStartDate, selectedEndDate],
      async (newValues) => {
        const [newObservationType, newStartDate, newEndDate] = newValues;
        //deleteConfirmation.value = false;

        //set url request
        if (newObservationType) {
          selectedCodes.value = observationTypeToCode[newObservationType];
        } else {
          selectedCodes.value = observationTypes
              .map(
                  (selectedObservationType) =>
                      observationTypeToCode[selectedObservationType]
              )
              .join(",");
        }
        requestUrl.value = `Observation?subject=${patientId.value}&code=${selectedCodes.value}&_count=${iterationItems}`;

        if (newStartDate) {
          requestUrl.value += `&date=ge${newStartDate}`;
        }

        if (newEndDate) {
          requestUrl.value += `&date=le${newEndDate}`;
        }

        while (observationData.value === null) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        if (observationData.value.class === Promise) {
          console.log("pending...")
          await observationData.value;
        }

        observationData.value = client.value.request(requestUrl.value, {
          flat: true,
          pageLimit: pageLimit,
        });

      }
    );

    watch(observationData, async (newValue) => {
      try {
        //update the observation table settings
        observationData.value = await newValue; // wait for promise
        currentPage.value = 1;
        observationDataPage.value = observationData.value.slice(
          20 * (currentPage.value - 1),
          20 * currentPage.value
        );

        initializePagination();
      } catch (error) {
        console.error("Promise error:", error);
      }
    });

    const initializeClient = async () => {
      try {
        client.value = await FHIR.oauth2.ready();
      } catch (error) {
        console.error("Error initializing client: " + error);
      }
    };

    const fetchPatient = async () => {
      if (patientId.value && client.value) {
        try {
          patientData.value = await client.value.request(
            "Patient/" + patientId.value
          );
          console.log(patientData.value);
        } catch (error) {
          console.error("Error fetching patient data: " + error);
        }
      }
    };

    const fetchObservationSummary = async () => {
      if (patientId.value && client.value) {
        try {
          bloodOxygenSum.value = await client.value.request(
            "Observation?subject=" +
              patientId.value +
              "&code=" +
              observationTypeToCode["Oxygen Saturation"] +
              "&_summary=count"
          );
          bloodPressureSum.value = await client.value.request(
            "Observation?subject=" +
              patientId.value +
              "&code=" +
              observationTypeToCode["Blood Pressure"] +
              "&_summary=count"
          );
          heartRateSum.value = await client.value.request(
            "Observation?subject=" +
              patientId.value +
              "&code=" +
              observationTypeToCode["Heart Rate"] +
              "&_summary=count"
          );
        } catch (error) {
          console.error("Error fetching observation data: " + error);
        }
      }
    };

    const initializePagination = () => {
      if (patientId.value && client.value && observationData.value) {
        try {
          //compute attributes of pagination
          const totalItems = observationData.value.length;

          totalPages.value = Math.ceil(totalItems / iterationItems);

          if (totalPages.value === 0) {
            totalPages.value = 1;
          }
        } catch (error) {
          console.error("Error fetching observation data: " + error);
        }
      }
    };

    const fetchObservation = async () => {
      if (patientId.value && client.value) {
        try {
          selectedCodes.value = observationTypes
            .map(
              (selectedObservationType) =>
                observationTypeToCode[selectedObservationType]
            )
            .join(",");
          requestUrl.value = `Observation?subject=Patient/${patientId.value}&code=${selectedCodes.value}&_count=${iterationItems}`;

          console.log(requestUrl.value);
          observationData.value = await client.value.request(requestUrl.value, {
            flat: true,
            pageLimit: pageLimit,
          });

          observationDataPage.value = observationData.value.slice(
            20 * (currentPage.value - 1),
            20 * currentPage.value
          );
          console.log("observationDataPage:");
          console.log(observationDataPage.value);
        } catch (error) {
          console.error("Error fetching observation data: " + error);
        }
      }
    };

    const goToGeneratorPage = () => {
      router.push({
        name: "generator",
        query: {
          patientId: patientId.value,
          startDate: selectedStartDate.value,
          endDate: selectedEndDate.value,
          observationType:
            observationTypesToModel[selectedObservationType.value],
        },
      });
     
    };


    const goToChart = async () => {
      if (selectedObservationType.value === "") {
        alert("Please choose an observation data type")
        return;
      }
      while (observationData.value === null) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      await observationData.value;
      var minValue;
      var maxValue;
      var unit;
      var recommendRange;


      if (selectedObservationType.value === "Heart Rate") {
        maxValue = 220;
        minValue = 0;
        unit = "beats/minute";
        recommendRange = [60, 100];
      } else if (selectedObservationType.value === "Oxygen Saturation") {
        maxValue = 100;
        minValue = 60;
        unit = "percent";
        recommendRange = [95, 100];
      } else {
        maxValue = 220;
        minValue = 0;
        unit = "mm Hg";
        recommendRange = [120, 129];
      }


      router.push({ name: "chart",
        query: {
          patientId: patientId.value,
          min: minValue,
          max: maxValue,
          selectedDateRange: [Date.parse(selectedStartDate.value), Date.parse(selectedEndDate.value)],
          unit: unit,
          recommendRange: recommendRange,
          selectedDataType: selectedObservationType.value,
        },
        params: {
          jsonData: JSON.stringify(observationData.value.sort((a, b) => {
            const effectiveDateA = new Date(a.effectiveDateTime).getTime();
            const effectiveDateB = new Date(b.effectiveDateTime).getTime();
            return effectiveDateA - effectiveDateB;
          }))
        }
      })
    }

    const getTotal = (resource) => {
      return resource.total;
    };

    const confirmDelete = () => {
      onDeleteFilteredData();
      showDeleteConfirmation.value = false;
      //deleteConfirmation.value = true;
      //router.push({ name: "generator", query: { patientId: patientId.value, startDate: selectedStartDate.value,  endDate: selectedEndDate.value, observationType: selectedObservationType.value} });
    };

    const cancelDelete = () => {
      showDeleteConfirmation.value = false;
      //router.push({ name: "generator", query: { patientId: patientId.value, startDate: selectedStartDate.value,  endDate: selectedEndDate.value, observationType: selectedObservationType.value} });
    };

    const onDeleteFilteredData = () => {
      console.log("Deleting filtered observation data...");

      const client = ref(null);

      FHIR.oauth2
        .ready()
        .then((fhirClientInstance) => {
          client.value = fhirClientInstance;

          // Map all delete operations into an array of promises
          const deletePromises = observationData.value.map((entry) => {
            const resourceType = entry.resourceType;
            const resourceId = entry.id;
            const url = `/${resourceType}/${resourceId}`;

            // Delete the resource from FHIR and return the promise
            return client.value
              .delete(url)
              .then((result) => {
                console.log(
                  `Successfully deleted ${resourceType}/${resourceId}:`,
                  result
                );
              })
              .catch((deleteError) => {
                console.error(
                  `Error deleting ${resourceType}/${resourceId}:`,
                  deleteError
                );
              });
          });

          // Wait for all delete operations to complete
          return Promise.all(deletePromises);
        })
        .then(() => {
          // All delete operations completed, now fetch observation summary
          fetchObservationSummary();
          initializePagination();
          selectedObservationType.value = null;
        })
        .catch((error) => {
          console.error(error);
        });
    };


    onMounted(async () => {
      patientId.value = router.currentRoute.value.query.patientId;
      localStorage.setItem("patientId",patientId.value);
      const a = localStorage.getItem('patientId');
      console.log("localstorage:"+a);
      await initializeClient();
      await fetchPatient();
      await fetchObservation();
      await fetchObservationSummary();
      await initializePagination();
    });

    return {
      patientId,
      client,
      patientData,
      observationTypes,
      observationData,
      selectedEndDate,
      selectedStartDate,
      selectedObservationType,
      // confirmObservationType,
      observationTypeToCode,
      fetchObservationSummary,
      bloodOxygenSum,
      getTotal,
      bloodPressureSum,
      heartRateSum,
      goToGeneratorPage,
      currentPage,
      totalPages,
      iterationItems,
      fetchObservation,
      observationDataPage,
      showDeleteConfirmation,
      confirmDelete,
      cancelDelete,
      goToChart,
    };
  },
};
</script>

<style>
.div-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-details {
  background-color: #e6f4f1;
}

.card-100 {
  width: 100%;
}

.col-limit {
  width: 25%;
}

.card-title {
  border-top: 10px solid #a3cec4;
  font-size: 16px;
  padding-top: -50%;
}

.table-custom {
  height: 470px;
  width: 100%;
  justify-content: center;
  align-items: center;
  background-color: white !important;
}

.div-custom {
  margin-left: 3%;
  width: 94%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 520px;
}

.custom-header {
  background-color: #6c979b !important;
  color: white !important;
}

.date-inputs {
  display: flex;
  justify-content: space-between;
}

.pagination-custom {
  height: 50px;
}

.title-img {
  background-color: #e6f4f1;
  width: 250px;
  height: auto;
}

.custom-dialog {
  width: 400px; /* 设置弹窗宽度 */
  height: 200px;
  margin: 0 auto; /* 居中显示 */
  text-align: center; /* 文字水平居中 */
  border-radius: 10px; /* 圆角 */
}

.custom-dialog-title {
  background-color: #40807a; /* 设置标题背景颜色 */
  color: white; /* 设置标题文字颜色 */
}

.custom-dialog-text {
  display: flex; /* 使用 flex 布局 */
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  padding: 20px; /* 设置内边距 */
}
</style>
