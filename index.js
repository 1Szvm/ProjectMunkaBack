import express from "express"
import cors from 'cors'
import { removeFromCloud } from "./cloudinaryConfig.js"

const app=express()
app.use(cors())
app.use(express.json())

const port=process.env.PORT || 5000

app.delete('/post/:id',async(req,res)=>{
    try {
        const {id}=req.params
        removeFromCloud(id)
        res.json({msg:"sikeres törlé"})
    } catch (error) {
        console.log(error);
    }
})

app.listen(port,()=>console.log("server listening on port: "+port))