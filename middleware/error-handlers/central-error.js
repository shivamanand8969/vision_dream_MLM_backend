export const centralError=(error,req,res,next)=>{
  const status= error.statusCode || 500;
  const message= error.message;
  const data=error.data;
  res.status(status).json({
    message:message,
    data:data
  })

}