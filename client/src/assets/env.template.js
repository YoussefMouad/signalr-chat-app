(function(window) {
  window.env = window.env || {};

  // Environment variables
  window["env"]["apiUrl"] = "${API_URL}";
  window["env"]["baseUrl"] = "${BASE_URL}";
  window["env"]["debug"] = "${DEBUG}";
})(this);