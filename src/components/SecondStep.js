import React from "react";
import { useForm } from "react-hook-form";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

import { BASE_API_URL } from "../utils/constants";

const SecondStep = (props) => {
  const { user } = props;
  const { register, handleSubmit, errors } = useForm({
    defaultValues: {
      email: user.email,
      password: user.password
    }
  });

  async function registerUser(data) {
    try {
      const userRegistration = {
        ...user,
        ...data
      };
      console.log(userRegistration);

      const resp = await axios.post(`${BASE_API_URL}/register`, userRegistration);
      const result = await Swal.fire({
        icon: "success",
        title: "Hooray",
        text: "You've successfully registered!"
      });
      if (result.isConfirmed || result.isDismissed) {
        props.resetUser();
        props.updateUser(resp.data)
        props.history.push("/home");
      }
    } catch (error) {
      if (error.response) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.response.data
        });
        console.log('Error:', error.response.data);
      }
    }
  };

  return (
    <Form className="input-form" onSubmit={handleSubmit(registerUser)}>
      <div className="col-md-6 offset-md-3">
        <Form.Group controlId="first_name">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter your email address"
            autoComplete="off"
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
            autoComplete="off"
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

        <Button variant="primary" type="submit">
          Register
        </Button>
      </div>
    </Form>
  );
};

export default SecondStep;
