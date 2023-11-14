<template>
    <ContentWrapper>
        <div class="content-heading">
            <div>Notifications
                <span class="text-sm d-none d-sm-block">A complete set of notification posibilities</span>
                <!-- Breadcrumb below title-->
                <ol class="breadcrumb breadcrumb px-0 pb-0">
                    <li class="breadcrumb-item">
                        <a href="#">Home</a>
                    </li>
                    <li class="breadcrumb-item">
                        <a href="#">Elements</a>
                    </li>
                    <li class="breadcrumb-item active">Notifications</li>
                </ol>
            </div>
            <!-- Breadcrumb right aligned-->
            <ol class="breadcrumb ml-auto">
                <li class="breadcrumb-item">
                    <a href="#">Home</a>
                </li>
                <li class="breadcrumb-item">
                    <a href="#">Elements</a>
                </li>
                <li class="breadcrumb-item active">Notifications</li>
            </ol>
        </div>
        <!-- Breadcrumb next to view title-->
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                <a href="#">Home</a>
            </li>
            <li class="breadcrumb-item">
                <a href="#">Elements</a>
            </li>
            <li class="breadcrumb-item active">Notifications</li>
        </ol>
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                <a href="#">Home</a>
            </li>
            <li class="breadcrumb-item">
                <a href="#">Elements</a>
            </li>
            <li class="breadcrumb-item active">Notifications</li>
        </ol>
        <!-- START row-->
        <div class="row">
            <div class="col-xl-6">
                <!-- START card-->
                <div class="card card-default">
                    <div class="card-header">Vue Toasted</div>
                    <div class="card-body">
                        <div class="form-group">
                            <label for="toastedText"><strong>Toasted Message</strong></label>
                            <input id="toastedText" type="text" v-model="toastedText" class="form-control mb-2">
                        </div>
                        <p><strong>Theme</strong></p>
                        <div class="form-group">
                            <div class="form-check form-check-inline">
                                <input id="toastedTheme1" type="radio" v-model="toastedTheme" value="primary" class="form-check-input">
                                <label for="toastedTheme1" class="form-check-label">primary</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input id="toastedTheme2" type="radio" v-model="toastedTheme" value="bubble" class="form-check-input">
                                <label for="toastedTheme2" class="form-check-label">bubble</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input id="toastedTheme3" type="radio" v-model="toastedTheme" value="outline" class="form-check-input">
                                <label for="toastedTheme3" class="form-check-label">outline</label>
                            </div>
                        </div>
                        <p><strong>Position</strong></p>
                        <div class="form-group">
                            <div class="form-check form-check-inline">
                                <input id="toastedPosition1" type="radio" v-model="toastedPosition" value="top-left" class="form-check-input">
                                <label for="toastedPosition1" class="form-check-label">top-left</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input id="toastedPosition2" type="radio" v-model="toastedPosition" value="top-center" class="form-check-input">
                                <label for="toastedPosition2" class="form-check-label">top-center</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input id="toastedPosition3" type="radio" v-model="toastedPosition" value="top-right" class="form-check-input">
                                <label for="toastedPosition3" class="form-check-label">top-right</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input id="toastedPosition4" type="radio" v-model="toastedPosition" value="bottom-left" class="form-check-input">
                                <label for="toastedPosition4" class="form-check-label">bottom-left</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input id="toastedPosition5" type="radio" v-model="toastedPosition" value="bottom-center" class="form-check-input">
                                <label for="toastedPosition5" class="form-check-label">bottom-center</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input id="toastedPosition6" type="radio" v-model="toastedPosition" value="bottom-right" class="form-check-input">
                                <label for="toastedPosition6" class="form-check-label">bottom-right</label>
                            </div>
                        </div>
                        <p><strong>Variant</strong></p>
                        <div class="form-group">
                            <div class="form-check form-check-inline">
                                <input id="toastedVariant0" type="radio" v-model="toastedVariant" value="default" class="form-check-input">
                                <label for="toastedVariant0" class="form-check-label">Default</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input id="toastedVariant1" type="radio" v-model="toastedVariant" value="primary" class="form-check-input">
                                <label for="toastedVariant1" class="form-check-label">primary</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input id="toastedVariant2" type="radio" v-model="toastedVariant" value="danger" class="form-check-input">
                                <label for="toastedVariant2" class="form-check-label">danger</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input id="toastedVariant3" type="radio" v-model="toastedVariant" value="warning" class="form-check-input">
                                <label for="toastedVariant3" class="form-check-label">warning</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input id="toastedVariant4" type="radio" v-model="toastedVariant" value="success" class="form-check-input">
                                <label for="toastedVariant4" class="form-check-label">success</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input id="toastedVariant5" type="radio" v-model="toastedVariant" value="info" class="form-check-input">
                                <label for="toastedVariant5" class="form-check-label">info</label>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="form-row align-items-center">
                                <div class="col-auto">
                                    <label for="toastedDuration"><strong>Duration</strong></label>
                                    <input id="toastedDuration" type="text" v-model="toastedDuration" class="form-control mb-2">
                                </div>
                            </div>
                        </div>
                        <div class="text-right">
                            <b-button variant="primary" @click="showToasted()">Launch Toast</b-button>
                        </div>
                    </div>
                </div>
                <!-- END card-->
                <!-- START card-->
                <div class="card card-default">
                    <div class="card-header">Alert Styles</div>
                    <div class="card-body">
                        <b-alert show>Default Alert</b-alert>
                        <b-alert variant="success" show>Success Alert</b-alert>
                        <b-alert variant="danger"
                                 dismissible
                                 :show="showDismissibleAlert"
                                 @dismissed="showDismissibleAlert=false">
                          Dismissible Alert!
                        </b-alert>
                        <b-alert :show="dismissCountDown"
                                 dismissible
                                 variant="warning"
                                 @dismissed="dismissCountDown=0"
                                 @dismiss-count-down="countDownChanged">
                          <p>This alert will dismiss after {{dismissCountDown}} seconds...</p>
                          <b-progress variant="warning"
                                      :max="dismissSecs"
                                      :value="dismissCountDown"
                                      height="6px">
                          </b-progress>
                        </b-alert>
                        <b-btn @click="showAlert" variant="info" class="m-1">
                          Show alert with count-down timer
                        </b-btn>
                        <b-btn @click="showDismissibleAlert=true" variant="info" class="m-1">
                          Show dismissible alert ({{showDismissibleAlert?'visible':'hidden'}})
                        </b-btn>
                    </div>
                </div>
                <!-- END card-->
                <!-- START card-->
                <div class="card card-default">
                    <div class="card-header">Tooltips</div>
                    <div class="card-body">
                        <b-row>
                          <b-col md="4" class="py-1 text-center"
                               v-for="placement in placements" :key="placement">
                            <b-btn :id="'exTooltip1-'+placement">
                              {{ placement }}
                            </b-btn>
                            <b-tooltip :target="'exTooltip1-'+placement"
                                       :placement="placement"
                                       triggers="hover focus"
                                       :title="`Placement ${placement}`">
                            </b-tooltip>
                          </b-col>
                        </b-row>
                    </div>
                </div>
                <!-- END card-->
            </div>
            <div class="col-xl-6">
                <!-- START card-->
                <div class="card card-default">
                    <div class="card-header">Vue Notifications</div>
                    <div class="card-body">
                        <div class="form-group">
                            <label for="notifText"><strong>Title</strong></label>
                            <input id="notifText" type="text" v-model="notifTitle" class="form-control mb-2">
                            <label for="notifText"><strong>Message</strong></label>
                            <input id="notifText" type="text" v-model="notifMessage" class="form-control mb-2">
                        </div>
                        <p><strong>Position</strong></p>
                        <div class="form-group">
                            <div class="form-check form-check-inline">
                                <input id="notifPosition1" type="radio" v-model="notifPosition" value="left top" class="form-check-input">
                                <label for="notifPosition1" class="form-check-label">Left Top</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input id="notifPosition2" type="radio" v-model="notifPosition" value="center top" class="form-check-input">
                                <label for="notifPosition2" class="form-check-label">Center Top</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input id="notifPosition3" type="radio" v-model="notifPosition" value="right top" class="form-check-input">
                                <label for="notifPosition3" class="form-check-label">Right Top</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input id="notifPosition4" type="radio" v-model="notifPosition" value="left bottom" class="form-check-input">
                                <label for="notifPosition4" class="form-check-label">Left Bottom</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input id="notifPosition5" type="radio" v-model="notifPosition" value="center bottom" class="form-check-input">
                                <label for="notifPosition5" class="form-check-label">Center Bottom</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input id="notifPosition6" type="radio" v-model="notifPosition" value="right bottom" class="form-check-input">
                                <label for="notifPosition6" class="form-check-label">Right Bottom</label>
                            </div>
                        </div>
                        <p><strong>Variant</strong></p>
                        <div class="form-group">
                            <div class="form-check form-check-inline">
                                <input id="notifVariant0" type="radio" v-model="notifVariant" value="default" class="form-check-input">
                                <label for="notifVariant0" class="form-check-label">Default</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input id="notifVariant1" type="radio" v-model="notifVariant" value="primary" class="form-check-input">
                                <label for="notifVariant1" class="form-check-label">primary</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input id="notifVariant2" type="radio" v-model="notifVariant" value="danger" class="form-check-input">
                                <label for="notifVariant2" class="form-check-label">danger</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input id="notifVariant3" type="radio" v-model="notifVariant" value="warning" class="form-check-input">
                                <label for="notifVariant3" class="form-check-label">warning</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input id="notifVariant4" type="radio" v-model="notifVariant" value="success" class="form-check-input">
                                <label for="notifVariant4" class="form-check-label">success</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input id="notifVariant5" type="radio" v-model="notifVariant" value="info" class="form-check-input">
                                <label for="notifVariant5" class="form-check-label">info</label>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="form-row align-items-center">
                                <div class="col-auto">
                                    <label for="notifDuration"><strong>Duration</strong></label>
                                    <input id="notifDuration" type="text" v-model="notifDuration" class="form-control mb-2">
                                </div>
                            </div>
                        </div>
                        <div class="text-right">
                            <b-button variant="primary" @click="showNotification()">Launch Notification</b-button>
                        </div>
                    </div>
                </div>
                <!-- END card-->
                <!-- START card-->
                <div class="card card-default">
                    <div class="card-header">Modals</div>
                    <div class="card-body">
                        <!-- Button trigger modal-->
                        <b-btn class="btn btn-primary btn-lg mr-1 mb-1" type="button" variant="primary" v-b-modal.myModal> Default modal</b-btn>
                        <b-btn class="btn btn-primary btn-lg mr-1 mb-1" type="button" variant="primary" v-b-modal.myModalLarge> Large modal</b-btn>
                        <b-btn class="btn btn-primary btn-lg mr-1 mb-1" type="button" variant="primary" v-b-modal.myModalSmall> Small modal</b-btn>
                    </div>
                </div>
                <!-- END card-->
                <!-- START card-->
                <div class="card card-default">
                    <div class="card-header">Popovers</div>
                    <div class="card-body">
                        <b-row>
                          <b-col md="4" class="py-1 text-center"
                               v-for="placement in placements" :key="placement">
                            <b-btn :id="'exPopover1-'+placement" variant="primary">
                              {{ placement }}
                            </b-btn>
                            <b-popover :target="'exPopover1-'+placement"
                                       :placement="placement"
                                       title="Popover!"
                                       triggers="hover focus"
                                       :content="`Placement ${placement}`">
                            </b-popover>
                          </b-col>
                        </b-row>
                    </div>
                </div>
                <!-- END card-->

            </div>
        </div>
        <!-- END row-->
        <!-- START card-->
        <div class="card card-default">
            <div class="card-header">Progress Bar
                <div class="btn-group float-right"></div>
            </div>
            <div class="card-body">
                <div v-for="bar in bars" class="row mb-1">
                  <div class="col-sm-2">{{ bar.variant }}:</div>
                  <div class="col-sm-10 pt-1">
                    <b-progress :value="bar.value"
                                :variant="bar.variant"
                                :key="bar.variant"
                    ></b-progress>
                  </div>
                </div>
            </div>
        </div>
        <!-- END card-->

        <!-- Notification container -->
        <notifications group="notifdemo" :position="notifPosition" :duration="parseInt(notifDuration)" :class="getNotificationPositionClass()"/>

        <!-- Modals -->
        <b-modal id="myModal" title="Modal">Hello Modal!</b-modal>
        <!-- Modal Large-->
        <b-modal id="myModalLarge" size="lg" title="Large Modal">Hello Modal Large!</b-modal>
        <!-- Modal Small-->
        <b-modal id="myModalSmall" size="sm" title="Small Modal">Hello Modal Small!</b-modal>

    </ContentWrapper>

</template>

<script>
    import Vue from 'vue'
    import Toasted from 'vue-toasted';
    import Notifications from 'vue-notification'

    Vue.use(Toasted)
    Vue.use(Notifications)

    export default {
        data() {
            return {
                toastedTheme: 'primary',
                toastedDuration: 5000,
                toastedText: 'Toasted Message',
                toastedPosition: 'top-center',
                toastedVariant: 'default',

                notifDuration: 5000,
                notifTitle: 'Notification Title',
                notifMessage: 'Notification Message',
                notifPosition: 'center top',
                notifVariant: 'default',
                // alerts demo
                dismissSecs: 10,
                dismissCountDown: 0,
                showDismissibleAlert: false,
                // popover/tooltip demo
                placements: [
                    'topright', 'top', 'topleft',
                    'bottomright', 'bottom', 'bottomleft',
                    'righttop', 'right', 'lefttop',
                    'rightbottom', 'left', 'leftbottom'
                ],
                // progress demo
                bars: [
                    {variant: 'success', value: 75},
                    {variant: 'info', value: 75},
                    {variant: 'warning', value: 75},
                    {variant: 'danger', value: 75},
                    {variant: 'primary', value: 75},
                    {variant: 'dark', value: 75}
                ],
                timer: null
            }
        },
        mounted () {
            // progress demo
            this.timer = setInterval(() => {
                this.bars.forEach(bar => bar.value = 25 + (Math.random() * 75))
            }, 2000)
        },
        beforeDestroy () {
            clearInterval(this.timer)
            this.timer = null
        },
        methods: {
            showToasted() {
                this.$toasted.show(this.toastedText, {
                    theme: this.toastedTheme,
                    duration: this.toastedDuration,
                    position: this.toastedPosition,
                    className: this.getToastedVariantClass()
                })
            },
            getToastedVariantClass() {
                if(this.toastedVariant === 'default') return '';
                if(this.toastedTheme === 'primary' || this.toastedTheme === 'bubble')
                    return `bg-${this.toastedVariant} text-white`
                if(this.toastedTheme === 'outline')
                    return `border-${this.toastedVariant} text-${this.toastedVariant}`
            },
            showNotification() {
                this.$notify({
                    group: 'notifdemo',
                    title: this.notifTitle,
                    text: this.notifMessage,
                    type: this.getNotificationVariantClass()
                });
            },
            getNotificationVariantClass() {
                if(this.notifVariant === 'default') return '';
                return `bg-${this.notifVariant} text-white`
            },
            getNotificationPositionClass() {
                return this.notifPosition.replace(' ', '-')
            },
            // Alerts demo
            countDownChanged (dismissCountDown) {
                this.dismissCountDown = dismissCountDown
            },
            showAlert () {
                this.dismissCountDown = this.dismissSecs
            }
        }
    }
</script>
