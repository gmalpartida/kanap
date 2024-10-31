window.addEventListener('load', populate_page);

async function populate_page(){
    console.log('cart.js populate_page')
    for (let i = 0; i < localStorage.length; i++){
        let product_key = localStorage.key(i);
        let product_in_cart = JSON.parse(localStorage.getItem(product_key));

        const response = await fetch('http://localhost:3000/api/products/' + product_in_cart.product_id, {
            method: 'GET',
            headers: {'Content-Type': 'application/json' }
        });

        if (!response.ok){
            throw new Error('Response Status: $(response.status)');
        }
        const product = await response.json();

        populate_cart(product_in_cart, product);

    }
}

function create_article_element(product_in_cart, product){
    let article = document.createElement('article');
    article.classList.add('cart__item');
    article.setAttribute('data-id', product_in_cart.product_id);
    article.setAttribute('data-color', product_in_cart.color)
    return article;
}

function create_cart_item_img_element(product){
    let div = document.createElement('div');
    div.classList.add('cart__item__img');
    let img = document.createElement('img');
    img.src = product.imageUrl;
    div.appendChild(img);
    return div;
}

function create_cart_item_content_description_element(product_in_cart, product){
    let div = document.createElement('div');
    div.classList.add('cart__item__content__description');
    let h2_name = document.createElement('h2');
    h2_name.textContent = product.name;
    let p_color = document.createElement('p');
    p_color.textContent = product_in_cart.color;
    let p_price = document.createElement('p');
    p_price.textContent = '€' + product.price;

    div.appendChild(h2_name);
    div.appendChild(p_color);
    div.appendChild(p_price);

    return div;
}

function create_cart_item_content(product_in_cart, product){
    let div = document.createElement('div');
    div.classList.add('cart__item__content');
    description_element = create_cart_item_content_description_element(product_in_cart, product);
    let cart_item_content_settings = create_cart_item_content_setting_element(product_in_cart, product);
    div.appendChild(description_element);
    div.appendChild(cart_item_content_settings);

    return div;
}

function create_cart_item_content_setting_element(product_in_cart, product){
    //<div class="cart__item__content__settings">
    let cart_item_content_settings = document.createElement('div');
    cart_item_content_settings.classList.add('cart__item__content__settings');

    //<div class="cart__item__content__settings__quantity">
    let cart_item_content_settings_quantity = document.createElement('div');
    cart_item_content_settings_quantity.classList.add('cart__item__content__settings__quantity');
    cart_item_content_settings.appendChild(cart_item_content_settings_quantity);

    //<p>Quantity : </p>
    let quantity = document.createElement('p');
    quantity.textContent = 'Quantity : ';
    cart_item_content_settings_quantity.appendChild(quantity);

    //<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
    let input_element = document.createElement('input');
    input_element.classList.add('itemQuantity');
    input_element.setAttribute('type', 'number');
    input_element.setAttribute('name', 'itemQuantity');
    input_element.setAttribute('min', '1');
    input_element.setAttribute('max', '100');
    input_element.setAttribute('value', product_in_cart.quantity);
    cart_item_content_settings_quantity.appendChild(input_element);

    //<div class="cart__item__content__settings__delete">
      //  <p class="deleteItem">Delete</p>
    //</div>
    let cart_item_content_settings_delete = document.createElement('div');
    cart_item_content_settings_delete.classList.add('cart__item__content__settings__delete');    
    cart_item_content_settings.appendChild(cart_item_content_settings_delete);
    cart_item_content_settings_delete.addEventListener('click', delete_cart_item);

    let delete_item = document.createElement('p');
    delete_item.classList.add('deleteItem');
    delete_item.textContent = 'Delete';
    cart_item_content_settings_delete.appendChild(delete_item);


    return cart_item_content_settings;
}

function delete_cart_item(){
    console.log(this);
    let product_id = this.parentNode.parentNode.parentNode.getAttribute('data-id');
    let product_color = this.parentNode.parentNode.parentNode.getAttribute('data-color');
    console.log(this.parentNode.parentNode.parentNode);
    key = product_id + product_color;

    localStorage.removeItem(key);
    location.reload();
}

function populate_cart(product_in_cart, product){

    let article = create_article_element(product_in_cart, product);

    let cart_item_img = create_cart_item_img_element(product);
    let cart_item_content = create_cart_item_content(product_in_cart, product);

    let cart_items = document.getElementById('cart__items');

    cart_items.appendChild(article);

    article.appendChild(cart_item_img);
    article.appendChild(cart_item_content);
}