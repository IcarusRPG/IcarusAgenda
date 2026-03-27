export function loginController(req, res) {
  const { email } = req.body;

  res.json({
    message: 'Estrutura de login criada. Implementar autenticação real nas próximas etapas.',
    user: {
      id: 'usr_1',
      email,
    },
    company: {
      id: 'cmp_1',
      name: 'Empresa Demo',
      slug: 'empresa-demo',
    },
  });
}
