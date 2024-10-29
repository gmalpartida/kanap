window.addEventListener('load', get_all_products);

async function get_all_products(){
    const url = 'http://localhost:3000/api/products/';
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
        const product_list = await response.json();
        console.log(product_list);
        items = document.getElementById('items');
        for (let i = 0; i < product_list.length; i++){
            product_element = create_product_element(product_list[i]);
            items.appendChild(product_element);
        }
    }
    catch(error){
        console.error(error.message);
    }
}

function create_product_element(product){
    
    product_link = document.createElement('a');

    product_link.href = './product.html?id=' + product._id;

    product_article = document.createElement('article');
    product_link.appendChild(product_article);

    return product_link;
}

