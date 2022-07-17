// Express untuk routing
var express = require("express")
// bodyParse sebagai  pembaca input dari form atau request dari parameter url cth: localhost:3000?id=1234
var bodyParser = require("body-parser")
// mongoose berperan sebagai database management system
var mongoose = require("mongoose")

// inisiasi express menggunakan const app
const app = express()
// inisiasi app untuk bisa menggunakan bodyParser
app.use(bodyParser.json())
// 
app.use(express.static('public'))
// 
app.use(bodyParser.urlencoded({extended:true}))
const port = process.env.port || 3000;
// koneksi database via mongodb
//website-real-estate
//zT1SGP7idyoYpowB
const database = process.env.MONGO_URI || "mongodb+srv://website-real-estate:zT1SGP7idyoYpowB@website-real-estate.pyurc.mongodb.net/?retryWrites=true&w=majority";//mongodb://Localhost:27017/mydb
mongoose.connect(database);
mongoose.connection.on("connected",()=>{
    console.log(`${database} terkoneksi`)
})
// set db sebagai variabel database
var db = mongoose.connection;
// JIka db error akan dilempar pesan ke console
db.on('error', ()=>console.log("Error connecting to Database"));
// Jika db berhasil koneksi akan lempar pesan berhasil koneksi
db.once('open',()=>console.log("Connected Database"))

//membuat model untuk table
var webSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String
});

// set Variabel web untuk menggunakan schema yang dibuat
var Web = mongoose.model("Web", webSchema);

// Routing root (diawal)
app.get("/", function(req,res){
    res.redirect("/webs");
});

// Routing dengan endpoint /webs dengan metode get
app.get("/webs", function(req,res){
    Web.find({}, function(err, webs){
        if(err){
            console.log("ERROR!");
        } else {
            res.render("index", {webs:webs});
        }
    });
});

// Routing dengan endpoint /webs dengan metode get
app.post("/webs", function(req, res){
    // inisiasi variabel input
    var name = req.body.name
    var email = req.body.email
    var message = req.body.message

    // penyatuan variabel ke dalam array data
    var data = {
        "name":name,
        "email":email,
        "message":message
    }

    // Proses insert data ke variabel
    db.collection('Web').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record Inserted Successfully");
    });

    //ketika berhasil akan dilarikan ke endpoint "/"
    return res.redirect('/')
});

app.listen(port, function(){
    console.log(`Listen on port ${port}`);
})