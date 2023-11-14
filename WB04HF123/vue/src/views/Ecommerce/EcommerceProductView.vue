<template>
    <ContentWrapper>
        <div class="content-heading">Product #000123</div>
        <form class="card">
            <b-tabs nav-class="nav-justified" class="ie-fix-flex">
                <b-tab title="Product Edit" active>
                    <fieldset>
                        <div class="form-group row">
                            <label class="col-lg-2 col-form-label">Name:</label>
                            <div class="col-lg-10">
                                <input class="form-control" type="text" placeholder="Product name.." />
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <div class="form-group row">
                            <label class="col-lg-2 col-form-label">Description:</label>
                            <div class="col-lg-10">
                                <textarea class="form-control" cols="5" placeholder="Short description.."></textarea>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <div class="form-group row">
                            <label class="col-lg-2 col-form-label">Price:</label>
                            <div class="col-lg-10">
                                <input class="form-control" type="text" placeholder="$ 123.20" />
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <div class="form-group row">
                            <label class="col-lg-2 col-form-label">Quantity:</label>
                            <div class="col-lg-10">
                                <input class="form-control" type="number" placeholder="0" min="0" />
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <div class="form-group row">
                            <label class="col-lg-2 col-form-label">Tax :</label>
                            <div class="col-lg-10">
                                <input class="form-control" type="text" placeholder="20%" />
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <div class="form-group row">
                            <label class="col-lg-2 col-form-label">Status:</label>
                            <div class="col-lg-10">
                                <select class="form-control">
                                    <option value="">Select..</option>
                                    <option value="0">Public</option>
                                    <option value="1">Pending</option>
                                </select>
                            </div>
                        </div>
                    </fieldset>
                </b-tab>
                <b-tab title="SEO Metadata" >
                    <fieldset>
                        <div class="form-group row">
                            <label class="col-lg-2 col-form-label">Title</label>
                            <div class="col-lg-10">
                                <input class="form-control" type="text" placeholder="Brief description.." />
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <div class="form-group row">
                            <label class="col-lg-2 col-form-label">Description</label>
                            <div class="col-lg-10">
                                <textarea class="form-control" rows="5" placeholder="Max 255 characters..."></textarea>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <div class="form-group row">
                            <label class="col-lg-2 col-form-label">Keywords</label>
                            <div class="col-lg-10">
                                <textarea class="form-control" rows="5" placeholder="Max 1000 characters..."></textarea>
                            </div>
                        </div>
                    </fieldset>
                </b-tab>
                <b-tab title="Pictures">
                    <div class="row mb-3">
                        <div class="col-3">
                            <strong>Preview</strong>
                        </div>
                        <div class="col-9">
                            <strong>Details</strong>
                        </div>
                    </div>
                    <div class="row mb-3 pb-3 bb">
                        <div class="col-6 col-md-3">
                            <a href="#" title="Product 1">
                                <img class="img-fluid" src="img/bg7.jpg" alt="Product 1" />
                            </a>
                        </div>
                        <div class="col-6 col-md-9">
                            <fieldset>
                                <div class="form-group row">
                                    <input class="form-control" type="text" placeholder="Brief description.." />
                                </div>
                            </fieldset>
                            <p>
                                <strong>Picture type</strong>
                            </p>
                            <div class="c-radio c-radio-nofont">
                                <label>
                                    <input type="radio" name="prod1-pic" value="option1" checked="" />
                                    <span></span>Primary</label>
                            </div>
                            <div class="c-radio c-radio-nofont">
                                <label>
                                    <input type="radio" name="prod1-pic" value="option2" />
                                    <span></span>Thumbnail</label>
                            </div>
                            <div class="c-radio c-radio-nofont">
                                <label>
                                    <input type="radio" name="prod1-pic" value="option3" />
                                    <span></span>Gallery</label>
                            </div>
                            <div class="text-right">
                                <button class="btn btn-sm btn-danger" type="button">
                                    <em class="fa fa-times-circle fa-fw"></em>Remove</button>
                            </div>
                        </div>
                    </div>
                    <div class="row mb-3 pb-3 bb">
                        <div class="col-6 col-md-3">
                            <a href="#" title="Product 2">
                                <img class="img-fluid" src="img/bg8.jpg" alt="Product 1" />
                            </a>
                        </div>
                        <div class="col-6 col-md-9">
                            <fieldset>
                                <div class="form-group row">
                                    <input class="form-control" type="text" placeholder="Brief description.." />
                                </div>
                            </fieldset>
                            <p>
                                <strong>Picture type</strong>
                            </p>
                            <div class="c-radio c-radio-nofont">
                                <label>
                                    <input type="radio" name="prod2-pic" value="option1" checked="" />
                                    <span></span>Primary</label>
                            </div>
                            <div class="c-radio c-radio-nofont">
                                <label>
                                    <input type="radio" name="prod2-pic" value="option2" />
                                    <span></span>Thumbnail</label>
                            </div>
                            <div class="c-radio c-radio-nofont">
                                <label>
                                    <input type="radio" name="prod2-pic" value="option3" />
                                    <span></span>Gallery</label>
                            </div>
                            <div class="text-right">
                                <button class="btn btn-sm btn-danger" type="button">
                                    <em class="fa fa-times-circle fa-fw"></em>Remove</button>
                            </div>
                        </div>
                    </div>
                    <div class="row mb-3 pb-3">
                        <div class="col-6 col-md-3">
                            <a href="#" title="Product 3">
                                <img class="img-fluid" src="img/bg10.jpg" alt="Product 1" />
                            </a>
                        </div>
                        <div class="col-6 col-md-9">
                            <fieldset>
                                <div class="form-group row">
                                    <input class="form-control" type="text" placeholder="Brief description.." />
                                </div>
                            </fieldset>
                            <p>
                                <strong>Picture type</strong>
                            </p>
                            <div class="c-radio c-radio-nofont">
                                <label>
                                    <input type="radio" name="prod3-pic" value="option1" checked="" />
                                    <span></span>Primary</label>
                            </div>
                            <div class="c-radio c-radio-nofont">
                                <label>
                                    <input type="radio" name="prod3-pic" value="option2" />
                                    <span></span>Thumbnail</label>
                            </div>
                            <div class="c-radio c-radio-nofont">
                                <label>
                                    <input type="radio" name="prod3-pic" value="option3" />
                                    <span></span>Gallery</label>
                            </div>
                            <div class="text-right">
                                <button class="btn btn-sm btn-danger" type="button">
                                    <em class="fa fa-times-circle fa-fw"></em>Remove</button>
                            </div>
                        </div>
                    </div>
                </b-tab>
            </b-tabs>
        </form>
        <div class="text-right mt-3">
            <b-btn variant="warning mr-2">Discard</b-btn>
            <b-btn variant="success">Save</b-btn>
        </div>
    </ContentWrapper>
</template>
