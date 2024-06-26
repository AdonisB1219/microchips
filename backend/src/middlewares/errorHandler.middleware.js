// eslint-disable-next-line no-unused-vars
export default (err, _req, res, _next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || 'Something went wrong!';
  console.error("Ocurrió un error: ", errorMessage.replace(/(\r\n|\n|\r){2,}/gm, ""))

  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
  });
};
