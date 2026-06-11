const express = require("express")
const app = express()

app.set("view engine", "ejs")
app.use(express.urlencoded({extended:false}))
app.use(express.static("front"))

app.get("/", (req, res) => {
    res.render("homepage")
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/register", (req, res) => {
    console.log(req.body)
    res.send("Thank you for filling out the form.")
})

app.listen(3000)