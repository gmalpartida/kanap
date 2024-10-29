window.addEventListener('load', get_product);

async function get_product(){
    const product_id = get_product_id();
    const url = 'http://localhost:3000/api/products/' + product_id;
    try{
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok){
            throw new Error('Response Status: $(response.status)');
        }
        const product = await response.json();
        console.log(product);
        populate_page(product);
    }
    catch(error){
        console.error(error.message);
    }
}

function get_product_id(){
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

function populate_page(product){

}