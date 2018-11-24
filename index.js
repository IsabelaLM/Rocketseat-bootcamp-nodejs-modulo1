const express = require('express')
const nunjucks = require('nunjucks')

const app = express()

nunjucks.configure('views', {
  autoescape: true,
  express: app,
  watch: true
})

app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'njk')

let age = 0

const myMiddleware = (req, res, next) => {
  console.log(
    `HOST: ${req.headers.host} | URL: ${req.url} | METHOD: ${
      req.method
    } | QUERY: ${req.query.idade} | BODY: ${req.body.idade}`
  )

  if (req.query.idade == '') {
    console.log('no query param!')
    return res.redirect('/')
  } else {
    console.log('ok')
    return next()
  }
}

app.get('/', (req, res) => {
  return res.render('age')
})

app.post('/check', (req, res) => {
  age = req.body.age
  return age >= 18
    ? res.redirect(`/major/?idade=${age}`)
    : res.redirect(`/minor/?idade=${age}`)
})

app.get('/major', myMiddleware, (req, res) => {
  return res.render('major', { age })
})

app.get('/minor', myMiddleware, (req, res) => {
  return res.render('minor', { age })
})

app.listen(3000)
