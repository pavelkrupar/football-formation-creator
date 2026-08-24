// ============================================================
// Data
// ============================================================
// Squad roster (`playersByPosition`, `players`) and formation
// layouts (`formations`) live in data.js, loaded before this file.

// ============================================================
// State
// ============================================================

let activeFormation = '4-3-3';
let draggedPlayerId = null;
let captainPlayerId = null;
let selectedPlayerId = null;
const slotAssignments = {};
let selectedClubs = new Set(clubs.map((club) => club.id));
let currentLanguage = DEFAULT_LANGUAGE;
let searchQuery = '';

const STORAGE_KEY = 'sparta-tactical-board:v1';

// ============================================================
// DOM references
// ============================================================

const fieldPositions = document.getElementById('field-positions');
const fieldGrid = document.getElementById('field-grid');
const playersList = document.getElementById('players-list');
const formationButtons = document.querySelectorAll('.formation-btn');
const formationPickerEl = document.getElementById('formation-picker');
const captainSelect = document.getElementById('captain-select');
const resetButton = document.getElementById('reset-lineup-btn');
const generateButton = document.getElementById('generate-lineup-btn');
const squadValueLabelEl = document.getElementById('squad-value-label');
const squadValueEl = document.getElementById('squad-value');
const dragPreview = document.getElementById('drag-preview');
const dragPreviewPhoto = document.getElementById('drag-preview-photo');
const dragPreviewName = document.getElementById('drag-preview-name');
const clubFilterEl = document.getElementById('club-filter');
const playerSearchEl = document.getElementById('player-search');
const appTitleEl = document.getElementById('app-title');
const lineupHeadingEl = document.getElementById('lineup-heading');
const appFooterEl = document.getElementById('app-footer');
const langPickerEl = document.getElementById('lang-picker');
const langButtons = document.querySelectorAll('.lang-btn');

// ============================================================
// Helpers
// ============================================================

const sortPlayersByValue = (groupPlayers) => [...groupPlayers].sort((a, b) => (b.marketValue ?? 0) - (a.marketValue ?? 0));

function normalizePosition(position) {
  return String(position || '').trim().toUpperCase();
}

function t(key) {
  return translations[currentLanguage]?.[key] ?? translations[DEFAULT_LANGUAGE][key];
}

function tGroup(groupLabel) {
  return t('groupLabels')[groupLabel] ?? groupLabel;
}

function normalizeForSearch(value) {
  // Diacritics-insensitive so e.g. "zeleny" still matches "Zelený".
  return String(value || '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

function matchesSearchQuery(player) {
  const query = normalizeForSearch(searchQuery);
  if (!query) return true;
  return normalizeForSearch(player.name).includes(query);
}

function getClubById(clubId) {
  return clubs.find((club) => club.id === clubId);
}

function getPlayerClub(player) {
  return getClubById(player?.club) || clubs[0];
}

function getPlayerPhoto(player) {
  // Players without a dedicated photo fall back to their club's logo.
  return player?.photo || getPlayerClub(player).logo;
}

function getPositionDisplayName(position) {
  // Pass-through today; kept separate from normalizePosition() as a
  // seam for future localized position labels.
  return normalizePosition(position);
}

function getPlayerRoleSummary(player) {
  if (!player) return '';

  const primary = player.optimalPositions && player.optimalPositions.length > 0
    ? player.optimalPositions
    : [player.role];
  const primaryNormalized = new Set(primary.map(normalizePosition));

  const secondary = (player.compatiblePositions || [])
    .filter((position) => !primaryNormalized.has(normalizePosition(position)));

  const primaryLabel = primary.map(getPositionDisplayName).join(', ');
  if (secondary.length === 0) return primaryLabel;

  return `${primaryLabel} (${secondary.map(getPositionDisplayName).join(', ')})`;
}

function formatMarketValue(value) {
  if (typeof value !== 'number') return '';
  // Trim to at most 2 decimals without trailing zeros (1.80 -> 1.8, 10.00 -> 10).
  const trimmed = Number(value.toFixed(2));
  return `€${trimmed}M`;
}

function getSlotPlayerNameSizeClass(name) {
  if (!name || name.length > 14) return 'name-size-sm';
  return name.length <= 10 ? 'name-size-lg' : 'name-size-md';
}

function getPlayerPositionStatus(player, slotLabel) {
  if (!player) return 'empty';

  const normalizedSlot = normalizePosition(slotLabel);

  if (player.optimalPositions?.some((position) => normalizePosition(position) === normalizedSlot)) {
    return 'optimal';
  }

  if (player.compatiblePositions?.some((position) => normalizePosition(position) === normalizedSlot)) {
    return 'compatible';
  }

  return 'incompatible';
}

function getPlayerById(playerId) {
  return players.find((player) => player.id === playerId);
}

function getPositionFamily(position) {
  const normalized = normalizePosition(position);

  if (['GK'].includes(normalized)) return 'GK';
  if (['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(normalized)) return 'DEF';
  if (['DM', 'CM', 'OM', 'LM', 'RM'].includes(normalized)) return 'MID';
  if (['LW', 'RW', 'CF'].includes(normalized)) return 'ATT';
  return 'OTHER';
}

function getSlotLabelById(slotId) {
  const slots = formations[activeFormation] || [];
  const slot = slots.find((item) => item.id === slotId);
  return slot ? slot.label : null;
}

function getFormattedSlotLabel(slotId) {
  const slotLabel = getSlotLabelById(slotId);
  if (!slotLabel) return t('emptySlot');
  return getPositionDisplayName(slotLabel);
}

function findPlayerSlot(playerId) {
  const entry = Object.entries(slotAssignments).find(([, assignedPlayerId]) => assignedPlayerId === playerId);
  return entry ? entry[0] : null;
}

function getAssignedPlayersForCurrentFormation() {
  const assignedIds = [...new Set(Object.values(slotAssignments).filter(Boolean))];
  return assignedIds
    .map((playerId) => getPlayerById(playerId))
    .filter(Boolean);
}

function redistributePlayersToNewFormation() {
  const currentAssignments = Object.entries(slotAssignments)
    .filter(([, playerId]) => Boolean(playerId))
    .map(([slotId, playerId]) => ({ slotId, playerId }));

  if (currentAssignments.length === 0) return;

  const nextSlots = formations[activeFormation] || [];
  const occupiedSlots = new Set();

  Object.keys(slotAssignments).forEach((slotId) => {
    delete slotAssignments[slotId];
  });

  const sortedAssignments = [...currentAssignments].sort((a, b) => {
    const playerA = getPlayerById(a.playerId);
    const playerB = getPlayerById(b.playerId);
    const priorityA = Number(playerA?.number ?? Number.MAX_SAFE_INTEGER);
    const priorityB = Number(playerB?.number ?? Number.MAX_SAFE_INTEGER);
    return priorityA - priorityB;
  });

  sortedAssignments.forEach(({ playerId }) => {
    const player = getPlayerById(playerId);
    if (!player) return;

    const candidates = nextSlots
      .filter((slot) => !occupiedSlots.has(slot.id))
      .map((slot) => {
        const normalizedSlot = normalizePosition(slot.label);
        const optimalMatch = player.optimalPositions?.some((position) => normalizePosition(position) === normalizedSlot);
        const compatibleMatch = player.compatiblePositions?.some((position) => normalizePosition(position) === normalizedSlot);
        const playerFamilies = [...(player.optimalPositions || [player.role || '']), ...(player.compatiblePositions || [])]
          .map(getPositionFamily);
        const familyMatch = playerFamilies.includes(getPositionFamily(normalizedSlot));

        let score = 99;
        if (optimalMatch) score = 0;
        else if (compatibleMatch) score = 1;
        else if (familyMatch) score = 2;

        return { slot, score };
      })
      .sort((a, b) => a.score - b.score || a.slot.label.localeCompare(b.slot.label));

    const chosen = candidates[0];
    if (!chosen) return;

    occupiedSlots.add(chosen.slot.id);
    slotAssignments[chosen.slot.id] = playerId;
  });
}

// ============================================================
// Rendering
// ============================================================
// Render functions only build markup. Interaction is wired once
// via event delegation (see "Event wiring" below), so re-rendering
// never needs to re-attach listeners to individual nodes.

function renderCoordinateGrid() {
  const xMarks = Array.from({ length: 11 }, (_, index) => index * 10);
  const yMarks = Array.from({ length: 11 }, (_, index) => index * 10);

  const lines = [];

  xMarks.forEach((value) => {
    lines.push(`<div class="coord-line x-line" style="left:${value}%"></div>`);
    lines.push(`<span class="coord-label x-label" style="left:${value}%">X:${value}</span>`);
  });

  yMarks.forEach((value) => {
    lines.push(`<div class="coord-line y-line" style="top:${value}%"></div>`);
    lines.push(`<span class="coord-label y-label" style="top:${value}%">Y:${value}</span>`);
  });

  fieldGrid.innerHTML = lines.join('');
}

function renderClubFilter() {
  if (!clubFilterEl) return;

  clubFilterEl.innerHTML = clubs
    .map((club) => {
      const checked = selectedClubs.has(club.id);
      return `
        <label class="club-chip ${checked ? 'active' : ''}">
          <input type="checkbox" class="club-chip-checkbox" value="${club.id}" ${checked ? 'checked' : ''} />
          <img class="club-chip-logo" src="${club.logo}" alt="" />
          <span class="club-chip-name">${club.name}</span>
        </label>
      `;
    })
    .join('');
}

function renderPlayers() {
  playersList.innerHTML = Object.entries(playersByPosition)
    .map(([groupLabel, groupPlayers]) => {
      const visiblePlayers = groupPlayers.filter((player) => selectedClubs.has(player.club) && matchesSearchQuery(player));
      if (visiblePlayers.length === 0) return '';

      const sortedGroupPlayers = sortPlayersByValue(visiblePlayers);
      const items = sortedGroupPlayers
        .map((player) => {
          const currentSlotId = findPlayerSlot(player.id);
          const slotLabel = currentSlotId ? getFormattedSlotLabel(currentSlotId) : t('emptySlot');
          const isSelected = selectedPlayerId === player.id;
          const playerNumber = player.number ?? '';
          const club = getPlayerClub(player);

          return `
            <div class="player-card ${currentSlotId ? 'is-assigned' : ''} ${isSelected ? 'is-selected' : ''}" draggable="true" data-player-id="${player.id}">
              <div class="player-avatar">
                <img src="${getPlayerPhoto(player)}" alt="${player.name}" />
              </div>
              <div class="player-meta">
                <span class="player-name">${player.name}<span class="player-number">#${playerNumber}</span><span class="player-market-value">${formatMarketValue(player.marketValue)}</span></span>
                <span class="player-role">${getPlayerRoleSummary(player)}</span>
              </div>
              <div class="player-side-actions">
                <span class="assignment-chip">${slotLabel}</span>
                <img class="roster-club-mark" src="${club.logo}" alt="${club.name} logo" />
              </div>
            </div>
          `;
        })
        .join('');

      return `
        <div class="position-group">
          <div class="group-title">${tGroup(groupLabel)}</div>
          ${items}
        </div>
      `;
    })
    .join('');
}

function renderFormation() {
  if (!formations[activeFormation]) {
    fieldPositions.innerHTML = '';
    return;
  }

  const slots = formations[activeFormation];

  fieldPositions.innerHTML = slots
    .map((slot) => {
      const assignedPlayerId = slotAssignments[slot.id] || null;
      const assignedPlayer = assignedPlayerId ? getPlayerById(assignedPlayerId) : null;
      const playerLabel = assignedPlayer ? assignedPlayer.name.split(' ').slice(-1)[0] : '—';
      const playerPhoto = assignedPlayer ? getPlayerPhoto(assignedPlayer) : '';
      const slotStatus = assignedPlayer ? getPlayerPositionStatus(assignedPlayer, slot.label) : 'empty';
      const slotDisplayLabel = getPositionDisplayName(slot.label);
      const isCaptain = Boolean(captainPlayerId && assignedPlayer && assignedPlayer.id === captainPlayerId);
      const nameSizeClass = getSlotPlayerNameSizeClass(assignedPlayer?.name);
      const club = assignedPlayer ? getPlayerClub(assignedPlayer) : null;

      return `
        <div class="pitch-slot is-${slotStatus}" data-slot-id="${slot.id}" data-slot-label="${slot.label}" data-player-id="${assignedPlayer ? assignedPlayer.id : ''}" draggable="${assignedPlayer ? 'true' : 'false'}" style="left: ${slot.x}%; top: ${slot.y}%">
          ${isCaptain ? '<span class="captain-mark">C</span>' : ''}
          ${assignedPlayer ? `<span class="club-mark"><img src="${club.logo}" alt="${club.name} logo" /></span>` : ''}
          <span class="slot-label">${slotDisplayLabel}</span>
          <div class="slot-player ${nameSizeClass}">
            ${assignedPlayer ? `<img class="slot-player-image" src="${playerPhoto}" alt="${assignedPlayer.name}" />` : ''}
            <span class="slot-player-name">${playerLabel}</span>
          </div>
        </div>
      `;
    })
    .join('');
}

function renderCaptainSelector() {
  if (!captainSelect) return;

  const assignedPlayers = getAssignedPlayersForCurrentFormation();

  if (captainPlayerId && !assignedPlayers.some((player) => player.id === captainPlayerId)) {
    captainPlayerId = null;
  }

  if (assignedPlayers.length === 0) {
    captainSelect.innerHTML = `<option value="">${t('captainPlaceholder')}</option><option value="" disabled>${t('captainEmptyOption')}</option>`;
    captainSelect.disabled = true;
    captainSelect.value = '';
    return;
  }

  const options = [`<option value="">${t('captainPlaceholder')}</option>`].concat(
    assignedPlayers.map((player) => {
      const selected = captainPlayerId === player.id ? 'selected' : '';
      return `<option value="${player.id}" ${selected}>${player.name}</option>`;
    })
  );

  captainSelect.disabled = false;
  captainSelect.innerHTML = options.join('');
  captainSelect.value = captainPlayerId || '';
}

function updateResetButtonState() {
  if (!resetButton) return;
  resetButton.disabled = !Object.values(slotAssignments).some(Boolean);
}

function getSquadValue() {
  return Object.values(slotAssignments)
    .filter(Boolean)
    .reduce((total, playerId) => total + (getPlayerById(playerId)?.marketValue ?? 0), 0);
}

function renderSquadValue() {
  if (!squadValueEl) return;
  squadValueEl.textContent = formatMarketValue(getSquadValue());
}

function applyStaticText() {
  document.documentElement.lang = currentLanguage;
  document.title = t('appName');

  if (appTitleEl) appTitleEl.textContent = t('appName');
  if (formationPickerEl) formationPickerEl.setAttribute('aria-label', t('formationPickerLabel'));
  if (langPickerEl) langPickerEl.setAttribute('aria-label', t('languagePickerLabel'));
  if (generateButton) {
    generateButton.textContent = t('generateButton');
    generateButton.title = t('generateButtonTitle');
  }
  if (squadValueLabelEl) squadValueLabelEl.textContent = t('squadValueLabel');
  if (captainSelect) captainSelect.setAttribute('aria-label', t('captainSelectLabel'));
  if (resetButton) {
    resetButton.textContent = t('resetButton');
    resetButton.title = t('resetButtonTitle');
  }
  if (clubFilterEl) clubFilterEl.setAttribute('aria-label', t('clubFilterLabel'));
  if (lineupHeadingEl) lineupHeadingEl.textContent = t('playerListHeading');
  if (playerSearchEl) {
    playerSearchEl.setAttribute('aria-label', t('playerSearchLabel'));
    playerSearchEl.placeholder = t('playerSearchPlaceholder');
  }
  if (appFooterEl) appFooterEl.textContent = t('footer');
}

function render() {
  applyStaticText();
  renderClubFilter();
  renderFormation();
  renderPlayers();
  renderCaptainSelector();
  renderSquadValue();
  updateResetButtonState();
  saveState();
}

function clearSelectedPlayer() {
  selectedPlayerId = null;
  renderPlayers();
}

function syncFormationButtons() {
  const names = Object.keys(formations);

  formationButtons.forEach((button) => {
    const isAvailable = names.includes(button.dataset.formation);
    button.hidden = !isAvailable;
    button.classList.toggle('active', button.dataset.formation === activeFormation && isAvailable);
  });
}

function syncLangButtons() {
  langButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.lang === currentLanguage);
  });
}

// ============================================================
// State mutations
// ============================================================

function assignPlayerToSlot(playerId, targetSlotId) {
  const currentSlot = findPlayerSlot(playerId);

  if (currentSlot === targetSlotId) {
    render();
    return;
  }

  if (currentSlot) {
    delete slotAssignments[currentSlot];
  }

  const targetOccupantId = slotAssignments[targetSlotId];
  if (targetOccupantId && targetOccupantId !== playerId) {
    const targetOccupantCurrentSlot = findPlayerSlot(targetOccupantId);
    if (targetOccupantCurrentSlot && targetOccupantCurrentSlot !== targetSlotId) {
      delete slotAssignments[targetOccupantCurrentSlot];
    }
  }

  slotAssignments[targetSlotId] = playerId;
  render();
}

function pruneAssignmentsForClubFilter() {
  Object.entries(slotAssignments).forEach(([slotId, playerId]) => {
    const player = getPlayerById(playerId);
    if (!player || !selectedClubs.has(player.club)) {
      delete slotAssignments[slotId];
    }
  });
}

function resetLineup() {
  Object.keys(slotAssignments).forEach((slotId) => {
    delete slotAssignments[slotId];
  });
  captainPlayerId = null;
  selectedPlayerId = null;
  render();
}

const COMPATIBLE_SLOT_VALUE_PENALTY = 0.8; // a "yellow" fit counts for 80% of a player's value

function generateLineup() {
  const slots = formations[activeFormation] || [];
  if (slots.length === 0) return;

  const candidates = players.filter((player) => selectedClubs.has(player.club));

  const assignment = {};
  const usedPlayerIds = new Set();

  // Every player/slot pair where the player is at least "compatible"
  // (yellow) competes on an effective value: full value for an "optimal"
  // (green) fit, 80% of it for a merely compatible one. Ranking all pairs
  // together — rather than filling every optimal slot before considering
  // any compatible one — lets a strong player's compatible position
  // outbid a much weaker player's optimal one when that's the better deal,
  // instead of that strong player missing out entirely because their one
  // optimal position wasn't free.
  const rankedPairs = [];
  candidates.forEach((player) => {
    const value = player.marketValue ?? 0;
    slots.forEach((slot) => {
      const status = getPlayerPositionStatus(player, slot.label);
      if (status === 'optimal') {
        rankedPairs.push({ player, slot, effectiveValue: value });
      } else if (status === 'compatible') {
        rankedPairs.push({ player, slot, effectiveValue: value * COMPATIBLE_SLOT_VALUE_PENALTY });
      }
    });
  });

  rankedPairs.sort((a, b) => b.effectiveValue - a.effectiveValue);

  rankedPairs.forEach(({ player, slot }) => {
    if (usedPlayerIds.has(player.id) || assignment[slot.id]) return;
    assignment[slot.id] = player.id;
    usedPlayerIds.add(player.id);
  });

  // Fallback: fill any still-empty slots with the strongest remaining
  // players regardless of position fit, so the lineup is always complete.
  const remainingByValueDesc = candidates
    .filter((player) => !usedPlayerIds.has(player.id))
    .sort((a, b) => (b.marketValue ?? 0) - (a.marketValue ?? 0));

  remainingByValueDesc.forEach((player) => {
    const targetSlot = slots.find((slot) => !assignment[slot.id]);
    if (!targetSlot) return;
    assignment[targetSlot.id] = player.id;
    usedPlayerIds.add(player.id);
  });

  Object.keys(slotAssignments).forEach((slotId) => {
    delete slotAssignments[slotId];
  });
  Object.assign(slotAssignments, assignment);

  // Hand the armband to the most valuable player in the generated lineup.
  const assignedPlayers = candidates.filter((player) => usedPlayerIds.has(player.id));
  const mostValuablePlayer = assignedPlayers.reduce(
    (best, player) => (!best || (player.marketValue ?? 0) > (best.marketValue ?? 0) ? player : best),
    null
  );
  captainPlayerId = mostValuablePlayer ? mostValuablePlayer.id : null;

  render();
}

// ============================================================
// Persistence
// ============================================================
// The lineup survives a page refresh via localStorage. Saving is
// hooked into render() so every state-changing action persists
// automatically; loading happens once at init, before the first
// render, and defensively re-validates against the current roster
// and formation data (in case either changed since the last save).

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      activeFormation,
      slotAssignments,
      captainPlayerId,
      selectedClubs: [...selectedClubs],
      language: currentLanguage
    }));
  } catch (error) {
    // Storage unavailable (e.g. private browsing, quota) — ignore.
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const saved = JSON.parse(raw);

    if (saved.activeFormation && formations[saved.activeFormation]) {
      activeFormation = saved.activeFormation;
    }

    if (saved.language && translations[saved.language]) {
      currentLanguage = saved.language;
    }

    if (Array.isArray(saved.selectedClubs)) {
      const validClubIds = saved.selectedClubs.filter((clubId) => getClubById(clubId));
      if (validClubIds.length > 0) {
        selectedClubs = new Set(validClubIds);
      }
    }

    const validSlotIds = new Set((formations[activeFormation] || []).map((slot) => slot.id));
    const usedPlayerIds = new Set();

    if (saved.slotAssignments && typeof saved.slotAssignments === 'object') {
      Object.entries(saved.slotAssignments).forEach(([slotId, playerId]) => {
        if (!validSlotIds.has(slotId)) return;
        const player = getPlayerById(playerId);
        if (!player || !selectedClubs.has(player.club)) return;
        if (usedPlayerIds.has(playerId)) return;

        slotAssignments[slotId] = playerId;
        usedPlayerIds.add(playerId);
      });
    }

    if (saved.captainPlayerId && usedPlayerIds.has(saved.captainPlayerId)) {
      captainPlayerId = saved.captainPlayerId;
    }
  } catch (error) {
    // Corrupted or inaccessible storage — start with defaults.
  }
}

// ============================================================
// Event wiring
// ============================================================
// Listeners are bound once on the stable container elements
// (event delegation) instead of being re-attached to every
// player card / pitch slot node after each render.

formationButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (!formations[button.dataset.formation]) return;
    const previousFormation = activeFormation;
    activeFormation = button.dataset.formation;

    if (Object.values(slotAssignments).some(Boolean) && previousFormation !== activeFormation) {
      redistributePlayersToNewFormation();
    }

    syncFormationButtons();
    render();
  });
});

if (captainSelect) {
  captainSelect.addEventListener('change', (event) => {
    captainPlayerId = event.target.value || null;
    render();
  });
}

if (resetButton) {
  resetButton.addEventListener('click', () => {
    if (!Object.values(slotAssignments).some(Boolean)) return;
    if (!window.confirm(t('resetConfirm'))) return;
    resetLineup();
  });
}

if (generateButton) {
  generateButton.addEventListener('click', () => {
    generateLineup();
  });
}

langButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (!translations[button.dataset.lang]) return;
    currentLanguage = button.dataset.lang;
    syncLangButtons();
    render();
  });
});

if (clubFilterEl) {
  clubFilterEl.addEventListener('change', (event) => {
    const checkbox = event.target.closest('.club-chip-checkbox');
    if (!checkbox) return;

    const clubId = checkbox.value;

    if (checkbox.checked) {
      selectedClubs.add(clubId);
    } else if (selectedClubs.size > 1) {
      selectedClubs.delete(clubId);
    } else {
      // Always keep at least one club selected.
      checkbox.checked = true;
      return;
    }

    pruneAssignmentsForClubFilter();
    render();
  });
}

if (playerSearchEl) {
  playerSearchEl.addEventListener('input', (event) => {
    searchQuery = event.target.value;
    renderPlayers();
  });
}

playersList.addEventListener('click', (event) => {
  const card = event.target.closest('.player-card');
  if (!card) return;
  event.stopPropagation();

  const playerId = card.dataset.playerId;
  selectedPlayerId = selectedPlayerId === playerId ? null : playerId;
  renderPlayers();
});

playersList.addEventListener('dragstart', (event) => {
  const card = event.target.closest('.player-card');
  if (!card) return;

  draggedPlayerId = card.dataset.playerId;
  card.classList.add('is-dragging');
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', draggedPlayerId);

  // Drag a compact photo+name square instead of the browser's default
  // snapshot of the whole (wide) player-card row — easier to aim at a
  // specific pitch slot.
  const player = getPlayerById(draggedPlayerId);
  if (player && dragPreview) {
    dragPreviewPhoto.src = getPlayerPhoto(player);
    dragPreviewPhoto.alt = player.name;
    dragPreviewName.textContent = player.name.split(' ').slice(-1)[0];
    event.dataTransfer.setDragImage(dragPreview, 32, 32);
  }
});

playersList.addEventListener('dragend', (event) => {
  const card = event.target.closest('.player-card');
  card?.classList.remove('is-dragging');
  draggedPlayerId = null;
});

fieldPositions.addEventListener('click', (event) => {
  const slotEl = event.target.closest('.pitch-slot');
  if (!slotEl) return;

  const slotId = slotEl.dataset.slotId;

  if (selectedPlayerId) {
    const playerId = selectedPlayerId;
    selectedPlayerId = null;
    assignPlayerToSlot(playerId, slotId);
    return;
  }

  if (slotAssignments[slotId]) {
    delete slotAssignments[slotId];
    render();
  }
});

fieldPositions.addEventListener('dragstart', (event) => {
  const slotEl = event.target.closest('.pitch-slot');
  if (!slotEl || !slotEl.dataset.playerId) return;

  draggedPlayerId = slotEl.dataset.playerId;
  slotEl.classList.add('is-dragging');
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', draggedPlayerId);
});

fieldPositions.addEventListener('dragend', (event) => {
  const slotEl = event.target.closest('.pitch-slot');
  slotEl?.classList.remove('is-dragging');
  draggedPlayerId = null;
});

fieldPositions.addEventListener('dragover', (event) => {
  const slotEl = event.target.closest('.pitch-slot');
  if (!slotEl) return;

  event.preventDefault();
  slotEl.classList.add('dragover');
});

fieldPositions.addEventListener('dragleave', (event) => {
  const slotEl = event.target.closest('.pitch-slot');
  slotEl?.classList.remove('dragover');
});

fieldPositions.addEventListener('drop', (event) => {
  const slotEl = event.target.closest('.pitch-slot');
  if (!slotEl) return;

  event.preventDefault();
  slotEl.classList.remove('dragover');

  const targetSlotId = slotEl.dataset.slotId;
  const playerId = event.dataTransfer.getData('text/plain') || draggedPlayerId;
  if (!playerId || !targetSlotId) return;

  assignPlayerToSlot(playerId, targetSlotId);
});

document.addEventListener('click', (event) => {
  const isPlayerCard = event.target.closest('.player-card');
  const isPitchSlot = event.target.closest('.pitch-slot');

  if (!isPlayerCard && !isPitchSlot && selectedPlayerId) {
    clearSelectedPlayer();
  }
});

// ============================================================
// Init
// ============================================================

loadState();
renderCoordinateGrid();
syncFormationButtons();
syncLangButtons();
render();
