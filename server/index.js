const express = require("express")
const mongoose = require("mongoose")
const app = express()
const dotenv=require('dotenv')
const cors = require('cors')
const path = require('path')
const authRoute = require("./routes/auth.js")
const userRoute = require("./routes/users.js")
const postRoute = require("./routes/posts.js") 
const commentRoute = require("./routes/comments.js")
const cookieParser = require("cookie-parser")
const multer = require("multer")
const User = require("./models/User");
const bcrypt = require("bcrypt");

const connectDB = async()=>{
  try{
    await mongoose.connect(process.env.MONGO_URL)
    console.log("Database Connected Successfully!!")
  } catch(err){
    console.log(err)
  }
}
connectDB();
dotenv.config()

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use("/api/auth",authRoute)
app.use("/api/user",userRoute)
app.use("/api/posts",postRoute)
app.use("/api/comments",commentRoute)
app.use("/images",express.static(path.join(__dirname,"/images")))
app.get("/", (req, res) =>{
  res.send("API IS RUNNING")
})
const storage=multer.diskStorage({
  destination:(req,file,fn)=>{
      fn(null,"images")
  },
  filename:(req,file,fn)=>{
      fn(null,req.body.img)
      // fn(null,"image1.jpg")
  }
})
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hashSync(password, salt);
    // const newUser = new User({ username, email, password: hashedPassword });
    // const savedUser = await newUser.save();
    res.status(200).json(req.body);
  } catch (err) {
    res.status(500).json(err);
  }
});
const upload=multer({storage:storage})
app.post("/api/upload",upload.single("file"),(req,res)=>{ 
    res.status(200).json("Image has been uploaded successfully!")
})

app.listen(process.env.PORT,()=>{
  connectDB();
  console.log("App is Runnning on PORT "+process.env.PORT)
})

module.exports=app;
