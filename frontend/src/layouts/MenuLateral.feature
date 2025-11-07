#language: pt-br
Funcionalidade: Menu lateral
  A aplicaçao deve renderizar um menu lateral
  mostrando as rotas que pode ser navegada
  utilizando componentes daisyui
  e framework vue deve mostrar as opções de menu
  Livros registrados, tipos de livros, alunos registrados e emprestimos de livros
  Contexto:
    Dado que estou devidamente autenticado no sistema
    E estou na tela inicial da aplicação
    E me autentiquei com um usuari de usernaem "teste@user" e de perfil "bibliotecario"
  Cenário: O bibliotecario clica em um item do menu "Livros registrados"
    Quando o usuário clicar no item do menu então deve ser selecionar o item no menu altual utilizando o router do vue usando a url como forma de seleção do menu
    Então  deve bloquear o item selecionado para não poder ser selecionado novamente
    E deve apresentar o menu lateral ao lado de uma renderização de subrota do vue router preenchendo toda a tela


