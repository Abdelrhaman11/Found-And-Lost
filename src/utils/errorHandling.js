export const asyncHandler=(controller)=>{
    return(req,res,next)=>{
        controller(req,res,next).catch((error)=>{
            return next(console.log(error) )

        })
    }

}

export const globalErrorHandling=(error,req,res,next)=>{
    return res.status(error.cause || 500).json({message:error.message , error , stack:error.stack})
}