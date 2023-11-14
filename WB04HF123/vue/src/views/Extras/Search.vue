<template>
    <ContentWrapper>
        <div class="content-heading">
            <div>Search
                <small>Search and filter results</small>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-9">
                <div class="form-group mb-4">
                    <input class="form-control mb-2" type="text" placeholder="Search products, people, apps, etc." />
                    <div class="d-flex">
                        <button class="btn btn-secondary" type="button">Search</button>
                        <div class="ml-auto">
                            <label class="c-checkbox">
                                <input id="inlineCheckbox10" type="checkbox" value="option1" />
                                <span class="fa fa-check"></span> Products</label>
                            <label class="c-checkbox">
                                <input id="inlineCheckbox20" type="checkbox" value="option2" />
                                <span class="fa fa-check"></span> People</label>
                            <label class="c-checkbox">
                                <input id="inlineCheckbox30" type="checkbox" value="option3" />
                                <span class="fa fa-check"></span> Apps</label>
                        </div>
                    </div>
                </div>
                <!-- START card-->
                <div class="card card-default">
                    <div class="card-header">
                        <CardTool refresh :onRefresh="onCardRefresh"/>
                        Search Results
                    </div>
                    <!-- START table-responsive-->
                    <div class="table-responsive">
                        <table class="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th data-check-all="" class="wd-xxs">
                                        <div class="checkbox c-checkbox" v-b-tooltip.hover title="Check All">
                                            <label class="m-0">
                                                <input type="checkbox" @input="checkAll"/>
                                                <span class="fa fa-check"></span>
                                            </label>
                                        </div>
                                    </th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div class="checkbox c-checkbox">
                                            <label>
                                                <input type="checkbox" :checked="checkedItems[0]"/>
                                                <span class="fa fa-check"></span>
                                            </label>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="media align-items-center">
                                            <a class="mr-3" href="#">
                                                <img class="img-fluid rounded thumb64" src="img/dummy.png" alt="" />
                                            </a>
                                            <div class="media-body d-flex">
                                                <div>
                                                    <h4 class="m-0">Product 1</h4>
                                                    <small class="text-muted">Category1, Category2</small>
                                                    <p>Sed gravida auctor odio. Sed viverra rutrum hendrerit. Praesent dapibus justo dolor. Suspendisse rhoncus consectetur eros vehicula accumsan.</p>
                                                </div>
                                                <div class="ml-auto">
                                                    <div class="btn btn-info btn-sm">View</div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="checkbox c-checkbox">
                                            <label>
                                                <input type="checkbox" :checked="checkedItems[1]"/>
                                                <span class="fa fa-check"></span>
                                            </label>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="media align-items-center">
                                            <a class="mr-3" href="#">
                                                <img class="img-fluid rounded thumb64" src="img/dummy.png" alt="" />
                                            </a>
                                            <div class="media-body d-flex">
                                                <div>
                                                    <h4 class="m-0">Product 2</h4>
                                                    <small class="text-muted">Category1, Category2</small>
                                                    <p>Sed gravida auctor odio. Sed viverra rutrum hendrerit. Praesent dapibus justo dolor. Suspendisse rhoncus consectetur eros vehicula accumsan.</p>
                                                </div>
                                                <div class="ml-auto">
                                                    <div class="btn btn-info btn-sm">View</div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="checkbox c-checkbox">
                                            <label>
                                                <input type="checkbox" :checked="checkedItems[2]"/>
                                                <span class="fa fa-check"></span>
                                            </label>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="media align-items-center">
                                            <a class="mr-3" href="#">
                                                <img class="img-fluid rounded thumb64" src="img/dummy.png" alt="" />
                                            </a>
                                            <div class="media-body d-flex">
                                                <div>
                                                    <h4 class="m-0">Product 3</h4>
                                                    <small class="text-muted">Category1, Category2</small>
                                                    <p>Sed gravida auctor odio. Sed viverra rutrum hendrerit. Praesent dapibus justo dolor. Suspendisse rhoncus consectetur eros vehicula accumsan.</p>
                                                </div>
                                                <div class="ml-auto">
                                                    <div class="btn btn-info btn-sm">View</div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="checkbox c-checkbox">
                                            <label>
                                                <input type="checkbox" :checked="checkedItems[3]"/>
                                                <span class="fa fa-check"></span>
                                            </label>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="media align-items-center">
                                            <a class="mr-3" href="#">
                                                <img class="img-fluid rounded thumb64" src="img/dummy.png" alt="" />
                                            </a>
                                            <div class="media-body d-flex">
                                                <div>
                                                    <h4 class="m-0">Product 4</h4>
                                                    <small class="text-muted">Category1, Category2</small>
                                                    <p>Sed gravida auctor odio. Sed viverra rutrum hendrerit. Praesent dapibus justo dolor. Suspendisse rhoncus consectetur eros vehicula accumsan.</p>
                                                </div>
                                                <div class="ml-auto">
                                                    <div class="btn btn-info btn-sm">View</div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="checkbox c-checkbox">
                                            <label>
                                                <input type="checkbox" :checked="checkedItems[4]"/>
                                                <span class="fa fa-check"></span>
                                            </label>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="media align-items-center">
                                            <a class="mr-3" href="#">
                                                <img class="img-fluid rounded thumb64" src="img/dummy.png" alt="" />
                                            </a>
                                            <div class="media-body d-flex">
                                                <div>
                                                    <h4 class="m-0">Product 5</h4>
                                                    <small class="text-muted">Category1, Category2</small>
                                                    <p>Sed gravida auctor odio. Sed viverra rutrum hendrerit. Praesent dapibus justo dolor. Suspendisse rhoncus consectetur eros vehicula accumsan.</p>
                                                </div>
                                                <div class="ml-auto">
                                                    <div class="btn btn-info btn-sm">View</div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!-- END table-responsive-->
                    <div class="card-footer">
                        <div class="d-flex">
                            <button class="btn btn-sm btn-secondary">Clear</button>
                            <nav class="ml-auto">
                                <ul class="pagination pagination-sm">
                                    <li class="page-item active">
                                        <a class="page-link" href="#">1</a>
                                    </li>
                                    <li class="page-item">
                                        <a class="page-link" href="#">2</a>
                                    </li>
                                    <li class="page-item">
                                        <a class="page-link" href="#">3</a>
                                    </li>
                                    <li class="page-item">
                                        <a class="page-link" href="#">»</a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
                <!-- END card-->
            </div>
            <div class="col-lg-3">
                <h3 class="m-0 pb-3">Filters</h3>
                <div class="form-group mb-4">
                    <label class="col-form-label mb-2">by Text</label>
                    <br/>
                    <multiselect
                      v-model="categoriesValue"
                      :options="categories"
                      :multiple="true"
                      :close-on-select="false"
                      :clear-on-select="false"
                      :hide-selected="true"
                      :preserve-search="true"
                      placeholder="Type here"
                      :taggable="true"/>
                </div>
                <div class="form-group">
                    <label class="col-form-label mb-2">by Date</label>
                    <br/>
                    <datepicker v-model="datepickerValue" :bootstrapStyling="true" />
                </div>
                <div class="form-group mb-4">
                    <label class="col-form-label mb-2">by Range</label>
                    <br/>
                    <div class="slider-fw">
                        <vue-slider ref="slider" v-model="sliderValue"></vue-slider>
                    </div>
                </div>
                <button class="btn btn-secondary btn-lg">Apply</button>
            </div>
        </div>
    </ContentWrapper>
</template>

<script>
    // Multiselect
    import Multiselect from 'vue-multiselect'
    // Datepicker
    import moment from 'moment'
    import Datepicker from 'vuejs-datepicker'
    // Range slider
    import vueSlider from 'vue-slider-component'
    // Card tool
    import CardTool from '@/components/Common/CardTool'

    const Categories = [ 'coding', 'less', 'sass', 'angularjs', 'node', 'expressJS' ]

    export default {
        components: {
            vueSlider,
            Datepicker,
            Multiselect,
            CardTool
        },
        data() {
            return {
                // Slider demo
                sliderValue: 40,
                // Multiselect
                categoriesValue: [],
                categories: Categories,
                // datepicker
                datepickerValue: moment().toDate(),
                // checkbox demo
                checkedItems: [false, false, false, false, false]
            }
        },
        methods: {
            onCardRefresh (card, done) {
                // perform any action when a .card triggers a the refresh event
                // when the action is done, call done to remove spiiner
                setTimeout(done, 3000);
            },
            checkAll (e) {
                this.checkedItems = this.checkedItems.map(() => e.currentTarget.checked)
            }
        }
    }
</script>
