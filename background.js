const parent = chrome.contextMenus.create({
  "title": "Copy GitHub Project card", "onclick": (info, tab) => {
    chrome.tabs.sendMessage(tab.id, "getClickedCardData", (clickedCardData) => {
      if (clickedCardData.value) {
        const { cardId, columnId, contentType, contentId, repo, contentNumber } = clickedCardData.value;

        chrome.storage.sync.get(['githubToken'], async ({ githubToken }) => {
          if (githubToken.length === 40) {
            const headers = {
              'Content-Type': 'application/json',
              'Authorization': `token ${githubToken}`,
              'Accept': 'application/vnd.github.inertia-preview+json'
            };

            if (contentType === '') {
              const response = await fetch(`https://api.github.com/projects/columns/cards/${cardId}`, { method: 'GET', headers });
              const { note } = await response.json();

              await fetch(`https://api.github.com/projects/columns/${columnId}/cards`, {
                method: 'POST', headers, body: JSON.stringify({ note })
              });
            } else if (contentType === 'Issue') {
              const getIssueResponse = await fetch(`https://api.github.com/repos/${repo}/issues/${contentNumber}`, { method: 'GET', headers });
              const { labels, assignees, title, body } = await getIssueResponse.json();

              const createIssueResponse = await fetch(`https://api.github.com/repos/${repo}/issues`, {
                method: 'POST', headers, body: JSON.stringify({
                  labels: labels.map(({ name }) => name), assignees: assignees.map(({ login }) => login), body: `Copy of #${contentNumber}\n${body}`, title
                })
              });

              const { id } = await createIssueResponse.json()

              await fetch(`https://api.github.com/projects/columns/${columnId}/cards`, {
                method: 'POST', headers, body: JSON.stringify({ content_id: id, content_type: "Issue" })
              });
            }
          } else {
            chrome.runtime.openOptionsPage();
          }
        });
      }
    });
  }
});
