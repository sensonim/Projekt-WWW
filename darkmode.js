const savedMode = localStorage.getItem('darkmode');
if (savedMode === 'active') document.body.classList.add('darkmode');
const themeSwitch = document.getElementById('theme-switch');
function enableDarkMode() {
  document.body.classList.add('darkmode');
  localStorage.setItem('darkmode', 'active');
}
function disableDarkMode() {
  document.body.classList.remove('darkmode');
  localStorage.setItem('darkmode', 'inactive');
}
themeSwitch.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('darkmode');
  localStorage.setItem('darkmode', isDark ? 'active' : 'inactive');
});