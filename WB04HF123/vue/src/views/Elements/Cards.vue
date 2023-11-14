<template>
    <ContentWrapper>
        <div class="content-heading">
            <div>Cards
                <small>Cards can contain almost any kind of element inside</small>
            </div>
        </div>
        <div class="container-fluid">
            <!-- START row-->
            <div class="row">
                <div class="col-lg-4">
                    <!-- START card-->
                    <div class="card card-default" id="cardDemo1">
                        <div class="card-header">Dismissable Card
                            <CardTool dismiss refresh :onRemove="onCardRemove" :onRemoved="onCardRemoved" :onRefresh="onCardRefresh"/>
                        </div>
                        <div class="card-body">
                            <p>Card can be dismissed by clicking on the cross icon icon on the top right corner</p>
                        </div>
                        <div class="card-footer">Card Footer</div>
                    </div>
                    <!-- END card-->
                </div>
                <div class="col-lg-4">
                    <!-- START card-->
                    <div class="card card-default card-demo" id="cardDemo3">
                        <div class="card-header">Standard Spinner
                            <CardTool refresh :onRefresh="onCardRefresh"/>
                        </div>
                        <div class="card-body">
                            <p>Click on the refresh icon to see how it triggers a refresh-event while it shows a spinner</p>
                        </div>
                        <div class="card-footer">Card Footer</div>
                    </div>
                    <!-- END card-->
                </div>
                <div class="col-lg-4">
                    <!-- START card-->
                    <div class="card card-default card-demo" id="cardDemo2">
                        <div class="card-header">Custom Spinner
                            <CardTool refresh :onRefresh="onCardRefresh" spinner="traditional"/>
                        </div>
                        <div class="card-body">
                            <p>Click on the refresh icon to see how it triggers a refresh-event while it shows a spinner</p>
                        </div>
                    </div>
                    <!-- END card-->
                </div>
            </div>
            <!-- END row-->
        </div>
        <h4 class="page-header">Card Styles</h4>
        <div class="row">
            <div class="col-lg-4">
                <div class="card text-white bg-primary mb-3">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h5 class="card-title">Primary card title</h5>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card&apos;s content.</p>
                    </div>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="card card-default mb-3">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h5 class="card-title">Card Default card title</h5>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card&apos;s content.</p>
                    </div>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="card text-white bg-success mb-3">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h5 class="card-title">Success card title</h5>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card&apos;s content.</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-4">
                <div class="card text-white bg-danger mb-3">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h5 class="card-title">Danger card title</h5>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card&apos;s content.</p>
                    </div>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="card text-white bg-warning mb-3">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h5 class="card-title">Warning card title</h5>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card&apos;s content.</p>
                    </div>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="card text-white bg-info mb-3">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h5 class="card-title">Info card title</h5>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card&apos;s content.</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-6">
                <div class="card bg-light mb-3">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h5 class="card-title">Light card title</h5>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card&apos;s content.</p>
                    </div>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="card text-white bg-dark mb-3">
                    <div class="card-header">Header</div>
                    <div class="card-body">
                        <h5 class="card-title">Dark card title</h5>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card&apos;s content.</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-4">
                <div class="card mb-3 border-primary">
                    <div class="card-header text-white bg-primary">Header</div>
                    <div class="card-body">
                        <h5 class="card-title">Primary card title</h5>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card&apos;s content.</p>
                    </div>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="card mb-3 border-secondary">
                    <div class="card-header bg-secondary">Header</div>
                    <div class="card-body">
                        <h5 class="card-title">Card Default card title</h5>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card&apos;s content.</p>
                    </div>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="card mb-3 border-success">
                    <div class="card-header text-white bg-success">Header</div>
                    <div class="card-body">
                        <h5 class="card-title">Success card title</h5>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card&apos;s content.</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-4">
                <div class="card mb-3 border-danger">
                    <div class="card-header text-white bg-danger">Header</div>
                    <div class="card-body">
                        <h5 class="card-title">Danger card title</h5>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card&apos;s content.</p>
                    </div>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="card mb-3 border-warning">
                    <div class="card-header text-white bg-warning">Header</div>
                    <div class="card-body">
                        <h5 class="card-title">Warning card title</h5>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card&apos;s content.</p>
                    </div>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="card mb-3 border-info">
                    <div class="card-header text-white bg-info">Header</div>
                    <div class="card-body">
                        <h5 class="card-title">Info card title</h5>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card&apos;s content.</p>
                    </div>
                </div>
            </div>
        </div>
        <h4 class="page-header">Card Deck</h4>
        <div class="mb-4">
            <div class="card-deck">
                <div class="card card-default">
                    <div class="card-header">Demo content</div>
                    <div class="card-body">
                        <h5 class="card-title">Card title</h5>
                        <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                    </div>
                    <div class="card-footer">
                        <div class="text-sm text-muted">Last updated 3 mins ago</div>
                    </div>
                </div>
                <div class="card card-default">
                    <div class="card-header">Demo content</div>
                    <div class="card-body">
                        <h5 class="card-title">Card title</h5>
                        <p class="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
                        <p class="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
                        <p class="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
                        <p class="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
                    </div>
                    <div class="card-footer">
                        <div class="text-sm text-muted">Last updated 3 mins ago</div>
                    </div>
                </div>
                <div class="card card-default">
                    <div class="card-header">Demo content</div>
                    <div class="card-body">
                        <h5 class="card-title">Card title</h5>
                        <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.</p>
                    </div>
                    <div class="card-footer">
                        <div class="text-sm text-muted">Last updated 3 mins ago</div>
                    </div>
                </div>
            </div>
        </div>
        <h4 class="page-header">Accordion</h4>
        <div role="tablist">
            <b-card no-body class="card-default mb-1">
                <b-card-header role="tab">
                    <h4 class="mb-0" v-b-toggle.accordion1>Collapsible Group Item #1</h4>
                </b-card-header>
                <b-collapse id="accordion1" visible accordion="my-accordion" role="tabpanel" class="border-top">
                    <b-card-body>
                        <p class="card-text">
                            I start opened because <code>visible</code> is <code>true</code>
                        </p>
                        <p class="card-text">
                            {{ text }}
                        </p>
                    </b-card-body>
                </b-collapse>
            </b-card>
            <b-card no-body class="card-default mb-1">
                <b-card-header role="tab">
                    <h4 class="mb-0" v-b-toggle.accordion2>Collapsible Group Item #2</h4>
                </b-card-header>
                <b-collapse id="accordion2" accordion="my-accordion" role="tabpanel" class="border-top">
                    <b-card-body>
                        <p class="card-text">
                            {{ text }}
                        </p>
                    </b-card-body>
                </b-collapse>
            </b-card>
            <b-card no-body class="card-default mb-1">
                <b-card-header role="tab">
                    <h4 class="mb-0" v-b-toggle.accordion3>Collapsible Group Item #2</h4>
                </b-card-header>
                <b-collapse id="accordion3" accordion="my-accordion" role="tabpanel" class="border-top">
                    <b-card-body>
                        <p class="card-text">
                            {{ text }}
                        </p>
                    </b-card-body>
                </b-collapse>
            </b-card>
        </div>

        <h4 class="page-header">Tabs</h4>
        <!-- START row-->
        <div class="row">
            <div class="col-xl-12">
                <!-- START card-->
                <div class="card card-default" id="cardDemo14">
                    <div class="card-header">Basic Tabs</div>
                    <div class="card-body">
                        <b-tabs>
                          <b-tab title="first" active>
                            <br>I'm the first fading tab
                          </b-tab>
                          <b-tab title="second" >
                            <br>I'm the second tab content
                          </b-tab>
                          <b-tab title="disabled" disabled>
                            <br>Disabled tab!
                          </b-tab>
                        </b-tabs>
                    </div>
                </div>
                <!-- END card-->
            </div>
        </div>
        <!-- END row-->
        <b-jumbotron>
          <template slot="header">
            Bootstrap Vue
          </template>
          <template slot="lead">
            This is a simple hero unit, a simple jumbotron-style component for
            calling extra attention to featured content or information.
          </template>
          <hr class="my-4">
          <p>
            It uses utility classes for typography and spacing to space content
            out within the larger container.
          </p>
          <b-btn variant="primary" class="mr-1" href="#">Do Something</b-btn>
          <b-btn variant="success" href="#">Do Something Else</b-btn>
        </b-jumbotron>
    </ContentWrapper>
</template>
<script>
    import CardTool from '@/components/Common/CardTool'
    export default {
        components: {
            CardTool
        },
        data () {
            return {
                text: `
                    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
                    richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor
                    brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon
                    tempor, sunt aliqua put a bird on it squid single-origin coffee nulla
                    assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore
                    wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher
                    vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic
                    synth nesciunt you probably haven't heard of them accusamus labore VHS.
                  `
            }
        },
        methods: {
            onCardRemove (card, confirm) {
                console.log('Removing card');
                // Call confirm() to continue removing the card
                // perform checks to avoid removing card if some user action is required
                setTimeout(confirm, 50);
            },
            onCardRemoved () {
                console.log('Card Removed');
            },
            onCardRefresh (card, done) {
                // perform any action when a .card triggers a the refresh event
                // when the action is done, call done to remove spiiner
                setTimeout(done, 3000);
            }
        }
    }
</script>