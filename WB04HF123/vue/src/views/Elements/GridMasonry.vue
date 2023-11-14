<template>
    <ContentWrapper>
        <div class="container">
            <p>
                <strong class="mr-1">Cards</strong>can be organized into Masonry-like columns with just CSS by wrapping them in<code>.card-columns.</code>Cards are built with CSS column properties instead of flexbox for easier alignment. Cards are ordered from top to bottom
                and left to right.</p>
            <b-card-group columns>
                <b-card class="mb-4"
                    title="Card title that wraps to a new line"
                    img-src="img/bg1.jpg"
                    img-alt="Card image cap"
                    img-fluid
                    img-top>
                        <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                </b-card>
                <b-card class="mb-4"
                    title="Card title"
                    img-src="img/bg2.jpg"
                    img-alt="Card image cap"
                    img-fluid
                    img-top>
                    <p class="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
                    <p class="card-text">
                        <span class="text-sm text-muted">Last updated 3 mins ago</span>
                    </p>
                </b-card>
                <b-card class="p-3 mb-4">
                    <blockquote class="blockquote mb-0">
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
                        <footer class="blockquote-footer">
                            <div class="text-sm text-muted">Someone famous in
                                <cite title="Source Title">Source Title</cite>
                            </div>
                        </footer>
                    </blockquote>
                </b-card>
                <b-card bg-variant="inverse" class="p-3 text-center mb-4 border-0">
                    <blockquote class="mb-0">
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat.</p>
                        <footer>
                            <div class="text-sm">Someone famous in
                                <cite title="Source Title">Source Title</cite>
                            </div>
                        </footer>
                    </blockquote>
                </b-card>
                <b-card class="text-center mb-4" title="Card title">
                    <p class="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
                    <p class="card-text">
                        <span class="text-sm text-muted">Last updated 3 mins ago</span>
                    </p>
                </b-card>
                <b-card class="card mb-4"
                    no-body
                    img-fluid
                    img-src="img/bg3.jpg"
                    img-alt="Card image">
                </b-card>
                <b-card class="p-3 text-right mb-4" no-body>
                    <blockquote class="mb-0">
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
                        <footer>
                            <div class="text-sm text-muted">Someone famous in
                                <cite title="Source Title">Source Title</cite>
                            </div>
                        </footer>
                    </blockquote>
                </b-card>
                <b-card class="mb-4" title="Card title">
                    <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.</p>
                    <p class="card-text">
                        <span class="text-sm text-muted">Last updated 3 mins ago</span>
                    </p>
                </b-card>
                <b-card class="mb-4"
                    title="Card title that wraps to a new line"
                    img-src="img/bg1.jpg"
                    img-alt="Card image cap"
                    img-top
                    img-fluid>
                    <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                </b-card>
                <b-card bg-variant="primary" class="p-3 text-center mb-4" no-body>
                    <blockquote class="mb-0">
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat.</p>
                        <footer>
                            <div class="text-sm">Someone famous in
                                <cite title="Source Title">Source Title</cite>
                            </div>
                        </footer>
                    </blockquote>
                </b-card>
                <b-card class="mb-4"
                    no-body
                    img-src="img/bg4.jpg"
                    img-alt="Card image cap"
                    img-top
                    img-fluid>
                </b-card>
                <b-card bg-variant="inverse" class="p-3 text-center mb-4 border-0" no-body>
                    <blockquote class="mb-0">
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat.</p>
                        <footer>
                            <div class="text-sm">Someone famous in
                                <cite title="Source Title">Source Title</cite>
                            </div>
                        </footer>
                    </blockquote>
                </b-card>
            </b-card-group>
        </div>
    </ContentWrapper>
</template>
