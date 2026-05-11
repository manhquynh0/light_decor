const Contact = require("../../models/contact.model");
module.exports.contact = async (req, res) => {
    res.render("client/pages/contact", {

    })
}
module.exports.createPost = async (req, res) => {
    const contact = new Contact(req.body)
    await contact.save()

    res.json({
        code: "success"

    })
}