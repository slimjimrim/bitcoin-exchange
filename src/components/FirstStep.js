import React from "react";
import { useForm } from "react-hook-form";
import { Form, Button } from "react-bootstrap";

const FirstStep = (props) => {
  const { user } = props;
  const { register, handleSubmit, errors } = useForm({
    defaultValues: {
      first_name: user.first_name,
      last_name: user.last_name,
    }
  });

  function onSubmit(data){
    console.log(data);
    props.updateUser(data);
    props.history.push("/second");
  };

  return (
    <Form className="input-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="col-md-6 offset-md-3">
        <Form.Group controlId="first_name">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your first name"
            autoComplete="off"
            {...register("first_name", {
              required: "First name is required.",
              pattern: {
                value: /^[a-zA-Z]+$/,
                message: "First name should contain only characters."
              }
            })}
            className={`${errors.first_name ? "input-error" : ""}`}
          />
          {errors.first_name && (
            <p className="errorMsg">{errors.first_name.message}</p>
          )}
        </Form.Group>

        <Form.Group controlId="last_name">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your last name"
            autoComplete="off"
            {...register("last_name", {
              required: "Last name is required.",
              pattern: {
                value: /^[a-zA-Z]+$/,
                message: "Last name should contain only characters."
              }
            })}
            className={`${errors.last_name ? "input-error" : ""}`}
          />
          {errors.last_name && (
            <p className="errorMsg">{errors.last_name.message}</p>
          )}
        </Form.Group>

        <Button variant="primary" type="submit">
          Next
        </Button>
      </div>
    </Form>
  );
};

export default FirstStep;
