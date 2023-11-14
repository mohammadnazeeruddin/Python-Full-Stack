Template.ecommerceOrders.onRendered(function() {

    $('#datatable-orders').dataTable({
        responsive: true
    });

})

Template.ecommerceOrders.onDestroyed(function() {
    $('#datatable-orders_wrapper').remove()
})
