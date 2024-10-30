window.addEventListener('load', populate_page);

async function populate_page(){
    console.log('cart.js populate_page')
    for (let i = 0; i < localStorage.length; i++){
        product_key = localStorage.key(i);
        product_in_cart = JSON.parse(localStorage.getItem(product_key));

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
    article = document.createElement('article');
    article.classList.add('cart__item');
    article.setAttribute('data-id', product_in_cart.product_id);
    article.setAttribute('data-color', product_in_cart.color)
    return article;
}

function create_cart_item_img_element(product){
    div = document.createElement('div');
    div.classList.add('cart__item__img');
    img = document.createElement('img');
    img.src = product.imageUrl;
    div.appendChild(img);
    return div;
}

function create_cart_item_content_description_element(product_in_cart, product){
    div = document.createElement('div');
    div.classList.add('cart__item__content__description');
    h2_name = document.createElement('h2');
    h2_name.textContent = product.name;
    p_color = document.createElement('p');
    p_price = document.createElement('p');

    div.appendChild(h2_name);
    div.appendChild(p_color);
    div.appendChild(p_price);

    return div;
}

function create_cart_item_content(product_in_cart, product){
    div = document.createElement('div');
    div.classList.add('cart__item__content');

    description_element = create_cart_item_content_description_element(product_in_cart, product);

    div.appendChild(description_element);

    return div;
}

function populate_cart(product_in_cart, product){
    console.log(product_in_cart);
    console.log(product);

    article = create_article_element(product_in_cart, product);

    cart_item_img = create_cart_item_img_element(product);
    cart_item_content = create_cart_item_content(product_in_cart, product);

    cart_items = document.getElementById('cart__items');

    cart_items.appendChild(article);

    article.appendChild(cart_item_img);
    article.appendChild(cart_item_content);
}