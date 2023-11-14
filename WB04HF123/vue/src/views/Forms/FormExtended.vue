<template>
    <ContentWrapper>
        <div class="content-heading">
            <div>Form Extended
                <small>New elements to extend the classic functions</small>
            </div>
        </div>
        <!-- START card-->
        <div class="card card-default">
            <div class="card-header"> Form elements</div>
            <div class="card-body">
                <form class="form-horizontal" method="get" action="#">
                    <fieldset>
                        <legend class="border-bottom mb-4">New Components</legend>
                        <div class="form-group row">
                            <label class="col-md-2 col-form-label">Vue Slider
                            </label>
                            <div class="col-md-4">
                                <div class="mb-3">
                                    <p class="mb-3">Classic</p>
                                    <vue-slider ref="slider" v-model="sliderValue"></vue-slider>
                                </div>
                                <div class="mb-3">
                                    <p class="mb-3">Vertical</p>
                                    <vue-slider class="d-inline-block mr-5"
                                        v-model="sliderValue"
                                        direction="vertical"
                                        :width="2"
                                        :height="200"
                                        :dotSize="12"
                                        :tooltipMerge="false"/>
                                    <vue-slider class="d-inline-block"
                                        v-model="sliderValue"
                                        direction="vertical"
                                        :width="2"
                                        :height="200"
                                        :dotSize="12"
                                        :reverse="true"
                                        :tooltipMerge="false"/>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <div class="form-group row">
                            <label class="col-md-2 col-form-label">Switch Small</label>
                            <div class="col-md-10">
                                <label class="switch switch-sm">
                                    <input type="checkbox" checked="checked" />
                                    <span></span>
                                </label>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-2 col-form-label">Switch</label>
                            <div class="col-md-10">
                                <label class="switch">
                                    <input type="checkbox" checked="checked" />
                                    <span></span>
                                </label>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-2 col-form-label">Switch Large</label>
                            <div class="col-md-10">
                                <label class="switch switch-lg">
                                    <input type="checkbox" checked="checked" />
                                    <span></span>
                                </label>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-2 col-form-label">Switch Radio</label>
                            <div class="col-md-10">
                                <label class="switch switch-lg">
                                    <input type="radio" checked="checked" name="radioSwitch" />
                                    <span></span>
                                </label>
                                <label class="switch switch-lg">
                                    <input type="radio" name="radioSwitch" />
                                    <span></span>
                                </label>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <div class="form-group row mb-2">
                            <label class="col-md-2 col-form-label">Color picker</label>
                            <div class="col-md-10">
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <br>
                                        <slider-picker v-model="colors" />
                                    </div>
                                    <div class="col-md-6">
                                        <compact-picker v-model="colors" />
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6">
                                        <swatches-picker v-model="colors" />
                                    </div>
                                    <div class="col-md-6">
                                        <sketch-picker v-model="colors" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <div class="form-group row">
                            <label class="col-md-2 col-form-label">Vue Masked input</label>
                            <div class="col-md-10">
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <masked-input type="text" class="form-control" placeholder="Date.."
                                          v-model="date"
                                          :mask="dateMask"
                                          :pipe="datePipe" />
                                        <span class="form-text">Date mask MM/DD/YYYY</span>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <masked-input type="text" class="form-control" placeholder="Number.."
                                          v-model="number"
                                          :mask="numberMask" />
                                          <span class="form-text">Price number with '$' sign prefix</span>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <masked-input type="text" class="form-control" placeholder="Phone.."
                                          v-model="phone"
                                          :mask="phoneMask" />
                                          <span class="form-text">Phone mask (NNN) NNN-NNNN</span>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <masked-input type="text" class="form-control" placeholder="Email.."
                                          v-model="email"
                                          :mask="emailMask" />
                                        <span class="form-text">Email format mask</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <div class="form-group row mb-2">
                            <label class="col-md-2 col-form-label mb-2">Vue Multiselect</label>
                            <div class="col-md-10">
                                <p>Select single value</p>
                                <multiselect
                                  v-model="vueSelectValue"
                                  :options="vueSelectOptions"
                                  :searchable="false"
                                  :show-labels="false"
                                  placeholder="Pick a value"/>
                                  <code>{{vueSelectValue}}</code>
                                <p class="mt-3">Select Multiple with Plain array</p>
                                <multiselect
                                  v-model="vueSelectMultiPlainValue"
                                  :options="vueSelectMultiPlainOptions"
                                  :multiple="true"
                                  :close-on-select="false"
                                  :clear-on-select="false"
                                  :hide-selected="true"
                                  :preserve-search="true"
                                  placeholder="Type here"
                                  tag-placeholder="Add as a new tag"
                                  :taggable="true"
                                  @tag="addTag" />
                                  <code>{{vueSelectMultiPlainValue}}</code>
                                <p class="mt-3">Select Multiple with Object</p>
                                <multiselect
                                  v-model="vueSelectMultipleValue"
                                  :options="vueSelectMultipleOptions"
                                  :multiple="true"
                                  :close-on-select="false"
                                  :clear-on-select="false"
                                  :hide-selected="true"
                                  :preserve-search="true"
                                  placeholder="Type here"
                                  label="name"
                                  track-by="name"
                                  tag-placeholder="Add as a new tag"
                                  :taggable="true"
                                  @tag="addTag" />
                                  <code>{{vueSelectMultipleValue}}</code>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <div class="form-group row mb-2">
                            <label class="col-md-2 col-form-label mb-2">Date Picker</label>
                            <div class="col-xl-6 col-10">
                                <div class="mb-3">
                                    <datepicker v-model="datepickerValue" :bootstrapStyling="true" />
                                </div>
                                <div class="mb-3">
                                    <datepicker
                                      v-model="datepickerValue"
                                      :bootstrapStyling="true"
                                      :monday-first="true"
                                      :full-month-name="true"
                                      placeholder="Select date"
                                      :calendar-button="true"
                                      calendar-button-icon="far fa-calendar"
                                      :clear-button="true"
                                      :disabled-dates="disabledDates"
                                      :highlighted="highlightedDates" />
                                </div>
                                <p class="mb-3">Inline</p>
                                <datepicker v-model="datepickerValue" :bootstrapStyling="true" :inline="true" />
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <div class="form-group row">
                            <label class="col-md-2 col-form-label">Tags input
                                <span class="text-sm text-muted">Type and press Enter</span>
                            </label>
                            <div class="col-md-10">
                                <b-form-group>
                                    <input-tag :tags="tags" class="form-control" placeholder="Add a tag" :read-only="readonly" />
                                </b-form-group>
                                <b-btn variant="secondary" size="sm" @click="readonly = !readonly">{{readonly?'Remove':'Set'}} read only</b-btn>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <div class="form-group row">
                            <label class="col-md-2 col-form-label">File input</label>
                            <div class="col-md-10">
                                <!-- Styled -->
                                <b-form-file v-model="file" :state="Boolean(file)" placeholder="Choose a file..."></b-form-file>
                                <div class="mt-3">Selected file: {{file && file.name}}</div>
                                <!-- Plain mode -->
                                <b-form-file v-model="file2" class="mt-3" plain></b-form-file>
                                <div class="mt-3">Selected file: {{file2 && file2.name}}</div>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <div class="form-group row">
                            <label class="col-md-2 col-form-label">Block Note Editor</label>
                            <div class="col-md-10">
                                <div class="card">
                                    <div class="card-body">
                                        <textarea class="form-control note-editor" rows="10"></textarea>
                                    </div>
                                </div>
                                <p>With margin</p>
                                <div class="card">
                                    <div class="card-body">
                                        <textarea class="form-control note-editor note-editor-margin" rows="10"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <div class="form-group row">
                            <label class="col-md-2 col-form-label">Vue Quill Editor</label>
                            <div class="col-md-10">
                                <quill-editor v-model="quillEditorContent" :options="quillEditorOptions" />
                                <!-- <pre class="mt-4"><strong>Content:</strong><br>{{quillEditorContent}}</pre> -->
                                <hr>
                                <p><strong>Bubble Mode</strong> (select text to show toolbar)</p>
                                <quill-editor v-model="quillBubbleEditorContent" :options="quillBubbleEditorOptions" />
                                <!-- <pre class="mt-4"><strong>Content:</strong><br>{{quillBubbleEditorContent}}</pre> -->
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <div class="form-group row">
                            <div class="col-md-4">
                                <button class="btn btn-secondary" type="submit">Cancel</button>
                                <button class="btn btn-primary" type="submit">Save changes</button>
                            </div>
                        </div>
                    </fieldset>
                </form>
            </div>
        </div>
        <!-- END card-->
    </ContentWrapper>
</template>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<script>
    // Range slider
    import vueSlider from 'vue-slider-component'
    // Color picker
    const vueColor = require('vue-color')
    // Input Mask
    import MaskedInput from 'vue-text-mask'
    import * as textMaskAddons from 'text-mask-addons/dist/textMaskAddons'
    // Multiselect
    import Multiselect from 'vue-multiselect'
    // Tag inputs
    import InputTag from 'vue-input-tag'
    // Datepicker
    import moment from 'moment'
    import Datepicker from 'vuejs-datepicker'
    // Quill editor
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'
    import { quillEditor } from 'vue-quill-editor'

    const options1 = [ 'Vue.js', 'Adonis', 'Rails', 'Sinatra', 'Laravel', 'Phoenix' ];
    const options2 = [
        { name: 'Vue.js', language: 'JavaScript' },
        { name: 'Adonis', language: 'JavaScript' },
        { name: 'Rails', language: 'Ruby' },
        { name: 'Sinatra', language: 'Ruby' },
        { name: 'Laravel', language: 'PHP' },
        { name: 'Phoenix', language: 'Elixir' }
    ]

    export default {
        components: {
            vueSlider,
            MaskedInput,
            Multiselect,
            InputTag,
            Datepicker,
            quillEditor,
            'chrome-picker': vueColor.Chrome,
            'compact-picker': vueColor.Compact,
            'material-picker': vueColor.Material,
            'sketch-picker': vueColor.Sketch,
            'slider-picker': vueColor.Slider,
            'swatches-picker': vueColor.Swatches,
            'photoshop-picker': vueColor.Photoshop
        },
        data() {
            return {
                // Color picker
                colors: '',
                // Slider demo
                sliderValue: 0,
                // Mask input
                phone: '',
                phoneMask: ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
                number: '',
                numberMask: textMaskAddons.createNumberMask({
                  prefix: '$ '
                }),
                email: '',
                emailMask: textMaskAddons.emailMask,
                date: '',
                dateMask: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/],
                datePipe: textMaskAddons.createAutoCorrectedDatePipe('mm/dd/yyyy'),
                // Multiselect
                vueSelectValue: '',
                vueSelectOptions: options1,
                vueSelectMultiPlainValue: [options1[0]],
                vueSelectMultiPlainOptions: options1,
                vueSelectMultipleValue: [options2[0]],
                vueSelectMultipleOptions: options2,
                // Input Tags
                tags: ['Amsterdam','Washington','Sydney','Beijing','Cairo'],
                readonly: false,
                // Datepicker
                datepickerValue: moment().toDate(),
                disabledDates: {
                  days: [0] // Disable sunday
                },
                highlightedDates: {
                  dates: [
                    moment().add(1, 'd').toDate(),
                    moment().add(2, 'd').toDate(),
                    moment().add(3, 'd').toDate()
                  ]
                },
                file: null,
                file2: null,
                // Vue Quill Editor
                quillEditorContent: '',
                quillBubbleEditorContent: '',
                quillEditorOptions: {
                  modules: {
                    toolbar: [
                      [{ 'header': [1, 2, 3, 4, 5, 6, false] }, { 'font': [] }, { 'size': [] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ 'color': [] }, { 'background': [] }],
                      [{ 'script': 'sub' }, { 'script': 'super' }],
                      ['blockquote', 'code-block'],
                      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                      [{ 'direction': 'rtl' }, { 'align': [] }],
                      ['link', 'image', 'video'],
                      ['clean']
                    ]
                  }
                },
                quillBubbleEditorOptions: {
                  theme: 'bubble',
                  modules: {
                    toolbar: [
                      ['bold', 'italic', 'underline'],
                      [{ 'color': [] }, { 'background': [] }],
                      [{ 'header': 1 }, { 'header': 2 }],
                      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                      ['link', 'image', 'video'],
                      ['clean']
                    ]
                  }
                }
            }
        },
        methods: {
            addTag (newTag) {
              this.vueSelectMultipleValue.push({
                name: newTag,
                language: 'Some language'
              })
            },
        }
    }
</script>
