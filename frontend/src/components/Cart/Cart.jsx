import Axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { domain } from '../../env';
import { useGlobalState } from '../../state/provider';

const CartPage = () => {
    const [{ cart_product_incomplete }, dispatch] = useGlobalState();
    const [error, setError] = useState(null);
    const token = window.localStorage.getItem('token');

    // Function to handle errors
    const handleError = (error) => {
        console.error("Error:", error);
        setError("An error occurred. Please try again later.");
    };

    // Function to update the quantity of a cart product
    const updateCartProduct = async (id) => {
        try {
            const response = await Axios.post(`${domain}/api/updateCartProduct/`, { id }, {
                headers: {
                    Authorization: `token ${token}`
                },
            });
            dispatch({
                type: "ADD_RELOAD_PAGE_DATA",
                reloadPage: response.data,
            });
        } catch (error) {
            handleError(error);
        }
    };

    // Function to edit the quantity of a cart product
    const editCartProduct = async (id) => {
        try {
            const response = await Axios.post(`${domain}/api/editCartProduct/`, { id }, {
                headers: {
                    Authorization: `token ${token}`
                },
            });
            dispatch({
                type: "ADD_RELOAD_PAGE_DATA",
                reloadPage: response.data,
            });
        } catch (error) {
            handleError(error);
        }
    };

    // Function to delete a cart product
    const deleteCartProduct = async (id) => {
        try {
            const response = await Axios.post(`${domain}/api/deleteCartProduct/`, { id }, {
                headers: {
                    Authorization: `token ${token}`
                },
            });
            dispatch({
                type: "ADD_RELOAD_PAGE_DATA",
                reloadPage: response.data,
            });
        } catch (error) {
            handleError(error);
        }
    };

    return (
        <div className="container p-3">
            <h2 className='pt-3 pb-3'>Your Shopping Cart</h2>
            {error ? (
                // Display an error message if there's an error
                <div className="alert alert-danger">{error}</div>
            ) : (
                // Display cart contents or message if the cart is empty
                <>
                    {cart_product_incomplete.length !== 0 ? (
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>SN</th>
                                        <th>Product</th>
                                        <th>Rate</th>
                                        <th>Quantity</th>
                                        <th>Subtotal</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart_product_incomplete[0]?.cart_product.map((data, i) => (
                                        <tr key={i}>
                                            <td>{i + 1}</td>
                                            <td>{data.product[0].title}</td>
                                            <td>{"AED " + data.product[0].selling_price}</td>
                                            <td>{data.quantity}</td>
                                            <td>{"AED " + data.subtotal}</td>
                                            <td>
                                                {/* Button to decrease quantity */}
                                                <button onClick={() => editCartProduct(data.id)} className="btn btn-outline-secondary m-1">-</button>
                                                {/* Button to delete product */}
                                                <button onClick={() => deleteCartProduct(data.id)} className="btn btn-outline-danger m-1">X</button>
                                                {/* Button to increase quantity */}
                                                <button onClick={() => updateCartProduct(data.id)} className="btn btn-outline-success m-1">+</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th colSpan="4" className="text-right">Total</th>
                                        <th>{"AED " + cart_product_incomplete[0]?.cart_product.reduce((total, data) => total + data.subtotal, 0)}</th>
                                        <th>
                                            {cart_product_incomplete[0]?.cart_product.reduce((total, data) => total + data.subtotal, 0) !== 0 ? (
                                                // Button to navigate to order page if cart is not empty
                                                <Link to="/order" className="btn btn-success">Order Now</Link>
                                            ) : (
                                                // Button to navigate back to home if cart is empty
                                                <Link to="/" className="btn btn-secondary">Back to home</Link>
                                            )}
                                        </th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    ) : (
                        <div>
                            <h3>There is not any Product in Cart. Go to the home page and add some Products.</h3>
                            <Link to="/" className="btn btn-secondary">Back to home</Link>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CartPage;