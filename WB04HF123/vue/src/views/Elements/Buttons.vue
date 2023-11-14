<template>
    <ContentWrapper>
        <div class="content-heading">Buttons</div>
        <!-- START row-->
        <div class="row">
            <div class="col-lg-6">
                <!-- START card-->
                <div class="card card-default">
                    <div class="card-header">
                        <h3 class="card-title">Button colors</h3>
                    </div>
                    <div class="card-body">
                        <b-button class="mr-1 mb-1" v-for="variant in ['secondary', 'primary', 'success', 'info', 'warning', 'danger', 'inverse', 'green', 'purple', 'pink']" type="button" :variant="variant" :key="variant">{{variant}}</b-button>
                        <br/>
                        <br/>
                        <a class="btn btn-link mr-1" href="#">Button Link</a>
                        <button class="btn btn-secondary mr-1" type="button">
                            <strong>button tag</strong>
                        </button>
                        <a class="btn btn-secondary mr-1" href="#">
                            <strong>anchor tag</strong>
                        </a>
                    </div>
                </div>
                <!-- END card-->
            </div>
            <div class="col-lg-6">
                <!-- START card-->
                <div class="card card-default">
                    <div class="card-header">
                        <h3 class="card-title">Button Labeled</h3>
                    </div>
                    <div class="card-body">
                        <!-- Success button with label-->
                        <button class="btn btn-labeled btn-success mb-2 mr-1" type="button">
                            <span class="btn-label"><i class="fa fa-check"></i></span>Success</button>
                        <!-- Danger button with label-->
                        <button class="btn btn-labeled btn-danger mb-2 mr-1" type="button">
                            <span class="btn-label"><i class="fa fa-times"></i></span>Danger</button>
                        <!-- Info button with label-->
                        <button class="btn btn-labeled btn-info mb-2 mr-1" type="button">
                            <span class="btn-label"><i class="fa fa-exclamation"></i></span>Info</button>
                        <!-- Warning button with label-->
                        <button class="btn btn-labeled btn-warning mb-2 mr-1" type="button">
                            <span class="btn-label"><i class="fas fa-exclamation-triangle"></i></span>Warning</button>
                        <br/>
                        <!-- Standard button with label-->
                        <button class="btn btn-labeled btn-secondary mr-1" type="button">
                            <span class="btn-label"><i class="fa fa-arrow-left"></i></span>Left</button>
                        <!-- Standard button with label on the right side-->
                        <button class="btn btn-labeled btn-secondary mr-1" type="button">Right
                            <span class="btn-label btn-label-right"><i class="fa fa-arrow-right"></i></span>
                        </button>
                    </div>
                </div>
                <!-- END card-->
            </div>
        </div>
        <!-- END row-->
        <!-- START row-->
        <div class="row">
            <div class="col-lg-6">
                <!-- START card-->
                <div class="card card-default">
                    <div class="card-header">
                        <h3 class="card-title">Button sizing</h3>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-xl-6">
                                <p>
                                    <button class="btn btn-primary btn-lg mr-1" type="button">Large button</button>
                                    <button class="btn btn-secondary btn-lg" type="button">Large button</button>
                                </p>
                                <p>
                                    <button class="btn btn-primary mr-1" type="button">Secondary button</button>
                                    <button class="btn btn-secondary" type="button">Secondary button</button>
                                </p>
                            </div>
                            <div class="col-xl-6">
                                <p>
                                    <button class="btn btn-primary btn-sm mr-1" type="button">Small button</button>
                                    <button class="btn btn-secondary btn-sm" type="button">Small button</button>
                                </p>
                                <p>
                                    <button class="btn btn-primary btn-xs mr-1" type="button">Extra small button</button>
                                    <button class="btn btn-secondary btn-xs" type="button">Extra small button</button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- END card-->
            </div>
            <div class="col-lg-6">
                <!-- START card-->
                <div class="card card-default">
                    <div class="card-header">
                        <h3 class="card-title">Button group</h3>
                    </div>
                    <div class="card-body">
                        <p></p>
                        <div class="btn-group">
                            <button class="btn btn-secondary" type="button">Left</button>
                            <button class="btn btn-secondary" type="button">Middle</button>
                            <button class="btn btn-secondary" type="button">Right</button>
                        </div>
                        <p></p>
                        <p></p>
                        <div class="btn-group">
                            <button class="btn btn-secondary" type="button">1</button>
                            <button class="btn btn-secondary" type="button">2</button>
                            <button class="btn btn-secondary" type="button">3</button>
                            <button class="btn btn-secondary" type="button">4</button>
                        </div>
                        <div class="btn-group">
                            <button class="btn btn-secondary" type="button">5</button>
                            <button class="btn btn-secondary" type="button">6</button>
                            <button class="btn btn-secondary" type="button">7</button>
                        </div>
                        <div class="btn-group">
                            <button class="btn btn-secondary" type="button">8</button>
                        </div>
                    </div>
                </div>
                <!-- END card-->
            </div>
        </div>
        <!-- END row-->
        <!-- START card-->
        <div class="card card-default">
            <div class="card-header">
                <h3 class="card-title">Outline Buttons</h3>
            </div>
            <div class="card-body">
                <b-button class="mr-1 mb-1" v-for="variant in ['secondary', 'primary', 'success', 'info', 'warning', 'danger', 'inverse', 'green', 'purple', 'pink']" type="button" :variant="'outline-'+variant" :key="variant">{{variant}}</b-button>
                <br/>
                <b-button size="lg" class="mb-1 mr-1" variant="outline-primary" type="button">Outline Large</b-button>
                <b-button size="sm" class="mb-1 mr-1" variant="outline-primary" type="button">Outline Small</b-button>
                <b-button size="xs" class="mb-1 mr-1" variant="outline-primary" type="button">Outline xSmall</b-button>
            </div>
        </div>
        <!-- END card-->
        <!-- START row-->
        <div class="row">
            <div class="col-lg-6">
                <!-- START card-->
                <div class="card card-default">
                    <div class="card-header">
                        <h3 class="card-title">Button Pills</h3>
                    </div>
                    <div class="card-body">
                        <p>Pill left</p>
                        <p>
                            <b-button class="btn-pill-left mr-1 mb-1" v-for="variant in ['secondary', 'primary', 'success', 'info', 'warning', 'danger', 'inverse']" type="button" :variant="variant" :key="variant">{{variant}}</b-button>
                        </p>
                        <p>Pill right</p>
                        <p>
                            <b-button class="btn-pill-right mr-1 mb-1" v-for="variant in ['secondary', 'primary', 'success', 'info', 'warning', 'danger', 'inverse']" type="button" :variant="variant" :key="variant">{{variant}}</b-button>
                        </p>
                    </div>
                </div>
                <!-- END card-->
            </div>
            <div class="col-lg-6">
                <!-- START card-->
                <div class="card card-default">
                    <div class="card-header">
                        <h3 class="card-title">Button Oval</h3>
                    </div>
                    <div class="card-body">
                        <b-button class="btn-oval mr-1 mb-1" v-for="variant in ['secondary', 'primary', 'success', 'info', 'warning', 'danger', 'inverse']" type="button" :variant="variant" :key="variant">{{variant}}</b-button>
                    </div>
                </div>
                <!-- END card-->
                <!-- START card-->
                <div class="card card-default">
                    <div class="card-header">
                        <h3 class="card-title">Button Square</h3>
                    </div>
                    <div class="card-body">
                        <b-button class="btn-square mr-1 mb-1" v-for="variant in ['secondary', 'primary', 'success', 'info', 'warning', 'danger', 'inverse']" type="button" :variant="variant" :key="variant">{{variant}}</b-button>
                    </div>
                </div>
                <!-- END card-->
            </div>
        </div>
        <!-- END row-->
        <!-- START row-->
        <div class="row">
            <div class="col-lg-6">
                <!-- START card-->
                <div class="card card-default">
                    <div class="card-header">
                        <h3 class="card-title">Button dropdown</h3>
                    </div>
                    <div class="card-body">
                        <div class="btn-group mr-1 mb-1" v-for="variant in ['secondary', 'primary', 'success', 'info', 'warning', 'danger', 'inverse']" :key="variant">
                            <b-dropdown :text="variant" :variant="variant">
                                  <b-dropdown-item>Item 1</b-dropdown-item>
                                  <b-dropdown-item>Item 2</b-dropdown-item>
                                  <b-dropdown-divider></b-dropdown-divider>
                                  <b-dropdown-item>Item 3</b-dropdown-item>
                            </b-dropdown>
                        </div>
                    </div>
                </div>
                <!-- END card-->
            </div>
            <div class="col-lg-6">
                <!-- START card-->
                <div class="card card-default">
                    <div class="card-header">
                        <h3 class="card-title">Split button dropdown</h3>
                    </div>
                    <div class="card-body">
                        <div class="btn-group mr-1 mb-1" v-for="variant in ['secondary', 'primary', 'success', 'info', 'warning', 'danger', 'inverse']" :key="variant">
                            <b-dropdown split :text="variant" :variant="variant">
                                  <b-dropdown-item>Item 1</b-dropdown-item>
                                  <b-dropdown-item>Item 2</b-dropdown-item>
                                  <b-dropdown-divider></b-dropdown-divider>
                                  <b-dropdown-item>Item 3</b-dropdown-item>
                            </b-dropdown>
                        </div>
                    </div>
                </div>
                <!-- END card-->
            </div>
        </div>
        <!-- END row-->
        <!-- START card-->
        <div class="card card-default">
            <div class="card-header">
                <h3 class="card-title">Button actions</h3>
            </div>
            <div class="card-body">
                <!-- START row-->
                <div class="row">
                    <div class="col-xl-4 mb-3">
                        <h4>Single toggle</h4>
                        <button class="btn btn-primary" type="button" aria-pressed="false">Single toggle</button>
                    </div>
                    <div class="col-xl-4 mb-3">
                        <h4>Checkbox</h4>
                        <div class="btn-group-toggle">
                            <label class="btn btn-primary active mr-1">
                                <input type="checkbox" checked="" /> Checkbox 1</label>
                            <label class="btn btn-primary mr-1">
                                <input type="checkbox" /> Checkbox 2</label>
                            <label class="btn btn-primary">
                                <input type="checkbox" /> Checkbox 3</label>
                        </div>
                    </div>
                    <div class="col-xl-4">
                        <h4>Radio</h4>
                        <div class="btn-group-toggle">
                            <label class="btn btn-primary active mr-1">
                                <input id="option1" type="radio" name="options" checked="" /> Radio 1</label>
                            <label class="btn btn-primary mr-1">
                                <input id="option2" type="radio" name="options" /> Radio 2</label>
                            <label class="btn btn-primary">
                                <input id="option3" type="radio" name="options" /> Radio 3</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- START card-->
        <div class="card card-default">
            <div class="card-header">
                <h3 class="card-title">Pagination</h3>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <h4>Large</h4>
                    <b-pagination size="lg" :total-rows="20" v-model="currentPage" :per-page="5"></b-pagination>
                    <h4>Standard</h4>
                    <b-pagination :total-rows="20" v-model="currentPage" :per-page="5"></b-pagination>
                    <h4>Small</h4>
                    <b-pagination size="sm" :total-rows="20" v-model="currentPage" :per-page="5"></b-pagination>
                </div>
            </div>
        </div>
        <!-- END card-->
    </ContentWrapper>
</template>
<script>
    export default {
        name: 'Buttons',
        data() {
            return {
                currentPage: 3
            }
        }
    }
</script>