<template>
    <ContentWrapper>
        <div class="content-heading">
            <div>Radial charts
                <small>Canvas based &amp; No canvas Pure CSS radial progress bars solutions</small>
            </div>
        </div>
        <h4 class="page-header">Knob</h4>
        <div class="row">
            <div class="col-lg-3 col-md-6">
                <div class="card">
                    <div class="card-header">Default</div>
                    <div class="card-body text-center">
                        <input ref="knobChart1" type="text" value="80" />
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6">
                <div class="card">
                    <div class="card-header">Ready only</div>
                    <div class="card-body text-center">
                        <input ref="knobChart2" type="text" value="45" />
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6">
                <div class="card">
                    <div class="card-header">Offset and arc</div>
                    <div class="card-body text-center">
                        <input ref="knobChart3" type="text" value="30" />
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6">
                <div class="card">
                    <div class="card-header">Display previous</div>
                    <div class="card-body text-center">
                        <input ref="knobChart4" type="text" value="20" />
                    </div>
                </div>
            </div>
        </div>
        <h4 class="page-header">Easypie Charts</h4>
        <div class="row">
            <div class="col-lg-3 col-md-6">
                <div class="card">
                    <div class="card-header">Default</div>
                    <div class="card-body text-center">
                        <div class="easypie-chart" ref="easypie1" data-percent="85">
                            <span>85</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6">
                <div class="card">
                    <div class="card-header">Slim</div>
                    <div class="card-body text-center">
                        <div class="easypie-chart" ref="easypie2" data-percent="45">
                            <span>45</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6">
                <div class="card">
                    <div class="card-header">Track color</div>
                    <div class="card-body text-center">
                        <div class="easypie-chart" ref="easypie3" data-percent="25">
                            <span>25</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6">
                <div class="card">
                    <div class="card-header">Scale color</div>
                    <div class="card-body text-center">
                        <div class="easypie-chart" ref="easypie4" data-percent="60">
                            <span>60</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <h4 class="page-header">Pure CSS
            <small>radial progress bars solutions</small>
        </h4>
        <!-- START row-->
        <div class="row">
            <div class="col-xl-6">
                <!-- START card-->
                <div class="card card-default">
                    <div class="card-header">Radial Size</div>
                    <div class="card-body text-center">
                        <div class="row">
                            <div class="col-lg-3">
                                <div class="radial-bar radial-bar-85 radial-bar-lg" data-label="85%"></div>
                                <p><code>.radial-bar.radial-bar-85.radial-bar-lg</code></p>
                            </div>
                            <div class="col-lg-3">
                                <div class="radial-bar radial-bar-45" data-label="45%"></div>
                            </div>
                            <div class="col-lg-3">
                                <div class="radial-bar radial-bar-60 radial-bar-sm" data-label="60%"></div>
                            </div>
                            <div class="col-lg-3">
                                <div class="radial-bar radial-bar-20 radial-bar-xs" data-label="20%"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- END card-->
                <!-- START card-->
                <div class="card card-default">
                    <div class="card-header">Radial with Images</div>
                    <div class="card-body text-center">
                        <div class="row">
                            <div class="col-lg-3">
                                <div class="radial-bar radial-bar-20 radial-bar radial-bar-danger">
                                    <img src="img/user/03.jpg" alt="Image" />
                                </div>
                            </div>
                            <div class="col-lg-3">
                                <div class="radial-bar radial-bar-35 radial-bar-warning" data-label="35%">
                                    <img src="img/user/01.jpg" alt="Image" />
                                </div>
                            </div>
                            <div class="col-lg-3">
                                <div class="radial-bar radial-bar-50 radial-bar-info" data-label="50%">
                                    <img src="img/user/04.jpg" alt="Image" />
                                </div>
                            </div>
                            <div class="col-lg-3">
                                <div class="radial-bar radial-bar-100 radial-bar-success" data-label="100%">
                                    <img src="img/user/05.jpg" alt="Image" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- END card-->
                <!-- START card-->
                <div class="card card-default">
                    <div class="card-header">Radial with Tooltips</div>
                    <div class="card-body text-center">
                        <div class="row">
                            <div class="col-lg-3">
                                <br/>
                                <div class="radial-bar radial-bar-85" data-label="85%"></div>
                            </div>
                            <div class="col-lg-3">
                                <br/>
                                <div class="radial-bar radial-bar-45" data-label="45%"></div>
                            </div>
                            <div class="col-lg-3">
                                <br/>
                                <div class="radial-bar radial-bar-60" data-label="60%"></div>
                            </div>
                            <div class="col-lg-3">
                                <br/>
                                <div class="radial-bar radial-bar-20" data-label="20%"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- END card-->
            </div>
            <div class="col-xl-6">
                <!-- START card-->
                <div class="card card-default">
                    <div class="card-header">Radial Variants</div>
                    <div class="card-body text-center">
                        <div class="row">
                            <div class="col-lg-3">
                                <div class="radial-bar radial-bar-20 radial-bar-lg radial-bar-danger" data-label="20%"></div>
                                <p><code>.radial-bar.radial-bar-20.radial-bar-lg.radial-bar-danger</code></p>
                            </div>
                            <div class="col-lg-3">
                                <div class="radial-bar radial-bar-35 radial-bar-lg radial-bar-warning" data-label="35%"></div>
                            </div>
                            <div class="col-lg-3">
                                <div class="radial-bar radial-bar-50 radial-bar-lg radial-bar-info" data-label="50%"></div>
                            </div>
                            <div class="col-lg-3">
                                <div class="radial-bar radial-bar-100 radial-bar-lg radial-bar-success" data-label="100%"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- END card-->
                <!-- START card-->
                <div class="card card-default">
                    <div class="card-header">Radial applications</div>
                    <div class="card-body text-center">
                        <div class="radial-bar radial-bar-85 radial-bar-lg" data-label="85%"></div>
                        <p>Visitors</p>
                    </div>
                    <div class="card-footer text-center">
                        <div class="row">
                            <div class="col-lg-4">
                                <div class="radial-bar radial-bar-warning radial-bar-35 radial-bar-sm" data-label="35%"></div>
                                <p>
                                    <small>Conversions</small>
                                </p>
                            </div>
                            <div class="col-lg-4">
                                <div class="radial-bar radial-bar-info radial-bar-45 radial-bar-sm" data-label="45%"></div>
                                <p>
                                    <small>Recurrent</small>
                                </p>
                            </div>
                            <div class="col-lg-4">
                                <div class="radial-bar radial-bar-success radial-bar-20 radial-bar-sm" data-label="20%"></div>
                                <p>
                                    <small>Uniques</small>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- END card-->
            </div>
        </div>
        <!-- END row-->
    </ContentWrapper>
</template>
<script>

    import EasyPieChart from 'easy-pie-chart';
    import * as CONST from '@/components/Common/Constants';
    // Knob charts
    import 'jquery-knob/js/jquery.knob.js';


    export default {
        data() {
            return {
                // Knob charts
                knobLoaderOptions1: {
                    width: '50%', // responsive
                    displayInput: true,
                    fgColor: CONST.APP_COLORS['info']
                },
                knobLoaderOptions2: {
                    width: '50%', // responsive
                    displayInput: true,
                    fgColor: CONST.APP_COLORS['purple'],
                    readOnly: true
                },
                knobLoaderOptions3: {
                    width: '50%', // responsive
                    displayInput: true,
                    fgColor: CONST.APP_COLORS['info'],
                    bgColor: CONST.APP_COLORS['gray'],
                    angleOffset: -125,
                    angleArc: 250
                },
                knobLoaderOptions4: {
                    width: '50%', // responsive
                    displayInput: true,
                    fgColor: CONST.APP_COLORS['pink'],
                    displayPrevious: true,
                    thickness: 0.1,
                    lineCap: 'round'
                },
                // Easy Pie chart
                pieOptions1: {
                    animate: {
                        duration: 800,
                        enabled: true
                    },
                    barColor: CONST.APP_COLORS['success'],
                    trackColor: false,
                    scaleColor: false,
                    lineWidth: 10,
                    lineCap: 'circle'
                },
                pieOptions2: {
                    animate: {
                        duration: 800,
                        enabled: true
                    },
                    barColor: CONST.APP_COLORS['warning'],
                    trackColor: false,
                    scaleColor: false,
                    lineWidth: 4,
                    lineCap: 'circle'
                },
                pieOptions3: {
                    animate: {
                        duration: 800,
                        enabled: true
                    },
                    barColor: CONST.APP_COLORS['danger'],
                    trackColor: false,
                    scaleColor: CONST.APP_COLORS['gray'],
                    lineWidth: 15,
                    lineCap: 'circle'
                },
                pieOptions4: {
                    animate: {
                        duration: 800,
                        enabled: true
                    },
                    barColor: CONST.APP_COLORS['danger'],
                    trackColor: CONST.APP_COLORS['yellow'],
                    scaleColor: CONST.APP_COLORS['gray-dark'],
                    lineWidth: 15,
                    lineCap: 'circle'
                }
            }
        },
        mounted() {
            // Knob
            $(this.$refs.knobChart1).knob(this.knobLoaderOptions1);
            $(this.$refs.knobChart2).knob(this.knobLoaderOptions2);
            $(this.$refs.knobChart3).knob(this.knobLoaderOptions3);
            $(this.$refs.knobChart4).knob(this.knobLoaderOptions4);
            // Easy pie
            new EasyPieChart(this.$refs.easypie1, this.pieOptions1);
            new EasyPieChart(this.$refs.easypie2, this.pieOptions2);
            new EasyPieChart(this.$refs.easypie3, this.pieOptions3);
            new EasyPieChart(this.$refs.easypie4, this.pieOptions4);
        }
    }

</script>
