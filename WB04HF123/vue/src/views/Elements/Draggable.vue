<template>
    <ContentWrapper>
        <div class="content-heading">
            <div>Vue Draggable
                <small>Vue component allowing drag-and-drop sorting in sync with View-Model. Based on Sortable.js</small>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <p>List 1 Draggable</p>
                <div class="list-group list-group-flush">
                    <draggable v-model="list" class="dragArea" :options="{group:'people'}">
                        <div class="list-group-item" v-for="element in list">{{element.name}}</div>
                    </draggable>
                </div>
            </div>
            <div class="col-md-6">
                <p>List 2 Draggable</p>
                <div class="list-group list-group-flush">
                    <draggable v-model="list2" class="dragArea" :options="{group:'people'}">
                        <div class="list-group-item" v-for="element in list2">{{element.name}}</div>
                    </draggable>
                </div>
            </div>
        </div>

        <div class="mt-4">
            <b-btn class="mr-1" @click="add()">Add</b-btn>
            <b-btn @click="replace()">Replace</b-btn>
        </div>

    </ContentWrapper>
</template>
<script>

    import draggable from 'vuedraggable'
    export default {
        components: {
            draggable
        },
        data() {
            return {
                list: [{
                    name: 'Gene Davidson'
                }, {
                    name: 'Candice Hamilton'
                }, {
                    name: 'Lynn Washington'
                }, {
                    name: 'Timmothy Young'
                }, {
                    name: 'Julia Davis'
                }],
                list2: [{
                    name: 'Bruce Stevens'
                }, {
                    name: 'Tracy Woods'
                }, {
                    name: 'Mattie Neal'
                }, {
                    name: 'Bobbie Jenkins'
                }, {
                    name: 'Erica Peterson'
                }]
            }
        },
        methods: {
            add: function() {
                this.list.push({
                    name: 'Darren Perez'
                });
            },
            replace: function() {
                this.list = [{
                    name: 'Evelyn Holmes'
                }]
            }
        }
    }

</script>
