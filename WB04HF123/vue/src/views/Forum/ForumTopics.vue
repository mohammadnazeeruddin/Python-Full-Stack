<template>
    <ContentWrapper>
        <div class="content-heading">
            <div>Forum - Topics
                <small>Category ID: {{categoryId}}</small>
            </div>
            <div class="ml-auto">
                <router-link class="btn btn-sm btn-secondary text-sm"
                    to="/forum/categories">
                    &lt; back
                </router-link>
            </div>
        </div>
        <div class="card card-default">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th class="h4" style="width: 50%">Welcome</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <h4>
                                <router-link to="/forum/discussion/123112">
                                    <strong>Powered by AngularJS</strong>
                                </router-link>
                            </h4>
                            <div class="text-muted text-sm">
                                <span>
                                    <strong class="mr-1">17</strong>views</span>
                                <span class="mx-1"></span>
                                <span>
                                    <strong class="mr-1">19</strong>comments</span>
                            </div>
                        </td>
                        <td class="text-right d-none d-lg-table-cell">
                            <div class="text-muted">
                                <small class="mr-1">Started by</small>
                                <a class="mr-1" href="#">Victoria West</a>
                                <small>on March 10, 2015</small>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h4>
                                <router-link to="/forum/discussion/124213">
                                    <strong>How to create an AngularJS admin GUI?</strong>
                                </router-link>
                            </h4>
                            <div class="text-muted text-sm">
                                <span>
                                    <strong class="mr-1">7</strong>views</span>
                                <span class="mx-1"></span>
                                <span>
                                    <strong class="mr-1">13</strong>comments</span>
                            </div>
                        </td>
                        <td class="text-right d-none d-lg-table-cell">
                            <div class="text-muted">
                                <small class="mr-1">Started by</small>
                                <a class="mr-1" href="#">Olivia Reynolds</a>
                                <small>on March 10, 2015</small>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h4>
                                <router-link to="/forum/discussion/125314">
                                    <strong>Issue found..</strong>
                                </router-link>
                            </h4>
                            <div class="text-muted text-sm">
                                <span>
                                    <strong class="mr-1">13</strong>views</span>
                                <span class="mx-1"></span>
                                <span>
                                    <strong class="mr-1">500</strong>comments</span>
                            </div>
                        </td>
                        <td class="text-right d-none d-lg-table-cell">
                            <div class="text-muted">
                                <small class="mr-1">Started by</small>
                                <a class="mr-1" href="#">Michelle Lane</a>
                                <small>on March 10, 2015</small>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h4>
                                <router-link to="/forum/discussion/126415">
                                    <strong>Share your application</strong>
                                </router-link>
                            </h4>
                            <div class="text-muted text-sm">
                                <span>
                                    <strong class="mr-1">98</strong>views</span>
                                <span class="mx-1"></span>
                                <span>
                                    <strong class="mr-1">1900</strong>comments</span>
                            </div>
                        </td>
                        <td class="text-right d-none d-lg-table-cell">
                            <div class="text-muted">
                                <small class="mr-1">Started by</small>
                                <a class="mr-1" href="#">Derek Jensen</a>
                                <small>on March 10, 2015</small>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h4>
                                <router-link to="/forum/discussion/127516">
                                    <strong>Angle - Angular Admin Template</strong>
                                </router-link>
                            </h4>
                            <div class="text-muted text-sm">
                                <span>
                                    <strong class="mr-1">17</strong>views</span>
                                <span class="mx-1"></span>
                                <span>
                                    <strong class="mr-1">19</strong>comments</span>
                            </div>
                        </td>
                        <td class="text-right d-none d-lg-table-cell">
                            <div class="text-muted">
                                <small class="mr-1">Started by</small>
                                <a class="mr-1" href="#">Colleen Cole</a>
                                <small>on March 10, 2015</small>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h4>
                                <router-link to="/forum/discussion/128617">
                                    <strong>Take a breakfast and happy coding</strong>
                                </router-link>
                            </h4>
                            <div class="text-muted text-sm">
                                <span>
                                    <strong class="mr-1">31</strong>view</span>
                                <span class="mx-1"></span>
                                <span>
                                    <strong class="mr-1">190</strong>comments</span>
                            </div>
                        </td>
                        <td class="text-right d-none d-lg-table-cell">
                            <div class="text-muted">
                                <small class="mr-1">Started by</small>
                                <a class="mr-1" href="#">Charlene Barrett</a>
                                <small>on March 10, 2015</small>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h4>
                                <router-link to="/forum/discussion/129718">
                                    <strong>Sed vitae nisi eget metus semper congue.</strong>
                                </router-link>
                            </h4>
                            <div class="text-muted text-sm">
                                <span>
                                    <strong class="mr-1">27</strong>views</span>
                                <span class="mx-1"></span>
                                <span>
                                    <strong class="mr-1">419</strong>comments</span>
                            </div>
                        </td>
                        <td class="text-right d-none d-lg-table-cell">
                            <div class="text-muted">
                                <small class="mr-1">Started by</small>
                                <a class="mr-1" href="#">Austin Montgomery</a>
                                <small>on March 10, 2015</small>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </ContentWrapper>
</template>

<script>
    export default {
        data() {
            return {
                categoryId: this.$route.params.catid
            }
        }
    }
</script>
