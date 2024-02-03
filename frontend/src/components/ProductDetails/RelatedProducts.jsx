import Axios from 'axios';
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { domain } from '../../env';
import { useGlobalState } from '../../state/provider';

// Product component represents a product card
const RelatedProduct = ({ item }) => {
    const [{ profile }, dispatch] = useGlobalState();
    const history = useHistory();

    // Function to add the product to the cart
    const addToCart = async (id) => {
        // Check if the user is logged in
        profile !== null ? (
            // If logged in, make a request to add the product to the cart
            await Axios({
                method: 'post',
                url: `${domain}/api/addToCart/`,
                headers: {
                    Authorization: `token ${window.localStorage.getItem('token')}`
                },
                data: { "id": id }
            }).then(response => {
                // Dispatch an action to update the state for a page reload
                dispatch({
                    type: "ADD_RELOAD_PAGE_DATA",
                    reloadPage: response
                })
            })
        ) : (
            // If not logged in, redirect to the login page
            history.push("/login")
        )
    };


    return (
        <>
            <div className="card mt-4">
                {/* Link to navigate to the product details page */}
                <Link
                    to={`/product/${item.id}`}
                    className="product_image"
                    style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
                >
                    {/* Product image */}
                    <img className="card-img" src={`${domain}${item.image}`} alt="Card cap" />
                </Link>
                <div className="card-body">
                    {/* Product title */}
                    <h4 className="card-title">{item.title}</h4>
                    {/* Short product description */}
                    <p className="card-text">
                        {item.description.substring(0, 50)}...{' '}
                        <Link to={`/product/${item.id}`} style={{ textDecoration: 'none' }}>
                            {' '}
                            Read more
                        </Link>
                    </p>
                    {/* Buy section with price and add to cart button */}
                    <div className="buy d-flex justify-content-between align-items-center">
                        {/* Price information */}
                        <div className="price">
                            <h5 className="mt-4">
                                {' '}
                                Price: <del className="text-danger">
                                    {item.market_price} 
                                </del>{' '}
                                <i className="text-success"> {item.selling_price} AED</i>
                            </h5>
                        </div>
                        {/* Add to Cart button */}
                        <button onClick={() => addToCart(item.id)} className="btn btn-warning mt-3">
                            <i className="fas fa-shopping-cart" /> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default RelatedProduct;
