import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { domain } from '../../env';
import { useGlobalState } from "../../state/provider";
import RelatedProduct from './RelatedProducts';

const ProductDetails = () => {
    const [{ profile }, dispatch] = useGlobalState()
    const history = useHistory()
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [categoryProducts, setCategoryProducts] = useState(null);

    useEffect(() => {
        // Fetch product details when the component mounts
        const getProduct = async () => {
            try {
                const response = await Axios({
                    method: 'get',
                    url: `${domain}/api/product/${id}/`,
                });

                setProduct(response?.data);
                getCategoryData(response?.data?.author['id']);
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };

        getProduct();
    }, [id]);

    // Fetch related category products
    const getCategoryData = async (id) => {
        try {
            const response = await Axios({
                method: 'get',
                url: `${domain}/api/author/${id}/`,
            });

            console.log(response?.data);
            setCategoryProducts(response?.data);
        } catch (error) {
            console.error('Error fetching category products:', error);
        }
    };

    // Add product to cart
    const addToCart = async (id) => {
        try {
            if (profile !== null) {
                const response = await Axios({
                    method: 'post',
                    url: `${domain}/api/addToCart/`,
                    headers: {
                        Authorization: `token ${window.localStorage.getItem('token')}`
                    },
                    data: { "id": id }
                });

                console.log(response);
                dispatch({
                    type: "ADD_RELOAD_PAGE_DATA",
                    reloadPage: response
                });
            } else {
                history.push("/login");
            }
        } catch (error) {
            console.error('Error adding to cart:', error);

            if (error.response && error.response.status === 401) {
                history.push('/login');
            } else {
                alert('Error adding to cart. Please try again later.');
            }
        }
    }

    return (
        <div className="container">
            {product !== null && (
                <>
                    {/* Product details section */}
                    <div className="container" style={{ marginTop: '20px' }}>
                        <article className="card p-3">
                            <div className="card-body">
                                <div className="row">
                                    <aside className="col-md-6">
                                        <div className="h-100 d-flex align-items-center justify-content-center">
                                            {' '}
                                            <img
                                                className="w-75 mx-auto d-block"
                                                src={product.image}
                                                alt=""
                                            />
                                        </div>
                                        {' '}
                                    </aside>
                                    <main className="col-md-6">
                                        <h3 className="title">{product.title}</h3>
                                        <hr />
                                        <div className="mb-3">
                                            <h6>Author : </h6>
                                            <ul className="list-dots mb-0">{product.author.name}</ul>
                                        </div>
                                        <div className="mb-3">
                                            <h6>Short description</h6>
                                            <ul className="list-dots mb-0">{product.description}</ul>
                                        </div>
                                        <div className="mb-3">
                                            <div className="price">
                                                <h5 className="mt-4">
                                                    {' '}
                                                    Price:{' '}
                                                    <del className="text-danger">
                                                        {product.market_price}
                                                    </del>
                                                    {' '}
                                                    <i className="text-success">
                                                        {product.selling_price} AED
                                                    </i>
                                                </h5>
                                            </div>
                                            <br />
                                        </div>
                                        <div className="mb-4">
                                            <button onClick={() => addToCart(product.id)}
                                                className="btn btn-warning mt-3">
                                                <i className="fas fa-shopping-cart" /> Add to Cart
                                            </button>
                                        </div>
                                    </main>
                                </div>
                            </div>
                        </article>
                    </div>

                    {/* Related Products section */}
                    <div className="row">
                        <h1>Related Products</h1>
                        {categoryProducts !== null &&
                            categoryProducts[0]?.category_product?.map((categoryProduct) => {
                                if (categoryProduct.id !== product.id) {
                                    return (
                                        <div className="col-md-3 mt-2" key={categoryProduct.id}>
                                            <RelatedProduct item={categoryProduct} />
                                        </div>
                                    );
                                } else {
                                    return null;
                                }
                            })}
                    </div>
                </>
            )}
        </div>
    );
};

export default ProductDetails;
