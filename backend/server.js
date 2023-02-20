const express = require('express')
const colors = require("colors")
const dotenv = require('dotenv').config()
const { errorHandler } = require("./middleware/errorMiddleware")
const connectDB = require("./config/db")
const port = process.env.PORT || 5000
const cors = require('cors');
const fileupload = require("express-fileupload");
const bodyParser = require('body-parser');
const fs = require('fs');
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });



connectDB()

const app = express()

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(fileupload());
// app.use(express.static("files"));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/employees', require('./routes/employeeRoutes'))
app.use('/api/attendances', require('./routes/attendanceRoutes'))
app.use('/api/leaves', require('./routes/leaveRoutes'))
app.use('/api/login', require('./routes/authenticationRoutes'))
app.use('/api/location', require('./routes/locationRoutes'))

app.get('/view/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = `./uploads/${imageName}`;
    fs.readFile(imagePath, (err, data) => {
        if (err) {
            res.status(404).send("Image not found");
            return;
        }
        var fileformat = req.params.imageName.substring(req.params.imageName.length - 3)
        console.log(fileformat);
        if (fileformat == "pdf") {
            res.contentType('application/pdf')
        } else if (fileformat == "jpeg") {
            res.contentType('image/jpeg')
        } else if (fileformat == "jpg") {
            res.contentType('image/jpg')
        } else if (fileformat == "png") {
            res.contentType('image/png')
        }
        res.send(data);
    });
});

app.use(errorHandler)

app.listen(port, () => console.log(`Server started on port ${port}`))