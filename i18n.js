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
    leaguePickerLabel: 'Choose league',
    noLeagueTeams: 'No teams have been added to this league yet.',
    generateButton: 'Generate lineup',
    generateButtonTitle: 'Auto-fill the strongest possible lineup for the selected formation and teams',
    squadValueLabel: 'Value',
    captainSelectLabel: 'Pick team captain',
    captainPlaceholder: 'Pick a captain',
    captainClear: 'Remove captain',
    captainEmptyOption: 'No players in the lineup',
    resetButton: 'Clear lineup',
    resetButtonTitle: 'Remove all players from the lineup',
    resetConfirm: 'Are you sure you want to clear the whole lineup?',
    clubFilterLabel: 'Team filter',
    playerListHeading: 'Player list',
    playerSearchLabel: 'Search players',
    playerSearchPlaceholder: 'Search players by name or position...',
    emptySlot: 'Free',
    groupLabels: {
      'Brankáři': 'Goalkeepers',
      'Obránci': 'Defenders',
      'Záložníci': 'Midfielders',
      'Útočníci': 'Forwards'
    },
    footerDisclaimer: [
      'DISCLAIMER: This website is an unofficial, non-commercial fan project.',
      'All team and competition names, logos and trademarks are the property of their respective owners and are used here solely for informational and illustrative purposes.'
    ],
    footer: 'Created by Pavel Krupař with Claude Code and GitHub Copilot'
  },
  cs: {
    appName: 'Tvůrce fotbalových sestav',
    formationPickerLabel: 'Vyber formace',
    languagePickerLabel: 'Vyber jazyk',
    leaguePickerLabel: 'Vyber ligu',
    noLeagueTeams: 'Do této ligy zatím nebyly přidány žádné týmy.',
    generateButton: 'Generovat sestavu',
    generateButtonTitle: 'Automaticky sestavit nejsilnější možnou sestavu pro zvolené rozestavení a týmy',
    squadValueLabel: 'Hodnota',
    captainSelectLabel: 'Výběr kapitána týmu',
    captainPlaceholder: 'Vyber kapitána',
    captainClear: 'Odebrat kapitána',
    captainEmptyOption: 'Žádný hráč v sestavě',
    resetButton: 'Vymazat sestavu',
    resetButtonTitle: 'Odebrat všechny hráče ze sestavy',
    resetConfirm: 'Opravdu chceš vymazat celou sestavu?',
    clubFilterLabel: 'Filtr týmů',
    playerListHeading: 'Seznam hráčů',
    playerSearchLabel: 'Hledat hráče',
    playerSearchPlaceholder: 'Hledat hráče podle jména nebo pozice...',
    emptySlot: 'Volný',
    groupLabels: {
      'Brankáři': 'Brankáři',
      'Obránci': 'Obránci',
      'Záložníci': 'Záložníci',
      'Útočníci': 'Útočníci'
    },
    footerDisclaimer: [
      'UPOZORNĚNÍ: Tato webová stránka je neoficiálním a nekomerčním fanouškovským projektem.',
      'Všechny názvy týmů a soutěží, loga a ochranné známky jsou majetkem příslušných vlastníků a jsou zde použity výhradně pro informační a ilustrační účely.'
    ],
    footer: 'Vytvořil Pavel Krupař s Claude Code a GitHub Copilot'
  }
};
