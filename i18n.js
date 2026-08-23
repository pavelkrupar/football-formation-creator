// ============================================================
// Translations
// ============================================================
// UI text for each supported language, loaded before script.js
// (same pattern as data.js). Football data itself is not
// translated — position codes (GK, CB, ...) are already
// language-neutral, and player/club names don't change.

const DEFAULT_LANGUAGE = 'en';

const translations = {
  en: {
    appName: 'Football Formation Creator',
    formationPickerLabel: 'Choose formation',
    languagePickerLabel: 'Choose language',
    captainSelectLabel: 'Pick team captain',
    captainPlaceholder: 'Pick a captain',
    captainEmptyOption: 'No players in the lineup',
    resetButton: 'Clear lineup',
    resetButtonTitle: 'Remove all players from the lineup',
    resetConfirm: 'Are you sure you want to clear the whole lineup?',
    clubFilterLabel: 'Team filter',
    playerListHeading: 'Player list',
    playerSearchLabel: 'Search players',
    playerSearchPlaceholder: 'Search players...',
    emptySlot: 'Free',
    groupLabels: {
      'Brankáři': 'Goalkeepers',
      'Obránci': 'Defenders',
      'Záložníci': 'Midfielders',
      'Útočníci': 'Forwards'
    },
    footer: 'Created by Pavel Krupař with Claude Code and GitHub Copilot'
  },
  cs: {
    appName: 'Tvůrce fotbalových sestav',
    formationPickerLabel: 'Vyber formace',
    languagePickerLabel: 'Vyber jazyk',
    captainSelectLabel: 'Výběr kapitána týmu',
    captainPlaceholder: 'Vyber kapitána',
    captainEmptyOption: 'Žádný hráč v sestavě',
    resetButton: 'Vymazat sestavu',
    resetButtonTitle: 'Odebrat všechny hráče ze sestavy',
    resetConfirm: 'Opravdu chceš vymazat celou sestavu?',
    clubFilterLabel: 'Filtr týmů',
    playerListHeading: 'Seznam hráčů',
    playerSearchLabel: 'Hledat hráče',
    playerSearchPlaceholder: 'Hledat hráče...',
    emptySlot: 'Volný',
    groupLabels: {
      'Brankáři': 'Brankáři',
      'Obránci': 'Obránci',
      'Záložníci': 'Záložníci',
      'Útočníci': 'Útočníci'
    },
    footer: 'Vytvořil Pavel Krupař s Claude Code a GitHub Copilot'
  }
};
