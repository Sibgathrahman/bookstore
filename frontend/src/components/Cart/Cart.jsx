import Axios from 'axios';
import React from 'react';
import { Link } from 'react-router-dom';
import { domain } from '../../env';
import { useGlobalState } from '../../state/provider';

const CartPage = () => {
    const [{ cart_product_incomplete }, dispatch] = useGlobalState();
    console.log(cart_product_incomplete);

    const token = window.localStorage.getItem('token');

    // Function to update the quantity of a cart product
    const updateCartProduct = async (id) => {
        await Axios({
            method: 'post',
            url: `${domain}/api/updateCartProduct/`,
            headers: {
                Authorization: `token ${token}`
            },
            data: { "id": id }
        }).then(response => {
            dispatch({
                type: "ADD_RELOAD_PAGE_DATA",
                reloadPage: response
            });
        });
    };

    // Function to edit the quantity of a cart product
    const editCartProduct = async (id) => {
        await Axios({
            method: 'post',
            url: `${domain}/api/editCartProduct/`,
            headers: {
                Authorization: `token ${token}`
            },
            data: { "id": id }
        }).then(response => {
            dispatch({
                type: "ADD_RELOAD_PAGE_DATA",
                reloadPage: response
            });
        });
    };

    // Function to delete a cart product
    const deleteCartProduct = async (id) => {
        await Axios({
            method: 'post',
            url: `${domain}/api/deleteCartProduct/`,
            headers: {
                Authorization: `token ${token}`
            },
            data: { "id": id }
        }).then(response => {
            dispatch({
                type: "ADD_RELOAD_PAGE_DATA",
                reloadPage: response
            });
        });
    };

    return (
        <div className="container p-3">
            <h2 className='pt-3 pb-3'>Your Shopping Cart</h2>
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
                                        <button onClick={() => editCartProduct(data.id)} className="btn btn-outline-secondary">-</button>
                                        {/* Button to delete product */}
                                        <button onClick={() => deleteCartProduct(data.id)} className="btn btn-outline-danger">X</button>
                                        {/* Button to increase quantity */}
                                        <button onClick={() => updateCartProduct(data.id)} className="btn btn-outline-success">+</button>
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
                // Display if the cart is empty
                <div>
                    <h3>There is not any Product in Cart. Go to the home page and add some Products.</h3>
                    <Link to="/" className="btn btn-secondary">Back to home</Link>
                </div>
            )}
        </div>
    );
};

export default CartPage;
