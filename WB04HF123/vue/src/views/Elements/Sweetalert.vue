<template>
    <ContentWrapper>
        <div class="content-heading">
            <div>SweetAlert
                <small>A Beautiful Replacement For Javascript's "alert"</small>
            </div>
        </div>
        <div class="container-fluid">
            <h4 class="page-header mt-0">Usage examples</h4>
            <div class="row">
                <div class="col-lg-9 col-xl-6">
                    <p>A basic message</p>
                </div>
                <div class="col-lg-3 col-xl-6">
                    <p>
                        <button type="button" class="btn btn-primary" @click="swalDemo1()" >Try me!</button>
                    </p>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-9 col-xl-6">
                    <p>A title with a text under</p>
                </div>
                <div class="col-lg-3 col-xl-6">
                    <p>
                        <button type="button" class="btn btn-primary" @click="swalDemo2()" >Try me!</button>
                    </p>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-9 col-xl-6">
                    <p>A success message!</p>
                </div>
                <div class="col-lg-3 col-xl-6">
                    <p>
                        <button type="button" class="btn btn-primary" @click="swalDemo3()" >Try me!</button>
                    </p>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-9 col-xl-6">
                    <p>A warning message, with a function attached to the &quot;Confirm&quot;-button</p>
                </div>
                <div class="col-lg-3 col-xl-6">
                    <p>
                        <button type="button" class="btn btn-primary" @click="swalDemo4()" >Try me!</button>
                    </p>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-9 col-xl-6">
                    <p>... and by passing a parameter, you can execute something else for &quot;Cancel&quot;.</p>
                </div>
                <div class="col-lg-3 col-xl-6">
                    <p>
                        <button type="button" class="btn btn-primary" @click="swalDemo5()" >Try me!</button>
                    </p>
                </div>
            </div>
        </div>
    </ContentWrapper>
</template>
<script>
    import swal from 'sweetalert2'

    export default {
        name: 'Sweetalert',
        methods: {
            swalDemo1() {
                swal("Here's a message!")
            },
            swalDemo2() {
                swal("Here's a message!", "It's pretty, isn't it?")
            },
            swalDemo3() {
                swal("Good job!", "You clicked the button!", "success")
            },
            swalDemo4() {
                swal({
                        title: "Are you sure?",
                        text: "You will not be able to recover this imaginary file!",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Yes, delete it!"
                    }).then((result) => {
                        if(result.value)
                            swal("Deleted!", "Your imaginary file has been deleted.", "success");
                    });
            },
            swalDemo5() {
                swal({
                    title: "Are you sure?",
                    text: "You will not be able to recover this imaginary file!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, delete it!",
                    cancelButtonText: "No, cancel plx!"
                }).then((result) => {
                    if (result.value) {
                        swal("Deleted!", "Your imaginary file has been deleted.", "success");
                    } else {
                        swal("Cancelled", "Your imaginary file is safe :)", "error");
                    }
                });
            },
        }
    }
</script>
<style>
    body.swal2-height-auto {
        height: 100% !important;
    }
</style>