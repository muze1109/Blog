{
  const entryTitle = document.querySelector('.entry-title');
  const postedDate = document.querySelector('.posted-date');
  const postArticle = document.getElementById('post-article');

  // const articleName = window.location.search.substring(7)

  axios.get('http://localhost:3000/article' + window.location.search).then(({ data }) => {
    // console.log(data);
    postArticle.innerHTML = data.content;
    entryTitle.innerHTML = data.data.title;
    postedDate.innerHTML = new Date(data.data.date);
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightBlock(block);
    });
  });
}