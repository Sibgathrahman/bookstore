import Axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { domain, header2 } from '../../env';
import styles from './Login.module.css';
import image1 from '../../static/images/books.jpg';

const Login = () => {
  // State variables for managing input fields and errors
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  // Function to handle login button click
  const loginButton = (e) => {
    e.preventDefault();
    Axios({
      url: `${domain}/api/login/`,
      method: 'post',
      headers: header2,
      data: {
        username: username,
        password: password,
      },
    })
      .then((response) => {
        // Store the token in local storage and redirect to the home page
        window.localStorage.setItem('token', response.data['token']);
        window.location.href = '/';
      })
      .catch((error) => {
        console.log(error.response);
        // Handle errors, display appropriate error message
        if (error.response.status === 400)
          setErrors({ [Object.keys(error.response.data)[0]]: 'Username OR Password is invalid. Try Again !!' });
        else
          setErrors({ 'error': 'Internal Server Error. Try Again!!!' });
      });
  };

  return (
    <div className="container">
      <div className="row m-5 no-gutters shadow-lg">
        {/* Login form */}
        <div className="col-md-6 bg-white p-5">
          <h3 className="pb-3">Login</h3>
          <div className="form-style">
            <form>
              {/* Username input */}
              <div className="form-group pb-3">
                <input
                  type="text"
                  placeholder="Username"
                  className="form-control"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              {/* Password input */}
              <div className="form-group pb-3">
                <input
                  type="password"
                  placeholder="Password"
                  className="form-control"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {/* Submit button */}
              <div className="pb-2">
                <button
                  type="submit"
                  className="btn btn-dark w-100 font-weight-bold mt-2"
                  onClick={(e) => loginButton(e)}
                >
                  Submit
                </button>
              </div>
            </form>
            {/* Registration link */}
            <div className="mt-4 text-center">
              Haven't Registered Yet?{' '}
              <Link to="/register" style={{ textDecoration: 'none' }}>
                Register Now
              </Link>
            </div>
            {/* Display errors */}
            <div className="mt-4">
              {Object.keys(errors).map((keyName, i) => (
                <div key={i} className={styles.errorMsg}>
                  <i className="fa fa-times-circle" />
                  <span style={{ marginLeft: '5px' }}>{errors[keyName]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Image */}
        <div
          className="col-md-6 d-none d-md-block"
          style={{ height: '500px', paddingLeft: 0, paddingRight: 0 }}
        >
          <img
            src={image1}
            className="img-fluid"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            alt="login"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
