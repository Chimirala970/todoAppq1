const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()
app.use(express.json())

const dbPath = path.join(__dirname, 'todoApplication.db')
let db = null

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Runnning at http://localhost:3000/')
    })
  } catch (e) {
    console.log('DB Error : ${e.message}')
    process.exit(1)
  }
}
initializeDbAndServer()

app.get('/todos/', async (request, response) => {
  const {search_q, category, priority, status} = request.query
  let getList = ''
  let data = null
  switch (true) {
    case priority === 'HIGH' && status === 'IN PROGRESS':
      getList = `SELECT * FROM todo WHERE status = '${status}' and priority = '${priority}';`
      data = await db.all(getList)
      response.send(data)
      break
    case category === 'WORK' && status === 'DONE':
      getList = `SELECT * FROM todo WHERE category = '${category}' and status = '${status}';`
      data = await db.all(getList)
      response.send(data)
      break
    case category === 'LEARNING' && priority === 'HIGH':
      getList = `SELECT * FROM todo  WHERE category = '${category}' and priority = '${priority}';`
      data = await db.all(getList)
      response.send(data)
      break
    case status !== undefined:
      getList = `SELECT * FROM todo WHERE status = '${status}' ;`
      data = await db.all(getList)
      response.send(data)
      break

    case priority !== undefined:
      getList = `SELECT * FROM todo WHERE priority = '${priority}';`
      data = await db.all(getList)
      response.send(data)
      break

    case search_q !== undefined:
      getList = `SELECT * FROM todo WHERE todo LIKE '%${search_q}%';`
      data = await db.all(getList)
      response.send(data)
      break

    case category !== undefined:
      getList = `SELECT * FROM todo WHERE category = '${category}';`
      data = await db.all(getList)
      response.send(data)
      break
  }
  // response.send('Hi')
})

module.exports = app
