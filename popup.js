document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const top4WeightEl = document.getElementById('top4Weight');
    const squadWeightEl = document.getElementById('squadWeight');
    const statusEl = document.getElementById('topRankings');

    if (tabs[0] && tabs[0].url && tabs[0].url.includes('tenup.fft.fr')) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['content.js']
      }, () => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "getData" }, function(response) {
          if (chrome.runtime.lastError) {
            top4WeightEl.textContent = 'Erreur';
            squadWeightEl.textContent = 'Erreur';
            statusEl.innerHTML = '<li class="message">Impossible de communiquer avec la page. Essayez de rafraîchir l\'onglet.</li>';
            console.error(chrome.runtime.lastError.message);
            return;
          }

          if (response && response.playerCount > 0) {
            if (response.teamName) {
              document.getElementById('popupTitle').textContent = response.teamName;
            }
            top4WeightEl.textContent = response.top4Weight ? response.top4Weight.toFixed(2) : 'N/A';
            squadWeightEl.textContent = response.squadWeight ? response.squadWeight.toFixed(2) : 'N/A';
            const topRankings = response.topRankings;
            statusEl.innerHTML = '';
            topRankings.forEach(ranking => {
              const li = document.createElement('li');
              li.textContent = ranking;
              statusEl.appendChild(li);
            });
          } else {
            if (response.teamName) {
              document.getElementById('popupTitle').textContent = response.teamName;
            }
            top4WeightEl.textContent = 'N/A';
            squadWeightEl.textContent = 'N/A';
            statusEl.innerHTML = '<li class="message">Aucun joueur trouvé sur cette page.</li>';
          }
        });
      });
    } else {
        top4WeightEl.textContent = 'N/A';
        squadWeightEl.textContent = 'N/A';
        statusEl.innerHTML = '<li class="message">Active uniquement sur les pages tenup.fft.fr</li>';
    }
  });
});
