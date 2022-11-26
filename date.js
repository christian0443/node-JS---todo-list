const today = new Date()

exports.getDate =  function () {  
const options = {
    weekday: "long",
    day: "numeric",
    month: "long"
}
 return today.toLocaleDateString("en-US", options)
//instead of using if else or switch
//we use toLocaleDateString use to shorten on how we get the dates
}

exports.getDay = function () {  
    const options = {
        weekday: "long"
    }
    return today.toLocaleDateString("en-US", options)
    //instead of using if else or switch
    //we use toLocaleDateString use to shorten on how we get the dates
    
    }