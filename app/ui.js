var chineseMode = true;
var halfwidthMode = true;

var sFullWidthTable = [
    "　", "！", "＂", "＃", "＄", "％", "＆", "＇", "（", "）", "＊", "＋",
    "，", "－", "．", "／", "０", "１", "２", "３", "４", "５", "６", "７",
    "８", "９", "：", "；", "＜", "＝", "＞", "？", "＠", "Ａ", "Ｂ", "Ｃ",
    "Ｄ", "Ｅ", "Ｆ", "Ｇ", "Ｈ", "Ｉ", "Ｊ", "Ｋ", "Ｌ", "Ｍ", "Ｎ", "Ｏ",
    "Ｐ", "Ｑ", "Ｒ", "Ｓ", "Ｔ", "Ｕ", "Ｖ", "Ｗ", "Ｘ", "Ｙ", "Ｚ", "［",
    "＼", "］", "＾", "＿", "｀", "ａ", "ｂ", "ｃ", "ｄ", "ｅ", "ｆ", "ｇ",
    "ｈ", "ｉ", "ｊ", "ｋ", "ｌ", "ｍ", "ｎ", "ｏ", "ｐ", "ｑ", "ｒ", "ｓ",
    "ｔ", "ｕ", "ｖ", "ｗ", "ｘ", "ｙ", "ｚ", "｛", "｜", "｝", "～",
];


function resetUI() {
  let renderText = chineseMode ? "【行列】" : "【英數】";
  renderText += halfwidthMode ? "【半形】" : "【全形】";
  document.querySelector("#input_mode").innerHTML = renderText;
  document.querySelector("#preedit").innerHTML = "";
  document.querySelector("#candidates").innerHTML = "";
}

let ui = (function () {
  let that = {};
  that.reset = resetUI;

  that.commitString = function (string) {
    var selectionStart = document.querySelector("#text_area").selectionStart;
    var text = document.querySelector("#text_area").value;
    var head = text.substring(0, selectionStart);
    var tail = text.substring(selectionStart);
    document.querySelector("#text_area").value = head + string + tail;
    let start = selectionStart + string.length;
    document.querySelector("#text_area").setSelectionRange(start, start);
  };

  that.update = function (string) {
    let state = JSON.parse(string);
    {
      let renderText = chineseMode ? "【行列】" : "【英數】";
      renderText += halfwidthMode ? "【半形】" : "【全形】";
      document.querySelector("#input_mode").innerHTML = renderText;

      let preedit = state.preedit;
      document.querySelector("#preedit").innerHTML = preedit;

      let candidates = state.candidates;
      let showcandiates = "";
      let selectkeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
      for (let i = 0; i < candidates.length; i++) {
          showcandiates = showcandiates.concat(" ", selectkeys[i], ". ", candidates[i]);
      }

      document.querySelector("#candidates").innerHTML = showcandiates;
    }
  };

  return that;
})();

const { InputController } = window.array30;
let controller = new InputController(ui);

let shiftKeyIsPressed = false;

document.querySelector("#text_area").addEventListener("keyup", (event) => {
    if (event.key === "Shift" && shiftKeyIsPressed) {
        shiftKeyIsPressed = false;
        chineseMode = !chineseMode;
        controller.reset();
        return;
    }
  },
  false
);


document.querySelector("#text_area").addEventListener("keydown", (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
    }

    shiftKeyIsPressed = event.key === "Shift";

    if (event.shiftKey && event.code == "Space") {
        halfwidthMode = !halfwidthMode;
        controller.reset();
        event.preventDefault();
        return;
    }

    if (!chineseMode) {
        if (!halfwidthMode) {
            let keyname = event.key;
            if (keyname.length == 1) {
                let keyval = keyname.charCodeAt(0);
                if (keyval >= 32 && keyval - 32 < sFullWidthTable.length) {
                    controller.commitString(sFullWidthTable[keyval - 32]);
                    event.preventDefault();
                }
            }
        }

        return;
    }

    let accepted = controller.keyEvent(event);
    if (accepted) {
        event.preventDefault();
    } else if (!accepted && !halfwidthMode) {
        let keyname = event.key;
        if (keyname.length == 1) {
            let keyval = keyname.charCodeAt(0);
            if (keyval >= 32 && keyval - 32 < sFullWidthTable.length) {
                controller.commitString(sFullWidthTable[keyval - 32]);
                event.preventDefault();
            }
        }
    }
  },
  false
);

resetUI();
document.querySelector("#text_area").focus();
