<template>
    <ContentWrapper>
        <div class="content-heading">Morris JS</div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-lg-6">
                    <div class="card card-default">
                        <div class="card-header">Line</div>
                        <div class="card-body">
                            <Morris type="Line" id="morris-line" :data="chartdata" :options="lineOptions" />
                        </div>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="card card-default">
                        <div class="card-header">Area</div>
                        <div class="card-body">
                            <Morris type="Area" id="morris-area" :data="chartdata" :options="areaOptions"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-6">
                    <div class="card card-default">
                        <div class="card-header">Bar</div>
                        <div class="card-body">
                            <Morris type="Bar" id="morris-bar" :data="chartdata" :options="barOptions"/>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="card card-default">
                        <div class="card-header">Donut</div>
                        <div class="card-body">
                            <Morris type="Donut" id="morris-donut" :data="donutdata" :options="donutOptions"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </ContentWrapper>
</template>
<script>

    import Morris from '@/components/Charts/Morris'

    export default {
        components: {
            Morris
        },
        data() {
            return {
                // Data for charts
                chartdata: [
                    { y: "2006", a: 100, b: 90 },
                    { y: "2007", a: 75, b: 65 },
                    { y: "2008", a: 50, b: 40 },
                    { y: "2009", a: 75, b: 65 },
                    { y: "2010", a: 50, b: 40 },
                    { y: "2011", a: 75, b: 65 },
                    { y: "2012", a: 100, b: 90 }
                ],
                donutdata: [
                    {label: "Download Sales", value: 12},
                    {label: "In-Store Sales", value: 30},
                    {label: "Mail-Order Sales", value: 20}
                ],
                // Line Chart
                lineOptions: {
                    element: 'morris-line',
                    xkey: 'y',
                    ykeys: ["a", "b"],
                    labels: ["Serie A", "Serie B"],
                    lineColors: ["#31C0BE", "#7a92a3"],
                    resize: true
                },
                // Donut Chart
                donutOptions: {
                    element: 'morris-donut',
                    colors: ['#f05050', '#fad732', '#ff902b'],
                    resize: true
                },
                // Bar Chart
                barOptions: {
                    element: 'morris-bar',
                    xkey: 'y',
                    ykeys: ["a", "b"],
                    labels: ["Series A", "Series B"],
                    xLabelMargin: 2,
                    barColors: ['#23b7e5', '#f05050'],
                    resize: true
                },
                // Area Chart
                areaOptions: {
                    element: 'morris-area',
                    xkey: 'y',
                    ykeys: ["a", "b"],
                    labels: ["Serie A", "Serie B"],
                    lineColors: ['#7266ba', '#23b7e5'],
                    resize: true
                }
            }
        }
    }

</script>
