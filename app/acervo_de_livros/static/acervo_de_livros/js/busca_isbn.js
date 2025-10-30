document.addEventListener('DOMContentLoaded', () => {
  const isbnField = document.querySelector('#id_isbn');
  if (!isbnField) return;

  isbnField.addEventListener('change', async () => {
    const isbn = isbnField.value.trim();
    if (isbn.length < 10) return;

    const url = `${window.location.origin}/acervo_de_livros/buscar_informacoes_do_livro_com_base_no_isbn/?isbn=${encodeURIComponent(isbn)}`
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.error) {
          alert(data.error);
          return;
        }
        if (data.titulo) document.querySelector('#id_titulo').value = data.titulo;
        if (data.autores) document.querySelector('#id_autores').value = data.autores;
        if (data.editora) document.querySelector('#id_editora').value = data.editora;
        if (data.ano) document.querySelector('#id_ano_publicacao').value = data.ano;
      })
      .catch(error => {
        console.error('Error fetching JSON:', error);
      });
  });
});
