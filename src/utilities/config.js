let _settings = {};

async function _loadSettings() {
  const response = await fetch("/_config/config.json");
  if (response && response.ok) {
    const settings = await response.json();
    _settings = settings;
  }
}

// Remove await for build???
await _loadSettings();

const Config = _settings;

export default Config;
