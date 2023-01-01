import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "react-bootstrap";
import Button from '@mui/material/Button';
import axios from "axios";

import { BASE_API_URL } from "../utils/constants";

const Login = (props) => {
  const { register, handleSubmit, errors } = useForm();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userDetails, setUserDetails] = useState("");

  async function loginUser(data) {
    // console.log(data);

    try {
      const response = await axios.post(`${BASE_API_URL}/login`, data);
      setSuccessMessage("User with the provided credentials found.");
      setErrorMessage("");
      setUserDetails(response.data);
      props.updateUser(response.data);
      props.history.push("/home");
    } catch (error) {
      console.log(error);
      if (error.response) {
        console.log("Error:", error.response.data);
        setErrorMessage(error.response.data);
      }
    }
  };

  return (
    <div className="container">
      <Form className="input-form" onSubmit={handleSubmit(loginUser)}>
        <div className="col-md-6 offset-md-3">
          {errorMessage ? (
            <p className="errorMsg login-error">{errorMessage}</p>
          ) : (
            <div>
              <p className="successMsg">{successMessage}</p>

              {userDetails && (
                <div className="user-details">
                  <p>Following are the user details:</p>
                  <div>First name: {userDetails.first_name}</div>
                  <div>Last name: {userDetails.last_name}</div>
                  <div>Email: {userDetails.email}</div>
                </div>
              )}
            </div>
          )}
          <Form.Group controlId="first_name">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter your email address"
              ref={register({
                required: "Email is required.",
                pattern: {
                  value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                  message: "Email is not valid."
                }
              })}
              className={`${errors.email ? "input-error" : ""}`}
            />
            {errors.email && (
              <p className="errorMsg">{errors.email.message}</p>
            )}
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Choose a password"
              ref={register({
                required: "Password is required.",
                minLength: {
                  value: 6,
                  message: "Password should have at-least 6 characters."
                }
              })}
              className={`${errors.password ? "input-error" : ""}`}
            />
            {errors.password && (
              <p className="errorMsg">{errors.password.message}</p>
            )}
          </Form.Group>

          <Button variant="contained" type="submit">
            Check Login
          </Button>
        </div>
      </Form>

      <br />
      <div className="flex flex-col items-center">
        <p>Don't have an account?</p>
        <a variant="primary" type="submit" href="/first">
          Register
        </a>
      </div>
    </div>
  );
};

export default Login;
