const express = require("express")
const server = express()

// pegar o banco de dados
const db = require("./database/db")

// Habilitar o uso do req.body na nossa aplicação
server.use(express.urlencoded({ extended: true }))

// configurar pasta publica
server.use(express.static("public"))

// utilizando template engine
const nunjucks = require("nunjucks")

nunjucks.configure("src/view", {
  express: server,
  noCache: true
})

// configura caminhos da minha aplicação
// Pagina inicial
//req: requisição
//res: resposta

server.get("/", (req, res) => {
  return res.render("index.html")
})

server.get("/Create-point", (req, res) => {
  return res.render("Create-point.html")
})

server.post("/savepoint", (req, res) => {

  const query = `
      INSERT INTO places (
        image,
        name,
        address,
        address2,
        state,
        city,
        items
      ) VALUES (?, ?, ?, ?, ?, ?, ?);
    `

  const values = [
    req.body.image,
    req.body.name,
    req.body.address,
    req.body.address2,
    req.body.state,
    req.body.city,
    req.body.items
  ]

  function afterInsertData(err) {
    if (err) {
      return console.log(err)
    }
    console.log("Cadastro com sucesso")
    console.log(this)

    return res.render("Create-point.html", { saved: true })

  }
  db.run(query, values, afterInsertData)

})


server.get("/search", (req, res) => {


  const search = req.query.search

  if (search == "") {
    //pesquisa vazia
    return res.render("search-results.html", { total: 0 })
  }
  // pegar os dados do banco

  db.all(`SELECT * FROM places WHERE city LIKE  '%${search}%'`, function (err, rows) {
    if (err) {
      console.log(err)
      return res.send("Erro no cadastrado!")
    }

    const total = rows.length
    console.log(rows)
    return res.render("search-results.html", { places: rows, total: total })
  })

})

//  ligar o servidor
server.listen(3000)