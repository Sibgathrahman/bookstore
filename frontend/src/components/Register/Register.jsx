import Axios from 'axios';
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { domain, header2 } from '../../env';
import styles from './Register.module.css';
import image1 from '../../static/images/books.jpg';

const Register = () => {
  // State variables for managing input fields, errors, and useHistory hook
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [errors, setErrors] = useState({});
  const history = useHistory();

  // Function to handle register button click
  const registerButton = async (e) => {
    e.preventDefault();
    setErrors({});

    // Check if passwords match
    if (password !== password2) {
      setErrors({ ...errors, 'password': 'Password not Matched. Try Again!' });
    } else {
      // Make API call to register user
      Axios({
        method: 'post',
        url: `${domain}/api/register/`,
        headers: header2,
        data: {
          username: username,
          password: password,
          first_name: firstName,
          last_name: lastName,
          password2: password2,
          email: email
        },
      }).then((response) => {
        // Redirect to login page after successful registration
        if (response.data['data']) {
          history.push('/login');
        }

        // Handle registration errors
        if (response.data.error) {
          setErrors({ ...errors, ...response.data.message });
        }
      }).catch((error) => {
        setErrors({ ...errors, ...error.message });
      });
    }
  };

  return (
    <div className="container">
      <div className="row m-5 no-gutters shadow-lg">
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
        {/* Registration form */}
        <div className="col-md-6 bg-white p-5">
          <h3 className="pb-3">Register</h3>
          <div className="form-style">
            <form>
              {/* Name inputs */}
              <div className="row form-group pb-3">
                <div className="col">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="form-control"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="col">
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="form-control"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              {/* Other input fields */}
              <div className="form-group pb-3">
                <input
                  type="text"
                  placeholder="Username"
                  className="form-control"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-group pb-3">
                <input
                  type="email"
                  placeholder="Email"
                  className="form-control"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group pb-3">
                <input
                  type="password"
                  placeholder="Password"
                  className="form-control"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="form-group pb-3">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="form-control"
                  onChange={(e) => setPassword2(e.target.value)}
                />
              </div>
              {/* Submit button */}
              <div className="pb-2">
                <button
                  type="submit"
                  className="btn btn-dark w-100 font-weight-bold mt-2"
                  onClick={(e) => registerButton(e)}
                >
                  Submit
                </button>
              </div>
              {/* Login link */}
              <div className="pt-4 text-center">
                Already Registered?{' '}
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  Login Now
                </Link>
              </div>
              {/* Display errors */}
              <div>
                {Object.keys(errors).map((keyName, i) => (
                  <div key={i} className={styles.errorMsg}>
                    <i className="fa fa-times-circle" />
                    <span style={{ marginLeft: '5px' }}>{errors[keyName]}</span>
                  </div>
                ))}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
