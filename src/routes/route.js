const express = require('express');
const router = express.Router();

router.get('/students/:name', function(req, res) {
    let studentName = req.params.name
    console.log(studentName)
    res.send(studentName)
})

router.get("/random" , function(req, res) {
    res.send("hi there")
})


router.get("/test-api" , function(req, res) {
    res.send("hi FunctionUp")
})


router.get("/test-api-2" , function(req, res) {
    res.send("hi FunctionUp. This is another cool API")
})


router.get("/test-api-3" , function(req, res) {
    res.send("hi FunctionUp. This is another cool API. And NOw i am bored of creating API's ")
})


router.get("/test-api-4" , function(req, res) {
    res.send("hi FunctionUp. This is another cool API. And NOw i am bored of creating API's. PLZ STOP CREATING MORE API;s ")
})



router.get("/test-api-5" , function(req, res) {
    res.send("hi FunctionUp5. This is another cool API. And NOw i am bored of creating API's. PLZ STOP CREATING MORE API;s ")
})

router.get("/test-api-6" , function(req, res) {
    res.send({a:56, b: 45})
})

router.post("/test-post", function(req, res) {
    res.send([ 23, 45 , 6])
})


router.post("/test-post-2", function(req, res) {
    res.send(  { msg: "hi" , status: true }  )
})

router.post("/test-post-3", function(req, res) {
    // let id = req.body.user
    // let pwd= req.body.password

    // console.log( id , pwd)

    console.log( req.body )

    res.send(  { msg: "hi" , status: true }  )
})



router.post("/test-post-4", function(req, res) {
    let arr= [ 12, "functionup"]
    let ele= req.body.element
    arr.push(ele)
    res.send(  { msg: arr , status: true }  )
})

//================================================= Assignment Post API ============================================================================

// Q1) Write a POST /players api that creates a new player (i.e. that saves a player's details and doesn't allow saving the data of a player that already esxists in the data)

let players = [
    {
        "name" : "manish",
        "dob" : "1/1/1995",
        "gender" : "male",
        "city" : "jalandhar",
        "sports" : [
            "swimming"
        ]
    },
    {
        "name" : "gopal",
        "dob" : "1/09/1995",
        "gender" : "male",
        "city" : "delhi",
        "sports" : [
            "soccer"
        ]
    },
    {
        "name" : "lokesh",
        "dob" : "1/1/1999",
        "gender" : "male",
        "city" : "mumbai",
        "sports" : [
            "soccer"
        ]
    }
]

router.post('/players', function(req, res){

    // LOGIC WILL COME HERE

    let newPlayer = req.body
    let newPlayersName = newPlayer.name
    let isNameRepeated = false

    for(let i=0; i<players.length; i++){
        if(players[i].name == newPlayersName){
           isNameRepeated = true;
           break;
        }
    }
    
    if(isNameRepeated){
        res.send("This player was added !")
    }
    else{
        players.push(newPlayer)
    }

    console.log(players)
    res.send(players)

})

module.exports = router;