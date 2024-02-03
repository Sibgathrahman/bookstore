import React from 'react';
import { Link } from 'react-router-dom';
import { useGlobalState } from '../../state/provider';

const NavBar = () => {
    // Accessing global state using useGlobalState
    const [{ profile, cart_product_incomplete }, dispatch] = useGlobalState();
    
    // Calculating the length of cart products
    let cart_product_length = 0;
    if (cart_product_incomplete !== null) {
        cart_product_length = cart_product_incomplete[0]?.cart_product.length;
    } else {
        cart_product_length = 0;
    }

    // Function to handle logout
    const logoutButton = () => {
        // Clear local storage and update global state to logout
        window.localStorage.clear();
        dispatch({
            type: 'ADD_PROFILE',
            profile: null,
        });
        // Redirect to the home page after logout
        window.location.href = '/';
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark navbar_className">
            <div className="container">
                {/* Brand logo linking to home page */}
                <Link className="navbar-brand" to="/">
                    Ecommerce
                </Link>
                
                {/* Navbar toggle button for small screens */}
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                
                {/* Navbar links */}
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mb-2 mb-lg-0 ms-auto">
                        {/* If the user is logged in, show cart, profile, and logout links */}
                        {profile !== null ? (
                            <>
                                <li className="nav-item">
                                    {/* Cart link with product count */}
                                    <Link to="/cart" className="btn btn-dark">
                                        <i className="fas fa-cart-plus" />
                                        <span>({cart_product_length})</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    {/* Profile link for logged-in users */}
                                    <Link to="/profile" className="nav-link btn-dark active">
                                        Profile
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    {/* Logout link */}
                                    <Link onClick={logoutButton} className="nav-link active btn-dark">
                                        Logout
                                    </Link>
                                </li>
                            </>
                        ) : (
                            // If the user is not logged in, show the login link
                            <li className="nav-item">
                                <Link to="/login" className="nav-link  active btn-dark">
                                    Login
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
