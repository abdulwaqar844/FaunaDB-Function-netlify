import React, { useState } from 'react';
import { Formik } from 'formik';
import { useEffect } from 'react';
export default function Home() {
  const [data, setData] = useState([]);
    useEffect(() => {
      (async () => {
        fetch(`/.netlify/functions/read`)
          .then(res => res.json())
          .then(res => {
            setData(res)
          })
      })()
    }, [])
  
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
        )
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
    <div>
      <h1>Data From FaunaDB</h1>
      <div>
        <table border="1">
          <thead>
            <tr>
              <th>Name</th>
              <th>Father Name</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {data.map((result, i) => {
              console.log(result)
              return (
                <tr key={i}>
                  <td>{result.data.name}</td>
                  <td>{result.data.fname}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>



    </div>

  </div>
}