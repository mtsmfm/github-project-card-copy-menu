const saveOptions = () => {
  const githubToken = document.getElementById('input').value;
  chrome.storage.sync.set({
    githubToken,
  }, () => {
    var status = document.getElementById('status');
    status.textContent = 'Saved.';
    setTimeout(() => {
      status.textContent = '';
    }, 1000);
  });
}

const restoreOptions = () => {
  chrome.storage.sync.get(['githubToken'], ({ githubToken }) => {
    document.getElementById('input').value = githubToken;
  });
}
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
