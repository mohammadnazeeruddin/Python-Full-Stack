<template>
    <ContentWrapper>
        <div class="content-heading">Flot charts
            <div class="ml-auto text-center">
                <div data-sparkline="" data-bar-color="#cfdbe2" data-height="20" data-bar-width="3" data-bar-spacing="2" data-values="1,0,4,9,5,7,8,9,5,7,8,4,7"></div>
            </div>
        </div>
        <div class="container-fluid">
            <!-- START row-->
            <div class="row">
                <div class="col-xl-6">
                    <div class="card card-default" id="cardChart1">
                        <div class="card-header">
                            <div class="card-title">Area</div>
                        </div>
                        <div class="card-body">
                            <FlotChart :options="ChartArea.options" :data="ChartArea.data" class="flot-chart" height="250px"/>
                        </div>
                    </div>
                </div>
                <div class="col-xl-6">
                    <div class="card card-default" id="cardChart9">
                        <div class="card-header">
                            <div class="card-title">Area Spline</div>
                        </div>
                        <div class="card-body">
                            <FlotChart :options="ChartSpline.options" :data="ChartSpline.data" class="flot-chart" height="250px"/>
                        </div>
                    </div>
                </div>
            </div>
            <!-- END row-->
            <!-- START row-->
            <div class="row">
                <div class="col-xl-6">
                    <div class="card card-default" id="cardChart2">
                        <div class="card-header">
                            <div class="card-title">Bar</div>
                        </div>
                        <div class="card-body">
                            <FlotChart :options="ChartBar.options" :data="ChartBar.data" class="flot-chart" height="250px"/>
                        </div>
                    </div>
                </div>
                <div class="col-xl-6">
                    <div class="card card-default" id="cardChart3">
                        <div class="card-header">
                            <div class="card-title">Bar - Stacked</div>
                        </div>
                        <div class="card-body">
                            <FlotChart :options="ChartBarStacked.options" :data="ChartBarStacked.data" class="flot-chart" height="250px"/>
                        </div>
                    </div>
                </div>
            </div>
            <!-- END row-->
            <!-- START row-->
            <div class="row">
                <div class="col-xl-12">
                    <div class="card card-default" id="cardChart4">
                        <div class="card-header">
                            <div class="card-title">Line</div>
                        </div>
                        <div class="card-body">
                            <FlotChart :options="ChartLine.options" :data="ChartLine.data" class="flot-chart" height="250px"/>
                        </div>
                    </div>
                </div>
            </div>
            <!-- END row-->
            <!-- START row-->
            <div class="row">
                <div class="col-lg-6">
                    <div class="card card-default" id="cardChart5">
                        <div class="card-header">
                            <div class="card-title">Pie</div>
                        </div>
                        <div class="card-body">
                            <FlotChart :options="ChartPie.options" :data="ChartPie.data" class="flot-chart" height="250px"/>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="card card-default" id="cardChart6">
                        <div class="card-header">
                            <div class="card-title">Donut
                                <small>(loaded from json)</small>
                            </div>
                        </div>
                        <div class="card-body">
                            <FlotChart :options="ChartDonut.options" :data="ChartDonut.data" class="flot-chart" height="250px"/>
                        </div>
                    </div>
                </div>
            </div>
            <!-- END row-->
        </div>
    </ContentWrapper>
</template>
<script>
    import { ChartSpline, ChartArea, ChartBar, ChartBarStacked, ChartDonut, ChartLine, ChartPie } from './ChartFlot.setup.js';
    import FlotChart from '@/components/Charts/Flot';

    export default {
        components: {
            FlotChart
        },
        data() {
            return {
                ChartSpline: ChartSpline,
                ChartArea: ChartArea,
                ChartBar: ChartBar,
                ChartBarStacked: ChartBarStacked,
                ChartDonut: ChartDonut,
                ChartLine: ChartLine,
                ChartPie: ChartPie
            }
        }
    }

</script>
