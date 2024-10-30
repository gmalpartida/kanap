window.addEventListener('load', get_product);
document.getElementById('addToCart').addEventListener('click', add_to_cart);

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

function create_img_element(product){
    img = document.createElement('img');
    img.src = product.imageUrl;
    img.alt = product.altTxt;
    return img;
}

function populate_colors(product){
    select = document.getElementById('colors');
    for (let i = 0; i < product.colors.length; i++){
        option = document.createElement('option');
        option.value = product.colors[i];
        option.innerHTML = product.colors[i];
        select.appendChild(option);
    }
}

function populate_page(product){
    img = create_img_element(product);
    img_div = document.getElementsByClassName('item__img');
    img_div[0].appendChild(img);

    h1 = document.getElementById('title');
    h1.textContent = product.name;

    span = document.getElementById('price');
    span.textContent = product.price;

    p = document.getElementById('description');
    p.textContent = product.description;

    populate_colors(product);
}

function add_to_cart(){
    product_id = get_product_id();
    color = document.getElementById('colors').value;
    quantity = document.getElementById('quantity').value;

    if (0 >= quantity){
        alert('Please, select at least 1 item.');
        document.getElementById('quantity').focus();
    }
    else if (color == ''){
        alert('Please select a color.');
        document.getElementById('colors').focus();
    }
    else{
        key = product_id + color;

        product_in_cart = JSON.parse(localStorage.getItem(key));

        if (null == product_in_cart){
            product_in_cart = {'product_id':product_id, 'color':color, 'quantity':quantity};
        }
        else{
            product_in_cart.quantity = parseInt(product_in_cart.quantity) + parseInt(quantity);
        }   

        localStorage.setItem(key, JSON.stringify(product_in_cart));    
        console.log(localStorage);
    }
}