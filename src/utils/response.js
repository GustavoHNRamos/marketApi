export const response = (response, isError, mensagem, quantidade, data) => {
  return response.json({
    erro: isError,
    mensagem,
    quantidade,
    data,
  });
};
