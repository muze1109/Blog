window.onload = () => {
  const progress = document.getElementById('progress');

  window.addEventListener('scroll', () => {
    let scrollTotal = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let sTop = document.documentElement.scrollTop;
    let bl = Math.min((sTop / scrollTotal) * 100, 100);
    progress.style.width = Math.floor(bl) + '%';
  });
}