// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const process = require('process')
var faunadb = require('faunadb'),
  q = faunadb.query;
const handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  try {var adminClient = new faunadb.Client({ secret: process.env.FAUNADB_SERVER_SECRET});
  let result = await adminClient.query(
    q.Map(
      q.Paginate(q.Documents(q.Collection("classes"))),
      q.Lambda(x => q.Get(x))
    ))
  
  return {
    statusCode: 200,
      body: JSON.stringify(result.data),
 
  }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
