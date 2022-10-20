// const bcrypt = require("bcrypt")

// bcrypt.genSalt(10, (err, salt) => {
//     console.log(err,salt)
//     // bcrypt.hash(plaintextPassword, salt, function(err, hash) {
//     //     // Store hash in the database
//     // });
// })
// bcrypt.hash("pass",10).then((result)=>console.log(result))


// let str=["   one  ,  two   "]
// console.log(Object .prototype.toString.call(str ))

// console.log(true=="true")
// const arr=[1,2,3]
// arr.splice(0,1)
// console.log(arr )


// const axios = require("axios")
// let option={
//     method:"get/post",
//     url:"<url>"
// }
// let data = await axios(option)

// console.log(sortPeople(["Mary","John","Emma"], [180,165,170]))

// let obj = {a:"a",c:"c",b:"b"}
// let hoo = obj.sort()
// console.log(hoo)

// let arr=[[1,2],[3,4],[5,6,[7,8],9],[10,11,12]]
// console.log(arr.flat())

class reservation{
    reserve(seat,typeOfSeat){

    }
    getAvailableSeats(totalSeats,d){
        let sum=0
        for(let i=0;i<d.length;i++){
            if(totalSeats>=d[i]){
                sum+=d[i]
                totalSeats-=d[i]
            }
        }
        return sum
    }
}
class reserveBus extends reservation{
    
    constructor(totalSeats){
        super()
        this.totalSeats=totalSeats
    }
}

let bus = new reserveBus(40)
console.log(bus)
