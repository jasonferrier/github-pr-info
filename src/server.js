import app from './app'

const server = app.listen(process.env.PORT, error => {
  if (error) {
    console.trace(error)
    throw error
  }

  console.info(
    `Serving http://localhost:${process.env.PORT} for ${process.env.NODE_ENV}.`
  )
})

export default server
