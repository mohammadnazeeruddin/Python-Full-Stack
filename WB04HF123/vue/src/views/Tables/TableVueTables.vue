<template>
    <ContentWrapper>
        <div class="content-heading">
            <div>Vue Tables
                <small>Vue.js 2 grid components</small>
            </div>
        </div>
        <div class="text-right">
            <b-btn @click="clear()" class="mr-2">Clear Table</b-btn>
            <b-btn @click="reload()">Reload Table</b-btn>
        </div>

        <v-client-table :data="tableData" :columns="columns" :options="options">
          <template slot="action" slot-scope="props">
            <div>
              <b-btn variant="outline-info mr-2" class="btn-xs" @click.prevent="edit(props.row)">edit</b-btn>
              <b-btn variant="outline-danger" class="btn-xs" @click.prevent="remove(props.row)">remove</b-btn>
            </div>
          </template>
          <template slot="child_row" slot-scope="props">
            <div><strong>Platform:</strong> {{props.row.platform}}</div>
            <div><strong>Grade:</strong> {{props.row.grade}}</div>
          </template>
        </v-client-table>

    </ContentWrapper>
</template>
<script>
    import Vue from 'vue';
    import { ClientTable } from 'vue-tables-2';

    Vue.use(ClientTable);

    const tableData = [
        {"engine": "Trident", "browser": "Internet Explorer 4.0", "platform": "Win 95+", "version": "4", "grade": "X"},
        {"engine": "Trident","browser": "Internet Explorer 5.0","platform": "Win 95+","version": "5","grade": "C"},
        {"engine": "Trident","browser": "Internet Explorer 5.5","platform": "Win 95+","version": "5.5","grade": "A"},
        {"engine": "Trident","browser": "Internet Explorer 6","platform": "Win 98+","version": "6","grade": "A"},
        {"engine": "Trident", "browser": "Internet Explorer 7", "platform": "Win XP SP2+", "version": "7", "grade": "A"},
        {"engine": "Trident", "browser": "AOL browser (AOL desktop)", "platform": "Win XP", "version": "6", "grade": "A"},
        {"engine": "Gecko", "browser": "Firefox 1.0", "platform": "Win 98+ / OSX.2+", "version": "1.7", "grade": "A"},
        {"engine": "Gecko", "browser": "Firefox 1.5", "platform": "Win 98+ / OSX.2+", "version": "1.8", "grade": "A"},
        {"engine": "Gecko", "browser": "Firefox 2.0", "platform": "Win 98+ / OSX.2+", "version": "1.8", "grade": "A"},
        {"engine": "Gecko", "browser": "Firefox 3.0", "platform": "Win 2k+ / OSX.3+", "version": "1.9", "grade": "A"},
        {"engine": "Gecko", "browser": "Camino 1.0", "platform": "OSX.2+", "version": "1.8", "grade": "A"},
        {"engine": "Gecko", "browser": "Camino 1.5", "platform": "OSX.3+", "version": "1.8", "grade": "A"},
        {"engine": "Trident", "browser": "Internet Explorer 4.0", "platform": "Win 95+", "version": "4", "grade": "X"},
        {"engine": "Trident","browser": "Internet Explorer 5.0","platform": "Win 95+","version": "5","grade": "C"},
        {"engine": "Trident","browser": "Internet Explorer 5.5","platform": "Win 95+","version": "5.5","grade": "A"},
        {"engine": "Trident","browser": "Internet Explorer 6","platform": "Win 98+","version": "6","grade": "A"},
        {"engine": "Trident", "browser": "Internet Explorer 7", "platform": "Win XP SP2+", "version": "7", "grade": "A"},
        {"engine": "Trident", "browser": "AOL browser (AOL desktop)", "platform": "Win XP", "version": "6", "grade": "A"},
        {"engine": "Gecko", "browser": "Firefox 1.0", "platform": "Win 98+ / OSX.2+", "version": "1.7", "grade": "A"},
        {"engine": "Gecko", "browser": "Firefox 1.5", "platform": "Win 98+ / OSX.2+", "version": "1.8", "grade": "A"},
        {"engine": "Gecko", "browser": "Firefox 2.0", "platform": "Win 98+ / OSX.2+", "version": "1.8", "grade": "A"},
        {"engine": "Gecko", "browser": "Firefox 3.0", "platform": "Win 2k+ / OSX.3+", "version": "1.9", "grade": "A"},
        {"engine": "Gecko", "browser": "Camino 1.0", "platform": "OSX.2+", "version": "1.8", "grade": "A"},
        {"engine": "Gecko", "browser": "Camino 1.5", "platform": "OSX.3+", "version": "1.8", "grade": "A"},
        {"engine": "Trident", "browser": "AOL browser (AOL desktop)", "platform": "Win XP", "version": "6", "grade": "A"}
    ]

    export default {
        components: {
            ClientTable
        },
        data() {
            return {
                tableData: [],
                columns: ['engine', 'browser', 'version', 'action'],
                options: {
                  pagination: { chunk: 5 },
                  sortIcon: {
                    is: 'fa-sort',
                    base: 'fas',
                    up: 'fa-sort-up',
                    down: 'fa-sort-down'
                  }
                }
            }
        },
        created () {
            // Add IDs for child rows functionality
            this.tableData = tableData.map((item, index) => {
                item['id'] = index
                return item
            })
        },
        methods: {
            edit (row) {
              alert(`Editing row id: ${row.id}`)
            },
            remove (row) {
                this.tableData = this.tableData.filter(item => (row.id !== item.id));
            },
            reload() {
                this.tableData = tableData;
            },
            clear() {
                this.tableData = [];
            }
        }
    }
</script>
