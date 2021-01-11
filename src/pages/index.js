import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Form, Formik, Field } from "formik"
import TextField from '@material-ui/core/TextField';
import CircularProgress from "@material-ui/core/CircularProgress"
import Modal from '@material-ui/core/Modal';
function rand() {
  return Math.round(Math.random() * 20) - 10;
}
function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));
export default function Home() {
  const classes = useStyles();
  let [data, setData] = useState([]);
  const [fetchData, setFetchData] = useState(false)
  const [updatingData, setUpdatingData] = useState(undefined)
  let [dataFetching, setdataFetching] = useState(false)
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);


  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  // body of update modal
  const bodyUpdate = (
    <div style={modalStyle} className={classes.paper}>
      <Formik
        onSubmit={(value, actions) => {
          fetch(`/.netlify/functions/update`, {
            method: "post",
            body: JSON.stringify({
              name: value.name,
              fname: value.fname,
              id: updatingData.ref["@ref"].id,
            }),
          })
            .then(res => res.json())
            .then(res => console.log(res))
          setFetchData(true)
          actions.resetForm({
            values: {
              name: "",
              fname: "",

            },
          })
          setFetchData(false)
          handleClose()
        }}
        initialValues={{
          name: updatingData !== undefined ? updatingData.data.name : "",
          fname: updatingData !== undefined ? updatingData.data.fname : "",
        }}
      >
        {formik => (
          <Form onSubmit={formik.handleSubmit} className="form">
            <Field
              as={TextField}
              multiline
              rowMax={4}
              type="text"
              name="name"
              id="name"
              className="field"
            />
            <Field
              as={TextField}
              multiline
              rowMax={4}
              type="text"
              name="fname"
              id="fname"
              className="field"
            />
            <div className="btn-form">
              <button type="submit">update</button>
              <button type="button" onClick={handleClose}>
                close
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
 
  useEffect(() => {
    setdataFetching(true)
    fetch(`/.netlify/functions/read`)
    .then(res => res.json())
    .then(res => {
      setData(res)
      setdataFetching(false)
    })  }, [fetchData])
  const updateMessage = (id) => {
    var updateData = data.find(mes => mes.ref["@ref"].id === id)
    setUpdatingData(updateData)
    setdataFetching(true)

  }
  const handleDelete = async message => {
    await fetch("/.netlify/functions/delete", {
      method: "POST",
      body: JSON.stringify({ id: message.ref["@ref"].id }),
    })
    .then(res=>res.json())
    .then(res=>console.log(res))
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

          <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}          >
            Add Message
      </Button>
        </form>
      )}
    </Formik>
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      {bodyUpdate}
    </Modal>
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
                <th>Update</th>

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
                          handleDelete(result);
                        }}
                      >
                        Delete
                </Button>

                    </td>
                    <td>
                      <Button variant="contained" color="primary"
                        onClick={() => {
                          handleOpen()
                          updateMessage(result.ref["@ref"].id)
                        }}
                        >
                        Update
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