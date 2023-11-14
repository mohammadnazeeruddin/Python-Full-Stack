<template>
    <ContentWrapper>
        <div class="content-heading">
            <div>Dropdown Animations
                <small>Extends the dropdown effects when open just adding an animation class</small>
            </div>
        </div>
        <!-- START row-->
        <div class="row">
            <div class="col-sm-6 col-lg-3" v-for="animation in ANIMATIONS" :key="animation">
                <!-- START box placeholder-->
                <div class="box-placeholder">
                    <!-- START button group-->
                    <div class="btn-group">
                        <b-dropdown id="ddown1" :text="animation" :menu-class="'animated '+ animation" class="m-md-2">
                            <b-dropdown-item>First Action</b-dropdown-item>
                            <b-dropdown-item>Second Action</b-dropdown-item>
                            <b-dropdown-item>Third Action</b-dropdown-item>
                            <b-dropdown-divider></b-dropdown-divider>
                            <b-dropdown-item>Something else here...</b-dropdown-item>
                            <b-dropdown-item disabled>Disabled action</b-dropdown-item>
                        </b-dropdown>
                    </div>
                    <!-- END button group-->
                </div>
                <!-- END box placeholder-->
            </div>
        </div>
        <!-- END row-->
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
    </ContentWrapper>
</template>
<script>
    export default {
        data() {
            return {
                ANIMATIONS: ['bounce','flash','pulse','rubberBand','shake','swing','tada','wobble','bounceIn','bounceInDown','bounceInLeft','bounceInRight','bounceInUp','fadeIn','fadeInDown','fadeInDownBig','fadeInLeft','fadeInLeftBig','fadeInRight','fadeInRightBig','fadeInUp','fadeInUpBig','flip','flipInX','flipInY','lightSpeedIn','rotateIn','rotateInDownLeft','rotateInDownRight','rotateInUpLeft','rotateInUpRight','hinge','rollIn','zoomIn','zoomInDown','zoomInLeft','zoomInRight','zoomInUp']
            }
        }
    }
</script>