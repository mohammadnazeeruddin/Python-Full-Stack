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
        <!-- START cards box-->
        <div class="row">
            <div class="col-xl-3 col-md-6">
                <!-- START card-->
                <div class="card flex-row align-items-center align-items-stretch border-0">
                    <div class="col-4 d-flex align-items-center bg-primary-dark justify-content-center rounded-left">
                        <em class="icon-cloud-upload fa-3x"></em>
                    </div>
                    <div class="col-8 py-3 bg-primary rounded-right">
                        <div class="h2 mt-0">1700</div>
                        <div class="text-uppercase">Uploads</div>
                    </div>
                </div>
            </div>
            <div class="col-xl-3 col-md-6">
                <!-- START card-->
                <div class="card flex-row align-items-center align-items-stretch border-0">
                    <div class="col-4 d-flex align-items-center bg-purple-dark justify-content-center rounded-left">
                        <em class="icon-globe fa-3x"></em>
                    </div>
                    <div class="col-8 py-3 bg-purple rounded-right">
                        <div class="h2 mt-0">700
                            <small>GB</small>
                        </div>
                        <div class="text-uppercase">Quota</div>
                    </div>
                </div>
            </div>
            <div class="col-xl-3 col-lg-6 col-md-12">
                <!-- START card-->
                <div class="card flex-row align-items-center align-items-stretch border-0">
                    <div class="col-4 d-flex align-items-center bg-green-dark justify-content-center rounded-left">
                        <em class="icon-bubbles fa-3x"></em>
                    </div>
                    <div class="col-8 py-3 bg-green rounded-right">
                        <div class="h2 mt-0">500</div>
                        <div class="text-uppercase">Reviews</div>
                    </div>
                </div>
            </div>
            <div class="col-xl-3 col-lg-6 col-md-12">
                <!-- START date widget-->
                <div class="card flex-row align-items-center align-items-stretch border-0">
                    <div class="col-4 d-flex align-items-center bg-green justify-content-center rounded-left">
                        <div class="text-center">
                            <!-- See formats: https://docs.angularjs.org/api/ng/filter/date-->
                            <Now class="text-sm" format="MMMM"></Now>
                            <br>
                            <Now class="h2 mt-0" format="D"></Now>
                        </div>
                    </div>
                    <div class="col-8 py-3 rounded-right">
                        <Now class="text-uppercase" format="dddd"></Now>
                        <br>
                        <Now class="h2 mt-0" format="h:mm"></Now>
                        <Now class="text-muted text-sm" format="a"></Now>
                    </div>
                </div>
                <!-- END date widget-->
            </div>
        </div>
        <!-- END cards box-->
        <div class="row">
            <!-- START dashboard main content-->
            <div class="col-xl-9">
                <!-- START chart-->
                <div class="row">
                    <div class="col-xl-12">
                        <!-- START card-->
                        <div class="card card-default card-demo" id="cardChart9">
                            <div class="card-header">
                                <CardTool refresh :onRefresh="onRefresh"/>
                                <div class="card-title">Inbound visitor statistics</div>
                            </div>
                            <div class="card-body">
                                <FlotChart :data="flotData" :options="flotOptions" height="250px" />
                            </div>
                        </div>
                        <!-- END card-->
                    </div>
                </div>
                <!-- END chart-->
                <div class="row">
                    <div class="col-xl-12">
                        <div class="card border-0">
                            <div class="row row-flush">
                                <div class="col-lg-2 col-md-3 col-6 bg-info py-4 d-flex align-items-center justify-content-center rounded-left">
                                    <em class="wi wi-day-sunny fa-4x"></em>
                                </div>
                                <div class="col-lg-2 col-md-3 col-6 py-2 br d-flex align-items-center justify-content-center">
                                    <div>
                                        <div class="h1 m-0 text-bold">32&deg;</div>
                                        <div class="text-uppercase">Clear</div>
                                    </div>
                                </div>
                                <div class="col-lg-2 col-md-3 d-none d-md-block py-2 text-center br">
                                    <div class="text-info text-sm">10 AM</div>
                                    <div class="text-muted text-md">
                                        <em class="wi wi-day-cloudy"></em>
                                    </div>
                                    <div class="text-info">
                                        <span class="text-muted">20%</span>
                                    </div>
                                    <div class="text-muted">27&deg;</div>
                                </div>
                                <div class="col-lg-2 col-md-3 d-none d-md-block py-2 text-center br">
                                    <div class="text-info text-sm">11 AM</div>
                                    <div class="text-muted text-md">
                                        <em class="wi wi-day-cloudy"></em>
                                    </div>
                                    <div class="text-info">
                                        <span class="text-muted">30%</span>
                                    </div>
                                    <div class="text-muted">28&deg;</div>
                                </div>
                                <div class="col-lg-2 py-2 text-center br d-none d-lg-block">
                                    <div class="text-info text-sm">12 PM</div>
                                    <div class="text-muted text-md">
                                        <em class="wi wi-day-cloudy"></em>
                                    </div>
                                    <div class="text-info">
                                        <span class="text-muted">20%</span>
                                    </div>
                                    <div class="text-muted">30&deg;</div>
                                </div>
                                <div class="col-lg-2 py-2 text-center d-none d-lg-block">
                                    <div class="text-info text-sm">1 PM</div>
                                    <div class="text-muted text-md">
                                        <em class="wi wi-day-sunny-overcast"></em>
                                    </div>
                                    <div class="text-info">
                                        <span class="text-muted">0%</span>
                                    </div>
                                    <div class="text-muted">30&deg;</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xl-4">
                        <!-- START card-->
                        <div class="card border-0">
                            <div class="card-body">
                                <div class="d-flex">
                                    <h3 class="text-muted mt-0">300</h3>
                                    <em class="ml-auto text-muted fa fa-coffee fa-2x"></em>
                                </div>
                                <Sparkline :options="{
                                        type:'line',
                                        height:80,
                                        width:'100%',
                                        lineWidth:2,
                                        lineColor:'#7266ba',
                                        spotColor:'#888',
                                        fillColor: 'transparent',
                                        minSpotColor:'#7266ba',
                                        maxSpotColor:'#7266ba',
                                        highlightLineColor:'#fff',
                                        spotRadius:3,
                                        resize:true
                                    }"
                                    :values="[1,3,4,7,5,9,4,4,7,5,9,6,4]"
                                    class="pv-lg"/>
                                <p>
                                    <small class="text-muted">Actual progress</small>
                                </p>
                                <div class="progress progress-xs mb-3">
                                    <div class="progress-bar bg-info progress-bar-striped" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style="width: 80%">
                                        <span class="sr-only">80% Complete</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- END card-->
                    </div>
                    <div class="col-xl-8">
                        <div class="card card-default">
                            <div class="card-header">
                                <div class="px-2 float-right badge badge-danger">5</div>
                                <div class="px-2 mr-2 float-right badge badge-success">12</div>
                                <div class="card-title">Team messages</div>
                            </div>
                            <!-- START list group-->
                            <Scrollable :height="180">
                                <div class="list-group">
                                    <!-- START list group item-->
                                    <div class="list-group-item list-group-item-action">
                                        <div class="media">
                                            <img class="align-self-start mx-2 circle thumb32" src="img/user/02.jpg" alt="Image">
                                            <div class="media-body text-truncate">
                                                <p class="mb-1">
                                                    <strong class="text-primary">
                                         <span class="circle bg-success circle-lg text-left"></span>
                                         <span>Catherine Ellis</span>
                                      </strong>
                                                </p>
                                                <p class="mb-1 text-sm">Cras sit amet nibh libero, in gravida nulla. Nulla...</p>
                                            </div>
                                            <div class="ml-auto">
                                                <small class="text-muted ml-2">2h</small>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- END list group item-->
                                    <!-- START list group item-->
                                    <div class="list-group-item list-group-item-action">
                                        <div class="media">
                                            <img class="align-self-start mx-2 circle thumb32" src="img/user/03.jpg" alt="Image">
                                            <div class="media-body text-truncate">
                                                <p class="mb-1">
                                                    <strong class="text-primary">
                                         <span class="circle bg-success circle-lg text-left"></span>
                                         <span>Jessica Silva</span>
                                      </strong>
                                                </p>
                                                <p class="mb-1 text-sm">Cras sit amet nibh libero, in gravida nulla. Nulla...</p>
                                            </div>
                                            <div class="ml-auto">
                                                <small class="text-muted ml-2">3h</small>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- END list group item-->
                                    <!-- START list group item-->
                                    <div class="list-group-item list-group-item-action">
                                        <div class="media">
                                            <img class="align-self-start mx-2 circle thumb32" src="img/user/09.jpg" alt="Image">
                                            <div class="media-body text-truncate">
                                                <p class="mb-1">
                                                    <strong class="text-primary">
                                         <span class="circle bg-danger circle-lg text-left"></span>
                                         <span>Jessie Wells</span>
                                      </strong>
                                                </p>
                                                <p class="mb-1 text-sm">Cras sit amet nibh libero, in gravida nulla. Nulla...</p>
                                            </div>
                                            <div class="ml-auto">
                                                <small class="text-muted ml-2">4h</small>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- END list group item-->
                                    <!-- START list group item-->
                                    <div class="list-group-item list-group-item-action">
                                        <div class="media">
                                            <img class="align-self-start mx-2 circle thumb32" src="img/user/12.jpg" alt="Image">
                                            <div class="media-body text-truncate">
                                                <p class="mb-1">
                                                    <strong class="text-primary">
                                         <span class="circle bg-danger circle-lg text-left"></span>
                                         <span>Rosa Burke</span>
                                      </strong>
                                                </p>
                                                <p class="mb-1 text-sm">Cras sit amet nibh libero, in gravida nulla. Nulla...</p>
                                            </div>
                                            <div class="ml-auto">
                                                <small class="text-muted ml-2"> 1d</small>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- END list group item-->
                                    <!-- START list group item-->
                                    <div class="list-group-item list-group-item-action">
                                        <div class="media">
                                            <img class="align-self-start mx-2 circle thumb32" src="img/user/10.jpg" alt="Image">
                                            <div class="media-body text-truncate">
                                                <p class="mb-1">
                                                    <strong class="text-primary">
                                         <span class="circle bg-danger circle-lg text-left"></span>
                                         <span>Michelle Lane</span>
                                      </strong>
                                                </p>
                                                <p class="mb-1 text-sm">Mauris eleifend, libero nec cursus lacinia...</p>
                                            </div>
                                            <div class="ml-auto">
                                                <small class="text-muted ml-2"> 2d</small>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- END list group item-->
                                </div>
                            </Scrollable>
                            <!-- END list group-->
                            <!-- START card footer-->
                            <div class="card-footer">
                                <div class="input-group">
                                    <input class="form-control form-control-sm" type="text" placeholder="Search message ..">
                                    <span class="input-group-btn">
                            <button class="btn btn-secondary btn-sm" type="submit"><i class="fa fa-search"></i></button>
                         </span>
                                </div>
                            </div>
                            <!-- END card-footer-->
                        </div>
                    </div>
                </div>
            </div>
            <!-- END dashboard main content-->
            <!-- START dashboard sidebar-->
            <aside class="col-xl-3">
                <!-- START loader widget-->
                <div class="card card-default">
                    <div class="card-body">
                        <a class="text-muted float-right" href="#">
                   <em class="fa fa-arrow-right"></em>
                </a>
                        <div class="text-info">Average Monthly Uploads</div>
                        <div class="text-center py-4">
                            <div ref="easypie" class="easypie-chart easypie-chart-lg" data-percent="70">
                                <span>70%</span>
                            </div>
                        </div>
                        <Sparkline :options="{
                                barColor:'#23b7e5',
                                height:30,
                                barWidth:5,
                                barSpacing:2
                            }"
                            :values="[5,4,8,7,8,5,4,6,5,5,9,4,6,3,4,7,5,4,7]"
                            class="text-center"/>
                    </div>
                    <div class="card-footer">
                        <p class="text-muted">
                            <em class="fa fa-upload fa-fw"></em>
                            <span>This Month</span>
                            <span class="text-dark">1000 Gb</span>
                        </p>
                    </div>
                </div>
                <!-- END loader widget-->
                <!-- START messages and activity-->
                <div class="card card-default">
                    <div class="card-header">
                        <div class="card-title">Latest activities</div>
                    </div>
                    <!-- START list group-->
                    <div class="list-group">
                        <!-- START list group item-->
                        <div class="list-group-item">
                            <div class="media">
                                <div class="align-self-start mr-2">
                                    <span class="fa-stack">
                            <em class="fa fa-circle fa-stack-2x text-purple"></em>
                            <em class="fas fa-cloud-upload-alt fa-stack-1x fa-inverse text-white"></em>
                         </span>
                                </div>
                                <div class="media-body text-truncate">
                                    <p class="mb-1">
                                        <a class="text-purple m-0" href="#">NEW FILE</a>
                                    </p>
                                    <p class="m-0">
                                        <small>
                               <a href="#">Bootstrap.xls</a>
                            </small>
                                    </p>
                                </div>
                                <div class="ml-auto">
                                    <small class="text-muted ml-2">15m</small>
                                </div>
                            </div>
                        </div>
                        <!-- END list group item-->
                        <!-- START list group item-->
                        <div class="list-group-item">
                            <div class="media">
                                <div class="align-self-start mr-2">
                                    <span class="fa-stack">
                            <em class="fa fa-circle fa-stack-2x text-info"></em>
                            <em class="far fa-file-alt fa-stack-1x fa-inverse text-white"></em>
                         </span>
                                </div>
                                <div class="media-body text-truncate">
                                    <p class="mb-1">
                                        <a class="text-info m-0" href="#">NEW DOCUMENT</a>
                                    </p>
                                    <p class="m-0">
                                        <small>
                               <a href="#">Bootstrap.doc</a>
                            </small>
                                    </p>
                                </div>
                                <div class="ml-auto">
                                    <small class="text-muted ml-2">2h</small>
                                </div>
                            </div>
                        </div>
                        <!-- END list group item-->
                        <!-- START list group item-->
                        <div class="list-group-item">
                            <div class="media">
                                <div class="align-self-start mr-2">
                                    <span class="fa-stack">
                            <em class="fa fa-circle fa-stack-2x text-danger"></em>
                            <em class="fa fa-exclamation fa-stack-1x fa-inverse text-white"></em>
                         </span>
                                </div>
                                <div class="media-body text-truncate">
                                    <p class="mb-1">
                                        <a class="text-danger m-0" href="#">BROADCAST</a>
                                    </p>
                                    <p class="m-0">
                                        <a href="#">Read</a>
                                    </p>
                                </div>
                                <div class="ml-auto">
                                    <small class="text-muted ml-2">5h</small>
                                </div>
                            </div>
                        </div>
                        <!-- END list group item-->
                        <!-- START list group item-->
                        <div class="list-group-item">
                            <div class="media">
                                <div class="align-self-start mr-2">
                                    <span class="fa-stack">
                            <em class="fa fa-circle fa-stack-2x text-success"></em>
                            <em class="far fa-clock fa-stack-1x fa-inverse text-white"></em>
                         </span>
                                </div>
                                <div class="media-body text-truncate">
                                    <p class="mb-1">
                                        <a class="text-success m-0" href="#">NEW MEETING</a>
                                    </p>
                                    <p class="m-0">
                                        <small>On
                               <em>10/12/2015 09:00 am</em>
                            </small>
                                    </p>
                                </div>
                                <div class="ml-auto">
                                    <small class="text-muted ml-2">15h</small>
                                </div>
                            </div>
                        </div>
                        <!-- END list group item-->
                        <!-- START list group item-->
                        <div class="list-group-item">
                            <div class="media">
                                <div class="align-self-start mr-2">
                                    <span class="fa-stack">
                            <em class="fa fa-circle fa-stack-2x text-warning"></em>
                            <em class="fa fa-tasks fa-stack-1x fa-inverse text-white"></em>
                         </span>
                                </div>
                                <div class="media-body text-truncate">
                                    <p class="mb-1">
                                        <a class="text-warning m-0" href="#">TASKS COMPLETION</a>
                                    </p>
                                    <div class="progress progress-xs m-0">
                                        <div class="progress-bar bg-warning progress-bar-striped" role="progressbar" aria-valuenow="22" aria-valuemin="0" aria-valuemax="100" style="width: 22%">
                                            <span class="sr-only">22% Complete</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="ml-auto">
                                    <small class="text-muted ml-2">1w</small>
                                </div>
                            </div>
                        </div>
                        <!-- END list group item-->
                    </div>
                    <!-- END list group-->
                    <!-- START card footer-->
                    <div class="card-footer">
                        <a class="text-sm" href="#">Load more</a>
                    </div>
                    <!-- END card-footer-->
                </div>
                <!-- END messages and activity-->
            </aside>
            <!-- END dashboard sidebar-->
        </div>
    </ContentWrapper>
</template>

<script>

    import EasyPieChart from 'easy-pie-chart';

    import CardTool from '@/components/Common/CardTool'
    import Sparkline from '@/components/Common/Sparklines';
    import Scrollable from '@/components/Common/Scrollable'
    import FlotChart from '@/components/Charts/Flot';
    import Now from '@/components/Common/Now';

    export default {
        name: 'DashboardV1',
        components: {
            CardTool,
            Sparkline,
            Scrollable,
            FlotChart,
            Now
        },
        data() {
            return {
                flotData: [{
                    "label": "Uniques",
                    "color": "#768294",
                    "data": [
                        ["Mar", 70],["Apr", 85],["May", 59],["Jun", 93],["Jul", 66],["Aug", 86],["Sep", 60]
                    ]
                }, {
                    "label": "Recurrent",
                    "color": "#1f92fe",
                    "data": [
                        ["Mar", 21],["Apr", 12],["May", 27],["Jun", 24],["Jul", 16],["Aug", 39],["Sep", 15]
                    ]
                }],
                flotOptions: {
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
                        tickFormatter: v => v /* + ' visitors'*/
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
            // Easy pie
            let pieOptions1 = {
                animate: {
                    duration: 800,
                    enabled: true
                },
                barColor: '#23b7e5',
                trackColor: 'rgba(200,200,200,0.4)',
                scaleColor: false,
                lineWidth: 10,
                lineCap: 'round',
                size: 145
            };
            new EasyPieChart(this.$refs.easypie, pieOptions1);
        },
        methods: {
            changeLanguage (lang) {
                this.$i18n.i18next.changeLanguage(lang);
            },
            onRefresh (_,done) {
                setTimeout(done, 2000)
            }
        }

    }

</script>