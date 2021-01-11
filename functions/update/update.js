// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const process = require('process')
var faunadb = require('faunadb'),
  q = faunadb.query;
const handler = async (event) => {
    const obj = JSON.parse(event.body)
    var adminClient = new faunadb.Client({ secret: process.env.FAUNADB_SERVER_SECRET});
  let result = await adminClient.query(
      q.Update(q.Ref(q.Collection('classes'), obj.id), {
        data: { name: obj.name ,fname:obj.fname},
      })
    )
    //q.Delete(
     // q.Ref(q.Collection('classes'), messageBody.id)
    //)
    
  return {
    statusCode: 200,
      body: JSON.stringify({message:"updated"}),
 
  }
  
}

module.exports = { handler }
