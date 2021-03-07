const express = require('express')
const app = express()
const path = require('path')

const port = 3000

const db = []


app.get('/', function(req,res) {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/createUser', function(req, res) {
    let userData = req.query
    db.push(userData)
    console.log(db)
    res.status(201).redirect('/')
})

app.get('/countBooks', function(req, res) {
    function map(f,data) {
        let favouriteBooks = []
        for(item of data){
            let thing = f(item)
            favouriteBooks.push(thing)
        }
        return favouriteBooks
    }
    
    function getBook(data) {
        let faveBook = data.favBook
        return faveBook
    }
    let books = map(getBook,db,0)
    db.push(books)        
    res.status(201).redirect('/showPopularBook')
})

app.get('/showPopularBook', function(req, res) {
    let books = db[db.length-1]
    let data = books

    function getBook(data){
        let obj = {}
        let results =[]

        data.forEach(item =>{
            if (!obj[item]){
                obj[item] = 1   
            }else {
                obj[item] += 1
            }
        })
        
        let vals = Object.values(obj)
        let start = vals[0]
        let restOfit = vals.splice(1,vals.length)
        let reduce = function (func, data, init) {
            let cumulative = init
            for (let item of data) {
               cumulative = func(cumulative, item)  
            }
            
            return cumulative
        }
        
        let mostFavoured = function (current_highest, newVal) {
            if (newVal > current_highest) {
                return newVal  
            } else {
                return current_highest  
            } 
        }

        let mostLiked = reduce(mostFavoured, restOfit, start)

        for(prop in obj){
            if(obj[prop] === mostLiked){
                results.push(prop)
            }
        }
        return results    
    }
    let faves = getBook(data)
    if(faves.length === 1){
        res.send(`<h2>The most favoured book is ${faves}</h2>`)
    } else {
        res.send(`<h2>The most favoured books are ${faves}</h2>`)
    }
    
})

app.listen(port, () => {
    console.log(`Server is running on localhost:${port}`)
})