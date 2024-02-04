import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { domain } from '../../env';
import Product from '../Product/Product';

const HomePage = () => {
    const [allProducts, setAllProducts] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        Axios.get(`${domain}/api/product/`)
            .then((res) => {
                setAllProducts(res.data);
            })
            .catch((error) => {
                setError("An error occurred while fetching data. Please try again later.");
                console.error("Error fetching data:", error);
            });
    }, []);

    useEffect(() => {
        if (allProducts) {
            // Filter products based on search term
            const filtered = allProducts.results.filter((product) =>
                product.title && product.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredProducts({ ...allProducts, results: filtered });
        }
    }, [searchTerm, allProducts]);

    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    return (
        <div className="container container-fluid">
            {/* Search bar */}
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

            {/* Display products based on search */}
            <div className="row mx-auto">
                {error ? (
                    <div className="col-12">
                        <h1>Error: {error}</h1>
                    </div>
                ) : (
                    <>
                        {searchTerm === '' ? (
                            // Display all products when no search term
                            allProducts !== null ? (
                                allProducts.results.map((item, i) => (
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
                    {filteredProducts?.count &&
                        Array.from({ length: Math.ceil(filteredProducts.count / 10) }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => goToPage(index + 1)}
                                className={`btn btn-md m-1 ${currentPage === index + 1 ? 'btn-primary' : 'btn-outline-secondary'}`}
                            >
                                {index + 1}
                            </button>
                        ))}

                </div>
            </div>
        </div>
    );
};

export default HomePage;
