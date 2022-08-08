const d = new Date()

const printDate = function(){
    console.log("Date : " + d)
}

let month = d.getMonth()

const printMonth = function(){
    console.log("Month : " + month + " (NOTE : January = 0, February = 1 , ... , December = 11)")
}

const getBatchInfo = function(){
    console.log("Batch Plutonium. Week 3 Day 3. The topic for today is Nodejs module system.")
}

module.exports.printDateFunction = printDate

module.exports.printMonthFunction = printMonth

module.exports.getBatchInfoFunction = getBatchInfo
