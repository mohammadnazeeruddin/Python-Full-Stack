<template>
    <ContentWrapper>
        <div class="content-heading">
            <div>Dashboard
                <small>{{$t("dashboard.WELCOME")}}</small>
            </div>
            <!-- START Language list-->
            <div class="ml-auto">
                <b-dropdown id="ddown1" :text="selectedLanguage()" no-caret right>
                    <b-dropdown-item @click="changeLanguage('en')">English</b-dropdown-item>
                    <b-dropdown-item @click="changeLanguage('es')">Spanish</b-dropdown-item>
                </b-dropdown>
            </div>
            <!-- END Language list-->
        </div>
        <div class="row">
            <div class="col-xl-4">
                <!-- START List group-->
                <div class="list-group mb-3">
                    <div class="list-group-item">
                        <div class="d-flex align-items-center py-3">
                            <div class="w-50 px-3">
                                <p class="m-0 lead">1204</p>
                                <p class="m-0 text-sm">Commits this month</p>
                            </div>
                            <div class="w-50 px-3 text-center">
                                <Sparkline :options="{
                                        barColor:'#23b7e5',
                                        height:'60',
                                        barWidth:'10',
                                        barSpacing:'6',
                                        chartRangeMin:'0'
                                    }"
                                    :values="[3,6,7,8,4,5]"/>
                            </div>
                        </div>
                    </div>
                    <div class="list-group-item">
                        <div class="d-flex align-items-center py-3">
                            <div class="w-50 px-3">
                                <p class="m-0 lead">$ 3,200.00</p>
                                <p class="m-0 text-sm">Available budget</p>
                            </div>
                            <div class="w-50 px-3 text-center">
                                <Sparkline :options="{
                                        type:'line',
                                        height:'60',
                                        width:'80%',
                                        lineWidth:'2',
                                        lineColor:'#7266ba',
                                        chartRangeMin:'0',
                                        spotColor:'#888',
                                        minSpotColor:'#7266ba',
                                        maxSpotColor:'#7266ba',
                                        fillColor:'',
                                        highlightLineColor:'#fff',
                                        spotRadius:'3',
                                        resize:true
                                    }"
                                    :values="[7,3,4,7,5,9,4,4,7,5,9,6,4]"/>

                            </div>
                        </div>
                    </div>
                    <div class="list-group-item">
                        <div class="d-flex align-items-center py-3">
                            <div class="w-50 px-3">
                                <p class="m-0 lead">67</p>
                                <p class="m-0 text-sm">New followers</p>
                            </div>
                            <div class="w-50 px-3 text-center">
                                <div class="d-flex align-items-center flex-wrap justify-content-center">
                                    <a href="#" v-b-tooltip.hover title="Katie">
                                        <img class="circle thumb24 mx-1" src="img/user/02.jpg" alt="Follower">
                                    </a>
                                    <a href="#" v-b-tooltip.hover title="Cody">
                                        <img class="circle thumb24 mx-1" src="img/user/01.jpg" alt="Follower">
                                    </a>
                                    <a href="#" v-b-tooltip.hover title="Tamara">
                                        <img class="circle thumb24 mx-1" src="img/user/03.jpg" alt="Follower">
                                    </a>
                                    <a href="#" v-b-tooltip.hover title="Gene">
                                        <img class="circle thumb24 mx-1" src="img/user/04.jpg" alt="Follower">
                                    </a>
                                    <a href="#" v-b-tooltip.hover title="Marsha">
                                        <img class="circle thumb24 mx-1" src="img/user/04.jpg" alt="Follower">
                                    </a>
                                    <a href="#" v-b-tooltip.hover title="Robin">
                                        <img class="circle thumb24 mx-1" src="img/user/09.jpg" alt="Follower">
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- END List group-->
            </div>
            <div class="col-xl-8">
                <!-- START bar chart-->
                <div class="card" id="cardChart3">
                    <div class="card-header">
                        <!-- START button group-->
                        <div class="float-right btn-group">
                            <b-dropdown id="ddown1" text="Monthly" size="sm" no-caret right>
                                <b-dropdown-item>Daily</b-dropdown-item>
                                <b-dropdown-item>Monthly</b-dropdown-item>
                                <b-dropdown-item>Yearly</b-dropdown-item>
                            </b-dropdown>
                        </div>
                        <!-- END button group-->
                        <div class="card-title">Projects Hours</div>
                    </div>
                    <div class="card-wrapper">
                        <div class="card-body">
                            <FlotChart :data="barStackedData" :options="barStackedOptions" height="250px" />
                        </div>
                    </div>
                </div>
                <!-- END bar chart-->
            </div>
        </div>
        <div class="unwrap my-3">
            <!-- START chart-->
            <div class="card" id="cardChart9">
                <div class="card-header">
                    <!-- START button group-->
                    <div class="float-right btn-group">
                        <b-dropdown id="ddown1" text="Monthly" size="sm" no-caret right menu-class="animated fadeInLeft dropdown-menu-right-forced">
                            <b-dropdown-item>Daily</b-dropdown-item>
                            <b-dropdown-item>Monthly</b-dropdown-item>
                            <b-dropdown-divider></b-dropdown-divider>
                            <b-dropdown-item>All time</b-dropdown-item>
                        </b-dropdown>
                    </div>
                    <!-- END button group-->
                    <div class="card-title">Overall progress</div>
                </div>
                <div class="card-wrapper">
                    <div class="card-body">
                        <FlotChart :data="splineData" :options="splineOptions" height="250px" />
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-3 col-6 text-center">
                                <p>Projects</p>
                                <div class="h1">25</div>
                            </div>
                            <div class="col-md-3 col-6 text-center">
                                <p>Teammates</p>
                                <div class="h1">85</div>
                            </div>
                            <div class="col-md-3 col-6 text-center">
                                <p>Hours</p>
                                <div class="h1">380</div>
                            </div>
                            <div class="col-md-3 col-6 text-center">
                                <p>Budget</p>
                                <div class="h1 text-truncate">$ 10,000.00</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- END chart-->
        </div>
        <!-- START radial charts-->
        <div class="row mb-3">
            <div class="col-lg-3 col-6 text-center">
                <p>Current Project</p>
                <div class="text-center py-4">
                    <div ref="easypiechart1" class="easypie-chart easypie-chart-md" data-percent="60">
                        <span>60%</span>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-6 text-center">
                <p>Current Progress</p>
                <div class="text-center py-4">
                    <div ref="easypiechart2" class="easypie-chart easypie-chart-md" data-percent="30">
                        <span>30%</span>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-6 text-center">
                <p>Space Usage</p>
                <div class="text-center py-4">
                    <div ref="easypiechart3" class="easypie-chart easypie-chart-md" data-percent="50">
                        <span>50%</span>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-6 text-center">
                <p>Interactions</p>
                <div class="text-center py-4">
                    <div ref="easypiechart4" class="easypie-chart easypie-chart-md" data-percent="75">
                        <span>75%</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- START radial charts-->
        <!-- START Multiple List group-->
        <div class="list-group mb-3">
            <a class="list-group-item" href="#">
                <table class="wd-wide">
                    <tbody>
                        <tr>
                            <td class="wd-xs">
                                <div class="px-2">
                                    <img class="img-fluid rounded thumb64" src="img/dummy.png" alt="">
                                </div>
                            </td>
                            <td>
                                <div class="px-2">
                                    <h4 class="mb-2">Project A</h4>
                                    <small class="text-muted">Vestibulum ante ipsum primis in faucibus orci</small>
                                </div>
                            </td>
                            <td class="wd-sm d-none d-lg-table-cell">
                                <div class="px-2">
                                    <p class="m-0">Last change</p>
                                    <small class="text-muted">4 weeks ago</small>
                                </div>
                            </td>
                            <td class="wd-xs d-none d-lg-table-cell">
                                <div class="px-2">
                                    <p class="m-0 text-muted">
                                        <em class="icon-people mr-2 fa-lg"></em>26</p>
                                </div>
                            </td>
                            <td class="wd-xs d-none d-lg-table-cell">
                                <div class="px-2">
                                    <p class="m-0 text-muted">
                                        <em class="icon-doc mr-2 fa-lg"></em>3500</p>
                                </div>
                            </td>
                            <td class="wd-sm">
                                <div class="px-2">
                                    <div class="progress-bar progress-xs bg-success" style="width: 80%">
                                        <span class="sr-only">80%</span>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </a>
        </div>
        <div class="list-group mb-3">
            <a class="list-group-item" href="#">
                <table class="wd-wide">
                    <tbody>
                        <tr>
                            <td class="wd-xs">
                                <div class="px-2">
                                    <img class="img-fluid rounded thumb64" src="img/dummy.png" alt="">
                                </div>
                            </td>
                            <td>
                                <div class="px-2">
                                    <h4 class="mb-2">Project X</h4>
                                    <small class="text-muted">Vestibulum ante ipsum primis in faucibus orci</small>
                                </div>
                            </td>
                            <td class="wd-sm d-none d-lg-table-cell">
                                <div class="px-2">
                                    <p class="m-0">Last change</p>
                                    <small class="text-muted">Today at 06:23 am</small>
                                </div>
                            </td>
                            <td class="wd-xs d-none d-lg-table-cell">
                                <div class="px-2">
                                    <p class="m-0 text-muted">
                                        <em class="icon-people mr-2 fa-lg"></em>3</p>
                                </div>
                            </td>
                            <td class="wd-xs d-none d-lg-table-cell">
                                <div class="px-2">
                                    <p class="m-0 text-muted">
                                        <em class="icon-doc mr-2 fa-lg"></em>150</p>
                                </div>
                            </td>
                            <td class="wd-sm">
                                <div class="px-2">
                                    <div class="progress-bar progress-xs bg-purple" style="width: 50%">
                                        <span class="sr-only">50%</span>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </a>
        </div>
        <div class="list-group mb-3">
            <a class="list-group-item" href="#">
                <table class="wd-wide">
                    <tbody>
                        <tr>
                            <td class="wd-xs">
                                <div class="px-2">
                                    <img class="img-fluid rounded thumb64" src="img/dummy.png" alt="">
                                </div>
                            </td>
                            <td>
                                <div class="px-2">
                                    <h4 class="mb-2">Project Z</h4>
                                    <small class="text-muted">Vestibulum ante ipsum primis in faucibus orci</small>
                                </div>
                            </td>
                            <td class="wd-sm d-none d-lg-table-cell">
                                <div class="px-2">
                                    <p class="m-0">Last change</p>
                                    <small class="text-muted">Yesterday at 10:20 pm</small>
                                </div>
                            </td>
                            <td class="wd-xs d-none d-lg-table-cell">
                                <div class="px-2">
                                    <p class="m-0 text-muted">
                                        <em class="icon-people mr-2 fa-lg"></em>15</p>
                                </div>
                            </td>
                            <td class="wd-xs d-none d-lg-table-cell">
                                <div class="px-2">
                                    <p class="m-0 text-muted">
                                        <em class="icon-doc mr-2 fa-lg"></em>480</p>
                                </div>
                            </td>
                            <td class="wd-sm">
                                <div class="px-2">
                                    <div class="progress-bar progress-xs bg-green" style="width: 20%">
                                        <span class="sr-only">20%</span>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </a>
            <!-- END dashboard main content-->
        </div>
        <!-- END Multiple List group-->
    </ContentWrapper>
</template>

<script>
    import EasyPieChart from 'easy-pie-chart';
    import Sparkline from '@/components/Common/Sparklines';
    import FlotChart from '@/components/Charts/Flot';

    export default {
        name: 'DashboardV2',
        components: {
            Sparkline,
            FlotChart
        },
        data() {
            return {
                splineData: [{
                    "label": "Hours",
                    "color": "#23b7e5",
                    "data": [
                        ["Jan", 70],
                        ["Feb", 20],
                        ["Mar", 70],
                        ["Apr", 85],
                        ["May", 59],
                        ["Jun", 93],
                        ["Jul", 66],
                        ["Aug", 86],
                        ["Sep", 60],
                        ["Oct", 60],
                        ["Nov", 12],
                        ["Dec", 50]
                    ]
                }, {
                    "label": "Commits",
                    "color": "#7266ba",
                    "data": [
                        ["Jan", 20],
                        ["Feb", 70],
                        ["Mar", 30],
                        ["Apr", 50],
                        ["May", 85],
                        ["Jun", 43],
                        ["Jul", 96],
                        ["Aug", 36],
                        ["Sep", 80],
                        ["Oct", 10],
                        ["Nov", 72],
                        ["Dec", 31]
                    ]
                }],
                splineOptions: {
                    series: {
                        lines: {
                            show: false
                        },
                        points: {
                            show: true,
                            radius: 4
                        },
                        splines: {
                            show: true,
                            tension: 0.4,
                            lineWidth: 1,
                            fill: 0.5
                        }
                    },
                    grid: {
                        borderColor: '#eee',
                        borderWidth: 1,
                        hoverable: true,
                        backgroundColor: '#fcfcfc'
                    },
                    tooltip: true,
                    tooltipOpts: {
                        content: (label, x, y) => x + ' : ' + y
                    },
                    xaxis: {
                        tickColor: '#fcfcfc',
                        mode: 'categories'
                    },
                    yaxis: {
                        min: 0,
                        max: 150, // optional: use it for a clear represetation
                        tickColor: '#eee',
                        //position: 'right' or 'left',
                        tickFormatter: v => v
                    },
                    shadowSize: 0
                },
                // Chart bar Stacked
                barStackedData: [{
                    "label": "Pending",
                    "color": "#9289ca",
                    "data": [
                        ["Pj1", 86],
                        ["Pj2", 136],
                        ["Pj3", 97],
                        ["Pj4", 110],
                        ["Pj5", 62],
                        ["Pj6", 85],
                        ["Pj7", 115],
                        ["Pj8", 78],
                        ["Pj9", 104],
                        ["Pj10", 82],
                        ["Pj11", 97],
                        ["Pj12", 110],
                        ["Pj13", 62]
                    ]
                }, {
                    "label": "Assigned",
                    "color": "#7266ba",
                    "data": [
                        ["Pj1", 49],
                        ["Pj2", 81],
                        ["Pj3", 47],
                        ["Pj4", 44],
                        ["Pj5", 100],
                        ["Pj6", 49],
                        ["Pj7", 94],
                        ["Pj8", 44],
                        ["Pj9", 52],
                        ["Pj10", 17],
                        ["Pj11", 47],
                        ["Pj12", 44],
                        ["Pj13", 100]
                    ]
                }, {
                    "label": "Completed",
                    "color": "#564aa3",
                    "data": [
                        ["Pj1", 29],
                        ["Pj2", 56],
                        ["Pj3", 14],
                        ["Pj4", 21],
                        ["Pj5", 5],
                        ["Pj6", 24],
                        ["Pj7", 37],
                        ["Pj8", 22],
                        ["Pj9", 28],
                        ["Pj10", 9],
                        ["Pj11", 14],
                        ["Pj12", 21],
                        ["Pj13", 5]
                    ]
                }],
                barStackedOptions: {
                    series: {
                        stack: true,
                        bars: {
                            align: 'center',
                            lineWidth: 0,
                            show: true,
                            barWidth: 0.6,
                            fill: 0.9
                        }
                    },
                    grid: {
                        borderColor: '#eee',
                        borderWidth: 1,
                        hoverable: true,
                        backgroundColor: '#fcfcfc'
                    },
                    tooltip: true,
                    tooltipOpts: {
                        content: (label, x, y) => x + ' : ' + y
                    },
                    xaxis: {
                        tickColor: '#fcfcfc',
                        mode: 'categories'
                    },
                    yaxis: {
                        // position: 'right' or 'left'
                        tickColor: '#eee'
                    },
                    shadowSize: 0
                },

                selectedLanguage() {
                    switch(this.$i18n.i18next.language) {
                        case 'es': return 'Spanish'; break;
                        case 'en': default: return 'English';
                    }
                }
            }
        },
        mounted() {
            let pieOptions1 = {
                 animate: {duration: 800, enabled: true},
                 barColor:"#23b7e5",
                 trackColor:"#edf2f6",
                 scaleColor:false,
                 lineWidth:2,
                 lineCap:'round',
                 size:130
            };
            new EasyPieChart(this.$refs.easypiechart1, pieOptions1);
            let pieOptions2 = {
                 animate: {duration: 800, enabled: true},
                 barColor:"#f532e5",
                 trackColor:"#edf2f6",
                 scaleColor:false,
                 lineWidth:2,
                 lineCap:'round',
                 size:130
            };
            new EasyPieChart(this.$refs.easypiechart2, pieOptions2);
            let pieOptions3 = {
                 animate: {duration: 800, enabled: true},
                 barColor:"#7266ba",
                 trackColor:"#edf2f6",
                 scaleColor:false,
                 lineWidth:2,
                 lineCap:'round',
                 size:130
            };
            new EasyPieChart(this.$refs.easypiechart3, pieOptions3);
            let pieOptions4 = {
                 animate: {duration: 800, enabled: true},
                 barColor:"#ff902b",
                 trackColor:"#edf2f6",
                 scaleColor:false,
                 lineWidth:2,
                 lineCap:'round',
                 size:130
            };
            new EasyPieChart(this.$refs.easypiechart4, pieOptions4);
        },
        methods: {
            changeLanguage (lang) {
                this.$i18n.i18next.changeLanguage(lang);
            }
        }
    }

</script>