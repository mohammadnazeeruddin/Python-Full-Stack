Template.ecommerceProducts.onRendered(function() {

    $('#datatable-products').DataTable({
        responsive: true
    });

})

Template.ecommerceProducts.onDestroyed(function() {
    $('#datatable-products_wrapper').remove()
})
