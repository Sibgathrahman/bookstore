import Axios from 'axios';
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { domain } from '../../env';
import { useGlobalState } from '../../state/provider';

const Order = () => {
    const [{ cart_product_incomplete }, dispatch] = useGlobalState();
    const [address, setAddress] = useState("");
    const [mobile, setMobile] = useState("");
    const [email, setEmail] = useState("");
    const history = useHistory();

    const orderData = {
        "cartId": cart_product_incomplete[0]?.id,
        "address": address,
        "mobile": mobile,
        "email": email
    };

    const token = window.localStorage.getItem('token');

    const totalSubtotal = cart_product_incomplete[0]?.cart_product.reduce(
        (total, data) => total + data.subtotal,
        0
    );

    const orderNow = async () => {
        try {
            // Validate required fields
            if (!address || !mobile || !email) {
                alert("All the fields are required!")
                throw new Error("Address, mobile, and email are required.");
            }

            const response = await Axios.post(`${domain}/api/orders/`, orderData, {
                headers: {
                    Authorization: `token ${token}`
                },
            });

            // Redirect to order history page
            history.push('/oldOrders');

            // Update global state with reload page data
            dispatch({
                type: "ADD_RELOAD_PAGE_DATA",
                reloadPage: response
            });

            // Reset cart_product_incomplete in global state
            dispatch({
                type: "ADD_CART_PRODUCT_INCOMPLETE",
                cart_product_incomplete: null
            });

        } catch (error) {
            console.error(error);
            // Handle error and provide user feedback if needed
        }
    };

    return (
        <div className="container">
            <h2 className='pt-3 pb-3'>Order Summary</h2>
            <div className="row">
                <div className="col-md-6 p-2">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>SN</th>
                                <th>Product</th>
                                <th>Rate</th>
                                <th>Quantity</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart_product_incomplete[0]?.cart_product.map((data, i) => (
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{data.product[0].title}</td>
                                    <td>{"AED " + data.price}</td>
                                    <td>{data.quantity}</td>
                                    <td>{"AED " + data.subtotal}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th colSpan="4" className="text-right">Total</th>
                                <th>{"AED " + totalSubtotal}</th>
                            </tr>
                            {/* Link to edit cart */}
                            <Link to='/cart/' className="btn btn-outline-secondary">Edit Cart</Link>
                        </tfoot>
                    </table>
                </div>
                <div className="col-md-6">
                    <h1>Order Now</h1>
                    <div>
                        <div className="form-group py-2">
                            <label>Address</label>
                            <input onChange={(e) => setAddress(e.target.value)} type="text" className="form-control" placeholder="Address" required />
                        </div>
                        <div className="form-group py-2">
                            <label>Mobile</label>
                            <input onChange={(e) => setMobile(e.target.value)} type="text" className="form-control" placeholder="Mobile" required />
                        </div>
                        <div className="form-group py-2">
                            <label>Email</label>
                            <input onChange={(e) => setEmail(e.target.value)} type="text" className="form-control" placeholder="Email" required />
                        </div>
                        {/* Button to place an order */}
                        <button className="btn btn-info my-2 mb-5" onClick={orderNow}>Order</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Order;
