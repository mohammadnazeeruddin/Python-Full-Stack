<template>
    <ContentWrapper>
        <div class="content-heading">Contacts
            <div class="ml-auto">
                <b-dropdown id="ddown1" variant="link" no-caret menu-class="animated fadeInLeft dropdown-menu-right-forced" right>
                    <template slot="button-content">
                        <em class="fa fa-ellipsis-v fa-lg"></em>
                    </template>
                    <b-dropdown-item>
                        <em class="fa-fw fa fa-plus mr-2"></em>
                        <span>New contact</span>
                    </b-dropdown-item>
                    <b-dropdown-item>
                        <em class="fa-fw fas fa-share mr-2"></em>
                        <span>Import contact</span>
                    </b-dropdown-item>
                    <b-dropdown-item>
                        <em class="fa-fw fas fa-reply mr-2"></em>
                        <span>Export contacts</span>
                    </b-dropdown-item>
                </b-dropdown>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-4 col-sm-6">
                <div class="card card-default">
                    <div class="card-header"></div>
                    <div class="card-body text-center">
                        <img class="mb-2 img-fluid rounded-circle thumb64" src="img/user/02.jpg" alt="Contact" />
                        <h4>Audrey Hunt</h4>
                        <p>Hello, I'm a just a dummy contact in your contact list and this is my presentation text. Have fun!</p>
                    </div>
                    <div class="card-footer d-flex">
                        <div>
                            <a class="btn btn-xs btn-primary" href="#">Send message</a>
                        </div>
                        <div class="ml-auto">
                            <a class="btn btn-xs btn-secondary" href="#">View</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-sm-6">
                <div class="card card-default">
                    <div class="card-header"></div>
                    <div class="card-body text-center">
                        <img class="mb-2 img-fluid rounded-circle thumb64" src="img/user/03.jpg" alt="Contact" />
                        <h4>Leonard Price</h4>
                        <p>Hello, I'm a just a dummy contact in your contact list and this is my presentation text. Have fun!</p>
                    </div>
                    <div class="card-footer d-flex">
                        <div>
                            <a class="btn btn-xs btn-primary" href="#">Send message</a>
                        </div>
                        <div class="ml-auto">
                            <a class="btn btn-xs btn-secondary" href="#">View</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-sm-6">
                <div class="card card-default">
                    <div class="card-header"></div>
                    <div class="card-body text-center">
                        <img class="mb-2 img-fluid rounded-circle thumb64" src="img/user/04.jpg" alt="Contact" />
                        <h4>Jamie Stephens</h4>
                        <p>Hello, I'm a just a dummy contact in your contact list and this is my presentation text. Have fun!</p>
                    </div>
                    <div class="card-footer d-flex">
                        <div>
                            <a class="btn btn-xs btn-primary" href="#">Send message</a>
                        </div>
                        <div class="ml-auto">
                            <a class="btn btn-xs btn-secondary" href="#">View</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-sm-6">
                <div class="card card-default">
                    <div class="card-header"></div>
                    <div class="card-body text-center">
                        <img class="mb-2 img-fluid rounded-circle thumb64" src="img/user/05.jpg" alt="Contact" />
                        <h4>Tara Nelson</h4>
                        <p>Hello, I'm a just a dummy contact in your contact list and this is my presentation text. Have fun!</p>
                    </div>
                    <div class="card-footer d-flex">
                        <div>
                            <a class="btn btn-xs btn-primary" href="#">Send message</a>
                        </div>
                        <div class="ml-auto">
                            <a class="btn btn-xs btn-secondary" href="#">View</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-sm-6">
                <div class="card card-default">
                    <div class="card-header"></div>
                    <div class="card-body text-center">
                        <img class="mb-2 img-fluid rounded-circle thumb64" src="img/user/06.jpg" alt="Contact" />
                        <h4>Constance Cook</h4>
                        <p>Hello, I'm a just a dummy contact in your contact list and this is my presentation text. Have fun!</p>
                    </div>
                    <div class="card-footer d-flex">
                        <div>
                            <a class="btn btn-xs btn-primary mr-1" href="#">Send message</a>
                            <div class="ml-auto"></div>
                        </div>
                        <div class="float-right">
                            <a class="btn btn-xs btn-secondary" href="#">View</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-sm-6">
                <div class="card card-default">
                    <div class="card-header"></div>
                    <div class="card-body text-center">
                        <img class="mb-2 img-fluid rounded-circle thumb64" src="img/user/07.jpg" alt="Contact" />
                        <h4>Laura Palmr</h4>
                        <p>Hello, I'm a just a dummy contact in your contact list and this is my presentation text. Have fun!</p>
                    </div>
                    <div class="card-footer d-flex">
                        <div>
                            <a class="btn btn-xs btn-primary" href="#">Send message</a>
                        </div>
                        <div class="ml-auto">
                            <a class="btn btn-xs btn-secondary" href="#">View</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-sm-6">
                <div class="card card-default">
                    <div class="card-header"></div>
                    <div class="card-body text-center">
                        <img class="mb-2 img-fluid rounded-circle thumb64" src="img/user/08.jpg" alt="Contact" />
                        <h4>Audrey Hunt</h4>
                        <p>Hello, I'm a just a dummy contact in your contact list and this is my presentation text. Have fun!</p>
                    </div>
                    <div class="card-footer d-flex">
                        <div>
                            <a class="btn btn-xs btn-primary" href="#">Call</a>
                        </div>
                        <div class="ml-auto">
                            <a class="btn btn-xs btn-secondary" href="#">View</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-sm-6">
                <div class="card card-default">
                    <div class="card-header"></div>
                    <div class="card-body text-center">
                        <img class="mb-2 img-fluid rounded-circle thumb64" src="img/user/09.jpg" alt="Contact" />
                        <h4>Leslie Mckinney</h4>
                        <p>Hello, I'm a just a dummy contact in your contact list and this is my presentation text. Have fun!</p>
                    </div>
                    <div class="card-footer d-flex">
                        <div>
                            <a class="btn btn-xs btn-primary" href="#">Send message</a>
                        </div>
                        <div class="ml-auto">
                            <a class="btn btn-xs btn-secondary" href="#">View</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-sm-6">
                <div class="card card-default">
                    <div class="card-header"></div>
                    <div class="card-body text-center">
                        <img class="mb-2 img-fluid rounded-circle thumb64" src="img/user/04.jpg" alt="Contact" />
                        <h4>Brian Mills</h4>
                        <p>Hello, I'm a just a dummy contact in your contact list and this is my presentation text. Have fun!</p>
                    </div>
                    <div class="card-footer d-flex">
                        <div>
                            <a class="btn btn-xs btn-primary" href="#">Send message</a>
                        </div>
                        <div class="ml-auto">
                            <a class="btn btn-xs btn-secondary" href="#">View</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </ContentWrapper>
</template>
