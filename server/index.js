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

const connectDB = async()=>{
  try{
    await mongoose.connect(process.env.MONGO_URL)
    console.log("Database Connected Successfully!!")
  } catch(err){
    console.log(err)
  }
}

dotenv.config()

app.use(express.json())
app.use(cookieParser())
app.use(cors({origin:'https://otaku-blogs.vercel.app/',credentials:true}))
app.use("/api/auth",authRoute)
app.use("/api/user",userRoute)
app.use("/api/posts",postRoute)
app.use("/api/comments",commentRoute)
app.use("/images",express.static(path.join(__dirname,"/images")))

const storage=multer.diskStorage({
  destination:(req,file,fn)=>{
      fn(null,"images")
  },
  filename:(req,file,fn)=>{
      fn(null,req.body.img)
      // fn(null,"image1.jpg")
  }
})

const upload=multer({storage:storage})
app.post("/api/upload",upload.single("file"),(req,res)=>{ 
    res.status(200).json("Image has been uploaded successfully!")
})

app.listen(process.env.PORT,()=>{
  connectDB();
  console.log("App is Runnning on PORT "+process.env.PORT)
})

module.exports=app;
