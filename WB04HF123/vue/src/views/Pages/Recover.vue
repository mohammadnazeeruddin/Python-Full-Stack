<template>
    <div class="block-center mt-4 wd-xl">
        <!-- START card-->
        <div class="card card-flat">
            <div class="card-header text-center bg-dark">
                <a href="#">
                    <img class="block-center rounded" src="img/logo.png" alt="Image" />
                </a>
            </div>
            <div class="card-body">
                <p class="text-center py-2">PASSWORD RESET</p>
                <form @submit.prevent="validateBeforeSubmit('recover')" data-vv-scope="recover">
                    <p class="text-center">Fill with your mail to receive instructions on how to reset your password.</p>
                    <div class="form-group">
                        <label class="text-muted" for="resetInputEmail1">Email address</label>
                        <div class="input-group with-focus">

                            <input :class="{'form-control border-right-0':true, 'is-invalid': errors.has('recover.email')}" placeholder="Enter email" v-model="recover.email" v-validate="'required|email'" type="text" name="email"/>
                            <div class="input-group-append">
                                <span class="input-group-text text-muted bg-transparent border-left-0">
                                    <em class="fa fa-envelope"></em>
                                </span>
                            </div>
                            <span v-show="errors.has('recover.email')" class="invalid-feedback">{{ errors.first('recover.email') }}</span>
                        </div>
                    </div>
                    <button class="btn btn-danger btn-block" type="submit">Reset</button>
                </form>
            </div>
        </div>
        <!-- END card-->
        <div class="p-3 text-center">
            <span class="mr-2">&copy;</span>
            <span>2018</span>
            <span class="mr-2">-</span>
            <span>Angle</span>
            <br/>
            <span>Bootstrap Admin Template</span>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
    import VeeValidate from 'vee-validate';

    Vue.use(VeeValidate, {
        fieldsBagName: 'formFields'  // fix issue with b-table
    })

    export default {
        data() {
            return {
                recover: {
                    email: ''
                }
            }
        },
        methods: {
            validateBeforeSubmit(scope) {
                this.$validator.validateAll(scope).then((result) => {
                    if (result) {
                        console.log('Form Submitted!');
                        console.log(`Email: ${this.recover.email}`)
                        return;
                    }
                    console.log('Correct them errors!');
                });
            }
        }
    }
</script>
