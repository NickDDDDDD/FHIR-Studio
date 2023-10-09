<template>
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
        <div id="oxygenChart" style="width: 600px; height: 400px;"></div>
    </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
    data() {
        return {
            fhirData: null, 
        };
    },
    mounted() {
        // get data from locatstorage
        const storedData = localStorage.getItem('uploadedJson');
        if (storedData) {
            this.fhirData = JSON.parse(storedData);
            let patientName = "Unknown";  // 默认名字

            // patientName = this.fhirData.entry[0].resource.subject.display || "Unknown";
            // get the patient bname
            // this.fhirData.entry.forEach((entry) => {
            //     patientName = entry[0].resource.subject.reference || "Unknown";
            //     if (entry.resource.resourceType === "Patient") {
            //         // in the json the patient Name is in the
            //         patientName = entry.resource.name[0].text || "Unknown";
            //     }
            // }
            // );

            this.fhirData.entry.forEach((entry) => {
                if (Object.prototype.hasOwnProperty.call(entry.resource.subject, "display")) {
                  // in the json the patient Name is in the
                  patientName = entry.resource.subject.display;
                  return;
                }
              }
            );

            
            const myChart = echarts.init(document.getElementById('oxygenChart'));


            const dataPoints = [];

            this.fhirData.entry.forEach((entry) => {
                const observation = entry.resource;
                if (observation.resourceType === "Observation") { 
                    const fullDate = new Date(observation.effectiveDateTime.split('T')[0]);
                    const formattedDate = `${fullDate.getFullYear()}-${String(fullDate.getMonth() + 1).padStart(2, '0')}`; // 格式为 YYYY-MM
                    const oxygenLevel = observation.valueQuantity.value;
                    dataPoints.push({ date: formattedDate, fullDate: observation.effectiveDateTime, oxygenLevel });
                }
            });

            dataPoints.sort((a, b) => {
                return new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime();
            });
            const dates = dataPoints.map(point => point.date);
            const oxygenLevels = dataPoints.map(point => point.oxygenLevel);

            const option = {
                title: {
                    text: `oxygen Saturation for ${patientName}`,
                    left: 'center',
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        const point = dataPoints[params[0].dataIndex];
                        return `Date: ${point.fullDate}<br/>Oxygen Level: ${point.oxygenLevel}%`;
                    },
                },
                xAxis: {
                    type: 'category',
                    data: dates,
                    axisPointer: {
                        type: 'shadow',
                    },
                },
                yAxis: {
                    type: 'value',
                },
                series: [
                    {
                        data: oxygenLevels,
                        type: 'line',
                        //mark point
                        markPoint: {
                            // data: [
                            //     { type: 'max', name: 'Max' },
                            //     { type: 'min', name: 'Min' },
                            // ],
                        },
                    },
                ],
            };

            myChart.setOption(option);
        }
    },
};
</script>
