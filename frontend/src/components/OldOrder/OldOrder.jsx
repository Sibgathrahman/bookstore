import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { domain } from '../../env';

const OldOrders = () => {
    // Get the token from local storage
    const token = window.localStorage.getItem('token');

    // State to store orders data and error
    const [orders, setOrders] = useState(null);
    const [error, setError] = useState(null);

    // Fetch orders data when the component mounts
    useEffect(() => {
        const getOrder = async () => {
            try {
                const response = await Axios({
                    method: 'get',
                    url: `${domain}/api/orders/`,
                    headers: {
                        Authorization: `token ${token}`,
                    },
                });
                // Set orders state with the fetched data
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
                // Set the error state if there is an issue with fetching orders
                setError('Error fetching orders. Please try again later.');
            }
        };

        // Call the getOrder function
        getOrder();
    }, [token]);

    return (
        <div className="container">
            <h1 className="pt-3 pb-3">Orders History</h1>
            {error ? (
                // Display error message if there is an issue with fetching orders
                <div>
                    <h1 className="display-1">Error</h1>
                    <p>{error}</p>
                </div>
            ) : (
                // Display orders table if there are no errors
                <table className="table">
                    <thead>
                        <tr>
                            <th>SN</th>
                            <th>Total</th>
                            <th>Product</th>
                            <th>Order Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders?.length !== 0 ? (
                            orders?.map((order, i) => (
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>AED {order?.total}</td>
                                    <td>{order?.cart_product?.length}</td>
                                    <td>{order?.order_status}</td>
                                    <td>
                                        <Link to={`/oldOrders/${order.id}`} className="btn btn-success">
                                            Details
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <div>
                                <h1 className="display-1">No Previous Order</h1>
                                <Link to="/profile" className="btn btn-info">
                                    BACK TO PROFILE
                                </Link>
                            </div>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default OldOrders;
