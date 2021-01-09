const process = require('process')
var faunadb = require('faunadb'),
  q = faunadb.query;
exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  try {
    const messageBody = JSON.parse(event.body);
    var adminClient = new faunadb.Client({ secret: process.env.FAUNADB_SERVER_SECRET});
    const result = await adminClient.query(
      
      q.Create(
        q.Collection('classes'),
        { data: { name:  messageBody.name,fname:messageBody.fname}}
      )
    )
    return {
      statusCode: 200,
        body: JSON.stringify({ name:  result.ref.name}),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
  }
