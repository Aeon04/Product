document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    console.log("Product ID from URL:", productId);

    fetch('data.json')
        .then(response => response.json())
        .then(jsonData => {
            console.log("Product data fetched:", jsonData);

            if (!productId) {
                displayError('No product ID found in the URL.');
                return;
            }

            const selectedProduct = findProductById(productId, jsonData.petProducts);
            console.log("Selected Product:", selectedProduct);

            if (!selectedProduct) {
                displayError('Product not found.');
                return;
            }

            renderProductCard(selectedProduct);
        })
        .catch(error => {
            console.error('Error loading product data:', error);
            displayError('Error loading product details.');
        });

    function findProductById(id, petProducts) {
        for (const category of petProducts) {
            const product = category.products.find(product => product.id == id);
            if (product) return product;
        }
        return null;
    }

    function renderProductCard(product) {
        const productDetailsContainer = document.getElementById('product-details');

        // Replace \n with <br> for descriptions
        const formattedDescription = product.description.replace(/\n/g, '<br>');
        const formattedDescription2 = product.description2?.replace(/\n/g, '<br>') || 'No additional description available.';

        const card = `
            <div class="product.card custom-bg rounded-xl p-6 text-center shadow">
                <div class="row align-items-center">
                    <div class="col-md-6 text-light text-start">
                        <h5 class="mb-4">${product.name}</h5>
                        <h6 class="text-white">Overview:</h6>
                        <p class="mb-3 lead">${formattedDescription}</p>
                        <p class="mb-3">${formattedDescription2}</p>
                        <h6 class="text-white mt-4">Features:</h6>
                        ${renderFeatures(product.features)}
                        <h6 class="text-white mt-4">Price:</h6>
                        <!-- Initially hidden price -->
                        <p id="selected-price" class="fw-bold fs-4" style="display: none;">₱${product.prices[0]?.price ?? 'N/A'}</p>

                        <!-- Size Buttons -->
                        <div id="size-buttons" class="d-flex flex-wrap justify-content-start mb-3">
                            ${renderSizeButtons(product.prices)}
                        </div>

                        <!-- Quantity Selector -->
                        <div id="quantity-selector" class="mt-3" style="display: none;">
                            <label for="quantity" class="text-white">Quantity:</label>
                            <input id="quantity" type="number" min="1" value="1" class="form-control w-25 mt-2" />
                        </div>

                        <div class="d-flex justify-content-start mt-4">
                            <button class="btn btn-warning me-3">Buy Now</button>
                            <button class="btn btn-dark">Add to Cart</button>
                        </div>
                    </div>
                    <div class="col-md-6 text-center">
                        <img src="${product.image ?? 'default-image.jpg'}" 
                             class="product.img img-fluid rounded" 
                             alt="${product.name}">
                    </div>
                </div>
            </div>
        `;

        productDetailsContainer.innerHTML = card;

        // Add event listeners for size buttons
        document.querySelectorAll('.size-button').forEach(button => {
            button.addEventListener('click', function () {
                // Remove 'active' class from all buttons
                document.querySelectorAll('.size-button').forEach(btn => {
                    btn.classList.remove('active');
                });

                // Add 'active' class to the clicked button
                button.classList.add('active');

                const selectedSize = button.dataset.size;
                const priceForSelectedSize = product.prices.find(
                    priceOption => priceOption.size === selectedSize
                );

                // Show the price and quantity selector
                const selectedPriceElement = document.getElementById('selected-price');
                selectedPriceElement.innerText = `₱${priceForSelectedSize?.price ?? 'N/A'}`;
                selectedPriceElement.style.display = 'block';

                document.getElementById('quantity-selector').style.display = 'block';
            });
        });
    }

    function renderFeatures(features) {
        if (!features || features.length === 0) {
            return '<p>No features available for this product.</p>';
        }

        return `
            <ul class="list-group list-group-flush">
                ${features.map(feature => `<li class="list-group-item bg-transparent text-white">${feature}</li>`).join('')}
            </ul>
        `;
    }

    function renderSizeButtons(prices) {
        if (!prices || prices.length === 0) {
            return '<p>No size options available.</p>';
        }

        return prices
            .map(
                priceOption => `
                    <button 
                        class="btn btn-outline-light size-button me-2 mb-2" 
                        data-size="${priceOption.size}">
                        ${priceOption.size || 'One Size'}
                    </button>
                `
            )
            .join('');
    }

    function displayError(message) {
        const container = document.getElementById('product-details');
        container.innerHTML = `
            <div class="alert alert-danger" role="alert">
                ${message}
            </div>
        `;
    }
});
