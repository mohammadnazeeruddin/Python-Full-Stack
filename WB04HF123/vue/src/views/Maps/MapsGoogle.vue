<template>
    <ContentWrapper>
        <div class="content-heading">
            <div>Google Maps
                <small>Google maps component for vue with 2-way data binding</small>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-6">
                <div class="card card-default">
                    <div class="card-header">Classic Map</div>
                    <div class="card-body">
                        <GmapMap
                          :center="center"
                          :zoom="14"
                          map-type-id="terrain"
                          class="gmap"
                        >
                          <GmapMarker
                            :key="index"
                            v-for="(m, index) in markers"
                            :position="m.position"
                            :clickable="true"
                            :draggable="true"
                            @click="center=m.position"
                          />
                        </GmapMap>
                    </div>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="card card-default">
                    <div class="card-header">Custom zoom</div>
                    <div class="card-body">
                        <GmapMap
                          :center="center"
                          :zoom="19"
                          map-type-id="terrain"
                          class="gmap"
                        >
                          <GmapMarker
                            :key="index"
                            v-for="(m, index) in markers"
                            :position="m.position"
                            :clickable="true"
                            :draggable="true"
                            @click="center=m.position"
                          />
                        </GmapMap>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-6">
                <div class="card card-default">
                    <div class="card-header">Different Map Type</div>
                    <div class="card-body">
                        <GmapMap
                          :center="center"
                          :zoom="14"
                          map-type-id="satellite"
                          class="gmap"
                        >
                          <GmapMarker
                            :key="index"
                            v-for="(m, index) in markers"
                            :position="m.position"
                            :clickable="true"
                            :draggable="true"
                            @click="center=m.position"
                          />
                        </GmapMap>
                    </div>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="card card-default">
                    <div class="card-header">Multiple Addresses</div>
                    <div class="card-body">
                        <GmapMap
                          :center="center"
                          :zoom="14"
                          map-type-id="terrain"
                          class="gmap"
                        >
                          <GmapMarker
                            :key="index"
                            v-for="(m, index) in markers2"
                            :position="m.position"
                            :clickable="true"
                            :draggable="true"
                            @click="center=m.position"
                          />
                        </GmapMap>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-12">
                <div class="card card-default">
                    <div class="card-header">Styled Maps</div>
                    <div class="card-body">
                        <GmapMap
                          :center="center"
                          :zoom="14"
                          map-type-id="terrain"
                          class="gmap"
                          :options="mapStyle"
                        >
                          <GmapMarker
                            :key="index"
                            v-for="(m, index) in markers2"
                            :position="m.position"
                            :clickable="true"
                            :draggable="true"
                            @click="center=m.position"
                          />
                        </GmapMap>
                    </div>
                </div>
            </div>
        </div>
    </ContentWrapper>
</template>
<script>
    import Vue from 'vue'
    import * as VueGoogleMaps from 'vue2-google-maps'

    Vue.use(VueGoogleMaps, {
        load: {
            key: 'AIzaSyBNs42Rt_CyxAqdbIBK0a5Ut83QiauESPA'
        }
    });

    export default {
        data() {
            return {
                center: {
                    lat:33.790807,
                    lng:-117.835734
                },
                markers: [
                    { position: { lat:33.790807, lng:-117.835734 } }
                ],
                markers2: [
                    { position: { lat: 33.7906731, lng: -117.8357194 } },
                    { position: { lat: 33.7928273, lng: -117.8360953 } }
                ],
                // Get more styles from http://snazzymaps.com/style/29/light-monochrome
                // - Just replace and assign to 'MapStyles' the new style array
                mapStyle: { styles : [{featureType:'water',stylers:[{visibility:'on'},{color:'#bdd1f9'}]},{featureType:'all',elementType:'labels.text.fill',stylers:[{color:'#334165'}]},{featureType:'landscape',stylers:[{color:'#e9ebf1'}]},{featureType:'road.highway',elementType:'geometry',stylers:[{color:'#c5c6c6'}]},{featureType:'road.arterial',elementType:'geometry',stylers:[{color:'#fff'}]},{featureType:'road.local',elementType:'geometry',stylers:[{color:'#fff'}]},{featureType:'transit',elementType:'geometry',stylers:[{color:'#d8dbe0'}]},{featureType:'poi',elementType:'geometry',stylers:[{color:'#cfd5e0'}]},{featureType:'administrative',stylers:[{visibility:'on'},{lightness:33}]},{featureType:'poi.park',elementType:'labels',stylers:[{visibility:'on'},{lightness:20}]},{featureType:'road',stylers:[{color:'#d8dbe0',lightness:20}]}]
                }
            }
        }
    }
</script>
