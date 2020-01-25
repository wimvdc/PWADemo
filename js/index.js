$(function() {
  fetch("https://api.chucknorris.io/jokes/random", {
    method: "GET",
    redirect: "follow"
  })
    .then(response => response.json())
    .then(result => {
      $("#icon").attr("src", result.icon_url);
      $("#quote").text(result.value);
    })
    .catch(error => console.log("error", error));

  window.onload = () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("../sw.js", { scope: "/" })
        .then(reg => {
          console.log(`Registration succeeded. Scope is ${reg.scope}`);
        })
        .catch(error => {
          console.log(`Registration failed with ${error}`);
        });
    }
  };
});
