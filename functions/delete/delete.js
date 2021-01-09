// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const process = require('process')
var faunadb = require('faunadb'),
  q = faunadb.query;
const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  try {
    const messageBody = JSON.parse(event.body);
    var adminClient = new faunadb.Client({ secret: process.env.FAUNADB_SERVER_SECRET});
  let result = await adminClient.query(
    q.Delete(
      q.Ref(q.Collection('classes'), messageBody.id)
    )
    )
  
  return {
    statusCode: 200,
      body: JSON.stringify({message:"deleted"}),
 
  }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
