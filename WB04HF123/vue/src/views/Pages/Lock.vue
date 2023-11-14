<template>
    <div class="abs-center wd-xl">
        <!-- START card-->
        <div class="d-flex justify-content-center">
            <div class="p-2">
                <img class="img-fluid img-thumbnail rounded-circle" src="img/user/02.jpg" alt="Avatar" width="60" height="60" />
            </div>
        </div>
        <div class="card b0">
            <div class="card-body">
                <p class="text-center">Please login to unlock your screen.</p>
                <form @submit.prevent="validateBeforeSubmit('lock')" data-vv-scope="lock">
                    <div class="form-group">
                        <div class="input-group with-focus">
                            <input :class="{'form-control  border-right-0':true, 'is-invalid': errors.has('lock.password')}" v-model="lock.password" v-validate="'required'" type="password" name="password" placeholder="Password"/>
                            <div class="input-group-append">
                                <span class="input-group-text text-muted bg-transparent border-left-0">
                                    <em class="fa fa-lock"></em>
                                </span>
                            </div>
                            <span v-show="errors.has('lock.password')" class="invalid-feedback">{{ errors.first('lock.password') }}</span>
                        </div>
                    </div>
                    <div class="d-flex">
                        <div class="mt-1">
                            <router-link class="text-muted" to="/recover">
                                <small>Forgot your password?</small>
                            </router-link>
                        </div>
                        <div class="ml-auto">
                            <b-btn type="submit" size="sm" variant="primary">Unlock</b-btn>
                        </div>
                    </div>
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
                lock: {
                    password: ''
                }
            }
        },
        methods: {
            validateBeforeSubmit(scope) {
                this.$validator.validateAll(scope).then((result) => {
                    if (result) {
                        console.log('Form Submitted!');
                        console.log(`Password: ${this.lock.password}`)

                        console.log('Redirecting to dashboard in 3 seconds...')
                        setTimeout(() => {
                            this.$router.push('/dasbhoardv1');
                        }, 3000)

                        return;
                    }
                    console.log('Correct them errors!');
                });
            }
        }
    }
</script>
