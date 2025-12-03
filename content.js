if (typeof window.poidsEquipeExtensionLoaded === 'undefined') {
  window.poidsEquipeExtensionLoaded = true;

  const getRankValue = (rank) => {
    if (!rank) return 1000;
    
    if (rank.startsWith('N')) {
      return -1000 + parseInt(rank.substring(1), 10);
    }
    
    const rankOrder = [
      "-15", "-4/6", "-2/6", "0", "1/6", "2/6", "3/6", "4/6", "5/6", 
      "15", "15/1", "15/2", "15/3", "15/4", "15/5", 
      "30", "30/1", "30/2", "30/3", "30/4", "30/5", 
      "40", "NC"
    ];
    
    const index = rankOrder.indexOf(rank);
    if (index !== -1) {
      return index;
    }
    
    return rankOrder.length;
  };

  const getDoublesEquivalent = (rank) => {
    const rankToValueMap = {
      // Negative Ranks
      "-15": -3,
      "-4/6": -2,
      "-2/6": -1,
      // "Seconde Série"
      "0": 0,
      "1/6": 1,
      "2/6": 2,
      "3/6": 3,
      "4/6": 4,
      "5/6": 5,
      // "Troisième Série"
      "15": 6,
      "15/1": 7,
      "15/2": 8,
      "15/3": 9,
      "15/4": 10,
      "15/5": 11,
      "30": 12,
      "30/1": 13,
      "30/2": 14,
      "30/3": 15,
      "30/4": 16,
      "30/5": 17,
      // "Quatrième Série"
      "40": 18,
      "NC": 19,
    };

    if (rank.startsWith('N')) {
      const number = parseInt(rank.substring(1), 10);
      return -number - 3;
    }

    if (rank in rankToValueMap) {
      return rankToValueMap[rank];
    }
    return 20; // Fallback for unknown ranks
  };

  const parsePage = () => {
      let teamName = null;
      let weightSpans = [];
      const url = window.location.href;

      if (url.includes('/equipe/')) {
          const teamNameEl = document.querySelector('h2');
          if (teamNameEl) {
              teamName = teamNameEl.textContent.trim();
          }
          weightSpans = document.querySelectorAll('span.text-sm.text-tu-secondary-500');
      } else {
          let foundHeader = false;
          document.querySelectorAll('h3').forEach(h3 => {
              if (h3.textContent.trim().includes('Les équipes')) {
                  foundHeader = true;
              }
          });

          if (foundHeader) {
              const allPossiblePlayerSpans = document.querySelectorAll('span.text-sm.text-tu-secondary-500');
              weightSpans = Array.from(allPossiblePlayerSpans).filter(span => span.offsetParent !== null);

                          if (weightSpans.length > 0) {
                              // Find the specific div for the visible team name, as instructed.
                              const headlessDiv = document.querySelector('div[data-headlessui-state="open"]');
                              if (headlessDiv) {
                                  const buttonInHeadlessDiv = headlessDiv.querySelector('button');
                                  if (buttonInHeadlessDiv) {
                                      const spanInButton = buttonInHeadlessDiv.querySelector('span');
                                      if (spanInButton) {
                                          teamName = spanInButton.textContent.trim();
                                      }
                                  }
                              }
                          }          }
      }

      const players = [];
      weightSpans.forEach(span => {
          const rankingSpan = span.previousElementSibling;
          if (rankingSpan) {
              const ranking = rankingSpan.textContent.trim();
              if (ranking && getRankValue(ranking) < 23) {
                  const doublesEquivalent = getDoublesEquivalent(ranking);
                  players.push({ ranking: ranking, value: doublesEquivalent });
              }
          }
      });

      let finalTitle = "Poids Équipe";
      if (teamName) {
          finalTitle = "Poids Équipe: " + teamName;
      }
      
      if (players.length === 0) {
          return { teamName: finalTitle, top4Weight: 0, squadWeight: 0, topRankings: [], playerCount: 0 };
      }

      players.sort((a, b) => getRankValue(a.ranking) - getRankValue(b.ranking));

      const squadWeight = players.reduce((sum, player) => sum + player.value, 0) / players.length;
      const top4Players = players.slice(0, 4);
      const top4Weight = top4Players.reduce((sum, player) => sum + player.value, 0) / top4Players.length;
      const topRankings = top4Players.map(p => p.ranking);
      const top3Players = players.slice(0, 3);
      const top3Weight = top3Players.reduce((sum, player) => sum + player.value, 0);

      return { teamName: finalTitle, top4Weight, squadWeight, topRankings, playerCount: players.length, top3Weight, players };
  };

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.action === "getData") {
        const data = parsePage();
        sendResponse(data);
        return true; 
      }
    }
  );
}