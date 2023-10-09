<template>
  <!-- Create the draggable chart component template -->
  <div>
    <div>
      <el-row>
        <el-col :span="4">
          <!-- Add the back button using Element UI -->
          <el-button type="primary" @click="onBackButtonClick">Back</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- Radio group for selecting "edit" or "add" mode -->
    <div>
      <el-radio-group v-model="mode">
        <el-radio-button label="edit">Edit</el-radio-button>
        <el-radio-button label="add">Add</el-radio-button>
      </el-radio-group>
    </div>
    <!-- Chart container -->
    <div ref="chart" style="width: 100%; height: 500px"></div>
    <!-- <div v-if="selectedPointIndex !== null"> -->
    <div style="
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
      ">
      <!-- Point information container -->
      <div v-if="isPointSelected" title="Point Information">
        <el-row gutter="20">
          <el-col :span="12">
            <el-input v-model="formattedDate" placeholder="Timestamp">
              <template #prepend>X-axis(Date: Year/Month/Date):</template>
            </el-input>
          </el-col>
          <el-col :span="12">
            <el-input v-model="formattedData" placeholder="Y coordinate" :suffix-icon="this.unit">
              <template #prepend>Y-axis({{ dataType }}:
                <span v-if="dataType === 'Oxygen Saturation'">HemoglobinSaturation</span>
                <span v-if="dataType === 'Blood Pressure'">mmHg</span>
                <span v-if="dataType === 'Heart Rate'">beats/min</span>):
              </template>
            </el-input>
          </el-col>
        </el-row>
        <!-- Save and delete buttons for the selected point -->
        <el-row style="margin-top: 20px">
          <el-col :span="12">
            <el-button type="primary" @click="saveUpdatedPoint" style="width: 100%">Save</el-button>
          </el-col>
          <el-col :span="12">
            <el-button type="danger" @click="onPointDelete" style="width: 100%">Delete</el-button>
          </el-col>
        </el-row>
      </div>
      <!-- Generate JSON button -->
      <div>
        <el-button type="primary" @click="onJsonSend" style="width: 100%">Generate JSON</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { useRoute } from "vue-router";
import {
  heartRateTemplate,
  oxygenSaturationTemplate,
  bloodPressureTemplate,
} from "../utils/template.js";
import { ref, markRaw } from "vue";
import FHIR from "fhirclient";

export default {
  name: "DraggableChart",
  data() {
    return {
      patientId: this.$route.query.patientId,
      chartInstance: null,
      data: [],
      symbolSize: 12,
      mode: "edit",
      selectedPointIndex: null,
      deleteDialogVisible: false,
      selectedPoint: null,
      selectedPointX: 0,
      selectedPointY: 0,
      isPointSelected: false,
      pointIndex: 0,
      url: null,
      unit: null,
      dataType: null,
      step: 0,
      deleteList: [],
      FHIRData: null,
      selectedDate: [],
    };
  },
  computed: {
    computedSelectedPointX: {
      get() {
        if (this.selectedPointIndex !== null) {
          return this.data[this.selectedPointIndex]["value"][0];
        }
        return null;
      },
      set(newValue) {
        if (this.selectedPointIndex !== null) {
          this.data[this.selectedPointIndex]["value"][0] = newValue;
        }
      },
    },
    computedSelectedPointY: {
      get() {
        if (this.selectedPointIndex !== null) {
          return this.data[this.selectedPointIndex]["value"][1];
        }
        return null;
      },
      set(newValue) {
        if (this.selectedPointIndex !== null) {
          this.data[this.selectedPointIndex]["value"][1] = newValue;
        }
      },
    },
    //formated the observation date from time stamp to normal time
    formattedDate() {
      let date = new Date(this.computedSelectedPointX);
      return date.getFullYear() + '/' + (date.getMonth() + 1).toString().padStart(2, '0') + '/' + date.getDate().toString().padStart(2, '0');
    },
    //round the observate data 
    formattedData() {
      return this.computedSelectedPointY.toFixed(2);
    }

  },
  methods: {
    // Initialize the chart instance
    initChart() {

      if (!this.$route.query) {
        console.error("Query is undefined!");
        return;
      }
      this.chartInstance = echarts.init(this.chart);
      const {
        patientId,
        min,
        max,
        selectedDateRange,
        unit,
        recommendRange,
        selectedDataType,
      } = this.route.query;
      this.patientId = patientId;
      var option, data = [];

      this.selectedDate = selectedDateRange;
      const jsonArray = JSON.parse(this.route.params.jsonData);
      this.FHIRData = jsonArray;

      //form data for displaying according to json data
      jsonArray.forEach(item => {
        var date = Date.parse(item.effectiveDateTime);
        var value;
        if(item.valueQuantity && item.valueQuantity.value) {
          value = item.valueQuantity.value;
        } else if (item.component) {
          value = item.component[0].valueQuantity.value;
        }
        data.push({value: [date, value], customData: {type:1, id:item.id}})
      })

      this.dataType = selectedDataType;
      console.log("datatype" + this.dataType);
      const recommendNum = [
        Number(recommendRange[0]),
        Number(recommendRange[1]),
      ];
      this.data = data;
      this.data.sort((a, b) => a["value"][0] - b["value"][0]);
      const timeRange = this.computeDateRange(this.data, selectedDateRange);

      console.log(data)
      console.log(timeRange)
      option = {
        toolbox: {
          feature: {
            saveAsImage: {},
            dataZoom: {},
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        xAxis: {
          type: "time",
          min: timeRange[0],
          max: timeRange[1],
          name: "Time",
          nameLocation: "middle",
          nameGap: 30,
        },
        yAxis: {
          type: "value",
          min: min,
          max: max,
          name: unit,
          nameLocation: "middle",
          nameGap: 40,
        },
        series: [
          {
            id: "a",
            data: this.data,
            type: "line",
            symbol: "circle",
            smooth: true,
            symbolSize: this.symbolSize,
          },
          {
            type: "line",
            markLine: {
              silent: true,
              symbol: "none",
              data: [
                {
                  yAxis: recommendNum[0],
                  lineStyle: {
                    color: "red",
                  },
                },
                {
                  yAxis: recommendNum[1],
                  lineStyle: {
                    color: "green",
                  },
                },
              ],
            },
          },
        ],
      };
      this.chartInstance.setOption(option);
      this.chartInstance.getZr().on("click", this.handleClick);
      this.chartInstance.getZr().on("mousemove", this.handleMouseMove);
    },

    // Handle the click event on the chart, either adding a new point or selecting an existing one
    handleClick(event) {
      if (this.mode === "add") {
        const pointInPixel = [event.offsetX, event.offsetY];
        if (this.chartInstance.containPixel("grid", pointInPixel)) {
          const pointInGrid = this.chartInstance.convertFromPixel(
            "grid",
            pointInPixel
          );
          const data = {value:pointInGrid, customData: {type:2}}
          this.addDataPoint(data);
        }
      }
      if (!this.inNode && this.mode === "edit") {
        const pointInPixel = [event.offsetX, event.offsetY];

        if (this.chartInstance.containPixel("grid", pointInPixel)) {
          // this.selectedPoint = this.data[dataIndex];
          this.deleteDialogVisible = true;
        }
        setTimeout(() => {
          this.updateChartOptions();
        }, 0);
        window.addEventListener("resize", this.updatePosition);
      }
    },

    // Handle the mousemove event on the chart, changing the cursor style based on mode and grid
    handleMouseMove(event) {
      const pointInPixel = [event.offsetX, event.offsetY];
      this.chartInstance
        .getZr()
        .setCursorStyle(
          this.chartInstance.containPixel("grid", pointInPixel) &&
            this.mode === "edit"
            ? "copy"
            : "default"
        );
    },

    computeDateRange(data, selectedDateRange) {
      var min, max;

      if (data.length > 1) {
        if (selectedDateRange[0] !== "NaN") {
          min = (selectedDateRange[0]-0 > data[0]["value"][0]) ? data[0]["value"][0] : selectedDateRange[0]-0;
        } else {
          min = data[0]["value"][0];
        }

        if (selectedDateRange[1] !== "NaN") {
          max = (selectedDateRange[1]-0 > data[data.length-1]["value"][0]) ?
              data[data.length-1]["value"][0] : selectedDateRange[1]-0;
        } else {
          max = data[data.length-1]["value"][0];
        }
        // min = selectedDateRange[0] !== "NaN" ? selectedDateRange[0]-0 : data[0]["value"][0];
        // max = selectedDateRange[1] !== "NaN" ? selectedDateRange[1]-0 : data[data.length-1]["value"][0];
      } else {
        min = 0;
        max = Date.now();
      }

      console.log(min, max)
      console.log(new Date(min), new Date(max))
      return [min, max]
    },

    // Add a new data point to the chart
    addDataPoint(point) {
      const data = this.chartInstance.getOption().series[0].data;
      data.push(point);
      this.data = data;
      this.data.sort((a, b) => a["value"][0] - b["value"][0]);
      this.updateChartOptions();
    },

    // Update the position of the draggable data points on the chart
    updatePosition() {
      // if (this.chartInstance) {
      //   this.chartInstance.setOption({
      //     graphic: echarts.util.map(this.data, (item) => ({
      //       position: this.chartInstance.convertToPixel("grid", item["value"]),
      //     })),
      //   });
      // }

    },

    // Save the updated data point after editing
    saveUpdatedPoint() {
      // Update the point in the data array
      this.data[this.selectedPointIndex]["value"] = [
        parseFloat(this.computedSelectedPointX),
        parseFloat(this.computedSelectedPointY),
      ];

      // Update the position of the point on the chart
      this.updateChartOptions();

      // Close the point information dialog
      this.isPointSelected = false;
    },

    // Handle dragging a data point on the chart
    onPointDragging(dataIndex, event) {
      const newPosition = this.chartInstance.convertFromPixel(
        "grid",
        event.target.position
      );

      // Get the Y-axis range
      const yAxisMin = this.chartInstance.getOption().yAxis[0].min;
      const yAxisMax = this.chartInstance.getOption().yAxis[0].max;

      // Get the neighboring points
      const leftNeighbor = dataIndex > 0 ? this.data[dataIndex - 1]["value"] : null;
      const rightNeighbor =
        dataIndex < this.data.length - 1 ? this.data[dataIndex + 1]["value"] : null;

      // Check if the new position is within the Y-axis range and between the neighboring points
      if (
        newPosition[1] >= yAxisMin &&
        newPosition[1] <= yAxisMax &&
        (!leftNeighbor || newPosition[0] > leftNeighbor[0]) &&
        (!rightNeighbor || newPosition[0] < rightNeighbor[0])
      ) {
        this.data[dataIndex]["value"] = newPosition;
        this.chartInstance.setOption({
          series: [
            {
              id: "a",
              data: this.data,
            },
          ],
        });
        this.updateChartOptions();
      }
    },

    // Handle clicking a data point on the chart
    onPointClick(dataIndex) {
      if (dataIndex >= 0 && dataIndex < this.data.length) {
        this.selectedPointIndex = dataIndex;
        this.selectedPointX = this.data[dataIndex]["value"][0];
        this.selectedPointY = this.data[dataIndex]["value"][1];
        this.dataIndex = dataIndex;
        console.log("ispoint" + this.isPointSelected);
        if (!this.mode === "edit") {
          this.isPointSelected = false;
        } else {
          this.isPointSelected = true;
        }
      } else {
        console.warn(`Data point at index ${dataIndex} does not exist.`);
      }
    },

    // Delete the selected data point from the chart
    onPointDelete() {
      if(this.data[this.dataIndex]["customData"]["type"] === 1) {
        this.deleteList.push("Observation/"+this.data[this.dataIndex]["customData"]["id"])
      }

      this.data.splice(this.dataIndex, 1);
      this.isPointSelected = false;
      this.updateChartOptions();
    },

    onBackButtonClick() {
      this.$router.go(-1);
    },

    // Update the chart options after data changes
    updateChartOptions() {
      this.data.sort((a, b) => a["value"][0] - b["value"][0]);
      const timeRange = this.computeDateRange(this.data, this.selectedDate)

      this.chartInstance.setOption({
        series: [
          {
            id: "a",
            data: this.data,
          },
        ],
        xAxis: {
          type: "time",
          min: timeRange[0],
          max: timeRange[1],
          name: "Time",
          nameLocation: "middle",
          nameGap: 30,
        },
        graphic: echarts.util.map(this.data, (item, dataIndex) => ({
          type: "circle",
          position: this.chartInstance.convertToPixel("grid", item["value"]),
          shape: {
            cx: 0,
            cy: 0,
            r: this.symbolSize / 2,
          },
          style: {
            fill: item["customData"]["type"] === 1 ? 'blue' : 'green'
          },
          draggable: this.mode === "edit",
          ondrag: echarts.util.curry(this.onPointDragging, dataIndex),
          onclick: echarts.util.curry(this.onPointClick, dataIndex),
          z: 100,
        })),
      });
    },

    // Convert the chart data to an array of observations
    async onJsonSend() {

      //initialize client
      const client = ref(null);
      try {
        client.value = await FHIR.oauth2.ready();
      } catch (error) {
        console.error("Error initializing client: " + error);
      }

      var j = 0;
      //create new data and update existing data
      for (let i = 0; i < this.data.length; i++) {
        const dataPoint = this.data[i]
        if (dataPoint["customData"]["type"] === 2) {
          // if the data is newly generated
          const json = this.dataToObservation(
            this.dataType,
            dataPoint["value"][0],
            dataPoint["value"][1].toFixed(2),
            "Patient/" + this.patientId
          );
          console.log(json);
          client.value.create(json);
        } else {
          // if the data is already existed, update it
          while (dataPoint["customData"]["id"] !== this.FHIRData[j].id) {
            j += 1;
          }
          if (this.FHIRData[j].valueQuantity) {
            this.FHIRData[j].valueQuantity.value = dataPoint["value"][1].toFixed(2);
            this.FHIRData[j].effectiveDateTime = new Date(
              dataPoint["value"][0]
            ).toISOString();
          } else if (this.FHIRData[j].component) {
            this.FHIRData[j].component[0].valueQuantity.value =
              dataPoint["value"][1].toFixed(2);
            this.FHIRData[j].effectiveDateTime = new Date(
              dataPoint["value"][0]
            ).toISOString();
          }
          client.value.update(this.FHIRData[j]);
        }
      }

      //delete unwanted data
      this.deleteList.forEach(item => {
        console.log("item:" + item)
        client.value.delete(item)
      })

      this.$message({
        message: "Json has been generated and sent！",
        type: "success",
      });
      // this.$emit("json-send", json);
    },

    // Convert a data point to an observation object based on the given type
    dataToObservation(type, timestamp, value, subject) {
      let template;

      switch (type) {
        case "Heart Rate":
          template = heartRateTemplate;
          break;
        case "Oxygen Saturation":
          template = oxygenSaturationTemplate;
          break;
        case "Blood Pressure":
          template = bloodPressureTemplate;
          break;
        default:
          console.error("Invalid type provided");
          // template = defaultTemplate;
          break;
      }


      const observation = JSON.parse(JSON.stringify(template));
      observation.effectiveDateTime = new Date(timestamp).toISOString();
      observation.valueQuantity.value = value;
      observation.subject.reference = subject;

      return observation;
    },
  },
  beforeRouteLeave(to, from, next) {
    //
    if (this.chartInstance) {
      this.chartInstance.dispose();
      this.chartInstance = null;
    }
    //
    next();
  },
  // When the component is mounted, initialize the chart and set up a watcher for the route query
  mounted() {
    this.chart = markRaw(this.$refs.chart);
    this.route = useRoute();
    if (this.$route.name === "chart") {
      this.initChart();
    }

    this.$watch(
      () => this.$route.query,
      () => {
        if (this.$route.name === "chart") {
          this.initChart();
        }
      }
    );
  },
};
</script>

<style scoped>
/* Add any custom styles for the chart here */
</style>
