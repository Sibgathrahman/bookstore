import Axios from 'axios';
import React from 'react';
import { Link } from 'react-router-dom';
import { domain } from '../../env';
import { useGlobalState } from '../../state/provider';

// CartPage component displays the products in the shopping cart
const CartPage = () => {
    const [{ cart_product_incomplete }, dispatch] = useGlobalState();
    console.log(cart_product_incomplete);

    // Calculate the length of cart products
    let cart_product_length;
    if (cart_product_incomplete !== null) {
        cart_product_length = cart_product_incomplete[0]?.cart_product.length;
    } else {
        cart_product_length = 0;
    }

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
            {cart_product_length !== 0 ? (
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
                                <td>{"AED " + data.product[0].selling_price}</td> {/* Display the rate */}
                                <td>{data.quantity}</td>
                                <td>{"AED " + data.subtotal}</td> {/* Display the subtotal */}
                                <td>
                                    <button onClick={() => editCartProduct(data.id)} className="btn btn-info">-</button>
                                    <button onClick={() => deleteCartProduct(data.id)} className="btn btn-danger mx-1">X</button>
                                    <button onClick={() => updateCartProduct(data.id)} className="btn btn-success">+</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th colSpan="4" className="text-right">Total</th>
                            <th>
                            {/* i need to display the total of subtotal */}
                            {"AED " + cart_product_incomplete[0]?.cart_product.reduce((total, data) => total + data.subtotal, 0)}
                            </th>
                            <th>
                                <Link to="/order" className="btn btn-success">Order Now</Link>
                            </th>
                        </tr>
                    </tfoot>
                </table>
            ) : (
                <div>
                    <h1>There is not any Product in Cart. Go to the home page and add some Products.</h1>
                </div>
            )}
            {/* <div className="row">
                <div className="col">
                    <Link to="/oldorders" className="btn btn-warning">Old Orders</Link>
                </div>
                {cart_product_length !== 0 && (
                    <div className="col">
                        <button onClick={() => deleteFullCart(cart_product_incomplete[0]?.id)} className="btn btn-danger">Delete Cart</button>
                    </div>
                )}
            </div> */}
        </div>
    );
};

export default CartPage;
