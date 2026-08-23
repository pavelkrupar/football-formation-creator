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

const STORAGE_KEY = 'sparta-tactical-board:v1';

// ============================================================
// DOM references
// ============================================================

const fieldPositions = document.getElementById('field-positions');
const fieldGrid = document.getElementById('field-grid');
const playersList = document.getElementById('players-list');
const formationButtons = document.querySelectorAll('.formation-btn');
const formationName = document.getElementById('formation-name');
const captainSelect = document.getElementById('captain-select');
const resetButton = document.getElementById('reset-lineup-btn');
const dragPreview = document.getElementById('drag-preview');
const dragPreviewPhoto = document.getElementById('drag-preview-photo');
const dragPreviewName = document.getElementById('drag-preview-name');

// ============================================================
// Helpers
// ============================================================

const sortPlayersByNumber = (groupPlayers) => [...groupPlayers].sort((a, b) => {
  const numberA = Number(a.number ?? Number.MAX_SAFE_INTEGER);
  const numberB = Number(b.number ?? Number.MAX_SAFE_INTEGER);
  return numberA - numberB;
});

function normalizePosition(position) {
  return String(position || '').trim().toUpperCase();
}

function getPlayerPhoto(player) {
  return player?.photo || 'img/surovcik.webp';
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
  return slot ? slot.label : 'Volný';
}

function getFormattedSlotLabel(slotId) {
  const slotLabel = getSlotLabelById(slotId);
  if (slotLabel === 'Volný') return 'Volný';
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

function renderPlayers() {
  playersList.innerHTML = Object.entries(playersByPosition)
    .map(([groupLabel, groupPlayers]) => {
      const sortedGroupPlayers = sortPlayersByNumber(groupPlayers);
      const items = sortedGroupPlayers
        .map((player) => {
          const currentSlotId = findPlayerSlot(player.id);
          const slotLabel = currentSlotId ? getFormattedSlotLabel(currentSlotId) : 'Volný';
          const isSelected = selectedPlayerId === player.id;
          const playerNumber = player.number ?? '';

          return `
            <div class="player-card ${currentSlotId ? 'is-assigned' : ''} ${isSelected ? 'is-selected' : ''}" draggable="true" data-player-id="${player.id}">
              <div class="player-avatar">
                <img src="${getPlayerPhoto(player)}" alt="${player.name}" />
              </div>
              <div class="player-meta">
                <span class="player-name">${player.name}<span class="player-number">#${playerNumber}</span></span>
                <span class="player-role">${getPlayerRoleSummary(player)}</span>
              </div>
              <div class="player-side-actions">
                <span class="assignment-chip">${slotLabel}</span>
                <img class="roster-sparta-mark" src="img/sparta.svg" alt="Sparta logo" />
              </div>
            </div>
          `;
        })
        .join('');

      return `
        <div class="position-group">
          <div class="group-title">${groupLabel}</div>
          ${items}
        </div>
      `;
    })
    .join('');
}

function renderFormation() {
  if (!formations[activeFormation]) {
    fieldPositions.innerHTML = '';
    formationName.textContent = 'Nezjištěno';
    return;
  }

  formationName.textContent = activeFormation;

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

      return `
        <div class="pitch-slot is-${slotStatus}" data-slot-id="${slot.id}" data-slot-label="${slot.label}" data-player-id="${assignedPlayer ? assignedPlayer.id : ''}" draggable="${assignedPlayer ? 'true' : 'false'}" style="left: ${slot.x}%; top: ${slot.y}%">
          ${isCaptain ? '<span class="captain-mark">C</span>' : ''}
          ${assignedPlayer ? '<span class="sparta-mark"><img src="img/sparta.svg" alt="Sparta logo" /></span>' : ''}
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
    captainSelect.innerHTML = '<option value="">Vyber kapitána</option><option value="" disabled>Žádný hráč v sestavě</option>';
    captainSelect.disabled = true;
    captainSelect.value = '';
    return;
  }

  const options = ['<option value="">Vyber kapitána</option>'].concat(
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

function render() {
  renderFormation();
  renderPlayers();
  renderCaptainSelector();
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

function resetLineup() {
  Object.keys(slotAssignments).forEach((slotId) => {
    delete slotAssignments[slotId];
  });
  captainPlayerId = null;
  selectedPlayerId = null;
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
      captainPlayerId
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

    const validSlotIds = new Set((formations[activeFormation] || []).map((slot) => slot.id));
    const usedPlayerIds = new Set();

    if (saved.slotAssignments && typeof saved.slotAssignments === 'object') {
      Object.entries(saved.slotAssignments).forEach(([slotId, playerId]) => {
        if (!validSlotIds.has(slotId)) return;
        if (!getPlayerById(playerId)) return;
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
    if (!window.confirm('Opravdu chceš vymazat celou sestavu?')) return;
    resetLineup();
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
render();
