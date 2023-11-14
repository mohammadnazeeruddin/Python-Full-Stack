<template>
    <ContentWrapper>
        <div class="content-heading">Bug tracker</div>
        <div class="row">
            <div class="col-lg-4">
                <!-- Aside card-->
                <div class="card b">
                    <div class="card-body bb">
                        <p>Overvall progress</p>
                        <div class="d-flex align-items-center mb-2">
                            <div class="w-100">
                                <b-progress :value="48" :max="100" variant="info" class="progress-xs m-0"></b-progress>
                            </div>
                            <div class="ml-auto">
                                <div class="col wd-xxs text-right">
                                    <div class="text-bold text-muted">48%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <p>Metrics</p>
                        <div class="row text-center">
                            <div class="col-3 col-lg-6 col-xl-3">
                                <Sparkline :values="[20,80]"
                                    :options="{
                                        type:'pie',
                                        height:'50',
                                        sliceColors:['#edf1f2', '#23b7e5']
                                    }"
                                    class="sparkline"/>
                                <p class="mt-3">Issues</p>
                            </div>
                            <div class="col-3 col-lg-6 col-xl-3">
                                <Sparkline :values="[60,40]"
                                    :options="{
                                        type:'pie',
                                        height:'50',
                                        sliceColors:['#edf1f2', '#27c24c']
                                    }"
                                    class="sparkline"/>
                                <p class="mt-3">Bugs</p>
                            </div>
                            <div class="col-3 col-lg-6 col-xl-3">
                                <Sparkline :values="[20,80]"
                                    :options="{
                                        type:'pie',
                                        height:'50',
                                        sliceColors:['#edf1f2', '#ff902b']
                                    }"
                                    class="sparkline"/>
                                <p class="mt-3">Hours</p>
                            </div>
                            <div class="col-3 col-lg-6 col-xl-3">
                                <Sparkline :values="[30,70]"
                                    :options="{
                                        type:'pie',
                                        height:'50',
                                        sliceColors:['#edf1f2', '#f05050']
                                    }"
                                    class="sparkline"/>
                                <p class="mt-3">Assigned</p>
                            </div>
                        </div>
                    </div>
                    <table class="table bb">
                        <tbody>
                            <tr>
                                <td>
                                    <strong>Assigned Hours</strong>
                                </td>
                                <td>68 hs</td>
                            </tr>
                            <tr>
                                <td>
                                    <strong>Time Consumed</strong>
                                </td>
                                <td>32 hs</td>
                            </tr>
                            <tr>
                                <td>
                                    <strong>Issues</strong>
                                </td>
                                <td>19</td>
                            </tr>
                            <tr>
                                <td>
                                    <strong>Bugs</strong>
                                </td>
                                <td>16</td>
                            </tr>
                            <tr>
                                <td>
                                    <strong>Health</strong>
                                </td>
                                <td>
                                    <em class="far fa-smile fa-lg text-warning"></em>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <strong>Commits</strong>
                                </td>
                                <td>140</td>
                            </tr>
                            <tr>
                                <td>
                                    <strong>Recently closed</strong>
                                </td>
                                <td>
                                    <Scrollable :height="120">
                                        <div class="list-group" >
                                            <table class="table table-bordered bg-transparent">
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <a class="text-muted" href="">BI:54678</a>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <a class="text-muted" href="">BI:55778</a>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <a class="text-muted" href="">BI:56878</a>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <a class="text-muted" href="">BI:57978</a>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <a class="text-muted" href="">BI:1107</a>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </Scrollable>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <strong>Last closed on</strong>
                                </td>
                                <td>12/01/2016</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- end Aside card-->
            </div>
            <div class="col-lg-8">
                <div class="mb-3 d-flex">
                    <div>
                        <button class="btn btn-sm btn-info" type="button">New ticket</button>
                        <button class="btn btn-sm btn-secondary" type="button">
                            <em class="fa fa-user-plus"></em>
                        </button>
                        <button class="btn btn-sm btn-secondary" type="button">
                            <em class="fas fa-pencil-alt"></em>
                        </button>
                        <button class="btn btn-sm btn-secondary" type="button">
                            <em class="fas fa-share"></em>
                        </button>
                        <button class="btn btn-sm btn-secondary" type="button">
                            <em class="fa fa-print"></em>
                        </button>
                    </div>
                    <div class="ml-auto">
                        <p class="mb-0 mt-1">19 bugs / 16 issues</p>
                    </div>
                </div>
                <div class="card b">
                    <div class="card-body">
                        <Datatable :options="dtOptions1" class="table w-100" id="datatable1">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>#ID</th>
                                    <th>Description</th>
                                    <th>Created</th>
                                    <th>Priority</th>
                                    <th>Asigned</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div class="badge bg-gray-lighter">bug</div>
                                    </td>
                                    <td>BI:54678</td>
                                    <td class="text-nowrap">
                                        <small>Maecenas mollis egestas convallis.</small>
                                    </td>
                                    <td>01/01/2016</td>
                                    <td>
                                        <div class="circle circle-lg bg-warning"></div>
                                    </td>
                                    <td>
                                        <a href="">Sylvia Daniels</a>
                                    </td>
                                    <td>
                                        <div class="inline wd-xxs badge badge-success">open</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="badge bg-gray-lighter">bug</div>
                                    </td>
                                    <td>BI:55778</td>
                                    <td class="text-nowrap">
                                        <small>Aliquam felis nibh, ultrices non elementum</small>
                                    </td>
                                    <td>01/05/2016</td>
                                    <td>
                                        <div class="circle circle-lg"></div>
                                    </td>
                                    <td>
                                        <a href="">Sherry Carroll</a>
                                    </td>
                                    <td>
                                        <div class="inline wd-xxs badge badge-success">open</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="badge bg-gray-lighter">issue</div>
                                    </td>
                                    <td>BI:56878</td>
                                    <td class="text-nowrap">
                                        <small>Aliquam condimentum enim a risus cursus blandit.</small>
                                    </td>
                                    <td>05/01/2016</td>
                                    <td>
                                        <div class="circle circle-lg bg-warning"></div>
                                    </td>
                                    <td>
                                        <a href="">Mitchell Jones</a>
                                    </td>
                                    <td>
                                        <div class="inline wd-xxs badge badge-warning">pending</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="badge bg-gray-lighter">issue</div>
                                    </td>
                                    <td>BI:57978</td>
                                    <td class="text-nowrap">
                                        <small>Sed at libero augue, in euismod tellus.</small>
                                    </td>
                                    <td>01/11/2016</td>
                                    <td>
                                        <div class="circle circle-lg bg-warning"></div>
                                    </td>
                                    <td>
                                        <a href="">Tracey Parker</a>
                                    </td>
                                    <td>
                                        <div class="inline wd-xxs badge badge-warning">pending</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="badge bg-gray-lighter">bug</div>
                                    </td>
                                    <td>BI:1107</td>
                                    <td class="text-nowrap">
                                        <small>Praesent lacinia ultricies neque.</small>
                                    </td>
                                    <td>01/01/2015</td>
                                    <td>
                                        <div class="circle circle-lg bg-danger"></div>
                                    </td>
                                    <td>
                                        <a href="">Warren Gray</a>
                                    </td>
                                    <td>
                                        <div class="inline wd-xxs badge badge-danger">closed</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="badge bg-gray-lighter">issue</div>
                                    </td>
                                    <td>BI:1117</td>
                                    <td class="text-nowrap">
                                        <small>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</small>
                                    </td>
                                    <td>11/05/2013</td>
                                    <td>
                                        <div class="circle circle-lg bg-warning"></div>
                                    </td>
                                    <td>
                                        <a href="">Jackson Ramos</a>
                                    </td>
                                    <td>
                                        <div class="inline wd-xxs badge badge-success">open</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="badge bg-gray-lighter">bug</div>
                                    </td>
                                    <td>BI:10127</td>
                                    <td class="text-nowrap">
                                        <small>Pellentesque habitant morbi tristique</small>
                                    </td>
                                    <td>05/02/2014</td>
                                    <td>
                                        <div class="circle circle-lg bg-warning"></div>
                                    </td>
                                    <td>
                                        <a href="">Ernest Berry</a>
                                    </td>
                                    <td>
                                        <div class="inline wd-xxs badge badge-danger">closed</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="badge bg-gray-lighter">bug</div>
                                    </td>
                                    <td>BI:54678</td>
                                    <td class="text-nowrap">
                                        <small>Integer venenatis ultrices vulputate.</small>
                                    </td>
                                    <td>01/01/2016</td>
                                    <td>
                                        <div class="circle circle-lg bg-warning"></div>
                                    </td>
                                    <td>
                                        <a href="">Sylvia Daniels</a>
                                    </td>
                                    <td>
                                        <div class="inline wd-xxs badge badge-success">open</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="badge bg-gray-lighter">issue</div>
                                    </td>
                                    <td>BI:55778</td>
                                    <td class="text-nowrap">
                                        <small>Maecenas mollis egestas convallis.</small>
                                    </td>
                                    <td>01/05/2016</td>
                                    <td>
                                        <div class="circle circle-lg"></div>
                                    </td>
                                    <td>
                                        <a href="">Sherry Carroll</a>
                                    </td>
                                    <td>
                                        <div class="inline wd-xxs badge badge-success">open</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="badge bg-gray-lighter">bug</div>
                                    </td>
                                    <td>BI:56878</td>
                                    <td class="text-nowrap">
                                        <small>Maecenas mollis egestas convallis.</small>
                                    </td>
                                    <td>05/01/2016</td>
                                    <td>
                                        <div class="circle circle-lg bg-warning"></div>
                                    </td>
                                    <td>
                                        <a href="">Mitchell Jones</a>
                                    </td>
                                    <td>
                                        <div class="inline wd-xxs badge badge-warning">pending</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="badge bg-gray-lighter">issue</div>
                                    </td>
                                    <td>BI:57978</td>
                                    <td class="text-nowrap">
                                        <small>Maecenas mollis egestas convallis.</small>
                                    </td>
                                    <td>01/11/2016</td>
                                    <td>
                                        <div class="circle circle-lg bg-warning"></div>
                                    </td>
                                    <td>
                                        <a href="">Tracey Parker</a>
                                    </td>
                                    <td>
                                        <div class="inline wd-xxs badge badge-warning">pending</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="badge bg-gray-lighter">bug</div>
                                    </td>
                                    <td>BI:1107</td>
                                    <td class="text-nowrap">
                                        <small>Maecenas mollis egestas convallis.</small>
                                    </td>
                                    <td>01/01/2015</td>
                                    <td>
                                        <div class="circle circle-lg bg-danger"></div>
                                    </td>
                                    <td>
                                        <a href="">Warren Gray</a>
                                    </td>
                                    <td>
                                        <div class="inline wd-xxs badge badge-danger">closed</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="badge bg-gray-lighter">issue</div>
                                    </td>
                                    <td>BI:1117</td>
                                    <td class="text-nowrap">
                                        <small>Maecenas mollis egestas convallis.</small>
                                    </td>
                                    <td>11/05/2013</td>
                                    <td>
                                        <div class="circle circle-lg bg-warning"></div>
                                    </td>
                                    <td>
                                        <a href="">Jackson Ramos</a>
                                    </td>
                                    <td>
                                        <div class="inline wd-xxs badge badge-success">open</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="badge bg-gray-lighter">issue</div>
                                    </td>
                                    <td>BI:10127</td>
                                    <td class="text-nowrap">
                                        <small>Maecenas mollis egestas convallis.</small>
                                    </td>
                                    <td>05/02/2014</td>
                                    <td>
                                        <div class="circle circle-lg bg-warning"></div>
                                    </td>
                                    <td>
                                        <a href="">Ernest Berry</a>
                                    </td>
                                    <td>
                                        <div class="inline wd-xxs badge badge-danger">closed</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="badge bg-gray-lighter">bug</div>
                                    </td>
                                    <td>BI:54678</td>
                                    <td class="text-nowrap">
                                        <small>Maecenas mollis egestas convallis.</small>
                                    </td>
                                    <td>01/01/2016</td>
                                    <td>
                                        <div class="circle circle-lg bg-warning"></div>
                                    </td>
                                    <td>
                                        <a href="">Sylvia Daniels</a>
                                    </td>
                                    <td>
                                        <div class="inline wd-xxs badge badge-success">open</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="badge bg-gray-lighter">bug</div>
                                    </td>
                                    <td>BI:55778</td>
                                    <td class="text-nowrap">
                                        <small>Maecenas mollis egestas convallis.</small>
                                    </td>
                                    <td>01/05/2016</td>
                                    <td>
                                        <div class="circle circle-lg"></div>
                                    </td>
                                    <td>
                                        <a href="">Sherry Carroll</a>
                                    </td>
                                    <td>
                                        <div class="inline wd-xxs badge badge-success">open</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="badge bg-gray-lighter">bug</div>
                                    </td>
                                    <td>BI:56878</td>
                                    <td class="text-nowrap">
                                        <small>Maecenas mollis egestas convallis.</small>
                                    </td>
                                    <td>05/01/2016</td>
                                    <td>
                                        <div class="circle circle-lg bg-warning"></div>
                                    </td>
                                    <td>
                                        <a href="">Mitchell Jones</a>
                                    </td>
                                    <td>
                                        <div class="inline wd-xxs badge badge-warning">pending</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="badge bg-gray-lighter">bug</div>
                                    </td>
                                    <td>BI:57978</td>
                                    <td class="text-nowrap">
                                        <small>Maecenas mollis egestas convallis.</small>
                                    </td>
                                    <td>01/11/2016</td>
                                    <td>
                                        <div class="circle circle-lg bg-warning"></div>
                                    </td>
                                    <td>
                                        <a href="">Tracey Parker</a>
                                    </td>
                                    <td>
                                        <div class="inline wd-xxs badge badge-warning">pending</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="badge bg-gray-lighter">bug</div>
                                    </td>
                                    <td>BI:1107</td>
                                    <td class="text-nowrap">
                                        <small>Maecenas mollis egestas convallis.</small>
                                    </td>
                                    <td>01/01/2015</td>
                                    <td>
                                        <div class="circle circle-lg bg-danger"></div>
                                    </td>
                                    <td>
                                        <a href="">Warren Gray</a>
                                    </td>
                                    <td>
                                        <div class="inline wd-xxs badge badge-danger">closed</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="badge bg-gray-lighter">bug</div>
                                    </td>
                                    <td>BI:1117</td>
                                    <td class="text-nowrap">
                                        <small>Maecenas mollis egestas convallis.</small>
                                    </td>
                                    <td>11/05/2013</td>
                                    <td>
                                        <div class="circle circle-lg bg-warning"></div>
                                    </td>
                                    <td>
                                        <a href="">Jackson Ramos</a>
                                    </td>
                                    <td>
                                        <div class="inline wd-xxs badge badge-success">open</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="badge bg-gray-lighter">issue</div>
                                    </td>
                                    <td>BI:10127</td>
                                    <td class="text-nowrap">
                                        <small>Maecenas mollis egestas convallis.</small>
                                    </td>
                                    <td>05/02/2014</td>
                                    <td>
                                        <div class="circle circle-lg bg-warning"></div>
                                    </td>
                                    <td>
                                        <a href="">Ernest Berry</a>
                                    </td>
                                    <td>
                                        <div class="inline wd-xxs badge badge-danger">closed</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="badge bg-gray-lighter">issue</div>
                                    </td>
                                    <td>BI:54678</td>
                                    <td class="text-nowrap">
                                        <small>Maecenas mollis egestas convallis.</small>
                                    </td>
                                    <td>01/01/2016</td>
                                    <td>
                                        <div class="circle circle-lg bg-warning"></div>
                                    </td>
                                    <td>
                                        <a href="">Sylvia Daniels</a>
                                    </td>
                                    <td>
                                        <div class="inline wd-xxs badge badge-success">open</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="badge bg-gray-lighter">issue</div>
                                    </td>
                                    <td>BI:55778</td>
                                    <td class="text-nowrap">
                                        <small>Maecenas mollis egestas convallis.</small>
                                    </td>
                                    <td>01/05/2016</td>
                                    <td>
                                        <div class="circle circle-lg"></div>
                                    </td>
                                    <td>
                                        <a href="">Sherry Carroll</a>
                                    </td>
                                    <td>
                                        <div class="inline wd-xxs badge badge-success">open</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="badge bg-gray-lighter">bug</div>
                                    </td>
                                    <td>BI:56878</td>
                                    <td class="text-nowrap">
                                        <small>Maecenas mollis egestas convallis.</small>
                                    </td>
                                    <td>05/01/2016</td>
                                    <td>
                                        <div class="circle circle-lg bg-warning"></div>
                                    </td>
                                    <td>
                                        <a href="">Mitchell Jones</a>
                                    </td>
                                    <td>
                                        <div class="inline wd-xxs badge badge-warning">pending</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="badge bg-gray-lighter">bug</div>
                                    </td>
                                    <td>BI:57978</td>
                                    <td class="text-nowrap">
                                        <small>Maecenas mollis egestas convallis.</small>
                                    </td>
                                    <td>01/11/2016</td>
                                    <td>
                                        <div class="circle circle-lg bg-warning"></div>
                                    </td>
                                    <td>
                                        <a href="">Tracey Parker</a>
                                    </td>
                                    <td>
                                        <div class="inline wd-xxs badge badge-warning">pending</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="badge bg-gray-lighter">bug</div>
                                    </td>
                                    <td>BI:1107</td>
                                    <td class="text-nowrap">
                                        <small>Maecenas mollis egestas convallis.</small>
                                    </td>
                                    <td>01/01/2015</td>
                                    <td>
                                        <div class="circle circle-lg bg-danger"></div>
                                    </td>
                                    <td>
                                        <a href="">Warren Gray</a>
                                    </td>
                                    <td>
                                        <div class="inline wd-xxs badge badge-danger">closed</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="badge bg-gray-lighter">issue</div>
                                    </td>
                                    <td>BI:1117</td>
                                    <td class="text-nowrap">
                                        <small>Maecenas mollis egestas convallis.</small>
                                    </td>
                                    <td>11/05/2013</td>
                                    <td>
                                        <div class="circle circle-lg bg-warning"></div>
                                    </td>
                                    <td>
                                        <a href="">Jackson Ramos</a>
                                    </td>
                                    <td>
                                        <div class="inline wd-xxs badge badge-success">open</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="badge bg-gray-lighter">issue</div>
                                    </td>
                                    <td>BI:10127</td>
                                    <td class="text-nowrap">
                                        <small>Maecenas mollis egestas convallis.</small>
                                    </td>
                                    <td>05/02/2014</td>
                                    <td>
                                        <div class="circle circle-lg bg-warning"></div>
                                    </td>
                                    <td>
                                        <a href="">Ernest Berry</a>
                                    </td>
                                    <td>
                                        <div class="inline wd-xxs badge badge-danger">closed</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="badge bg-gray-lighter">bug</div>
                                    </td>
                                    <td>BI:54678</td>
                                    <td class="text-nowrap">
                                        <small>Maecenas mollis egestas convallis.</small>
                                    </td>
                                    <td>01/01/2016</td>
                                    <td>
                                        <div class="circle circle-lg bg-warning"></div>
                                    </td>
                                    <td>
                                        <a href="">Sylvia Daniels</a>
                                    </td>
                                    <td>
                                        <div class="inline wd-xxs badge badge-success">open</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="badge bg-gray-lighter">issue</div>
                                    </td>
                                    <td>BI:55778</td>
                                    <td class="text-nowrap">
                                        <small>Maecenas mollis egestas convallis.</small>
                                    </td>
                                    <td>01/05/2016</td>
                                    <td>
                                        <div class="circle circle-lg"></div>
                                    </td>
                                    <td>
                                        <a href="">Sherry Carroll</a>
                                    </td>
                                    <td>
                                        <div class="inline wd-xxs badge badge-success">open</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="badge bg-gray-lighter">issue</div>
                                    </td>
                                    <td>BI:56878</td>
                                    <td class="text-nowrap">
                                        <small>Maecenas mollis egestas convallis.</small>
                                    </td>
                                    <td>05/01/2016</td>
                                    <td>
                                        <div class="circle circle-lg bg-warning"></div>
                                    </td>
                                    <td>
                                        <a href="">Mitchell Jones</a>
                                    </td>
                                    <td>
                                        <div class="inline wd-xxs badge badge-warning">pending</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="badge bg-gray-lighter">issue</div>
                                    </td>
                                    <td>BI:57978</td>
                                    <td class="text-nowrap">
                                        <small>Maecenas mollis egestas convallis.</small>
                                    </td>
                                    <td>01/11/2016</td>
                                    <td>
                                        <div class="circle circle-lg bg-warning"></div>
                                    </td>
                                    <td>
                                        <a href="">Tracey Parker</a>
                                    </td>
                                    <td>
                                        <div class="inline wd-xxs badge badge-warning">pending</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="badge bg-gray-lighter">bug</div>
                                    </td>
                                    <td>BI:1107</td>
                                    <td class="text-nowrap">
                                        <small>Maecenas mollis egestas convallis.</small>
                                    </td>
                                    <td>01/01/2015</td>
                                    <td>
                                        <div class="circle circle-lg bg-danger"></div>
                                    </td>
                                    <td>
                                        <a href="">Warren Gray</a>
                                    </td>
                                    <td>
                                        <div class="inline wd-xxs badge badge-danger">closed</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="badge bg-gray-lighter">bug</div>
                                    </td>
                                    <td>BI:1117</td>
                                    <td class="text-nowrap">
                                        <small>Maecenas mollis egestas convallis.</small>
                                    </td>
                                    <td>11/05/2013</td>
                                    <td>
                                        <div class="circle circle-lg bg-warning"></div>
                                    </td>
                                    <td>
                                        <a href="">Jackson Ramos</a>
                                    </td>
                                    <td>
                                        <div class="inline wd-xxs badge badge-success">open</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="badge bg-gray-lighter">issue</div>
                                    </td>
                                    <td>BI:10127</td>
                                    <td class="text-nowrap">
                                        <small>Maecenas mollis egestas convallis.</small>
                                    </td>
                                    <td>05/02/2014</td>
                                    <td>
                                        <div class="circle circle-lg bg-warning"></div>
                                    </td>
                                    <td>
                                        <a href="">Ernest Berry</a>
                                    </td>
                                    <td>
                                        <div class="inline wd-xxs badge badge-danger">closed</div>
                                    </td>
                                </tr>
                            </tbody>
                        </Datatable>
                    </div>
                </div>
            </div>
        </div>
    </ContentWrapper>
</template>
<script>
    import Scrollable from '@/components/Common/Scrollable'
    import Datatable from '@/components/Tables/Datatable';
    import Sparkline from '@/components/Common/Sparklines';

    export default {
        components: {
            Scrollable,
            Datatable,
            Sparkline
        },
        data() {
            return {
                dtOptions1: {
                    'paging': true, // Table pagination
                    'ordering': true, // Column ordering
                    'info': true, // Bottom left status text
                    responsive: true,
                    // Text translation options
                    // Note the required keywords between underscores (e.g _MENU_)
                    oLanguage: {
                        sSearch: '<em class="fa fa-search"></em>',
                        sLengthMenu: '_MENU_ records per page',
                        info: 'Showing page _PAGE_ of _PAGES_',
                        zeroRecords: 'Nothing found - sorry',
                        infoEmpty: 'No records available',
                        infoFiltered: '(filtered from _MAX_ total records)',
                        oPaginate: {
                            sNext: '<em class="fa fa-caret-right"></em>',
                            sPrevious: '<em class="fa fa-caret-left"></em>'
                        }
                    }
                }
            }
        }
    }
</script>
