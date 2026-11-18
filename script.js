var apps = JSON.parse(localStorage.apps || "[]");
var save = () => localStorage.apps = JSON.stringify(apps);

function show() {
  const box = document.getElementById("myApplications");
  if (!box) return;

  box.textContent = "";

  apps.forEach((a, i) => {
    const article = document.createElement("article");
    article.className = "card";

    const h3 = document.createElement("h3");
    h3.textContent = a.t;

    const pCompany = document.createElement("p");
    pCompany.textContent = a.c;

    const pStatus = document.createElement("p");
    pStatus.textContent = a.s;

    const button = document.createElement("button");
    button.setAttribute("data-action", "remove");
    button.setAttribute("data-i", i);
    button.textContent = "Remove";

    article.append(h3, pCompany, pStatus, button);
    box.appendChild(article);
  });
}


function askConfirm(message, onYes) {
  var overlay = document.createElement("div");
  overlay.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999";

  var box = document.createElement("div");
  box.style = "background:white;padding:20px;border-radius:8px;text-align:center";

  var p = document.createElement("p");
  p.textContent = message;

  var yes = document.createElement("button");
  yes.textContent = "Yes";
  yes.style = "margin:5px";

  var no = document.createElement("button");
  no.textContent = "No";
  no.style = "margin:5px";

  yes.onclick = function () {
    overlay.remove();
    onYes();
  };
  no.onclick = function () {
    overlay.remove();
  };

  box.append(p, yes, no);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
}

document.onclick = (e) => {
  var b = e.target, act = b.dataset.action;


  if (act == "apply") {
    var c = b.closest(".card");
    apps.push({
      t: c.querySelector("h3").textContent,
      c: c.querySelector(".company").textContent,
      s: c.querySelector(".stipend").textContent
    });
    save();
    b.textContent = "Applied ✓";
    b.disabled = true;
  }


  if (act == "save")
    b.textContent = b.textContent.includes("Saved") ? "Save ☆" : "Saved ★";

 
  if (act == "remove") {
    var i = b.dataset.i;
    askConfirm("Are you sure you want to remove?", function () {
      apps.splice(i, 1);
      save();
      show();
    });
  }
};

show();

document.querySelectorAll("[data-action=apply]").forEach((b) => {
  var t = b.closest(".card").querySelector("h3").textContent;
  if (apps.some((a) => a.t == t)) {
    b.textContent = "Applied ✓";
    b.disabled = true;
  }
});


function filter() {
  var text = document.getElementById("search").value.toLowerCase();
  var cat = document.getElementById("category").value;
  var typ = document.getElementById("type").value;

  var cards = document.querySelectorAll(".card[data-category]");

  cards.forEach(function (card) {
    var okText = card.textContent.toLowerCase().includes(text);
    var okCat = cat === "" || card.dataset.category === cat;
    var okType = typ === "" || card.dataset.type === typ;

    if (okText && okCat && okType) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}

var searchBox = document.getElementById("search");
if (searchBox) {
  searchBox.addEventListener("input", filter);
  document.getElementById("category").addEventListener("change", filter);
  document.getElementById("type").addEventListener("change", filter);
}


document.addEventListener("submit", function (e) {
  e.preventDefault();
  var employer = location.href.includes("employer");
  alert(employer ? "Internship published successfully!" : "Profile saved!");
  e.target.reset();
});