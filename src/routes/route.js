const express = require('express');
const abc = require('../introduction/intro')
const router = express.Router();

const lodash = require("lodash");

router.get("/test-me", function (req, res) {
  // lodash
  // Month division
  let month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  let result = lodash.chunk(month,3)
  console.log(result);
  //Finding 9th no element
  let hi = [ 1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
  let result2 = lodash.tail(hi,9);
  console.log(result2);
  // Merging 5 to 1 array which are duplicate
  let arr1 =  [ 1, 3, 5]
  let arr2 =  [ 1, 3, 7]
  let arr3 = [ 1, 3, 9]
  let arr4 = [ 1, 3, 11]
  let arr5 = [ 1, 3, 13]
  let result3 = lodash.union(arr1,arr2,arr3,arr4,arr5); 
  console.log(result3);
  // array to object 
  let obj = [["horror","The Shining"],["drama","Titanic"],["thriller","Shutter Island"],["fantasy","Pans Labyrinth"]]
  let result4 = lodash.fromPairs(obj);
  console.log(result4);

  // API Response
  res.send("hello");
});

module.exports = router;

router.get('/test-me', function (req, res) {
    console.log('My batch is', abc.name)
    abc.printName()
    logger.welcome()

    res.send('My second ever api!')
});

router.get('/students', function (req, res){
    let students = ['Sabiha', 'Neha', 'Akash']
    res.send(students)
})

router.get('/student-details/:name', function(req, res){
    /*
    params is an attribute inside request that contains 
    dynamic values.
    This value comes from the request url in the form of an 
    object where key is the variable defined in code 
    and value is what is sent in the request
    */

    let requestParams = req.params

    // JSON strigify function helps to print an entire object
    // We can use any ways to print an object in Javascript, JSON stringify is one of them
    console.log("This is the request "+ JSON.stringify(requestParams))
    let studentName = requestParams.name
    console.log('Name of the student is ', studentName)
    
    res.send('Dummy response')
})

//======================================================== Assignment Solutions ==========================================================================

//first 
router.get('/get-movies',function(req, res){ //student detail api 
    let movies1= ["shole ","Rang de basanti","dil mange more","tiranga"]//api is implementation is used to send response for request
    res.send(movies1)
})

// second 
router.get('/get-movie/:indexNumber',function(req, res){ //student detail api
    
    let movies=['rang de basanti','The shining','Lord of the rings','batman begins']
    let index = req.params.indexNumber;
    console.log(movies[index])
     res.send(movies[index])
})

//Third  
router.get('/get-moviess/:indexNumber',function(req, res){ //student detail api 
    
    let moviesName=['rang de basanti','The shining','Lord of the rings','batman begins']
    let index = req.params.indexNumber;

     if(index > moviesName.length){
        return res.send("use a valid index  ")
     }else{
    
     res.send(moviesName[index])
     }
})

//forth 
router.get('/get-/films', function (req, res) { //student detail api 

        let moviesName = [{ "id": 1, "name": "The Shining" },
        { "id": 2, "name": "Incendies" },
        { "id": 3, "name": "Rang de Basanti" },
        { "id": 4, "name": "Finding Nemo" }]
        res.send(moviesName)
    })


//fifth
router.get('/get-/films/:indexNumber', function (req, res) { //student detail api 

        let moviesName = [{ "id": 1, "name": "The Shining" },
        { "id": 2, "name": "Incendies" },
        { "id": 3, "name": "Rang de Basanti" },
        { "id": 4, "name": "Finding Nemo" }]
        let index = req.params.indexNumber;
        if (index > moviesName.length) {
            return res.send("no movie exist with this id ")
        } else {
            res.send(moviesName[index])
        }
    })

module.exports = router;