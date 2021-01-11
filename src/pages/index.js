import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Formik } from 'formik';
import TextField from '@material-ui/core/TextField';
import CircularProgress from "@material-ui/core/CircularProgress"

export default function Home() {
  const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }));

  const classes = useStyles();
  let [data, setData] = useState([]);
  let [dataFetching, setdataFetching] = useState(false)
  let retreiveData = async () => {
      setdataFetching(true)
     await fetch(`/.netlify/functions/read`)
      .then(res => res.json())
      .then(res => {
        setData(res)
        setdataFetching(false)
      })
  }
  useEffect(() => {
    retreiveData() 
  }, [])

  const handleDelete = async message => {
    await fetch("/.netlify/functions/delete", {
      method: "POST",
      body: JSON.stringify({ id: message.ref["@ref"].id }),
    })
    retreiveData()



  }
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
        })
      retreiveData() 
     }
  }
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
        <form className={classes.root} noValidate autoComplete="off"
          onSubmit={handleSubmit}
        >
          <TextField
            id="standard-basic"
            label="Name"
            type="text"
            name="name"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.name}
          />
          {errors.name && touched.name && errors.name}
          <br />
          <TextField
            id="standard-basic"
            label="Father Name"
            type="text"
            name="fname"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.fname}
          />
          {errors.name && touched.name && errors.name}
          <br />

          <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}
          >
            Add Message
      </Button>
        </form>
      )}
    </Formik>
    {dataFetching ? (
      <div>
        <CircularProgress />
      </div>
    ) : data.length >= 1 ? (

      <div>
        <h1>Data From FaunaDB</h1>
        <div>
          <table border="1">
            <thead>
              <tr>
                <th>Name</th>
                <th>Father Name</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {data.map((result, i) => {
                return (
                  <tr key={i}>
                    <td>{result.data.name}</td>
                    <td>{result.data.fname}</td>
                    <td>
                      <Button variant="contained" color="secondary"
                        onClick={() => {
                          handleDelete(result)
                        }}
                      >
                        Delete
                </Button>

                    </td>
                  </tr>
                )
              }
              )
              }
            </tbody>
          </table>
        </div>



      </div>

    ) : (
          <div className="no-task">
            <h4>No Task for today</h4>
          </div>
        )
    }
  </div>
}