var url = 'https://script.googleusercontent.com/macros/echo?user_content_key=F4CXWA2MBA8pkOJQqkDfJGALRV6fZ08h5YOyRV0GuOPIjG29dvncySJIRbzibyq7FKYd6rTgcgdf9pYBUgN7IsFcBy2iRTrXm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnKxhnXDbCfBp2D7V11DYUy6xUlsRw-fZsgKq1tXmpCWIhxg97JjDUqVC5jn7Ap4pL9JHAuHevSyL&lib=MKKXYFsp7MmrfuppBgCEAsvyToF40XZCH'
var doc = new JSONGoogleDocs.Document(url)
 
doc.fetch().then(function() {
  console.log(doc.get('Title'))
})