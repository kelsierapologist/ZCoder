const mongoose = require('mongoose');

const url = "mongodb+srv://dhruvgenie21:dada%4021ZCODER@zcoder-cluster.ex3sqrf.mongodb.net/?retryWrites=true&w=majority&appName=Zcoder-cluster"

module.exports.connect = () => {
    mongoose.connect(url).then((res) => {
        console.log("MongoDB connected Successfully")
    }).catch((error) => {
        console.log(error)
    })
}