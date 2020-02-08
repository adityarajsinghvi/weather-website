const path = require('path')
const express = require('express')
//for the partial files like header and fotter which are common other files
const hbs = require('hbs')
const partialsPath = path.join(__dirname,'../templates/partials')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

// console.log(__dirname)
// console.log(path.join(__dirname, '../public'))

const app = express()
const publicDirectoryPath = path.join(__dirname, '../public')

//hbs default folder name is views but if you want to customise the name of the folder you can do that by

const viewsPath = path.join(__dirname,'../templates/views')
app.set('views', viewsPath)

//For setting up handelbars
hbs.registerPartials(partialsPath)


// app.use(express.static(path.join(__dirname, '../public'))
//setup static directory to server
app.use(express.static(publicDirectoryPath))

//For serving up dynamic page
app.set('view engine', 'hbs')
app.get('', (req,res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Aditya Raj Singhvi',
    })
})

app.get('/about', (req,res) => {
    res.render('about', {
        title: 'About Me!',
        name: 'Aditya Raj Singhvi'
    })
})

app.get('/help', (req,res) => {
    res.render('help', {
        title: 'Help',
        name: 'Aditya Raj Singhvi',
        message: 'I need help!',
    })
})
//this get funt is used to send the response to the server when he visit the domain like app.com the empty string as the first argument ssays that it is the main page without / something like app.com/about then we will use about instead of a empty string
// app.get('', (req, res) => {
//     // res.send('Hello Express!')
//     res.send('<h1>Weather</h1>')
// })

// app.get('/help',(req, res) => {
//     // res.send('Help page!')
//     // res.send({
//     //     name: 'Aditya',
//     //     age: 19
//     // })
//     res.send([{
//         name: 'Aditya'
//     }, {
//         name: 'Raj'
//     }])
// })

// app.get('/about',(req, res) => {
//     res.send('About page!')
// })

app.get('/weather',(req,res) => {
    if(!req.query.address){
                return res.send({
                    error : 'You must provide an Address'
                })
            }
            else {
                geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
                    if (error) {
                        return res.send({error})
                    }
            
                    forecast(latitude, longitude, (error, forecastData) => {
                        if (error) {
                            return res.send({error})
                        }
                        
                        res.send({
                                    forecast: forecastData,
                                    location,
                                    address: req.query.address,
                                    })
                        
                    })
                })
            }
    //         console.log(req.query.address)
    //         res.send({
    //             forecast: 'It is snowing',
    //             location: 'Philadelphia',
    //             address: req.query.address,
    //         })


})

//handling Queries 'someurl?query=value'
// app.get('/products', (req, res) => {
//     if(!req.query.search){
//         return res.send({
//             error : 'You must provide a search term'
//         })
//     }
//     console.log(req.query.search)
//     res.send({
//         products: []
//     })
// })

//for all the other links other than the one declared
app.get('/help/*', (req, res) => {
    res.render('error', {
        title: 'Error',
        name: 'Aditya Raj Singhvi',
        message: 'Help article not found',
    })
})

app.get('*',(req, res) => {
    res.render('error', {
        title: 'Error',
        name: 'Aditya Raj Singhvi',
        message: 'Page Not Found!',
    })
})


//to start the server,   3000 is the port number
app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})