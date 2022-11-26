//NODE-JS

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require("lodash")
// const date = require(__dirname + "/date.js")

const app = express()

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended: true}))
//use to connect the html to the server 
//MUST HAVE when we use post method
app.use(express.static("public")) //To make sure that our design
//will run in the server - also create folder public

mongoose.connect("mongodb+srv://christian:christian@cluster0.1brvalq.mongodb.net/todolistDB", {useNewUrlParser: true})
// SCHEMA
const itemsSchema = {
    name: String
}
//MODEL - model mostly use capital letter
const Item = mongoose.model("Item", itemsSchema)

//Mongoose Document
const item1 = new Item({
    name: "Refreshing what i learn"
})
const item2 = new Item({
    name: "Forgetting them"
})
const item3 = new Item({
    name: "Should be remember"
})

const defaultItems = [item1, item2, item3]

const listSchema = {
    name: String,
    items: [itemsSchema]
}

const List = mongoose.model("List", listSchema)

app.get("/", function(req, res) {
    // let day = date.getDate()

    //Mongoose.find
    //{} - means ALL    //find give us ARRAY
    Item.find({}, function(err, foundItems){
        if(foundItems.length === 0) {
            //MONGOOSE - INSERT
            Item.insertMany(defaultItems, function (err) { 
                if(err) {
                    console.log(err);
                } else {
                    console.log("Data has been successfully added to the DB");
                
                }
                res.redirect("/")
             })
            // ------------------
        }else {
            res.render("list", { listTitle: "Today", newListItems: foundItems})
        }
    })

    // List.deleteMany({name: "home"}, function (err) { 
    //     if(!err) {
    //         console.log("Deleted");
    //     }
    //  })
})

app.post("/", function(req, res) {
    const itemName = req.body.newItem
    const listName = req.body.list

    const item = new Item({
        name: itemName
    })

    if(listName === "Today") {
        item.save()
        res.redirect("/")
    } else {
        List.findOne({name: listName}, function (err, foundList) { 

            foundList.items.push(item)
            foundList.save()
            res.redirect("/" + listName)
         })
    }
})

app.post("/delete", function (req, res) { 
    checkItemId = req.body.checkbox
    const listName = req.body.listName

    if(listName === "Today") {
        Item.findByIdAndRemove(checkItemId, function (err) { 
        if(err) {
            console.log(err);
        } else {
            console.log(checkItemId + "ID is deleted");
            res.redirect("/")
        }
     })
    } else {
        List.findOneAndUpdate({name: listName},
            {$pull: {items: {_id: checkItemId}}} ,//$pull from mongoDB
            function(err, foundList) {
                if(!err) {
                    res.redirect("/" + listName)
                } 
        })
    }

    
 })

 app.get("/:customeListName", function (req, res) { 
    const customListName = _.capitalize(req.params.customeListName) 

    //findOne - give us OBJECT
    List.findOne({name: customListName}, function (err, foundList) { 
        if(!err) {
            if(!foundList) {
                const list = new List({
                    name: customListName,
                    items: defaultItems
                })
                list.save()
                res.redirect("/" + customListName)
            } else {
                res.render("list",  { listTitle: foundList.name, newListItems: foundList.items})
                
            }
        } else {
            console.log(err);
        }
     })

    
    
 })


// app.post("/work", function (req, res) { 
//     let item = req.body.newItem
//     workItems.push(item)

//     res.redirect("/work")
//  })

// app.get("/about", function(req, res) {
//     res.render("about")
// })



app.listen(3000, function() {
    console.log("Server is started on port 3000");
})