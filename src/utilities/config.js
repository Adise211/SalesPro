let Config = {};

async function _loadSettings() {
  let isConfigLoaded;
  const response = await fetch("/_config/config.json");

  if (response && response.ok) {
    const settings = await response.json();
    Config = settings;
    if (Config) {
      isConfigLoaded = true;
    } else {
      isConfigLoaded = false;
    }
  } else {
    isConfigLoaded = false;
  }

  return isConfigLoaded;
}

export { Config, _loadSettings };
