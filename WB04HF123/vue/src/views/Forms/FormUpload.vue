<template>
    <ContentWrapper>
        <div class="content-heading">
            <div>Vue Dropzone
                <small>A Vue.js component for Dropzone.js - a drag’n’drop file uploads utility with image previews</small>
            </div>
        </div>
        <div class="container container-lg">
            <div class="mb-3">
                <p class="m-0 text-center">DropzoneJS is an open source library that provides drag&apos;n&apos;drop file uploads with image previews.
                    <br/>It’s lightweight, doesn’t depend on any other library (like jQuery) and is
                    <a class="ml-1" href="http://www.dropzonejs.com/" target="_blank">highly customizable</a>
                </p>
            </div>
            <b-card class="mb-3">
                <vue-dropzone id="my-dropzone" :options="dropzoneOptions" ref="dropzoneInstance" />
            </b-card>
            <p>
                <small class="text-muted">This demo does not upload files to any server.</small>
            </p>
        </div>
    </ContentWrapper>
</template>
<script>
    import vue2Dropzone from 'vue2-dropzone'

    export default {
        components: {
            vueDropzone: vue2Dropzone
        },
        data() {
            return {
                dropzoneOptions: {
                    url: '/upload',
                    autoProcessQueue: false,
                    uploadMultiple: true,
                    parallelUploads: 100,
                    maxFiles: 100,
                    dictDefaultMessage: '<em class="fa fa-upload text-muted"></em><br>Drop files here to upload', // default messages before first drop
                    paramName: 'file', // The name that will be used to transfer the file
                    maxFilesize: 2, // MB
                    addRemoveLinks: true,
                    accept: function(file, done) {
                        if (file.name === 'justinbieber.jpg') {
                            done('Naha, you dont. :)');
                        } else {
                            done();
                        }
                    }
                }
            }
        }
    }
</script>
