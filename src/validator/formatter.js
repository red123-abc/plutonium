let text = " FunctionUp ! "
let text2 = "FunctionUp !"
let result1 = text.trim()
let result2 = text2.toLowerCase()
let result3 = text2.toUpperCase()

const trim = function() {
  console.log("Before trim : " + text)
  console.log("After trim : " + result1)
}

const changeToLowerCase = function() {
    console.log("Before changeToLowerCase : " + text2)
    console.log("After changeToLowerCase : " + result2)
}

const changeToUpperCase = function() {
    console.log("Before changeToUpperCase : " + text2)
    console.log("After changeToUpperCase : " + result3)
}

module.exports.trimFunction = trim

module.exports.changeToLowerCaseFunction = changeToLowerCase

module.exports.changeToUpperCaseFunction = changeToUpperCase

