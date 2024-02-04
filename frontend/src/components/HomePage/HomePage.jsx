import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { domain } from '../../env';
import Product from '../Product/Product';

const HomePage = () => {
    // State to store the products data
    const [products, setProducts] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState(null);

    // Fetch data when the component mounts or page changes
    useEffect(() => {
        const getData = () => {
            Axios({
                method: 'get',
                url: `${domain}/api/product/?page=${currentPage}`,
            })
                .then((res) => {
                    setProducts(res.data);
                })
                .catch((error) => {
                    setError("An error occurred while fetching data. Please try again later.");
                    console.error("Error fetching data:", error);
                });
        };
        getData();
    }, [currentPage]);

    useEffect(() => {
        if (products) {
            // Filter products based on search term
            const filtered = products.results.filter((product) =>
                product.title && product.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredProducts({ ...products, results: filtered });
        }
    }, [searchTerm, products]);

    // Function to fetch a specific page of products
    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="container container-fluid">
            <div className="row justify-content-center m-3">
                <div className="col-9">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search products"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div className="row ps-md-5 pe-md-5 ps-sm-2 pe-sm-2 mx-auto">
                <div className="row mx-auto">
                    {error ? (
                        <div className="col-12">
                            <h1>Error: {error}</h1>
                        </div>
                    ) : (
                        <>
                            {searchTerm === '' ? (
                                // Display all products when no search term
                                products !== null ? (
                                    products.results.map((item, i) => (
                                        <div className="col-12 col-sm-8 col-md-6 col-lg-4" key={i}>
                                            <Product item={item} />
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-12">
                                        <h1>Loading...</h1>
                                    </div>
                                )
                            ) : (
                                // Display filtered products when search term exists
                                filteredProducts !== null && filteredProducts.results.length > 0 ? (
                                    filteredProducts.results.map((item, i) => (
                                        <div className="col-12 col-sm-8 col-md-6 col-lg-4" key={i}>
                                            <Product item={item} />
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-12">
                                        <h1>No results found.</h1>
                                    </div>
                                )
                            )}
                        </>
                    )}
                </div>
                {/* Pagination controls */}
                <div className="homepage__pagination">
                    <div className="pt-3 pb-5 ms-auto">
                        {searchTerm === '' && products?.count && (
                            Array.from({ length: Math.ceil(products.count / 10) }, (_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => goToPage(index + 1)}
                                    className={`btn btn-md m-1 ${currentPage === index + 1 ? 'btn-primary' : 'btn-outline-secondary'}`}
                                >
                                    {index + 1}
                                </button>
                            ))
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
