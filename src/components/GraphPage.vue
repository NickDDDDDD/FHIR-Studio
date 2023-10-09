<template>
  <div>
    <!-- Chart container -->
    <div ref="chart" style="width: 100%; height: 500px;">
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import * as echarts from 'echarts';

export default {
  computed: {
    ...mapState({
      storedFhirData: state => state.fhirData,
    }),
  },
  data() {
    return {
      processedCombinedData: [],
      chart: null,
    };
  },
  methods: {
    processHealthData() {
      if (this.storedFhirData && this.storedFhirData.entry) {
        const combinedData = this.storedFhirData.entry.map(entry => {
          const value = entry.resource.valueQuantity.value;
          const date = entry.resource.effectiveDateTime;
          return [date, value];
        });
        //sorted
        combinedData.sort((a, b) => {
          const dateA = new Date(a[0]);
          const dateB = new Date(b[0]);
          return dateA - dateB;
        });
        this.processedCombinedData = combinedData;

        console.log("After processHealthData: ", this.processedCombinedData);  // Add debug here
      } else {
        console.log("No FHIR data available.");
      }
    },
    initializeChart() {
      // 只在有数据时初始化图表

      const chartDom = this.$refs.chart;
      this.chart = echarts.init(chartDom);

      console.log("Before initializeChart: ", this.processedCombinedData);  // Add debug here

      const dates = this.processedCombinedData.map(item => item[0]);
      const values = this.processedCombinedData.map(item => item[1]);

      const option = {
        xAxis: {
          type: 'category',
          data: dates
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: values,
          type: 'line',
          symbol: 'circle',
        }]
      };
      this.chart.setOption(option);

    },

    updateChart() {
      if (this.chart && this.processedCombinedData.length > 0) {
        const dates = this.processedCombinedData.map(item => item[0]);
        const values = this.processedCombinedData.map(item => item[1]);

        const option = {
          xAxis: {
            type: 'category',
            data: dates,
          },
          yAxis: {
            type: 'value',
          },
          series: [{
            data: values,
            type: 'line',
            symbol: 'circle',
          }],
        };

        this.chart.setOption(option);
      }
    },

  },
  watch: {
    storedFhirData: {
      immediate: true, // Immediate观察属性初始化时就会调用
      handler(newValue) {
        console.log("Stored FHIR Data changed: ", newValue);  // Add debug here
        this.processHealthData();
       
      },
    },
    processedCombinedData: {
      immediate: true,
      handler() {
        this.updateChart(); // 调用更新图表的方法
      },
    },
  },


  mounted() {
    const chartDom = this.$refs.chart;
    this.chart = echarts.init(chartDom);

    this.processHealthData();
    this.updateChart();

    console.log("Component Mounted. Stored FHIR Data: ", this.storedFhirData);  // Add debug here
  },
};
</script>
