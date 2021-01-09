import React, { useState, useEffect } from 'react';
export default function List() {
    const [data, setData] = useState([]);
    useEffect(() => {
        fetch(`/.netlify/functions/read`)
            .then(res => res.json())
            .then(res => {
                setData(res)
            })
    }, [])
    const handleDelete = async message => {
        await fetch("/.netlify/functions/delete", {
            method: "POST",
            body: JSON.stringify({ id: message.ref["@ref"].id }),
        }).then(res => res.json())
            .then()



    }
    return (
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
                            return (
                                <tr key={i}>
                                    <td>{result.data.name}</td>
                                    <td>{result.data.fname}</td>
                                    <td>
                                        <button
                                            onClick={() => {
                                                handleDelete(result)
                                            }}
                                        >
                                            Delete
                </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>



        </div>
    )
}