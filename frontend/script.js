var currText = "# Marked in the browser\n\nRendered by **marked**.";
var content = $("#content");
var area = $(".area");
var editMode = false;
var noticenames = [];

area.val(currText);
content.html(parseContent(currText));

area.on("input change keyup", (e) => {
  console.log(e.target.innerHTML);
  content.html(parseContent(area.val()));
});

$(document).ready(() => {
  loadNotices();
});

function parseContent(mdContent) {
  var parsed = marked.parse(mdContent);
  console.log(parsed);
  return parsed;
}

function loadNotices() {
  fetch("/loadNotices")
    .then((response) => response.json())
    .then((value) => {
      console.log(value);
      setCurrentSelected(value[0]);
      value.forEach((element) => {
        console.log(element);
        createNoticeItem(element);
      });
    });
}

function setCurrentSelected(noticename) {
  $(".currentSelected").text("Aktuelle Notiz: " + noticename);
}

function createNoticeItem(noticename) {
  var item = `<li onclick=setCurrentSelected("${noticename}")>${noticename}</li>`;
  $(".noticeList").append(item);
}

function createNotice() {
  var noticename = { name: $(".createNoticeInput").val() };
  console.log(noticename);

  fetch("/createNewNotice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(noticename),
  });

  location.reload();
}
