import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { domain } from '../../env';
import Product from '../Product/Product';

const HomePage = () => {
    // State to store the products data
    const [products, setProducts] = useState(null);

    // Fetch data when the component mounts
    useEffect(() => {
        const getData = () => {
            Axios({
                method: 'get',
                url: `${domain}/api/product/`,
            }).then((res) => {
                setProducts(res.data);
            });
        };
        getData();
    }, []);

    // Function to fetch the next page of products
    const nextPage = async () => {
        Axios({
            method: 'get',
            url: products?.next,
        }).then((res) => {
            setProducts(res.data);
        });
    };

    // Function to fetch the previous page of products
    const previousPage = async () => {
        Axios({
            method: 'get',
            url: products?.previous,
        }).then((res) => {
            setProducts(res.data);
        });
    };

    return (
        <div className="container-fluid">
            <div className="row ps-md-5 pe-md-5 ps-sm-2 pe-sm-2 mx-auto">
                <div className="row mx-auto">
                    {products !== null ? (
                        <>
                            {products?.results.map((item, i) => (
                                // Display each product using the Product component
                                <div className="col-12 col-sm-8 col-md-6 col-lg-4" key={i}>
                                    <Product item={item} />
                                </div>
                            ))}
                        </>
                    ) : (
                        // Display a loading message while products are being fetched
                        <>
                            <h1>Loading...</h1>
                        </>
                    )}
                </div>
                {/* Pagination controls */}
                <div className="homepage__pagination">
                    <div className="">
                        {products?.previous !== null ? (
                            // Enable previous button if there is a previous page
                            <button onClick={previousPage} className="btn btn-lg btn-success">
                                <i className="fas fa-backward" /> Previous
                            </button>
                        ) : (
                            // Disable previous button if no previous page
                            <button className="btn btn-lg btn-success" disabled>
                                {' '}
                                <i className="fas fa-backward" /> Previous
                            </button>
                        )}
                    </div>
                    <div className="">
                        {products?.next !== null ? (
                            // Enable next button if there is a next page
                            <button onClick={nextPage} className="btn btn-lg btn-danger">
                                Next <i className="fas fa-forward" />
                            </button>
                        ) : (
                            // Disable next button if no next page
                            <button className="btn btn-lg btn-danger" disabled>
                                Next <i className="fas fa-forward" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
