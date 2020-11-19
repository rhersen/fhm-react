const faunadb = require("faunadb");

const q = faunadb.query;

console.log(process.env.FAUNADB_SECRET);
const faunaClient = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET,
});

async function lastRead() {
  return await faunaClient.query(q.Get(q.Match(q.Index("all_fhm"))));
}

exports.handler = async function ({ httpMethod, body }) {
  console.log(httpMethod, body);
  try {
    if (httpMethod === "GET") {
      const response = await lastRead();
      console.log(response);
      if (!response.data)
        return { statusCode: response.requestResult.statusCode };

      return {
        statusCode: 200,
        body: JSON.stringify(response.data),
      };
    }
  } catch (err) {
    console.log(err); // output to netlify function log
    return {
      statusCode: err.requestResult ? err.requestResult.statusCode : 500,
      body: err.message, // Could be a custom message or object i.e.
    };
  }
};
