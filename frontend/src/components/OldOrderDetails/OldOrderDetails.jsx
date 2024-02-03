import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { domain } from '../../env';

const OldOrderDetails = () => {
    // Get the token from local storage
    const token = window.localStorage.getItem('token');

    // Get the order ID from the route parameters
    const { id } = useParams();

    // State to store order details
    const [details, setDetails] = useState(null);

    useEffect(() => {
        // Function to fetch order details
        const getData = async () => {
            try {
                const response = await Axios({
                    method: "get",
                    url: `${domain}/api/orders/${id}/`,
                    headers: {
                        Authorization: `token ${token}`
                    }
                });

                // Log the data to the console and set the state with the fetched details
                console.log(response?.data?.data[0]);
                setDetails(response?.data?.data[0]);
            } catch (error) {
                console.error('Error fetching order details:', error);
            }
        }

        // Call the getData function
        getData();
    }, [id, token]);

    // Extract products from order details
    const products = details?.cart_product;

    return (
        <div className="container p-3">
            {/* Display order summary */}
            <table className="table table-bordered ">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Products</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {/* Display order details if available */}
                        {details != null && (
                            <>
                                <td>{details.date}</td>
                                <td>{"AED " + details.total}</td>
                                <td>{details.email}</td>
                                <td>{details.mobile}</td>
                                <td>{details.cart_product?.length}</td>
                            </>
                        )}
                    </tr>
                </tbody>
            </table>

            {/* Display product details */}
            <h1>Product details</h1>
            <table className="table table-bordered ">
                <thead>
                    <tr>
                        <th>SN</th>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Map through products and display details */}
                    {products?.map((data, i) => (
                        <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{data.product[0].title}</td>
                            <td>{"AED " + data.price}</td>
                            <td>{data.quantity}</td>
                            <td>{"AED " + data.subtotal}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default OldOrderDetails;
