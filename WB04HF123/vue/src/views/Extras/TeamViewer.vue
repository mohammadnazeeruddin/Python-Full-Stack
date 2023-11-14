<template>
    <ContentWrapper>
        <div class="content-heading">Team viewer
            <div class="ml-auto">
                <em class="fas fa-exclamation-triangle text-warning"></em>
            </div>
        </div>
        <div class="row">
            <div class="col-xl-4 col-lg-6">
                <!-- Team Card-->
                <div class="card card-default">
                    <div class="card-header">
                        <div class="float-right">
                            <div class="badge badge-success">free</div>
                        </div>
                        <div class="card-title">Team #1</div>
                    </div>
                    <div class="card-body bt">
                        <a class="inline" href="#" v-b-tooltip.hover title="Team leader">
                            <img class="rounded-circle thumb48" src="img/user/03.jpg" alt="project member" />
                        </a>
                        <a class="inline" href="#">
                            <img class="rounded-circle thumb24" src="img/user/02.jpg" alt="project member" />
                        </a>
                        <a class="inline" href="#">
                            <img class="rounded-circle thumb24" src="img/user/04.jpg" alt="project member" />
                        </a>
                        <a class="inline" href="#">
                            <img class="rounded-circle thumb24" src="img/user/05.jpg" alt="project member" />
                        </a>
                        <a class="inline" href="#">
                            <img class="rounded-circle thumb24" src="img/user/06.jpg" alt="project member" />
                        </a>
                        <a class="inline" href="#">
                            <img class="rounded-circle thumb24" src="img/user/07.jpg" alt="project member" />
                        </a>
                    </div>
                    <div class="card-body bb text-center">
                        <div v-b-tooltip.hover title="Progress of asigned tasks">
                            <b-progress :value="50" :max="100" variant="info" class="progress-xs m-0"></b-progress>
                        </div>
                    </div>
                    <div class="card-body bb">
                        <div class="row text-center">
                            <div class="col-4">
                                <p class="text-bold">BUDGET</p>
                                <Sparkline :values="[60,40]"
                                    :options="{
                                        type:'pie',
                                        height:'24',
                                        sliceColors:['#edf1f2', '#ff902b']
                                    }"
                                    class="sparkline inline mr-2"/>
                            </div>
                            <div class="col-4">
                                <p class="text-bold">TASKS</p>
                                <div class="h3 m-0">26</div>
                            </div>
                            <div class="col-4">
                                <p class="text-bold">AVAILABITY</p>
                                <Sparkline :values="[70,30]"
                                    :options="{
                                        type:'pie',
                                        height:'24',
                                        sliceColors:['#edf1f2', '#ff902b']
                                    }"
                                    class="sparkline inline mr-2"/>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <ul class="list-inline m-0">
                            <li class="list-inline-item">
                                <div class="badge bg-gray">angularjs</div>
                            </li>
                            <li class="list-inline-item">
                                <div class="badge bg-gray">jquery</div>
                            </li>
                            <li class="list-inline-item">
                                <div class="badge bg-gray">gulp</div>
                            </li>
                            <li class="list-inline-item">
                                <div class="badge bg-gray">git</div>
                            </li>
                            <li class="list-inline-item">
                                <div class="badge p-1 bg-gray">ios</div>
                            </li>
                        </ul>
                    </div>
                    <div class="card-footer text-center">
                        <a class="btn btn-secondary btn-oval" href="#">Manage Team</a>
                    </div>
                </div>
                <!-- end Team Card-->
            </div>
            <div class="col-xl-4 col-lg-6">
                <!-- Team Card-->
                <div class="card card-default">
                    <div class="card-header">
                        <div class="float-right">
                            <div class="badge bg-gray">asigned</div>
                        </div>
                        <div class="card-title">Team #2</div>
                    </div>
                    <div class="card-body bt">
                        <a class="inline" href="#" v-b-tooltip.hover title="Team leader">
                            <img class="rounded-circle thumb48" src="img/user/03.jpg" alt="project member" />
                        </a>
                        <a class="inline" href="#">
                            <img class="rounded-circle thumb24" src="img/user/02.jpg" alt="project member" />
                        </a>
                        <a class="inline" href="#">
                            <img class="rounded-circle thumb24" src="img/user/04.jpg" alt="project member" />
                        </a>
                        <a class="inline" href="#">
                            <img class="rounded-circle thumb24" src="img/user/05.jpg" alt="project member" />
                        </a>
                        <a class="inline" href="#">
                            <img class="rounded-circle thumb24" src="img/user/09.jpg" alt="project member" />
                        </a>
                    </div>
                    <div class="card-body bb text-center">
                        <div v-b-tooltip.hover title="Progress of asigned tasks">
                            <b-progress :value="90" :max="100" variant="info" class="progress-xs m-0"></b-progress>
                        </div>
                    </div>
                    <div class="card-body bb">
                        <div class="row text-center">
                            <div class="col-4">
                                <p class="text-bold">BUDGET</p>
                                <Sparkline :values="[10,90]"
                                    :options="{
                                        type:'pie',
                                        height:'24',
                                        sliceColors:['#edf1f2', '#f05050']
                                    }"
                                    class="sparkline inline mr-2"/>
                            </div>
                            <div class="col-4">
                                <p class="text-bold">TASKS</p>
                                <div class="h3 m-0">145</div>
                            </div>
                            <div class="col-4">
                                <p class="text-bold">AVAILABITY</p>
                                <Sparkline :values="[40,60]"
                                    :options="{
                                        type:'pie',
                                        height:'24',
                                        sliceColors:['#edf1f2', '#27c24c']
                                    }"
                                    class="sparkline inline mr-2"/>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <ul class="list-inline m-0">
                            <li class="list-inline-item">
                                <div class="badge bg-gray">angularjs</div>
                            </li>
                            <li class="list-inline-item">
                                <div class="badge bg-gray">jquery</div>
                            </li>
                            <li class="list-inline-item">
                                <div class="badge bg-gray">gulp</div>
                            </li>
                            <li class="list-inline-item">
                                <div class="badge bg-gray">git</div>
                            </li>
                            <li class="list-inline-item">
                                <div class="badge p-1 bg-gray">ios</div>
                            </li>
                        </ul>
                    </div>
                    <div class="card-footer text-center">
                        <a class="btn btn-secondary btn-oval" href="#">Manage Team</a>
                    </div>
                </div>
                <!-- end Team Card-->
            </div>
            <div class="col-xl-4 col-lg-6">
                <!-- Team Card-->
                <div class="card card-default">
                    <div class="card-header">
                        <div class="float-right">
                            <div class="badge badge-success">free</div>
                        </div>
                        <div class="card-title">Team #3</div>
                    </div>
                    <div class="card-body bt">
                        <a class="inline" href="#" v-b-tooltip.hover title="Team leader">
                            <img class="rounded-circle thumb48" src="img/user/03.jpg" alt="project member" />
                        </a>
                        <a class="inline" href="#">
                            <img class="rounded-circle thumb24" src="img/user/02.jpg" alt="project member" />
                        </a>
                        <a class="inline" href="#">
                            <img class="rounded-circle thumb24" src="img/user/04.jpg" alt="project member" />
                        </a>
                        <a class="inline" href="#">
                            <img class="rounded-circle thumb24" src="img/user/05.jpg" alt="project member" />
                        </a>
                        <a class="inline" href="#">
                            <img class="rounded-circle thumb24" src="img/user/06.jpg" alt="project member" />
                        </a>
                        <a class="inline" href="#">
                            <img class="rounded-circle thumb24" src="img/user/07.jpg" alt="project member" />
                        </a>
                    </div>
                    <div class="card-body bb text-center">
                        <div v-b-tooltip.hover title="Progress of asigned tasks">
                            <b-progress :value="50" :max="100" variant="info" class="progress-xs m-0"></b-progress>
                        </div>
                    </div>
                    <div class="card-body bb">
                        <div class="row text-center">
                            <div class="col-4">
                                <p class="text-bold">BUDGET</p>
                                <Sparkline :values="[60,40]"
                                    :options="{
                                        type:'pie',
                                        height:'24',
                                        sliceColors:['#edf1f2', '#ff902b']
                                    }"
                                    class="sparkline inline mr-2"/>
                            </div>
                            <div class="col-4">
                                <p class="text-bold">TASKS</p>
                                <div class="h3 m-0">98</div>
                            </div>
                            <div class="col-4">
                                <p class="text-bold">AVAILABITY</p>
                                <Sparkline :values="[40,60]"
                                    :options="{
                                        type:'pie',
                                        height:'24',
                                        sliceColors:['#edf1f2', '#27c24c']
                                    }"
                                    class="sparkline inline mr-2"/>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <ul class="list-inline m-0">
                            <li class="list-inline-item">
                                <div class="badge bg-gray">angularjs</div>
                            </li>
                            <li class="list-inline-item">
                                <div class="badge bg-gray">jquery</div>
                            </li>
                            <li class="list-inline-item">
                                <div class="badge bg-gray">gulp</div>
                            </li>
                            <li class="list-inline-item">
                                <div class="badge bg-gray">git</div>
                            </li>
                            <li class="list-inline-item">
                                <div class="badge p-1 bg-gray">ios</div>
                            </li>
                        </ul>
                    </div>
                    <div class="card-footer text-center">
                        <a class="btn btn-secondary btn-oval" href="#">Manage Team</a>
                    </div>
                </div>
                <!-- end Team Card-->
            </div>
            <div class="col-xl-4 col-lg-6">
                <!-- Team Card-->
                <div class="card card-default">
                    <div class="card-header">
                        <div class="float-right">
                            <div class="badge bg-gray">asigned</div>
                        </div>
                        <div class="card-title">Team #4</div>
                    </div>
                    <div class="card-body bt">
                        <a class="inline" href="#" v-b-tooltip.hover title="Team leader">
                            <img class="rounded-circle thumb48" src="img/user/03.jpg" alt="project member" />
                        </a>
                        <a class="inline" href="#">
                            <img class="rounded-circle thumb24" src="img/user/02.jpg" alt="project member" />
                        </a>
                        <a class="inline" href="#">
                            <img class="rounded-circle thumb24" src="img/user/04.jpg" alt="project member" />
                        </a>
                        <a class="inline" href="#">
                            <img class="rounded-circle thumb24" src="img/user/05.jpg" alt="project member" />
                        </a>
                        <a class="inline" href="#">
                            <img class="rounded-circle thumb24" src="img/user/06.jpg" alt="project member" />
                        </a>
                        <a class="inline" href="#">
                            <img class="rounded-circle thumb24" src="img/user/07.jpg" alt="project member" />
                        </a>
                        <a class="inline" href="#">
                            <img class="rounded-circle thumb24" src="img/user/08.jpg" alt="project member" />
                        </a>
                        <a class="inline" href="#">
                            <img class="rounded-circle thumb24" src="img/user/09.jpg" alt="project member" />
                        </a>
                    </div>
                    <div class="card-body bb text-center">
                        <div v-b-tooltip.hover title="Progress of asigned tasks">
                            <b-progress :value="25" :max="100" variant="info" class="progress-xs m-0"></b-progress>
                        </div>
                    </div>
                    <div class="card-body bb">
                        <div class="row text-center">
                            <div class="col-4">
                                <p class="text-bold">BUDGET</p>
                                <Sparkline :values="[60,40]"
                                    :options="{
                                        type:'pie',
                                        height:'24',
                                        sliceColors:['#edf1f2', '#ff902b']
                                    }"
                                    class="sparkline inline mr-2"/>
                            </div>
                            <div class="col-4">
                                <p class="text-bold">TASKS</p>
                                <div class="h3 m-0">145</div>
                            </div>
                            <div class="col-4">
                                <p class="text-bold">AVAILABITY</p>
                                <Sparkline :values="[40,60]"
                                    :options="{
                                        type:'pie',
                                        height:'24',
                                        sliceColors:['#edf1f2', '#27c24c']
                                    }"
                                    class="sparkline inline mr-2"/>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <ul class="list-inline m-0">
                            <li class="list-inline-item">
                                <div class="badge bg-gray">angularjs</div>
                            </li>
                            <li class="list-inline-item">
                                <div class="badge bg-gray">jquery</div>
                            </li>
                            <li class="list-inline-item">
                                <div class="badge bg-gray">gulp</div>
                            </li>
                            <li class="list-inline-item">
                                <div class="badge bg-gray">git</div>
                            </li>
                            <li class="list-inline-item">
                                <div class="badge p-1 bg-gray">ios</div>
                            </li>
                        </ul>
                    </div>
                    <div class="card-footer text-center">
                        <a class="btn btn-secondary btn-oval" href="#">Manage Team</a>
                    </div>
                </div>
                <!-- end Team Card-->
            </div>
            <div class="col-xl-4 col-lg-6">
                <!-- Team Card-->
                <div class="card card-default">
                    <div class="card-header">
                        <div class="float-right">
                            <div class="badge bg-gray">asigned</div>
                        </div>
                        <div class="card-title">Team #5</div>
                    </div>
                    <div class="card-body bt">
                        <a class="inline" href="#" v-b-tooltip.hover title="Team leader">
                            <img class="rounded-circle thumb48" src="img/user/03.jpg" alt="project member" />
                        </a>
                        <a class="inline" href="#">
                            <img class="rounded-circle thumb24" src="img/user/02.jpg" alt="project member" />
                        </a>
                        <a class="inline" href="#">
                            <img class="rounded-circle thumb24" src="img/user/04.jpg" alt="project member" />
                        </a>
                        <a class="inline" href="#">
                            <img class="rounded-circle thumb24" src="img/user/05.jpg" alt="project member" />
                        </a>
                        <a class="inline" href="#">
                            <img class="rounded-circle thumb24" src="img/user/06.jpg" alt="project member" />
                        </a>
                        <a class="inline" href="#">
                            <img class="rounded-circle thumb24" src="img/user/07.jpg" alt="project member" />
                        </a>
                        <a class="inline" href="#">
                            <img class="rounded-circle thumb24" src="img/user/08.jpg" alt="project member" />
                        </a>
                        <a class="inline" href="#">
                            <img class="rounded-circle thumb24" src="img/user/09.jpg" alt="project member" />
                        </a>
                    </div>
                    <div class="card-body bb text-center">
                        <div v-b-tooltip.hover title="Progress of asigned tasks">
                            <b-progress :value="50" :max="100" variant="info" class="progress-xs m-0"></b-progress>
                        </div>
                    </div>
                    <div class="card-body bb">
                        <div class="row text-center">
                            <div class="col-4">
                                <p class="text-bold">BUDGET</p>
                                <Sparkline :values="[60,40]"
                                    :options="{
                                        type:'pie',
                                        height:'24',
                                        sliceColors:['#edf1f2', '#ff902b']
                                    }"
                                    class="sparkline inline mr-2"/>
                            </div>
                            <div class="col-4">
                                <p class="text-bold">TASKS</p>
                                <div class="h3 m-0">500</div>
                            </div>
                            <div class="col-4">
                                <p class="text-bold">AVAILABITY</p>
                                <Sparkline :values="[40,60]"
                                    :options="{
                                        type:'pie',
                                        height:'24',
                                        sliceColors:['#edf1f2', '#27c24c']
                                    }"
                                    class="sparkline inline mr-2"/>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <ul class="list-inline m-0">
                            <li class="list-inline-item">
                                <div class="badge bg-gray">angularjs</div>
                            </li>
                            <li class="list-inline-item">
                                <div class="badge bg-gray">jquery</div>
                            </li>
                            <li class="list-inline-item">
                                <div class="badge bg-gray">gulp</div>
                            </li>
                            <li class="list-inline-item">
                                <div class="badge bg-gray">git</div>
                            </li>
                            <li class="list-inline-item">
                                <div class="badge p-1 bg-gray">ios</div>
                            </li>
                        </ul>
                    </div>
                    <div class="card-footer text-center">
                        <a class="btn btn-secondary btn-oval" href="#">Manage Team</a>
                    </div>
                </div>
                <!-- end Team Card-->
            </div>
            <div class="col-xl-4 col-lg-6">
                <!-- Team Card-->
                <div class="card card-default">
                    <div class="card-header">
                        <div class="float-right">
                            <div class="badge badge-success">free</div>
                        </div>
                        <div class="card-title">Team #6</div>
                    </div>
                    <div class="card-body bt">
                        <a class="inline" href="#" v-b-tooltip.hover title="Team leader">
                            <img class="rounded-circle thumb48" src="img/user/03.jpg" alt="project member" />
                        </a>
                        <a class="inline" href="#">
                            <img class="rounded-circle thumb24" src="img/user/02.jpg" alt="project member" />
                        </a>
                        <a class="inline" href="#">
                            <img class="rounded-circle thumb24" src="img/user/04.jpg" alt="project member" />
                        </a>
                        <a class="inline" href="#">
                            <img class="rounded-circle thumb24" src="img/user/05.jpg" alt="project member" />
                        </a>
                        <a class="inline" href="#">
                            <img class="rounded-circle thumb24" src="img/user/06.jpg" alt="project member" />
                        </a>
                        <a class="inline" href="#">
                            <img class="rounded-circle thumb24" src="img/user/07.jpg" alt="project member" />
                        </a>
                        <a class="inline" href="#">
                            <img class="rounded-circle thumb24" src="img/user/08.jpg" alt="project member" />
                        </a>
                        <a class="inline" href="#">
                            <img class="rounded-circle thumb24" src="img/user/09.jpg" alt="project member" />
                        </a>
                    </div>
                    <div class="card-body bb text-center">
                        <div v-b-tooltip.hover title="Progress of asigned tasks">
                            <b-progress :value="50" :max="100" variant="info" class="progress-xs m-0"></b-progress>
                        </div>
                    </div>
                    <div class="card-body bb">
                        <div class="row text-center">
                            <div class="col-4">
                                <p class="text-bold">BUDGET</p>
                                <Sparkline :values="[5,95]"
                                    :options="{
                                        type:'pie',
                                        height:'24',
                                        sliceColors:['#edf1f2', '#f05050']
                                    }"
                                    class="sparkline inline mr-2"/>
                            </div>
                            <div class="col-4">
                                <p class="text-bold">TASKS</p>
                                <div class="h3 m-0">145</div>
                            </div>
                            <div class="col-4">
                                <p class="text-bold">AVAILABITY</p>
                                <Sparkline :values="[70,30]"
                                    :options="{
                                        type:'pie',
                                        height:'24',
                                        sliceColors:['#edf1f2', '#ff902b']
                                    }"
                                    class="sparkline inline mr-2"/>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <ul class="list-inline m-0">
                            <li class="list-inline-item">
                                <div class="badge bg-gray">angularjs</div>
                            </li>
                            <li class="list-inline-item">
                                <div class="badge bg-gray">jquery</div>
                            </li>
                            <li class="list-inline-item">
                                <div class="badge bg-gray">gulp</div>
                            </li>
                            <li class="list-inline-item">
                                <div class="badge bg-gray">git</div>
                            </li>
                            <li class="list-inline-item">
                                <div class="badge p-1 bg-gray">ios</div>
                            </li>
                        </ul>
                    </div>
                    <div class="card-footer text-center">
                        <a class="btn btn-secondary btn-oval" href="#">Manage Team</a>
                    </div>
                </div>
                <!-- end Team Card-->
            </div>
        </div>
    </ContentWrapper>
</template>
<script>
    import Sparkline from '@/components/Common/Sparklines';
    export default {
        components: {
            Sparkline
        }
    }
</script>
