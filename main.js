const express = require('express')
const app = express()
const port = 3000

app.use(express.static(__dirname + '/templates'));
app.use('/static', express.static('static'))

app.get('/', (req, res) => {
  res.sendFile('./templates/index.html', {root: __dirname})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

