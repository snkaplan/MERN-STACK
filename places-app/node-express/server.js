const express = require('express');
const bodyParser = require('body-parser');
const fs = require("fs");
const placesRoutes = require("./routes/places-routes")
const usersRoutes = require("./routes/users-routes")

const HttpError = require("./models/http-error")
const app = express();
const mongoose = require("mongoose");

const path = require("path")
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

app.use(bodyParser.json());

app.use("/uploads/images",express.static(path.join("uploads","images")));

app.use("/api/places",placesRoutes) // only requests that starts with /api/places will forward to placesRoutes router.
app.use("/api/users",usersRoutes)

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if(req.file){
      fs.unlink(req.file.path,(err)=>{
        console.log(err);
      });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500)
  res.json({message: error.message || 'An unknown error occurred!'});
});

mongoose
.connect("mongodb+srv://admin:VxTexsjf6oc7gEzj@cluster0-74qdq.mongodb.net/test?retryWrites=true&w=majority",{ useNewUrlParser: true ,useUnifiedTopology: true}).
then(()=>{
    app.listen(5000);
}).
catch((err)=>{
    console.log(err);
});
