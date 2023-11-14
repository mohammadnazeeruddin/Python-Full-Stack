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
                <div class="card bg-info-light pt-2 b0">
                    <div class="px-2">
                        <em class="icon-cloud-upload fa-lg float-right"></em>
                        <div class="h2 mt-0">1700</div>
                        <div class="text-uppercase">Uploads</div>
                    </div>
                    <Sparkline :options="{
                            type:'line',
                            width:'100%',
                            height:'75px',
                            lineColor:'#23b7e5',
                            chartRangeMin:'0',
                            fillColor:'#23b7e5',
                            spotColor:'#23b7e5',
                            minSpotColor:'#23b7e5',
                            maxSpotColor:'#23b7e5',
                            highlightSpotColor:'#23b7e5',
                            highlightLineColor:'#23b7e5',
                            resize:true
                        }"
                        :values="[2,5,3,7,4,5]"
                        :style="{marginBottom: '-2px'}"
                    />
                </div>
            </div>
            <div class="col-xl-3 col-md-6">
                <!-- START card-->
                <div class="card bg-purple-light pt-2 b0">
                    <div class="px-2">
                        <em class="icon-globe fa-lg float-right"></em>
                        <div class="h2 mt-0">700
                            <span class="text-sm text-white">GB</span>
                        </div>
                        <div class="text-uppercase">Quota</div>
                    </div>
                    <Sparkline :options="{
                            type:'line',
                            width:'100%',
                            height:'75px',
                            lineColor:'#7266ba',
                            chartRangeMin:'0',
                            fillColor:'#7266ba',
                            spotColor:'#7266ba',
                            minSpotColor:'#7266ba',
                            maxSpotColor:'#7266ba',
                            highlightSpotColor:'#7266ba',
                            highlightLineColor:'#7266ba',
                            resize:true
                        }"
                        :values="[1,4,5,4,8,7,10]"
                        :style="{marginBottom: '-2px'}"
                    />
                </div>
            </div>
            <div class="col-xl-3 col-lg-6 col-md-12">
                <!-- START card-->
                <div class="card bg-info-light pt-2 b0">
                    <div class="px-2">
                        <em class="icon-bubbles fa-lg float-right"></em>
                        <div class="h2 mt-0">500</div>
                        <div class="text-uppercase">Reviews</div>
                    </div>
                    <Sparkline :options="{
                            type:'line',
                            width:'100%',
                            height:'75px',
                            lineColor:'#23b7e5',
                            chartRangeMin:'0',
                            fillColor:'#23b7e5',
                            spotColor:'#23b7e5',
                            minSpotColor:'#23b7e5',
                            maxSpotColor:'#23b7e5',
                            highlightSpotColor:'#23b7e5',
                            highlightLineColor:'#23b7e5',
                            resize:true
                        }"
                        :values="[4,5,3,10,7,15]"
                        :style="{marginBottom: '-2px'}"
                    />
                </div>
            </div>
            <div class="col-xl-3 col-lg-6 col-md-12">
                <!-- START card-->
                <div class="card bg-purple-light pt-2 b0">
                    <div class="px-2">
                        <em class="icon-pencil fa-lg float-right"></em>
                        <div class="h2 mt-0">35</div>
                        <div class="text-uppercase">Annotations</div>
                    </div>
                    <Sparkline :options="{
                            type:'line',
                            width:'100%',
                            height:'75px',
                            lineColor:'#7266ba',
                            chartRangeMin:'0',
                            fillColor:'#7266ba',
                            spotColor:'#7266ba',
                            minSpotColor:'#7266ba',
                            maxSpotColor:'#7266ba',
                            highlightSpotColor:'#7266ba',
                            highlightLineColor:'#7266ba',
                            resize:true
                        }"
                        :values="[1,3,4,5,7,8]"
                        :style="{marginBottom: '-2px'}"
                    />
                </div>
            </div>
        </div>
        <!-- END cards box-->
        <!-- START chart-->
        <div class="row">
            <div class="col-xl-12">
                <!-- START card-->
                <div class="card card-default" id="cardChart9">
                    <div class="card-header">
                        <div class="card-title">Website Performance</div>
                    </div>
                    <div class="card-wrapper">
                        <div class="card-body">
                            <FlotChart :data="splineData" :options="splineOptions" height="250px" />
                        </div>
                    </div>
                </div>
                <!-- END card-->
            </div>
        </div>
        <!-- END chart-->
        <div class="row">
            <div class="col-xl-6">
                <!-- START card tab-->
                <div class="card card-transparent" role="tabpanel">
                    <!-- Nav tabs-->
                    <b-tabs content-class="p-0 bg-white" nav-class="nav-fill">
                        <b-tab active>
                            <template slot="title">
                                <em class="far fa-clock fa-fw"></em>Tasks Card
                            </template>
                            <!-- START list group-->
                            <div class="list-group mb-0">
                                <a class="list-group-item bt0" href="#">
                                <span class="badge badge-purple float-right">just now</span>
                                <em class="fa-fw fas fa-calendar-alt mr-2"></em>Calendar updated</a>
                                <a class="list-group-item" href="#">
                                <span class="badge badge-purple float-right">4 minutes ago</span>
                                <em class="fa-fw fa fa-comment mr-2"></em>Commented on a post</a>
                                <a class="list-group-item" href="#">
                                <span class="badge badge-purple float-right">23 minutes ago</span>
                                <em class="fa-fw fa fa-truck mr-2"></em>Order 392 shipped</a>
                                <a class="list-group-item" href="#">
                                <span class="badge badge-purple float-right">46 minutes ago</span>
                                <em class="fa-fw far fa-money-bill-alt mr-2"></em>Invoice 653 has been paid</a>
                                <a class="list-group-item" href="#">
                                <span class="badge badge-purple float-right">1 hour ago</span>
                                <em class="fa-fw fa fa-user mr-2"></em>A new user has been added</a>
                                <a class="list-group-item" href="#">
                                <span class="badge badge-purple float-right">2 hours ago</span>
                                <em class="fa-fw fa fa-check mr-2"></em>Completed task: "pick up dry cleaning"</a>
                                <a class="list-group-item" href="#">
                                <span class="badge badge-purple float-right">yesterday</span>
                                <em class="fa-fw fa fa-globe mr-2"></em>Saved the world</a>
                                <a class="list-group-item" href="#">
                                <span class="badge badge-purple float-right">two days ago</span>
                                <em class="fa-fw fa fa-check mr-2"></em>Completed task: "fix error on sales page"</a>
                                <a class="list-group-item" href="#">
                                <span class="badge badge-purple float-right">two days ago</span>
                                <em class="fa-fw fa fa-check mr-2"></em>Completed task: "fix error on sales page"</a>
                            </div>
                            <!-- END list group-->
                            <div class="card-footer text-right">
                                <button class="btn btn-secondary btn-sm" type="button">View All Activity</button>
                            </div>
                        </b-tab>
                        <b-tab>
                            <template slot="title">
                                <em class="far fa-money-bill-alt fa-fw"></em>Transactions Card
                            </template>
                            <!-- START table responsive-->
                            <div class="table-responsive">
                                <table class="table table-bordered table-hover table-striped">
                                    <thead>
                                        <tr>
                                            <th>Order #</th>
                                            <th>Order Date</th>
                                            <th>Order Time</th>
                                            <th>Amount (USD)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>3326</td>
                                            <td>10/21/2013</td>
                                            <td>3:29 PM</td>
                                            <td>$321.33</td>
                                        </tr>
                                        <tr>
                                            <td>3325</td>
                                            <td>10/21/2013</td>
                                            <td>3:20 PM</td>
                                            <td>$234.34</td>
                                        </tr>
                                        <tr>
                                            <td>3324</td>
                                            <td>10/21/2013</td>
                                            <td>3:03 PM</td>
                                            <td>$724.17</td>
                                        </tr>
                                        <tr>
                                            <td>3323</td>
                                            <td>10/21/2013</td>
                                            <td>3:00 PM</td>
                                            <td>$23.71</td>
                                        </tr>
                                        <tr>
                                            <td>3322</td>
                                            <td>10/21/2013</td>
                                            <td>2:49 PM</td>
                                            <td>$8345.23</td>
                                        </tr>
                                        <tr>
                                            <td>3321</td>
                                            <td>10/21/2013</td>
                                            <td>2:23 PM</td>
                                            <td>$245.12</td>
                                        </tr>
                                        <tr>
                                            <td>3320</td>
                                            <td>10/21/2013</td>
                                            <td>2:15 PM</td>
                                            <td>$5663.54</td>
                                        </tr>
                                        <tr>
                                            <td>3319</td>
                                            <td>10/21/2013</td>
                                            <td>2:13 PM</td>
                                            <td>$943.45</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <!-- END table responsive-->
                            <div class="card-footer text-right">
                                <a class="btn btn-secondary btn-sm" href="#">View All Transactions</a>
                            </div>
                        </b-tab>
                    </b-tabs>
                </div>
                <!-- END card tab-->
            </div>
            <div class="col-xl-6">
                <div class="card card-transparent">
                    <VectorMap height="450px" :options="options" :series="series" :markers="markers"/>
                </div>
            </div>
        </div>
        <!-- START cards-->
        <div class="row">
            <div class="col-xl-3">
                <!-- START loader widget-->
                <div class="card card-default">
                    <div class="card-body">
                        <a class="text-muted float-right" href="#">
                   <em class="fa fa-arrow-right"></em>
                </a>
                        <div class="text-info">Average Monthly Uploads</div>
                        <div class="text-center py-4">
                            <div ref="easypiechart" class="easypie-chart easypie-chart-lg" data-percent="70">
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
            </div>
            <div class="col-xl-3">
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
                    </div>
                    <!-- END list group-->
                    <!-- START card footer-->
                    <div class="card-footer">
                        <a class="text-sm" href="#">Load more</a>
                    </div>
                    <!-- END card-footer-->
                </div>
                <!-- END messages and activity-->
            </div>
            <div class="col-xl-6">
                <div class="card card-default">
                    <div class="card-header">
                        <div class="px-2 float-right badge badge-danger">5</div>
                        <div class="px-2 mr-2 float-right badge badge-success">12</div>
                        <div class="card-title">Team messages</div>
                    </div>
                    <!-- START list group-->
                    <Scrollable :height="230">
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
            <!-- END dashboard sidebar-->
        </div>
        <!-- END cards-->
    </ContentWrapper>
</template>


<script>
    import EasyPieChart from 'easy-pie-chart';
    import Sparkline from '@/components/Common/Sparklines';
    import Scrollable from '@/components/Common/Scrollable'
    import FlotChart from '@/components/Charts/Flot';
    import VectorMap from '@/components/Maps/VectorMap';

    const defaultColors = {
        markerColor:  '#23b7e5',      // the marker points
        bgColor:      'transparent',  // the background
        scaleColors:  ['#878c9a'],    // the color of the region in the serie
        regionFill:   '#bbbec6'       // the base region color
    };

    const RegionValues = {
        'CA': 11100,   // Canada
        'DE': 2510,    // Germany
        'FR': 3710,    // France
        'AU': 5710,    // Australia
        'GB': 8310,    // Great Britain
        'RU': 9310,    // Russia
        'BR': 6610,    // Brazil
        'IN': 7810,    // India
        'CN': 4310,    // China
        'US': 839,     // USA
        'SA': 410      // Saudi Arabia
    }

    export default {
        name: 'DashboardV3',
        components: {
            Sparkline,
            Scrollable,
            FlotChart,
            VectorMap
        },
        data() {
            return {
                splineData: [{
                    "label": "Home",
                    "color": "#1ba3cd",
                    "data": [
                        ["1", 38],
                        ["2", 40],
                        ["3", 42],
                        ["4", 48],
                        ["5", 50],
                        ["6", 70],
                        ["7", 145],
                        ["8", 70],
                        ["9", 59],
                        ["10", 48],
                        ["11", 38],
                        ["12", 29],
                        ["13", 30],
                        ["14", 22],
                        ["15", 28]
                    ]
                }, {
                    "label": "Overall",
                    "color": "#3a3f51",
                    "data": [
                        ["1", 16],
                        ["2", 18],
                        ["3", 17],
                        ["4", 16],
                        ["5", 30],
                        ["6", 110],
                        ["7", 19],
                        ["8", 18],
                        ["9", 110],
                        ["10", 19],
                        ["11", 16],
                        ["12", 10],
                        ["13", 20],
                        ["14", 10],
                        ["15", 20]
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

                // VectorMap
                series: {
                    regions: [{
                        values: RegionValues,
                        scale: defaultColors.scaleColors,
                        normalizeFunction: 'polynomial'
                    }]
                },
                markers: [
                    { latLng:[41.90, 12.45],  name:'Vatican City'          },
                    { latLng:[43.73, 7.41],   name:'Monaco'                },
                    { latLng:[-0.52, 166.93], name:'Nauru'                 },
                    { latLng:[-8.51, 179.21], name:'Tuvalu'                },
                    { latLng:[7.11,171.06],   name:'Marshall Islands'      },
                    { latLng:[17.3,-62.73],   name:'Saint Kitts and Nevis' },
                    { latLng:[3.2,73.22],     name:'Maldives'              },
                    { latLng:[35.88,14.5],    name:'Malta'                 },
                    { latLng:[41.0,-71.06],   name:'New England'           },
                    { latLng:[12.05,-61.75],  name:'Grenada'               },
                    { latLng:[13.16,-59.55],  name:'Barbados'              },
                    { latLng:[17.11,-61.85],  name:'Antigua and Barbuda'   },
                    { latLng:[-4.61,55.45],   name:'Seychelles'            },
                    { latLng:[7.35,134.46],   name:'Palau'                 },
                    { latLng:[42.5,1.51],     name:'Andorra'               }
                ],
                options: {
                    map: 'world_mill_en',
                    backgroundColor: defaultColors.bgColor,
                    zoomMin: 1,
                    zoomMax: 8,
                    zoomOnScroll: false,
                    regionStyle: {
                        initial: {
                            'fill': defaultColors.regionFill,
                            'fill-opacity': 1,
                            'stroke': 'none',
                            'stroke-width': 1.5,
                            'stroke-opacity': 1
                        },
                        hover: {
                            'fill-opacity': 0.8
                        },
                        selected: {
                            fill: 'blue'
                        },
                        selectedHover: {}
                    },
                    focusOn: {
                        x: 0.4,
                        y: 0.6,
                        scale: 1
                    },
                    markerStyle: {
                        initial: {
                            fill: defaultColors.markerColor,
                            stroke: defaultColors.markerColor
                        }
                    },
                    onRegionLabelShow: (e, el, code) => {
                        if (RegionValues[code])
                            el.html(el.html() + ': ' + RegionValues[code] + ' visitors');
                    }
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
            // EasyPieChar
            let pieOptions1 = {
                 animate: {duration: 800, enabled: true},
                 barColor:"#23b7e5",
                 trackColor:"rgba(200,200,200,0.4)",
                 scaleColor:false,
                 lineWidth:10,
                 lineCap:'round',
                 size:145
            };
            new EasyPieChart(this.$refs.easypiechart, pieOptions1);
        },
        methods: {
            changeLanguage (lang) {
                this.$i18n.i18next.changeLanguage(lang);
            }
        }

    }

</script>