// Import Dependencies
const url = require('url')
const MongoClient = require('mongodb').MongoClient
const mongodbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

let cachedDb = null

async function connectToDatabase(uri) {
  if (cachedDb) {
    return cachedDb
  }
  const client = await MongoClient.connect(uri, mongodbOptions)
  const db = await client.db(url.parse(uri).pathname.substr(1))
  cachedDb = db
  return db
}

module.exports = async (req, res) => {
  const db = await connectToDatabase(process.env.MONGODB_URI)
  const collection = await db.collection('thes')
  const thepedia = await collection.find({}).toArray()
  res.status(200).json({ thepedia })
}