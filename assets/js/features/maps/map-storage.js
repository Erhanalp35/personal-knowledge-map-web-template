(function (PKM) {
  const getMaps = () => PKM.state.get().maps;
  const getActive = () => PKM.state.activeMap();
  PKM.mapStorage = { getMaps, getActive };
})(window.PKM = window.PKM || {});
