<template>
    <ContentWrapper>
        <div class="content-heading">
            <div>Form Validation
                <small>Validating forms frontend have never been so powerful and easy.</small>
            </div>
        </div>
        <!-- START row-->
        <div class="row">
            <div class="col-xl-6">
                <form @submit.prevent="validateBeforeSubmit('register')" data-vv-scope="register">
                    <!-- START card-->
                    <div class="card card-default">
                        <div class="card-header">
                            <div class="card-title">Form Register</div>
                        </div>
                        <div class="card-body">
                            <div class="form-group">
                                <label class="col-form-label">Email Address *</label>
                                <input :class="{'form-control':true, 'is-invalid': errors.has('register.email')}" v-model="register.email" v-validate="'required|email'" type="text" name="email"/>
                                <span v-show="errors.has('register.email')" class="invalid-feedback">{{ errors.first('register.email') }}</span>
                            </div>
                            <div class="form-group">
                                <label class="col-form-label">Password *</label>
                                <input ref="password1" :class="{'form-control':true, 'is-invalid': errors.has('register.password1')}" v-model="register.password1" v-validate="'required'" type="password" name="password1"/>
                                <span v-show="errors.has('register.password1')" class="invalid-feedback">{{ errors.first('register.password1') }}</span>
                            </div>
                            <div class="form-group">
                                <label class="col-form-label">Confirm Password *</label>
                                <input :class="{'form-control':true, 'is-invalid': errors.has('register.password2')}" v-model="register.password2" v-validate="'required|confirmed:password1'" type="password" name="password2"/>
                                <span v-show="errors.has('register.password2')" class="invalid-feedback">{{ errors.first('register.password2') }}</span>
                            </div>
                            <div class="required">* Required fields</div>
                        </div>
                        <div class="card-footer">
                            <div class="clearfix">
                                <div class="float-left">
                                    <div class="custom-control custom-checkbox">
                                        <input type="checkbox" :class="{'custom-control-input':true, 'is-invalid': errors.has('register.agreements')}" v-model="register.agreements" v-validate="'required'" name="agreements" id="registeragree">
                                        <label class="custom-control-label" for="registeragree">
                                            I agree with the<a class="ml-1 text-inherit" href="#">terms</a>
                                        </label>
                                        <span v-show="errors.has('register.agreements')" class="invalid-feedback">{{ errors.first('register.agreements') }}</span>
                                    </div>
                                </div>
                                <div class="float-right">
                                    <button class="btn btn-primary" type="submit">Register</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- END card-->
                </form>
            </div>
            <div class="col-xl-6">
                <form @submit.prevent="validateBeforeSubmit('login')" data-vv-scope="login">
                    <!-- START card-->
                    <div class="card card-default">
                        <div class="card-header">
                            <div class="card-title">Form Login</div>
                        </div>
                        <div class="card-body">
                            <div class="form-group">
                                <label class="col-form-label">Email Address *</label>
                                <input :class="{'form-control':true, 'is-invalid': errors.has('login.email')}" v-model="login.email" v-validate="'required|email'" type="text" name="email"/>
                                <span v-show="errors.has('login.email')" class="invalid-feedback">{{ errors.first('login.email') }}</span>
                            </div>
                            <div class="form-group">
                                <label class="col-form-label">Password *</label>
                                <input :class="{'form-control':true, 'is-invalid': errors.has('login.password')}" v-model="login.password" v-validate="'required'" type="password" name="password"/>
                                <span v-show="errors.has('login.password')" class="invalid-feedback">{{ errors.first('login.password') }}</span>
                            </div>
                            <div class="required">* Required fields</div>
                        </div>
                        <div class="card-footer">
                            <button class="btn btn-primary" type="submit">Login</button>
                        </div>
                    </div>
                    <!-- END card-->
                </form>
            </div>
        </div>
        <!-- END row-->
        <!-- START row-->
        <div class="row">
            <div class="col-lg-12">
                <form @submit.prevent="validateBeforeSubmit('demo')" data-vv-scope="demo">
                    <!-- START card-->
                    <div class="card card-default">
                        <div class="card-header">
                            <div class="card-title">Fields validation</div>
                        </div>
                        <div class="bg-gray-lighter px-3 py-2 my-3">Type validation</div>
                        <div class="card-body">
                            <fieldset>
                                <div class="form-group row">
                                    <label class="col-md-2 col-form-label">Required Text</label>
                                    <div class="col-md-6">
                                        <input
                                            v-model="demo.required"
                                            v-validate="'required'"
                                            :class="{'form-control':true, 'is-invalid': errors.has('demo.required')}"
                                            type="text"
                                            name="required"/>
                                        <span v-show="errors.has('demo.required')" class="invalid-feedback">{{ errors.first('demo.required') }}</span>
                                    </div>
                                </div>
                            </fieldset>
                            <fieldset>
                                <div class="form-group row">
                                    <label class="col-md-2 col-form-label">Email</label>
                                    <div class="col-md-6">
                                        <input
                                            v-model="demo.email"
                                            v-validate="'required|email'"
                                            :class="{'form-control':true, 'is-invalid': errors.has('demo.email')}"
                                            type="email"
                                            name="email"/>
                                        <span v-show="errors.has('demo.email')" class="invalid-feedback">{{ errors.first('demo.email') }}</span>
                                    </div>
                                </div>
                            </fieldset>
                            <fieldset>
                                <div class="form-group row">
                                    <label class="col-md-2 col-form-label">Number</label>
                                    <div class="col-md-6">
                                        <input
                                            v-model="demo.number"
                                            v-validate="'required|numeric'"
                                            :class="{'form-control':true, 'is-invalid': errors.has('demo.number')}"
                                            type="text"
                                            name="number"/>
                                        <span v-show="errors.has('demo.number')" class="invalid-feedback">{{ errors.first('demo.number') }}</span>
                                    </div>
                                </div>
                            </fieldset>
                            <fieldset>
                                <div class="form-group row">
                                    <label class="col-md-2 col-form-label">Alpha</label>
                                    <div class="col-md-6">
                                        <input
                                            v-model="demo.alpha"
                                            v-validate="'required|alpha'"
                                            :class="{'form-control':true, 'is-invalid': errors.has('demo.alpha')}"
                                            type="text"
                                            name="alpha"/>
                                        <span v-show="errors.has('demo.alpha')" class="invalid-feedback">{{ errors.first('demo.alpha') }}</span>
                                    </div>
                                </div>
                            </fieldset>
                            <fieldset>
                                <div class="form-group row">
                                    <label class="col-md-2 col-form-label">Url</label>
                                    <div class="col-md-6">
                                        <input
                                            v-model="demo.url"
                                            v-validate="'required|url'"
                                            :class="{'form-control':true, 'is-invalid': errors.has('demo.url')}"
                                            type="text"
                                            name="url" />
                                        <span v-show="errors.has('demo.url')" class="invalid-feedback">{{ errors.first('demo.url') }}</span>
                                    </div>
                                </div>
                            </fieldset>
                            <fieldset class="m-0">
                                <div class="form-group row">
                                    <label class="col-md-2 col-form-label">Equal to</label>
                                    <div class="col-md-3">
                                        <input ref="compareto"
                                            v-model="demo.equal"
                                            v-validate="'required'"
                                            :class="{'form-control':true, 'is-invalid': errors.has('demo.equal')}"
                                            type="text"
                                            name="equal" />
                                        <span v-show="errors.has('demo.equal')" class="invalid-feedback">{{ errors.first('demo.equal') }}</span>
                                    </div>
                                    <div class="col-md-3">
                                        <input
                                            v-model="demo.equalconfirm"
                                            v-validate="'required|confirmed:compareto'"
                                            :class="{'form-control':true, 'is-invalid': errors.has('demo.equalconfirm')}"
                                            type="text"
                                            name="equalconfirm" />
                                        <span v-show="errors.has('demo.equalconfirm')" class="invalid-feedback">{{ errors.first('demo.equalconfirm') }}</span>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                        <div class="bg-gray-lighter px-3 py-2 mb-3">Range validation</div>
                        <div class="card-body">
                            <fieldset>
                                <div class="form-group row">
                                    <label class="col-md-2 col-form-label">Minlength</label>
                                    <div class="col-md-6">
                                        <input
                                            v-model="demo.minlength"
                                            v-validate="'min:6'"
                                            :class="{'form-control':true, 'is-invalid': errors.has('demo.minlength')}"
                                            type="text"
                                            name="minlength"
                                            />
                                        <span v-show="errors.has('demo.minlength')" class="invalid-feedback">{{ errors.first('demo.minlength') }}</span>
                                    </div>
                                    <div class="col-md-4"><code>Min length 6</code></div>
                                </div>
                            </fieldset>
                            <fieldset>
                                <div class="form-group row align-items-center">
                                    <label class="col-md-2 col-form-label">Maxlength</label>
                                    <div class="col-md-6">
                                        <input
                                            v-model="demo.maxlength"
                                            v-validate="'max:10'"
                                            :class="{'form-control':true, 'is-invalid': errors.has('demo.maxlength')}"
                                            type="text"
                                            name="maxlength"
                                            />
                                        <span v-show="errors.has('demo.maxlength')" class="invalid-feedback">{{ errors.first('demo.maxlength') }}</span>
                                    </div>
                                    <div class="col-md-4"><code>Max length 10</code></div>
                                </div>
                            </fieldset>
                            <fieldset>
                                <div class="form-group row align-items-center">
                                    <label class="col-md-2 col-form-label">Length</label>
                                    <div class="col-md-6">
                                        <input
                                            v-model="demo.length"
                                            v-validate="'min:6|max:10'"
                                            :class="{'form-control':true, 'is-invalid': errors.has('demo.length')}"
                                            type="text"
                                            name="length"
                                            />
                                        <span v-show="errors.has('demo.length')" class="invalid-feedback">{{ errors.first('demo.length') }}</span>
                                    </div>
                                    <div class="col-md-4"><code>Length between 6 and 10</code></div>
                                </div>
                            </fieldset>
                            <fieldset>
                                <div class="form-group row align-items-center">
                                    <label class="col-md-2 col-form-label">Min</label>
                                    <div class="col-md-6">
                                        <input
                                            v-model="demo.minval"
                                            v-validate="'min_value:6'"
                                            :class="{'form-control':true, 'is-invalid': errors.has('demo.minval')}"
                                            type="text"
                                            name="minval"
                                            />
                                        <span v-show="errors.has('demo.minval')" class="invalid-feedback">{{ errors.first('demo.minval') }}</span>
                                    </div>
                                    <div class="col-md-4"><code>Min value 6</code></div>
                                </div>
                            </fieldset>
                            <fieldset>
                                <div class="form-group row align-items-center">
                                    <label class="col-md-2 col-form-label">Max</label>
                                    <div class="col-md-6">
                                        <input
                                            v-model="demo.maxval"
                                            v-validate="'max_value:6'"
                                            :class="{'form-control':true, 'is-invalid': errors.has('demo.maxval')}"
                                            type="text"
                                            name="maxval"
                                            />
                                        <span v-show="errors.has('demo.maxval')" class="invalid-feedback">{{ errors.first('demo.maxval') }}</span>
                                    </div>
                                    <div class="col-md-4"><code>Max value 6</code></div>
                                </div>
                            </fieldset>
                            <fieldset>
                                <div class="form-group row align-items-center">
                                    <label class="col-md-2 col-form-label">IP</label>
                                    <div class="col-md-6">
                                        <input
                                            v-model="demo.ip"
                                            v-validate="'ip'"
                                            :class="{'form-control':true, 'is-invalid': errors.has('demo.ip')}"
                                            type="text"
                                            name="ip"
                                            />
                                        <span v-show="errors.has('demo.ip')" class="invalid-feedback">{{ errors.first('demo.ip') }}</span>
                                    </div>
                                    <div class="col-md-4"><code>IP v4 address</code></div>
                                </div>
                            </fieldset>
                            <fieldset>
                                <div class="form-group row align-items-center">
                                    <label class="col-md-2 col-form-label">Value IS</label>
                                    <div class="col-md-6">
                                        <input
                                            v-model="demo.is"
                                            v-validate="'is:javascript'"
                                            :class="{'form-control':true, 'is-invalid': errors.has('demo.is')}"
                                            type="text"
                                            name="is"
                                            />
                                        <span v-show="errors.has('demo.is')" class="invalid-feedback">{{ errors.first('demo.is') }}</span>
                                    </div>
                                    <div class="col-md-4"><code>Only javascript word allowed</code></div>
                                </div>
                            </fieldset>
                            <fieldset>
                                <div class="form-group row align-items-center">
                                    <label class="col-md-2 col-form-label">Value IS NOT</label>
                                    <div class="col-md-6">
                                        <input
                                            v-model="demo.is_not"
                                            v-validate="'is_not:javascript'"
                                            :class="{'form-control':true, 'is-invalid': errors.has('demo.is_not')}"
                                            type="text"
                                            name="is_not"
                                            />
                                        <span v-show="errors.has('demo.is_not')" class="invalid-feedback">{{ errors.first('demo.is_not') }}</span>
                                    </div>
                                    <div class="col-md-4"><code>The javascript word is not allowed</code></div>
                                </div>
                            </fieldset>
                        </div>
                        <div class="card-footer text-center">
                            <button class="btn btn-info" type="submit">Run validation</button>
                        </div>
                    </div>
                    <!-- END card-->
                </form>
            </div>
        </div>
        <!-- END row-->
    </ContentWrapper>
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
                register: {
                    email: '',
                    password1: '',
                    password2: '',
                    agreements: false
                },
                login: {
                    email: '',
                    password: ''
                },
                demo: {
                    required: '',
                    email: '',
                    number: 0,
                    alpha: '',
                    url: '',
                    equal: '',
                    equalconfirm: '',
                    minlength: '',
                    maxlength: '',
                    length: '',
                    minval: '',
                    maxval: '',
                    ip: '',
                    is: '',
                    is_not: ''
                }
            }
        },
        methods: {
            validateBeforeSubmit(scope) {
                this.$validator.validateAll(scope).then((result) => {
                    if (result) {
                        console.log('Form Submitted!');
                        return;
                    }
                    console.log('Correct them errors!');
                });
            }
        }
    }
</script>
