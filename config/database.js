const mongoose = require('mongoose');

module.exports.connect = async () => {
    try {

        console.log("DATABASE =", process.env.DATABASE);

        await mongoose.connect(process.env.DATABASE);

        console.log("Ket noi thanh cong");

    }
    catch (error) {

        console.log("Ket noi that bai");
        console.log(error);

    }
}