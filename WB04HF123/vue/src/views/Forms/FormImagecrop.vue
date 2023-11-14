<template>
    <ContentWrapper>
        <div class="content-heading">
            <div>Vue Cropper
                <small>A simple picture clipping plugin for vue</small>
            </div>
        </div>
        <div class="container-md">
            <div class="row">
                <div class="col-xl-8">
                    <b-modal v-model="previewModalShow" :ok-only="true" ok-title="Close" ok-variant="secondary" :hide-header="true">
                        <img :src="previewImage" alt="Modal Preview Image" class="img-fluid d-block mx-auto">
                    </b-modal>
                    <div class="mb-3" :class="{ 'd-none': !imageSrc }" style="height: 400px;">
                        <vueCropper ref="cropper" :img="imageSrc" :outputSize="outputSize" :outputType="outputType" :info="true" @realTime="previewRealTime" />
                    </div>
                    <div class="btn-group flex-wrap">
                        <label class="btn btn-primary mb-2 mr-2" for="change-image">
                            <input class="sr-only" type="file" id="change-image" accept="image/png, image/jpeg, image/gif, image/jpg" @change="changeImage($event)"> Change Image
                        </label>
                        <b-btn class="mr-2 mb-2" @click="startCrop" v-if="!crap" :disabled="!imageSrc">Start Crop</b-btn>
                        <b-btn class="mr-2 mb-2" @click="stopCrop" variant="danger" v-else :disabled="!imageSrc">Stop Crop</b-btn>
                        <b-btn class="mr-2 mb-2" @click="clearCrop" :disabled="!imageSrc">Clear</b-btn>
                        <b-btn class="mr-2 mb-2" @click="changeScale(1)" :disabled="!imageSrc">Zoom +</b-btn>
                        <b-btn class="mr-2 mb-2" @click="changeScale(-1)" :disabled="!imageSrc">Zoom -</b-btn>
                    </div>
                    <div class="btn-group flex-wrap">
                        <b-btn class="mr-2 mb-2" @click="rotateLeft" :disabled="!imageSrc">Rotate Left</b-btn>
                        <b-btn class="mr-2 mb-2" @click="rotateRight" :disabled="!imageSrc">Rotate Right</b-btn>
                    </div>
                    <div class="btn-group flex-wrap">
                        <b-btn class="mr-2 mb-2" variant="info" @click="previewImg('base64')" :disabled="!imageSrc">Preview (base64)</b-btn>
                        <b-btn class="mr-2 mb-2" variant="info" @click="previewImg('blob')" :disabled="!imageSrc">Preview (blob)</b-btn>
                    </div>
                    <b-form-group label="Output Format" class="p-0 my-4">
                        <b-radio-group
                            v-model="outputType"
                            :disabled="!imageSrc"
                            :options="[{ text: 'jpeg', value: 'jpeg' }, { text: 'png', value: 'png' }, { text: 'webp', value: 'webp' }]" />
                    </b-form-group>
                    <div class="btn-group flex-wrap">
                        <b-btn class="mr-2 mb-4" @click="downloadImg('base64')" :disabled="!imageSrc">Download (base64)</b-btn>
                        <b-btn class="mr-2 mb-4" @click="downloadImg('blob')" :disabled="!imageSrc">Download (blob)</b-btn>
                    </div>
                </div>
                <div class="col-xl-4">
                    <p>Output Preview</p>
                    <div :style="{'width': realTimePreviewData.w + 'px', 'height': realTimePreviewData.h + 'px', 'overflow': 'hidden', 'margin': '5px'}">
                        <div :style="realTimePreviewData.div">
                            <img :src="realTimePreviewData.url" :style="realTimePreviewData.img">
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </ContentWrapper>
</template>

<script>
    import vueCropper from 'vue-cropper'

    export default {
        components: {
            vueCropper
        },
        data() {
            return {
                imageSrc: 'img/mb-sample.jpg',
                outputSize: 1,
                outputType: 'jpeg',
                realTimePreviewData: {},
                crap: false,
                previewImage: null,
                previewModalShow: false
            }
        },
        methods: {
            startCrop () {
                this.crap = true
                this.$refs.cropper.startCrop()
            },
            stopCrop () {
                this.crap = false
                this.$refs.cropper.stopCrop()
            },
            clearCrop () {
                this.$refs.cropper.clearCrop()
            },
            changeScale (num) {
                this.$refs.cropper.changeScale(num || 1)
            },
            rotateLeft () {
                this.$refs.cropper.rotateLeft()
            },
            rotateRight () {
                this.$refs.cropper.rotateRight()
            },
            previewRealTime (data) {
                this.realTimePreviewData = data
            },
            previewImg (type) {
                if (type === 'blob') {
                    this.$refs.cropper.getCropBlob(data => {
                        this.previewImage = window.URL.createObjectURL(data)
                        this.previewModalShow = true
                    })
                } else { // type === 'base64'
                    this.$refs.cropper.getCropData(data => {
                        this.previewImage = data
                        this.previewModalShow = true
                    })
                }
            },
            downloadImg (type) {
                let aLink = document.createElement('a')
                aLink.download = 'demo'

                if (type === 'blob') {
                    this.$refs.cropper.getCropBlob((data) => {
                        this.downloadImgData = window.URL.createObjectURL(data)
                        aLink.href = window.URL.createObjectURL(data)
                        aLink.click()
                    })
                } else {
                    this.$refs.cropper.getCropData((data) => {
                        this.downloadImgData = data
                        aLink.href = data
                        aLink.click()
                    })
                }
            },
            changeImage (e) {
                let file = e.target.files[0]
                if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
                    alert('Please one of the following extensions: gif, jpeg, jpg, png, bmp')
                    return false
                }
                let reader = new FileReader()
                reader.onload = (e) => {
                    let data
                    if (typeof e.target.result === 'object') {
                        data = window.URL.createObjectURL(new Blob([e.target.result]))
                    } else {
                        data = e.target.result
                    }
                    this.imageSrc = data
                }
                reader.readAsArrayBuffer(file)
            }
        }
    }
</script>
