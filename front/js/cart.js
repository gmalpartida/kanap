let product_list = [];

window.addEventListener('load', populate_page);
document.getElementById('firstName').addEventListener('input', validate_name);
document.getElementById('lastName').addEventListener('input', validate_name);
document.getElementById('email').addEventListener('input', validate_email);

async function populate_page(){
    let cart_totals = {total_quantity:0, total_price:0.0};
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
        product_list.push(product);
        let results = populate_cart(product_in_cart, product);
        cart_totals.total_quantity += results.total_quantity;
        cart_totals.total_price += results.total_price;
        populate_cart_totals(cart_totals);

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

function create_cart_item_content_settings_quantity(){
    let cart_item_content_settings_quantity = document.createElement('div');
    cart_item_content_settings_quantity.classList.add('cart__item__content__settings__quantity');
    
    return cart_item_content_settings_quantity;
}

function create_input_quantity_element(product_in_cart){
    let input_element = document.createElement('input');
    input_element.classList.add('itemQuantity');
    input_element.setAttribute('type', 'number');
    input_element.setAttribute('name', 'itemQuantity');
    input_element.setAttribute('min', '1');
    input_element.setAttribute('max', '100');
    input_element.setAttribute('value', product_in_cart.quantity);
    return input_element;
}

function create_cart_item_content_settings_delete_element(){
    let cart_item_content_settings_delete = document.createElement('div');
    cart_item_content_settings_delete.classList.add('cart__item__content__settings__delete');    
    cart_item_content_settings_delete.addEventListener('click', delete_cart_item);
    return cart_item_content_settings_delete;
}


function create_cart_item_content_setting_element(product_in_cart, product){
    //<div class="cart__item__content__settings">
    let cart_item_content_settings = document.createElement('div');
    cart_item_content_settings.classList.add('cart__item__content__settings');

    //<div class="cart__item__content__settings__quantity">
    let cart_item_content_settings_quantity = create_cart_item_content_settings_quantity();
    cart_item_content_settings.appendChild(cart_item_content_settings_quantity);

    //<p>Quantity : </p>
    let quantity = document.createElement('p');
    quantity.textContent = 'Quantity : ';
    cart_item_content_settings_quantity.appendChild(quantity);

    //<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
    let input_element = create_input_quantity_element(product_in_cart);
    input_element.addEventListener('change', quantity_change);
    cart_item_content_settings_quantity.appendChild(input_element);

    //<div class="cart__item__content__settings__delete">
      //  <p class="deleteItem">Delete</p>
    //</div>
    let cart_item_content_settings_delete = create_cart_item_content_settings_delete_element();
    cart_item_content_settings.appendChild(cart_item_content_settings_delete);

    let delete_item = document.createElement('p');
    delete_item.classList.add('deleteItem');
    delete_item.textContent = 'Delete';
    cart_item_content_settings_delete.appendChild(delete_item);

    return cart_item_content_settings;
}

function delete_cart_item(){
    let product_id = this.parentNode.parentNode.parentNode.getAttribute('data-id');
    let product_color = this.parentNode.parentNode.parentNode.getAttribute('data-color');
    key = product_id + product_color;

    localStorage.removeItem(key);
    location.reload();
    if (0 == localStorage.length){
        alert('Your cart will be empty after deleting this last item.  You will be taken back to the Home page.');
        location.href = './index.html';
    }
}

function populate_cart(product_in_cart, product){

    let article = create_article_element(product_in_cart, product);

    let cart_item_img = create_cart_item_img_element(product);
    let cart_item_content = create_cart_item_content(product_in_cart, product);

    let cart_items = document.getElementById('cart__items');

    cart_items.appendChild(article);

    article.appendChild(cart_item_img);
    article.appendChild(cart_item_content);

    let total_quantity = parseInt(product_in_cart.quantity);
    let total_price = parseFloat(product.price) * total_quantity;

    return {total_quantity: total_quantity, total_price: total_price};
}

function populate_cart_totals(cart_totals){

    document.getElementById('totalQuantity').textContent =  cart_totals.total_quantity;
    document.getElementById('totalPrice').textContent = cart_totals.total_price;

}

function calculate_cart_totals(){
    let cart_totals = {total_quantity: 0, total_price: 0.0};
    for (let i = 0; i < localStorage.length; i++)
    {
        let key = localStorage.key(i);
        let product_in_cart = JSON.parse(localStorage.getItem(key));
        cart_totals.total_quantity += product_in_cart.quantity;
        
        let product = product_list.find(p => p._id == product_in_cart.product_id);

        cart_totals.total_price += product_in_cart.quantity * product.price;
        
    }
    return cart_totals;
}

function quantity_change(){
    let current_quantity = parseInt(this.value);
    let product_id = this.parentNode.parentNode.parentNode.parentNode.getAttribute('data-id');
    let color_id = this.parentNode.parentNode.parentNode.parentNode.getAttribute('data-color');

    let key = product_id + color_id;
    let product_in_cart = JSON.parse(localStorage.getItem(key));
    product_in_cart.quantity = current_quantity;
    localStorage.setItem(key, JSON.stringify(product_in_cart));

    let cart_totals = calculate_cart_totals();

    populate_cart_totals(cart_totals);
}

function is_valid_name(name){
    // rule for length of name
    result = name.length > 1 && name.length <= 50;

    // only letters, hyphen and apostrophe allowed
    if (result){
        for(let i = 0; i < name.length; i++){            
            let c = name[i];
            
            result = result && ((c >= 'A' && c <= 'z') || c == '-' || c == '\'');
            if (!result)
                break;
        }
    }

    return result;
}

function validate_name(){
    let is_valid = is_valid_name(this.value);
    if (!is_valid){
        if (this.id == 'firstName')
            document.getElementById('firstNameErrorMsg').textContent = 'Only letters, hyphen and apostrophes allowed in name.';
        else
            document.getElementById('lastNameErrorMsg').textContent = 'Only letters, hyphen and apostrophes allowed in name.';
    }
    else
        if (this.id == 'firstName')
            document.getElementById('firstNameErrorMsg').textContent = '';
        else
            document.getElementById('lastNameErrorMsg').textContent = '';
}

function validate_email(){
    let is_valid = true;
    if (!is_valid){
        document.getElementById('emailErrorMsg').textContent = 'Invalid email address.';
    }
    else
        document.getElementById('emailErrorMsg').textContent = '';
}

document.querySelector('form').addEventListener('submit', async (evt) => {
    evt.preventDefault();

    let contact = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        email: document.getElementById('email').value
    };

    let products = [];

    for (let i = 0; i < localStorage.length; i++){
        let key = localStorage.key(i);
        let product_in_cart = JSON.parse(localStorage.getItem(key));
        products.push(product_in_cart.product_id);
    }

    let formData = {'contact': contact, 'products':products};

    const response = await fetch('http://localhost:3000/api/products/order', {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });

    if (!response.ok){
        throw new Error('Response Status: $(response.status)');
    }

    const product_table = await response.json();

    location.href = './confirmation.html?orderId=' + product_table.orderId;

  });

