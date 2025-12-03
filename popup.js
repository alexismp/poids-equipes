document.addEventListener('DOMContentLoaded', function() {
  const DEFAULT_NB_PLAYERS = 3;
  document.getElementById('version').textContent = chrome.runtime.getManifest().version;

  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const teamWeightEl = document.getElementById('teamWeight');
    const statusEl = document.getElementById('topRankings');
    const sliderEl = document.getElementById('player-slider');
    const sliderValueEl = document.getElementById('slider-value');

    if (tabs[0] && tabs[0].url && tabs[0].url.includes('tenup.fft.fr')) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['content.js']
      }, () => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "getData" }, function(response) {
          if (chrome.runtime.lastError) {
            teamWeightEl.textContent = 'Erreur';
            statusEl.innerHTML = '<li class="message">Impossible de communiquer avec la page. Essayez de rafraîchir l\'onglet.</li>';
            console.error(chrome.runtime.lastError.message);
            return;
          }

          if (response && response.playerCount > 0) {
            if (response.teamName) {
              document.getElementById('popupTitle').textContent = response.teamName;
            }

            const players = response.players;
            sliderEl.max = response.playerCount;
            sliderEl.value = DEFAULT_NB_PLAYERS;
            sliderValueEl.textContent = DEFAULT_NB_PLAYERS;

            const updateUI = () => {
              const nbPlayers = parseInt(sliderEl.value, 10);
              sliderValueEl.textContent = nbPlayers;

              const selectedPlayers = players.slice(0, nbPlayers);
              const totalWeight = selectedPlayers.reduce((sum, player) => sum + player.value, 0);
              const averageWeight = totalWeight / nbPlayers;

              teamWeightEl.textContent = `${totalWeight} (${averageWeight.toFixed(2)})`;

              statusEl.innerHTML = '';
              selectedPlayers.forEach(player => {
                const li = document.createElement('li');
                li.textContent = player.ranking;
                statusEl.appendChild(li);
              });
            };

            sliderEl.addEventListener('input', updateUI);
            updateUI();

          } else {
            if (response.teamName) {
              document.getElementById('popupTitle').textContent = response.teamName;
            }
            teamWeightEl.textContent = 'N/A';
            statusEl.innerHTML = '<li class="message">Aucun joueur trouvé sur cette page.</li>';
          }
        });
      });
    } else {
        teamWeightEl.textContent = 'N/A';
        statusEl.innerHTML = '<li class="message">Actif uniquement sur les pages tenup.fft.fr</li>';
    }
  });
});