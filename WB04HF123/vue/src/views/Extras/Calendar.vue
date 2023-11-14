<template>
    <ContentWrapper>
        <div class="content-heading">
            <div>Vue Simple Calendar
                <small>Vue-based, flexible calendar grid supporting multi-day events, localization, and more! See repo for documentation.</small>
            </div>
        </div>
        <!-- START row-->
        <div class="row">
            <div class="col-xl-3 col-lg-4">
                <b-card header="New Event">
                        <div class="form-group">
                            <label>Title</label>
                            <input class="form-control" type="email" placeholder="Event title" v-model="newEventTitle" />
                        </div>
                        <div class="form-group">
                            <label>Start Date</label>
                            <input class="form-control" type="date"
                                :value="newEventStart && newEventStart.toISOString().split('T')[0]"
                                @input="newEventStart = $event.target.valueAsDate"/>
                        </div>
                        <div class="form-group">
                            <label>End Date</label>
                            <input class="form-control" type="date"
                                :value="newEventEnd && newEventEnd.toISOString().split('T')[0]"
                                @input="newEventEnd = $event.target.valueAsDate">
                        </div>
                        <b-btn variant="primary" @click="addNewEvent">Add Event</b-btn>
                </b-card>
            </div>
            <div class="col-xl-9 col-lg-8">
                <b-card class="d-flex">
                    <calendar-view
                        class="holiday-us-traditional holiday-us-official"
                        style="min-height: 600px"
                        :events="events"
                        :show-date="showDate"
                        :time-format-options="{hour: 'numeric', minute:'2-digit'}"
                        :display-period-uom="displayPeriodUom"
                        :enable-drag-drop="true"
                        :show-event-times="true"
                        :display-period-count="1"
                        :starting-day-of-week="1"
                        :locale="getDefaultBrowserLocale()"
                        @drop-on-date="onDrop"
                        @click-date="onClickDay"
                        @click-event="onClickEvent"
                        @show-date-change="setShowDate">

                        <div slot="header"
                            slot-scope="{ headerProps }"
                            class="d-flex flex-wrap justify-content-center justify-content-md-between align-items-center mb-3">

                            <div>
                                <b-btn-group>
                                    <b-btn
                                        variant="secondary"
                                        size="sm"
                                        :pressed="displayPeriodUom === 'year'"
                                        @click="displayPeriodUom = 'year'">
                                            Year
                                    </b-btn>
                                    <b-btn
                                        variant="secondary"
                                        size="sm"
                                        :pressed="displayPeriodUom === 'month'"
                                        @click="displayPeriodUom = 'month'">
                                            Month
                                    </b-btn>
                                    <b-btn
                                        variant="secondary"
                                        size="sm"
                                        :pressed="displayPeriodUom === 'week'"
                                        @click="displayPeriodUom = 'week'">
                                            Week
                                    </b-btn>
                                </b-btn-group>
                                <b-btn class="ml-1" variant="primary" size="sm" @click="setShowDate(headerProps.currentPeriod)">Today</b-btn>
                            </div>

                            <div>
                                <p class="lead m-0">{{ formatHeader(headerProps) }}</p>
                            </div>

                            <div>
                                <b-btn-group>
                                    <b-btn
                                        variant="secondary"
                                        size="sm"
                                        :disabled="!headerProps.previousYear"
                                        @click="setShowDate(headerProps.previousYear)">
                                            <em class="fa fa-angle-double-left text-muted"></em>
                                    </b-btn>
                                    <b-btn
                                        variant="secondary"
                                        size="sm"
                                        :disabled="!headerProps.previousPeriod"
                                        @click="setShowDate(headerProps.previousPeriod)">
                                            <em class="fa fa-chevron-left text-muted"></em>
                                    </b-btn>
                                    <b-btn
                                        variant="secondary"
                                        size="sm"
                                        :disabled="!headerProps.nextPeriod"
                                        @click="setShowDate(headerProps.nextPeriod)">
                                            <em class="fa fa-chevron-right text-muted"></em>
                                    </b-btn>
                                    <b-btn
                                        variant="secondary"
                                        size="sm"
                                        :disabled="!headerProps.nextYear"
                                        @click="setShowDate(headerProps.nextYear)">
                                            <em class="fa fa-angle-double-right text-muted"></em>
                                    </b-btn>
                                </b-btn-group>
                            </div>

                        </div>

                    </calendar-view>
                </b-card>
            </div>
        </div>
        <!-- END row-->
    </ContentWrapper>
</template>

<script>
    import {
        CalendarView,
        CalendarViewHeader,
        CalendarMathMixin,
    } from "vue-simple-calendar"
    require("vue-simple-calendar/static/css/default.css")
    require("vue-simple-calendar/static/css/holidays-us.css")

    export default {
        components: {
            CalendarView
        },
        mixins: [CalendarMathMixin],
        data () {
            return {
                newEventTitle: 'Event demo',
                newEventStart: new Date(),
                newEventEnd: new Date(),
                showDate: new Date(),
                displayPeriodUom: 'month',
                events: [
                    {
                        id: "e0",
                        startDate: "2018-01-05",
                        classes: "bg-info"
                    },
                    {
                        id: "e1",
                        startDate: this.currentMonth(15, 18, 30),
                        classes: "bg-info"
                    },
                    {
                        id: "e2",
                        startDate: this.currentMonth(15),
                        title: "Single-day event with a long title",
                        classes: "bg-info"
                    },
                    {
                        id: "e3",
                        startDate: this.currentMonth(7, 9, 25),
                        endDate: this.currentMonth(10, 16, 30),
                        classes: "bg-info",
                        title: "Multi-day event with a long title and times",
                    },
                    {
                        id: "e4",
                        startDate: this.currentMonth(20),
                        title: "My Birthday!",
                        classes: "bg-pink birthday",
                        url: "https://en.wikipedia.org/wiki/Birthday",
                    },
                    {
                        id: "e5",
                        startDate: this.currentMonth(5),
                        endDate: this.currentMonth(12),
                        title: "Multi-day event",
                        classes: "bg-purple",
                    },
                    {
                        id: "foo",
                        startDate: this.currentMonth(29),
                        title: "Same day 1",
                        classes: "bg-info"
                    },
                    {
                        id: "e6",
                        startDate: this.currentMonth(29),
                        title: "Same day 2",
                        classes: "bg-pink",
                    },
                    {
                        id: "e7",
                        startDate: this.currentMonth(29),
                        title: "Same day 3",
                        classes: "bg-info"
                    },
                    {
                        id: "e8",
                        startDate: this.currentMonth(29),
                        title: "Same day 4",
                        classes: "bg-pink",
                    },
                    {
                        id: "e9",
                        startDate: this.currentMonth(29),
                        title: "Same day 5",
                        classes: "bg-info"
                    },
                    {
                        id: "e10",
                        startDate: this.currentMonth(29),
                        title: "Same day 6",
                        classes: "bg-pink",
                    },
                    {
                        id: "e11",
                        startDate: this.currentMonth(29),
                        title: "Same day 7",
                        classes: "bg-info"
                    },
                ]
            }
        },
        methods: {
            currentMonth(d, h = 0, m = 0) {
                const now = new Date()
                return new Date(now.getFullYear(), now.getMonth(), d, h, m)
            },
            setShowDate(d) {
                this.showDate = d
            },
            // Creates the text to render the date range for the header
            formatHeader(header) {
                return this.formattedPeriod(
                    header.periodStart,
                    header.periodEnd,
                    this.displayPeriodUom,
                    header.monthNames
                )
            },
            addNewEvent() {
                if (this.newEventStart && this.newEventTitle) {
                    this.events.push({
                        startDate: this.newEventStart,
                        endDate: this.newEventEnd || this.newEventStart,
                        title: this.newEventTitle,
                        classes: 'bg-primary'
                    })
                }
            },
            onClickDay(d) {
                console.log(`You clicked: ${d}`)
            },
            onClickEvent(e) {
                console.log(`You clicked: ${e.title}`)
            },
            onDrop(event, date) {
                console.log(`You dropped ${event.id} on ${date.toLocaleDateString()}`)
                // Determine the delta between the old start date and the date chosen,
                // and apply that delta to both the start and end date to move the event.
                const eLength = this.dayDiff(event.startDate, date)
                event.originalEvent.startDate = this.addDays(event.startDate, eLength)
                event.originalEvent.endDate = this.addDays(event.endDate, eLength)
            }
        }
    }
</script>

<style>
    .cv-event { border: 0 !important; }
</style>
