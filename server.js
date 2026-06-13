const bcrypt = require("bcrypt")
const express = require("express")
const db = require("better-sqlite3")("ourApp.db")
db.pragma("journal_mode = WAL")

// Database setup here
const createTables = db.transaction(() => {
    db.prepare(
        `
        CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username STRING NOT NULL UNIQUE,
        password STRING NOT NULL
        )
        `
    ).run()
})

createTables()

// Database setup ends here

const app = express()

app.set("view engine", "ejs")
app.use(express.urlencoded({extended:false}))
app.use(express.static("front"))

app.use(function (req, res, next) {
    res.locals.errors = []
    next()
})

app.get("/", (req, res) => {
    res.render("homepage", {errors: []})
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/register", (req, res) => {
    const errors =[]

    if (typeof req.body.username !=="string") req.body.username = ""
    if (typeof req.body.password !=="string") req.body.password = ""

    req.body.username = req.body.username.trim()

    if (!req.body.username) errors.push("You must provide a username.")
    if (req.body.username && req.body.username.length < 3) errors.push("Username must be at least 3 characters.")
    if (req.body.username && req.body.username.length > 10) errors.push("Username cannot exceed 10 characters.")
    if (req.body.username && !req.body.username.match(/^[a-zA-Z0-9]+$/)) errors.push("Username can only contain letters and numbers.")

    if (!req.body.password) errors.push("You must provide a password.")
    if (req.body.password && req.body.password.length < 8) errors.push("Password must be at least 8 characters.")
    if (req.body.password && req.body.password.length > 70) errors.push("Password cannot exceed 70 characters.")

    if (errors.length) {
        return res.render("homepage",{errors})
    }
    
    // Save the new user into database.
    const salt = bcrypt.genSaltSync(10)
    req.body.password = bcrypt.hashSync(req.body.password, salt)

    const ourStatement = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)")
    ourStatement.run(req.body.username, req.body.password)


    res.send("Thank You!")
   
})

app.listen(3000)