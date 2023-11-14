<template>
    <ContentWrapper>
        <div class="content-heading">
            <div>Tables
                <small>Bootstrap Responsive tables</small>
            </div>
        </div>
        <div class="row">
            <div class="col-xl-6">

                <div class="card card-default">
                    <div class="card-header">Basic Example</div>
                    <div class="card-body">
                        <b-table responsive striped hover :items="itemsBasic"></b-table>
                    </div>
                </div>

            </div>
            <div class="col-xl-6">

                <div class="card card-default">
                    <div class="card-header">Custom Fields</div>
                    <div class="card-body">
                        <b-table responsive striped hover :items="itemsFields" :fields="fields"></b-table>
                    </div>
                </div>

            </div>
        </div>

        <div class="card card-default">
            <div class="card-header">Sortable</div>
            <div class="card-body">
                <b-table responsive striped hover :items="itemsSortable" :fields="fieldsSortable"></b-table>
            </div>
        </div>

        <div class="card card-default">
            <div class="card-header">Table styles</div>
            <div class="card-body">
                <b-form-checkbox v-model="style.striped">Striped</b-form-checkbox>
                <b-form-checkbox v-model="style.bordered">Bordered</b-form-checkbox>
                <b-form-checkbox v-model="style.outlined">Outlined</b-form-checkbox>
                <b-form-checkbox v-model="style.small">Small</b-form-checkbox>
                <b-form-checkbox v-model="style.hover">Hover</b-form-checkbox>
                <b-form-checkbox v-model="style.dark">Dark</b-form-checkbox>
                <b-form-checkbox v-model="style.fixed">Fixed</b-form-checkbox>
                <b-form-checkbox v-model="style.footClone">Foot Clone</b-form-checkbox>

                <b-table responsive  :striped="style.striped"
                         :bordered="style.bordered"
                         :outlined="style.outlined"
                         :small="style.small"
                         :hover="style.hover"
                         :dark="style.dark"
                         :fixed="style.fixed"
                         :foot-clone="style.footClone"
                         :items="itemsFields"
                         :fields="fields">
                </b-table>
            </div>
        </div>

        <div class="card card-default">
            <div class="card-header">Table Variant</div>
            <div class="card-body">
                <b-table responsive  hover :items="itemsVariant"></b-table>
            </div>
        </div>

    </ContentWrapper>
</template>
<script>
    export default {
        data() {
            return {
                itemsBasic: [
                    { isActive: true, age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
                    { isActive: false, age: 21, first_name: 'Larsen', last_name: 'Shaw' },
                    { isActive: false, age: 89, first_name: 'Geneva', last_name: 'Wilson' },
                    { isActive: true, age: 38, first_name: 'Jami', last_name: 'Carney' }
                ],
                itemsVariant: [
                    { isActive: false, age: 21, first_name: 'Larsen', last_name: 'Shaw' }, {
                        isActive: false,
                        age: 89,
                        first_name: 'Geneva',
                        last_name: 'Wilson',
                        _rowVariant: 'danger'
                    }, {
                        isActive: true,
                        age: 40,
                        first_name: 'Thor',
                        last_name: 'Macdonald',
                        _cellVariants: { isActive: 'success', age: 'info', first_name: 'warning' }
                    },
                    { isActive: false, age: 29, first_name: 'Dick', last_name: 'Dunlap' }
                ],
                // Note 'isActive' is left out and will not appear in the rendered table
                fields: ['first_name', 'last_name', 'age'],
                itemsFields: [
                    { isActive: true, age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
                    { isActive: false, age: 21, first_name: 'Larsen', last_name: 'Shaw' },
                    { isActive: false, age: 89, first_name: 'Geneva', last_name: 'Wilson' },
                    { isActive: true, age: 38, first_name: 'Jami', last_name: 'Carney' }
                ],
                // Fields with Sortable definition
                // Note 'isActive' is left out and will not appear in the rendered table
                fieldsSortable: {
                    last_name: {
                        label: 'Person last name',
                        sortable: true
                    },
                    first_name: {
                        label: 'Person first name',
                        sortable: false
                    },
                    foo: {
                        // This key overrides `foo`!
                        key: 'age',
                        label: 'Person age',
                        sortable: true
                    },
                    city: {
                        key: 'address.city'
                    },
                    'address.country': {
                        label: 'Country'
                    }
                },
                itemsSortable: [
                    { isActive: true, age: 40, first_name: 'Dickerson', last_name: 'Macdonald', address: { country: 'USA', city: 'New York' } },
                    { isActive: false, age: 21, first_name: 'Larsen', last_name: 'Shaw', address: { country: 'Canada', city: 'Toronto' } },
                    { isActive: false, age: 89, first_name: 'Geneva', last_name: 'Wilson', address: { country: 'Australia', city: 'Sydney' } },
                    { isActive: true, age: 38, first_name: 'Jami', last_name: 'Carney', address: { country: 'England', city: 'London' } }
                ],
                // Styleing demo
                style: {
                    striped: false,
                    bordered: false,
                    outlined: false,
                    small: false,
                    hover: false,
                    dark: false,
                    fixed: false,
                    footClone: false
                }
            }
        }
    }
</script>