<template>
    <ContentWrapper>
        <div class="content-heading">
            <div>Vue Chart JS
                <small>Vue.js wrapper for Chart.js</small>
            </div>
        </div>
        <div class="container-fluid container-md">
            <div class="row mb-3">
                <div class="col-xl-6">
                    <h3 class="mb-3 py-2">Line Chart</h3>
                    <div>
                        <chartjs-line :height="250"/>
                    </div>
                </div>
                <div class="col-xl-6">
                    <h3 class="mb-3 py-2">Bar Chart</h3>
                    <div>
                        <chartjs-bar :height="250"/>
                    </div>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-lg-6">
                    <h3 class="mb-3 py-2">Polar Area Chart</h3>
                    <div>
                        <chartjs-polar :height="250"/>
                    </div>
                </div>
                <div class="col-lg-6">
                    <h3 class="mb-3 py-2">Radar Chart</h3>
                    <div>
                        <chartjs-radar :height="250"/>
                    </div>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-lg-6">
                    <h3 class="mb-3 py-2">Pie Chart</h3>
                    <div>
                        <chartjs-pie :height="250"/>
                    </div>
                </div>
                <div class="col-lg-6">
                    <h3 class="mb-3 py-2">Doughnut Chart</h3>
                    <div>
                        <chartjs-doughnut :height="250"/>
                    </div>
                </div>
            </div>
        </div>
    </ContentWrapper>
</template>

<script>
    import Vue from 'vue'
    import VueChartJs from 'vue-chartjs'
    import { Line, Bar, Doughnut, Pie, Polar, Radar } from './ChartJS.setup';

    // Create a vue component by exetending each chart type
    const createComponent = (tag, type, params) => {
        Vue.component(tag, {
          extends: type,
          mounted () {
            this.renderChart(params.data, params.options)
          }
        })
    }

    createComponent('chartjs-line',     VueChartJs.Line,       Line)
    createComponent('chartjs-bar',      VueChartJs.Bar,        Bar)
    createComponent('chartjs-doughnut', VueChartJs.Doughnut,   Doughnut)
    createComponent('chartjs-pie',      VueChartJs.Pie,        Pie)
    createComponent('chartjs-polar',    VueChartJs.PolarArea,  Polar)
    createComponent('chartjs-radar',    VueChartJs.Radar,      Radar)

    export default {
    }

</script>
