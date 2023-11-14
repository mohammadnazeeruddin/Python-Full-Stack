<template>
    <ContentWrapper>
        <div class="content-heading">
            <div>Vue Echarts
                <small>ECharts component for Vue.js.</small>
            </div>
        </div>
        <b-card header="Bar Chart">
            <echart :options="barOptions" :auto-resize="true"></echart>
        </b-card>
        <b-card header="Pie Chart">
            <echart :options="pieOptions" :auto-resize="true"></echart>
        </b-card>
        <b-card header="Polar Chart">
            <echart :options="polarOptions" :auto-resize="true"></echart>
        </b-card>
        <b-card header="Radar Chart">
            <echart :options="radarOptions" :auto-resize="true"></echart>
        </b-card>
    </ContentWrapper>
</template>

<script>
    import ECharts from 'vue-echarts/components/ECharts.vue'
    import * as CONST from '@/components/Common/Constants';

    import 'echarts/lib/chart/line'
    import 'echarts/lib/chart/bar'
    import 'echarts/lib/chart/pie'
    import 'echarts/lib/chart/radar'
    import 'echarts/lib/component/polar'
    import 'echarts/lib/component/tooltip'
    import 'echarts/lib/component/legend'

    export default {
        components: {
            'echart': ECharts
        },
        data () {
            return {
                barOptions: {
                    color: [CONST.APP_COLORS['info'], CONST.APP_COLORS['purple'], CONST.APP_COLORS['primary'] ],
                    legend: {},
                    tooltip: {},
                    dataset: {
                      // Provide data.
                      source: [
                        ['Product', '2015', '2016', '2017'],
                        ['Matcha Latte', ...this.randomize()],
                        ['Milk Tea', ...this.randomize()],
                        ['Cheese Cocoa', ...this.randomize()],
                        ['Walnut Brownie', ...this.randomize()]
                      ]
                    },
                    // Declare X axis, which is a category axis, mapping
                    // to the first column by default.
                    xAxis: { type: 'category' },
                    // Declare Y axis, which is a value axis.
                    yAxis: {},
                    // Declare several series, each of them mapped to a
                    // column of the dataset by default.
                    series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
                },
                polarOptions: {
                    color: [CONST.APP_COLORS['pink']],
                    title: {
                        text: 'Polar Chart'
                    },
                    legend: {
                        data: ['line']
                    },
                    polar: {
                        center: ['50%', '54%']
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross'
                        }
                    },
                    angleAxis: {
                        type: 'value',
                        startAngle: 0
                    },
                    radiusAxis: {
                        min: 0
                    },
                    series: [{
                        coordinateSystem: 'polar',
                        name: 'line',
                        type: 'line',
                        showSymbol: false,
                        data: this.polarData()
                    }],
                    animationDuration: 2000
                },
                radarOptions: {
                    color: [CONST.APP_COLORS['info']],
                    title: {
                      text: 'Radar Chart'
                    },
                    tooltip: {},
                    radar: {
                      indicator: this.radarData().map(({name, max}) => {
                        return {name, max}
                      })
                    },
                    series: [{
                      name: 'Score',
                      type: 'radar',
                      data: [{value: this.radarData().map(({value}) => value)}]
                    }]
                },
                pieOptions: {
                    color: [
                        CONST.APP_COLORS['green'],
                        CONST.APP_COLORS['danger'],
                        CONST.APP_COLORS['dark'],
                        CONST.APP_COLORS['info'],
                        CONST.APP_COLORS['warning']
                    ],
                    title: {
                        text: 'Pie Chart',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['Direct Access', 'Mail Marketing', 'Alliance Ads', 'Video Ads', 'Search Engine']
                    },
                    series: [{
                        name: 'Series',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: [
                            { value: 335, name: 'Direct Access' },
                            { value: 310, name: 'Mail Marketing' },
                            { value: 234, name: 'Alliance Ads' },
                            { value: 135, name: 'Video Ads' },
                            { value: 1548, name: 'Search Engine' }
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }]
                }
            }
        },
        methods: {
            randomize () {
                return [0, 0, 0].map(v => {
                    return Math.round(300 + Math.random() * 700) / 10
                })
            },
            polarData() {
                let data = []
                for (let i = 0; i <= 360; i++) {
                    let t = i / 180 * Math.PI
                    let r = Math.sin(2 * t) * Math.cos(2 * t)
                    data.push([r, i])
                }
                return data;
            },
            radarData() {
                return [
                    {name: 'Attack', max: 20, value: 19},
                    {name: 'Defense', max: 20, value: 9},
                    {name: 'Speed', max: 20, value: 18},
                    {name: 'Power', max: 20, value: 16},
                    {name: 'Endurance', max: 20, value: 16},
                    {name: 'Agile', max: 20, value: 20}
                ]
            }
        }
    }
</script>

<style>
    .echarts {
        height: 300px !important;
        width: 100% !important;
    }
</style>
