<template>
    <ContentWrapper>
        <div class="content-heading">
            <div>Form Wizard
                <small>Vue Form Wizard: A dynamic form wizard to split your forms easier</small>
            </div>
        </div>
        <div class="card card-default">
            <div class="card-header">Classic</div>
            <div class="card-body">
                <form-wizard>
                  <template slot="step" slot-scope="props">
                    <!-- By using a custom header markup we can pass html in title attribute -->
                    <wizard-step
                        :tab="props.tab"
                        @click.native="props.navigateToTab(props.index)"
                        @keyup.enter.native="props.navigateToTab(props.index)"
                        :transition="props.transition"
                        :index="props.index">
                      <span slot="title" :class="{'text-danger':props.tab.validationError}" v-html="props.tab.title"></span>
                    </wizard-step>
                  </template>
                  <!-- Headers -->
                  <tab-content title="<div>FIRST STEP TITLE</div><div>Step subtitle</div>">
                    <b-card class="mb-3 border">
                      Step Content 1
                    </b-card>
                  </tab-content>
                  <tab-content title="<div>SECOND STEP TITLE</div><div>Step subtitle</div>">
                    <b-card class="mb-3 border">
                      Step Content 2
                    </b-card>
                   </tab-content>
                   <tab-content title="<div>THIRD STEP TITLE</div><div>Step subtitle</div>">
                     <b-card class="mb-3 border">
                       Step Content 3
                     </b-card>
                   </tab-content>
                    <!-- Directions -->
                    <b-btn variant="secondary" slot="prev">Back</b-btn>
                    <b-btn variant="secondary" slot="next">Next</b-btn>
                    <b-btn variant="info" slot="finish">Finish</b-btn>
                </form-wizard>
            </div>
        </div>

        <div class="card card-default">
            <div class="card-header">Basic Vertical Example</div>
            <div class="card-body">
                <form-wizard class="vue-form-wizard-vertical">
                    <!-- By using a custom header markup we can pass html in title attribute -->
                    <template slot="step" slot-scope="props">
                        <wizard-step :tab="props.tab" @click.native="props.navigateToTab(props.index)" @keyup.enter.native="props.navigateToTab(props.index)" :transition="props.transition" :index="props.index">
                            <span slot="title" :class="{'text-danger':props.tab.validationError}" v-html="props.tab.title"></span>
                        </wizard-step>
                    </template>
                    <!-- Headers -->
                    <tab-content title="<div>FIRST STEP TITLE</div><div>Step subtitle</div>">
                        <b-card class="mb-3 border">
                            Step Content 1
                        </b-card>
                    </tab-content>
                    <tab-content title="<div>SECOND STEP TITLE</div><div>Step subtitle</div>">
                        <b-card class="mb-3 border">
                            Step Content 2
                        </b-card>
                    </tab-content>
                    <tab-content title="<div>THIRD STEP TITLE</div><div>Step subtitle</div>">
                         <b-card class="mb-3 border">
                            Step Content 3
                        </b-card>
                    </tab-content>
                    <!-- Directions -->
                    <b-btn variant="secondary" slot="prev">Back</b-btn>
                    <b-btn variant="secondary" slot="next">Next</b-btn>
                    <b-btn variant="info" slot="finish">Finish</b-btn>
                </form-wizard>
            </div>
        </div>
    </ContentWrapper>
</template>

<script>
    import { FormWizard, TabContent, WizardStep } from 'vue-form-wizard'

    export default {
        components: {
            FormWizard,
            TabContent,
            WizardStep
        }
    }
</script>

<style src="vue-form-wizard/dist/vue-form-wizard.min.css"></style>
