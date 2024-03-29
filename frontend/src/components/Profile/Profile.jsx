import Axios from 'axios';
import React, { useState } from 'react';
import { domain } from '../../env';
import { useGlobalState } from '../../state/provider';
import styles from './Profile.module.css';
import { Link } from 'react-router-dom';
import prfilePhoto from '../../static/images/profile.jpg';
import booksBg from '../../static/images/booksTwo.jpg';

const Profile = () => {
    // Get user profile data from global state
    const [{ profile }, dispatch] = useGlobalState();

    // State for form fields
    const [image, setImage] = useState(null);
    const [firstname, setFirstname] = useState(profile?.user.first_name);
    const [lastname, setLastname] = useState(profile?.user.last_name);
    const [email, setEmail] = useState(profile?.user.email);

    // Function to upload profile picture
    const uploadImage = async () => {
        const form_data = new FormData();
        form_data.append('image', image);

        // Make API request to update profile picture
        Axios({
            method: "post",
            url: `${domain}/api/updateprofile/`,
            headers: {
                Authorization: `token ${window.localStorage.getItem('token')}`
            },
            data: form_data
        }).then(response => {
            // Update global state and show alert
            dispatch({
                type: "ADD_RELOAD_PAGE_DATA",
                reloadPage: response.data
            });
            alert(response.data["message"]);
        });
    };

    // Function to update user data
    const updateData = async () => {
        // Make API request to update user data
        Axios({
            method: "post",
            url: `${domain}/api/updateuser/`,
            headers: {
                Authorization: `token ${window.localStorage.getItem('token')}`
            },
            data: {
                "first_name": firstname,
                "last_name": lastname,
                "email": email
            }
        }).then(response => {
            // Update global state and show alert
            dispatch({
                type: "ADD_RELOAD_PAGE_DATA",
                reloadPage: response.data
            });
            alert(response.data["message"]);
        });
    };

    return (
        <div className="container py-5">
            <div className="row m-3 p-3 shadow-lg">
                {/* Profile Card */}
                <div className="col-lg-4 col-md-12 mb-4 mb-lg-0">
                    <div className={`card ${styles.profileCard3}`}>
                        <div className={styles.backgroundBlock}>
                            <img src={booksBg} alt="profile-sample1" className={styles.background} />
                        </div>
                        <div className="profile-thumb-block">
                            {profile?.image ? (
                                <img src={`${domain}${profile?.image}`} alt="profile" className={styles.profile} />
                            ) : (
                                <img src={prfilePhoto} alt="profile" className={styles.profile} />
                            )}
                        </div>
                        <div className={styles.cardContent}>
                            <h2>{profile?.user.first_name + " "} {profile?.user.last_name}
                                <small>{profile?.user.username.toUpperCase()}</small></h2>
                            <h3 className="text-secondary ">{profile?.user.email}</h3>
                            {/* Button to navigate to Order History */}
                            <div className="form-group pb-3">
                                <Link to="/oldorders" className="btn btn-info">Order History</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Update Profile Form */}
                <div className="col-lg-8 col-md-12">
                    <form method="POST" encType="multipart/form-data">
                        <fieldset className="form-group">
                            <legend className="border-bottom mb-4">Profile Update</legend>
                            {/* Upload Profile Picture */}
                            <div className="form-group">
                                <label>Upload Profile Picture</label>
                                <div className="row">
                                    <div className="col">
                                        <input
                                            onChange={(e) => setImage(e.target.files[0])}
                                            type="file"
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="col">
                                        <p onClick={uploadImage} className="btn btn-info">Upload</p>
                                    </div>
                                </div>
                            </div>

                            {/* First Name and Last Name Fields */}
                            <div className="row form-group pb-3">
                                <div className="col">
                                    <label>First Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        onChange={(e) => setFirstname(e.target.value)}
                                        value={firstname}
                                    />
                                </div>
                                <div className="col">
                                    <label>Last Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        onChange={(e) => setLastname(e.target.value)}
                                        value={lastname}
                                    />
                                </div>
                            </div>

                            {/* Email Field */}
                            <div className="form-group pb-3">
                                <label>Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                />
                            </div>
                        </fieldset>

                        {/* Update Button */}
                        <div className="form-group pb-3">
                            <p className="btn btn-outline-danger" onClick={updateData}>Update</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
