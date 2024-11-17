document.addEventListener("DOMContentLoaded", function () {
    fetch('data.json')
        .then(response => response.json())
        .then(jsonData => {
            const productContainer = document.getElementById('product-container');
            const sidebar = document.querySelector('aside');

            productContainer.innerHTML = '';
            sidebar.innerHTML = '';

            const spacer = document.createElement('div');
            spacer.style.height = '100px';

            document.body.appendChild(spacer);

            // Function to set active class
            function setActiveButton(button) {
                const buttons = sidebar.querySelectorAll('.category-button');
                buttons.forEach(btn => btn.classList.remove('active')); // Remove active from all buttons
                button.classList.add('active'); // Add active to the clicked button
            }

            // Create "All Products" button
            const allProductsButton = document.createElement('div');
            allProductsButton.classList.add(
                'bg-[#fde7d8]', 
                'rounded-md', 
                'py-3', 
                'px-5', 
                'flex', 
                'justify-between', 
                'items-center', 
                'text-lg', 
                'font-semibold', 
                'text-gray-800', 
                'mb-4', 
                'category-button'
            );
            allProductsButton.innerHTML = 'All Products';
            allProductsButton.addEventListener('click', function () {
                displayAllProducts(jsonData.petProducts);
                setActiveButton(allProductsButton); // Set this button as active
            });
            sidebar.appendChild(allProductsButton);

            // Create category buttons
            jsonData.petProducts.forEach(category => {
                const categoryItem = document.createElement('div');
                categoryItem.classList.add(
                    'bg-[#fde7d8]', 
                    'rounded-md', 
                    'py-3', 
                    'px-5', 
                    'flex', 
                    'justify-between', 
                    'items-center', 
                    'text-lg', 
                    'font-semibold', 
                    'text-gray-800', 
                    'mb-4', 
                    'category-button'
                );
                categoryItem.innerHTML = `${category.category} <span>(${category.products.length})</span>`;
                
                categoryItem.addEventListener('click', function () {
                    filterProductsByCategory(category.category, jsonData.petProducts);
                    setActiveButton(categoryItem); // Set this button as active
                });

                sidebar.appendChild(categoryItem);
            });

            function displayAllProducts(petProducts) {
                const productContainer = document.getElementById('product-container');
                productContainer.innerHTML = '';  // Clear previous content

                petProducts.forEach(category => {
                    category.products.forEach(product => {
                        const productCard = `
                            <div class="bg-[#64b268] rounded-xl p-6 text-center product-card">
                                <!-- Link now includes product id in the URL -->
                                <a href="product.html?id=${product.id}" class="product-link">
                                    <div class="flex justify-center mb-4">
                                        <img src="${product.image}" alt="${product.name}" class="rounded-md" />
                                    </div>
                                 </a>
                                <h2 class="text-xl font-semibold text-white">${product.name}</h2>
                                <p class="text-sm text-white mt-2">${product.description}</p>
                                <div class="mt-4">
                                 <a href="product.html?id=${product.id}" class="product-link">
                                    <button type="button" class="bg-orange-500 text-white mt-6 px-4 py-2 rounded-full font-semibold hover:bg-orange-600">Buy Now</button>
                                </a>
                                    <button type="button" class="bg-white-500 text-white mt-2 px-4 py-2 rounded-full font-semibold hover:bg-blue-600">Add To Cart</button>
                                </div>
                            </div>
                        `;
                        productContainer.innerHTML += productCard;
                    });
                });
            }

            function filterProductsByCategory(categoryName, petProducts) {
                productContainer.innerHTML = '';  // Clear previous content
                petProducts.forEach(category => {
                    if (category.category === categoryName) {
                        category.products.forEach(product => {
                            const productCard = `
                                <div class="bg-[#64b268] rounded-xl p-6 text-center product-card">
                                    <div class="flex justify-center mb-4">
                                    <a href="product.html?id=${product.id}" class="product-link">
                                        <img src="${product.image}" alt="${product.name}" class="rounded-md" />
                                    </a>
                                    </div>
                                    <h2 class="text-xl font-semibold text-white">${product.name}</h2>
                                    <p class="text-sm text-white mt-2">${product.description}</p>
                                    <div class="mt-4">
                                     <a href="product.html?id=${product.id}" class="product-link">
                                        <button type="button" class="bg-orange-500 text-white mt-6 px-4 py-2 rounded-full font-semibold hover:bg-orange-600">Buy Now</button>
                                    </a>
                                        <button type="button" class="bg-white-500 text-white mt-2 px-4 py-2 rounded-full font-semibold hover:bg-blue-600">Add To Cart</button>
                                    </div>
                                </div>
                            `;
                            productContainer.innerHTML += productCard;
                        });
                    }
                });
            }

            displayAllProducts(jsonData.petProducts);  // Display all products initially
            setActiveButton(allProductsButton);  // Set "All Products" as active initially
        })
        .catch(error => {
            console.error('Error loading JSON data:', error);
        });
});
