#language: pt-br
Funcionalidade: Componente em vue chamado 'BaseCrud'
  Um componente gerenico que deve ajudar a criar o layout de listagem, modal de criaçao, modal de edição e deleção
  Contexto:
    Dato que o usuario utilizou o componente em algum local no codigo
  Cenário:
    Quando utilizar o componete BaseCrud em crud de livros
    E oferecer os parametros corretos
    E o componente em slot de formulario de criação que sera renderizado em um modal
    E o componente em slto de formulario de atualização que sera renderizado em um modal
    E uma função asincrona que faz a listagem dos objetos genericos
    E o uma lista para nomes de Header da listagem 
    E o uma função que recebe o objeto genericos e rotorna uma lista representando os items da table de acordo com o header
    E uma lista contendo as permições do crude como create, update e delete
    Então deve renderizar uma listagem contendo os items od reader e açõe de deletar, atualizar
    E no topo da listagem deve aver um botão de criação que vai abrir o modal de criação
    E deve renderizar a funcionalidades de acordo com as permissões passadas nas propriedades

