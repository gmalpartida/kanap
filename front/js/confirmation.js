
window.addEventListener('load', populate_page);

function get_order_id(){
    const params = new URLSearchParams(window.location.search);
    return params.get('orderId');
}

function populate_page(){
    let orderId = get_order_id();

    document.getElementById('orderId').textContent = orderId;
}