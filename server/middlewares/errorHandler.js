function errorHandler(err, req, res, next) {
  console.error("Erro capturado:", err.message);

  const statusCode = err.statusCode || 500;
  const mensagem =
    statusCode === 500 ? "Erro interno no servidor." : err.message;

  res.status(statusCode).json({
    sucesso: false,
    mensagem,
  });
}

export default errorHandler;
