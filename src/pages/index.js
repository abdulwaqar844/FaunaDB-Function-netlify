import React from 'react';
import { Formik } from 'formik';
import List from "./../../components/List"
export default function Home() {
 
  return <div>
    <h1>FaunaDB CRUD</h1>
    <Formik
      initialValues={{ name: '', fname: '' }}
      validate={values => {
        const errors = {};
        if (!values.name) {
          errors.name = 'Required';
        } if (!values.fname) {
          errors.fname = 'Required';
        }
        return errors;

      }}
      onSubmit={(values) => {
        fetch(`/.netlify/functions/create`, {
          method: 'post',
          body: JSON.stringify(values)
        }).then(
          res=>res.json()
        ).then(res=>console.log(res))
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        /* and other goodies */
      }) => (
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Enter Name"
            type="text"
            name="name"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.name}
          />
          {errors.name && touched.name && errors.name}
          <br />
          <input
            placeholder="Enter Father Name"
            type="text"
            name="fname"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.fname}
          />
          {errors.name && touched.name && errors.name}
          <br />
          <button type="submit" disabled={isSubmitting}
          >
            Add Message
           </button>
        </form>
      )}
    </Formik>
 <List />   
  </div>
}