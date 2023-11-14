<template>
    <ContentWrapper>
        <div class="content-heading">Forum - Categories</div>
        <!-- First category table-->
        <div class="card card-default">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th class="h4" style="width: 50%">Starting</th>
                        <th class="h4 text-center d-none d-lg-table-cell">Topics</th>
                        <th class="h4 text-center d-none d-lg-table-cell">Posts</th>
                        <th class="h4 d-none d-lg-table-cell">Updated</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <h4>
                                <router-link to="/forum/topics/11">
                                    <strong>Welcome</strong>
                                </router-link>
                            </h4>
                            <div class="text-muted">Feel free to come inside and introduce yourself!</div>
                        </td>
                        <td class="text-muted text-center d-none d-lg-table-cell">
                            <strong>789</strong>
                        </td>
                        <td class="text-muted text-center d-none d-lg-table-cell">
                            <strong>254</strong>
                        </td>
                        <td class="d-none d-lg-table-cell">
                            <a href="#">Arnold Gray</a>
                            <br/>
                            <small>March 10, 2015</small>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h4>
                                <router-link to="/forum/topics/22">
                                    <strong>Forum Rules</strong>
                                </router-link>
                            </h4>
                            <div class="text-muted">Please read the rules before post</div>
                        </td>
                        <td class="text-muted text-center d-none d-lg-table-cell">
                            <strong>15</strong>
                        </td>
                        <td class="text-muted text-center d-none d-lg-table-cell">
                            <strong>28</strong>
                        </td>
                        <td class="d-none d-lg-table-cell">
                            <a href="#">Erika Mckinney</a>
                            <br/>
                            <small>March 10, 2015</small>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h4>
                                <router-link to="/forum/topics/33">
                                    <strong>Announcements</strong>
                                </router-link>
                            </h4>
                            <div class="text-muted">Latest udpates and news about this forum</div>
                        </td>
                        <td class="text-muted text-center d-none d-lg-table-cell">
                            <strong>300</strong>
                        </td>
                        <td class="text-muted text-center d-none d-lg-table-cell">
                            <strong>561</strong>
                        </td>
                        <td class="d-none d-lg-table-cell">
                            <a href="#">Annette Ruiz</a>
                            <br/>
                            <small>March 10, 2015</small>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- Second category table-->
        <div class="card card-default">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th class="h4" style="width: 50%">Application</th>
                        <th class="h4 text-center d-none d-lg-table-cell">Topics</th>
                        <th class="h4 text-center d-none d-lg-table-cell">Posts</th>
                        <th class="h4 d-none d-lg-table-cell">Updated</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <h4>
                                <router-link to="/forum/topics/44">
                                    <strong>Getting Started</strong>
                                </router-link>
                            </h4>
                            <div class="text-muted">Donec id lectus tortor.</div>
                        </td>
                        <td class="text-muted text-center d-none d-lg-table-cell">
                            <strong>789</strong>
                        </td>
                        <td class="text-muted text-center d-none d-lg-table-cell">
                            <strong>254</strong>
                        </td>
                        <td class="d-none d-lg-table-cell">
                            <a href="#">Arnold Gray</a>
                            <br/>
                            <small>March 10, 2015</small>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h4>
                                <router-link to="/forum/topics/55">
                                    <strong>API</strong>
                                </router-link>
                            </h4>
                            <div class="text-muted">Etiam pharetra, orci sit amet lobortis malesuada.</div>
                        </td>
                        <td class="text-muted text-center d-none d-lg-table-cell">
                            <strong>15</strong>
                        </td>
                        <td class="text-muted text-center d-none d-lg-table-cell">
                            <strong>28</strong>
                        </td>
                        <td class="d-none d-lg-table-cell">
                            <a href="#">Erika Mckinney</a>
                            <br/>
                            <small>March 10, 2015</small>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h4>
                                <router-link to="/forum/topics/66">
                                    <strong>Updates</strong>
                                </router-link>
                            </h4>
                            <div class="text-muted">Etiam porttitor consectetur lectus, in adipiscing nisi bibendum eu.</div>
                        </td>
                        <td class="text-muted text-center d-none d-lg-table-cell">
                            <strong>300</strong>
                        </td>
                        <td class="text-muted text-center d-none d-lg-table-cell">
                            <strong>561</strong>
                        </td>
                        <td class="d-none d-lg-table-cell">
                            <a href="#">Annette Ruiz</a>
                            <br/>
                            <small>March 10, 2015</small>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h4>
                                <router-link to="/forum/topics/77">
                                    <strong>Modules</strong>
                                </router-link>
                            </h4>
                            <div class="text-muted">Sed viverra rutrum hendrerit.</div>
                        </td>
                        <td class="text-muted text-center d-none d-lg-table-cell">
                            <strong>300</strong>
                        </td>
                        <td class="text-muted text-center d-none d-lg-table-cell">
                            <strong>561</strong>
                        </td>
                        <td class="d-none d-lg-table-cell">
                            <a href="#">Floyd Porter</a>
                            <br/>
                            <small>March 10, 2015</small>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h4>
                                <router-link to="/forum/topics/88">
                                    <strong>Migration</strong>
                                </router-link>
                            </h4>
                            <div class="text-muted">Cum sociis natoque penatibus.</div>
                        </td>
                        <td class="text-muted text-center d-none d-lg-table-cell">
                            <strong>300</strong>
                        </td>
                        <td class="text-muted text-center d-none d-lg-table-cell">
                            <strong>561</strong>
                        </td>
                        <td class="d-none d-lg-table-cell">
                            <a href="#">Pedro Fox</a>
                            <br/>
                            <small>March 10, 2015</small>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- Third category table-->
        <div class="card card-default">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th class="h4" style="width: 50%">Support</th>
                        <th class="h4 text-center d-none d-lg-table-cell">Topics</th>
                        <th class="h4 text-center d-none d-lg-table-cell">Posts</th>
                        <th class="h4 d-none d-lg-table-cell">Updated</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <h4>
                                <router-link to="/forum/topics/99">
                                    <strong>F.A.Q.'s</strong>
                                </router-link>
                            </h4>
                            <div class="text-muted">Frequently asked questions here</div>
                        </td>
                        <td class="text-muted text-center d-none d-lg-table-cell">
                            <strong>789</strong>
                        </td>
                        <td class="text-muted text-center d-none d-lg-table-cell">
                            <strong>254</strong>
                        </td>
                        <td class="d-none d-lg-table-cell">
                            <a href="#">Arnold Gray</a>
                            <br/>
                            <small>March 10, 2015</small>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h4>
                                <router-link to="/forum/topics/1010">
                                    <strong>Guides</strong>
                                </router-link>
                            </h4>
                            <div class="text-muted">How to guides here</div>
                        </td>
                        <td class="text-muted text-center d-none d-lg-table-cell">
                            <strong>15</strong>
                        </td>
                        <td class="text-muted text-center d-none d-lg-table-cell">
                            <strong>28</strong>
                        </td>
                        <td class="d-none d-lg-table-cell">
                            <a href="#">Erika Mckinney</a>
                            <br/>
                            <small>March 10, 2015</small>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h4>
                                <router-link to="/forum/topics/1111">
                                    <strong>Updates</strong>
                                </router-link>
                            </h4>
                            <div class="text-muted">Latest news about latests updates</div>
                        </td>
                        <td class="text-muted text-center d-none d-lg-table-cell">
                            <strong>300</strong>
                        </td>
                        <td class="text-muted text-center d-none d-lg-table-cell">
                            <strong>561</strong>
                        </td>
                        <td class="d-none d-lg-table-cell">
                            <a href="#">Annette Ruiz</a>
                            <br/>
                            <small>March 10, 2015</small>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h4>
                                <router-link to="/forum/topics/1212">
                                    <strong>Questions</strong>
                                </router-link>
                            </h4>
                            <div class="text-muted">Ask for help here</div>
                        </td>
                        <td class="text-muted text-center d-none d-lg-table-cell">
                            <strong>300</strong>
                        </td>
                        <td class="text-muted text-center d-none d-lg-table-cell">
                            <strong>561</strong>
                        </td>
                        <td class="d-none d-lg-table-cell">
                            <a href="#">Floyd Porter</a>
                            <br/>
                            <small>March 10, 2015</small>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </ContentWrapper>
</template>
