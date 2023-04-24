import {CandidateList} from "./CandidateList.js"
import {webData} from "./webData.js"
import {simpleCode} from "./simpleCode.js"
import {phraseData} from "./phraseData.js"

export class InputController {
    ui;
    input_buffer = "";
    candidateList = null;
    space_count = 0;
    symbol_lookup = false;
    phrase_lookup = false;

    selectkeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

    keymap = {
            "q": "1^",
            "a": "1-",
            "z": "1v",
            "w": "2^",
            "s": "2-",
            "x": "2v",
            "e": "3^",
            "d": "3-",
            "c": "3v",
            "r": "4^",
            "f": "4-",
            "v": "4v",
            "t": "5^",
            "g": "5-",
            "b": "5v",
            "y": "6^",
            "h": "6-",
            "n": "6v",
            "u": "7^",
            "j": "7-",
            "m": "7v",
            "i": "8^",
            "k": "8-",
            ",": "8v",
            "o": "9^",
            "l": "9-",
            ".": "9v",
            "p": "0^",
            ";": "0-",
            "/": "0v",
            "0": " 0",
            "1": " 1",
            "2": " 2",
            "3": " 3",
            "4": " 4",
            "5": " 5",
            "6": " 6",
            "7": " 7",
            "8": " 8",
            "9": " 9",
        };

    constructor(ui) {
        this.ui = ui;
        this.input_buffer = "";
        this.candidateList = null;
        this.space_count = 0;
    }

    reset() {
        this.input_buffer = "";
        this.candidateList = null;
        this.space_count = 0;

        this.ui.reset();
    }

    update(string) {
        let preedit_string = this.toPreeditString(string);

        let candidates = [];
        if (this.phrase_lookup == true) {
            this.phrase_lookup = false;

            if (phraseData[string] !== undefined)
                candidates = phraseData[string].slice();
            else
                candidates = [];
        } else if (string.charAt(0) === 'w' && string.length == 2 && this.symbol_lookup == true) {
            this.symbol_lookup = false;

            if (webData[string] !== undefined)
                candidates = webData[string].slice();
            else
                candidates = [];
        } else if (string.length <= 2 && this.space_count == 0) {
            if (simpleCode[string] !== undefined)
                candidates = simpleCode[string].slice();
            else
                candidates = [];
        } else {
            if (webData[string] !== undefined)
                candidates = webData[string].slice();
            else
                candidates = [];
        }

        let candidatelist;
        if (candidates.length == 0) {
            this.candidateList = null;
            candidatelist = [];
        } else {
            this.candidateList = new CandidateList(candidates);
            candidatelist = this.candidateList.getCandidates().slice();
        }

        let state = {
            "preedit": preedit_string,
            "candidates": candidatelist,
        };

        this.ui.update(JSON.stringify(state));
    }

    toPreeditString (string) {
        let preedit_string = "";
        for (let i = 0; i < string.length; i++) {
            preedit_string = preedit_string.concat(" ", this.keymap[string[i]]);
        }

        return preedit_string;
    }

    /*
     * For candidate list more than 1 pages.
     * It is not good but it works.
     */
    updateCandidates(string) {
        let preedit_string = this.toPreeditString(string);

        let candidatelist;
        candidatelist = this.candidateList.getCandidates().slice();

        let state = {
            "preedit": preedit_string,
            "candidates": candidatelist,
        };

        this.ui.update(JSON.stringify(state));
    }

    commitString(string) {
        if (string !== "⎔") {
            this.ui.commitString(string);
        }
    }

    keyEvent(event) {
        let keyname = event.key;
        switch (keyname) {
            case ' ':
                if (this.input_buffer.length == 0) {
                    return false;
                }

                if (this.candidateList != null) {
                    if(this.candidateList.totalPages() > 1) {
                        this.candidateList.next();
                        this.updateCandidates(this.input_buffer);
                        return true;
                    }
                }

                if (this.space_count == 0) {
                    this.space_count++;

                    this.update(this.input_buffer);
                    if (this.candidateList != null) {
                        let candidatewords = this.candidateList.getCandidates().slice();
                        if (this.candidateList.getLength() == 1) {
                            this.commitString(candidatewords[0]);
                            this.reset();
                        }
                    } else {
                        this.reset();
                    }
                } else if (this.space_count == 1) {
                    if (this.candidateList != null) {
                        let candidatewords = this.candidateList.getCandidates().slice();
                        if (this.candidateList.getLength() > 0) {
                            this.commitString(candidatewords[0]);
                            this.reset();
                        }
                    } else {
                        this.reset();
                    }
                }

                return true;

            case "'":
                if (this.input_buffer.length == 0) {
                    return false;
                }

                if (this.space_count == 0) {
                    this.space_count++;
                }

                this.phrase_lookup = true;
                this.update(this.input_buffer);
                if (this.candidateList != null) {
                    let candidatewords = this.candidateList.getCandidates().slice();
                    if (this.candidateList.getLength() == 1) {
                        this.commitString(candidatewords[0]);
                        this.reset();
                    }
                } else {
                    this.reset();
                }

                return true;

            case 'Backspace':
            case 'Delete':
                if (this.input_buffer.length == 0) {
                    return false;
                }

                this.space_count = 0;

                this.input_buffer =
                    this.input_buffer.substr(0, this.input_buffer.length - 1);

                this.update(this.input_buffer);
                return true;

            case 'Enter':
                if (this.input_buffer.length == 0) {
                    return false;
                }

                return true;

            case 'PageUp':
            case 'ArrowLeft':
            case 'ArrowUp':
                if (this.input_buffer.length == 0) {
                    return false;
                }

                if (this.candidateList != null) {
                    if(this.candidateList.totalPages() > 1) {
                        this.candidateList.prev();
                        this.updateCandidates(this.input_buffer);
                        return true;
                    }
                }

                break;

            case 'PageDown':
            case 'ArrowRight':
            case 'ArrowDown':
                if (this.input_buffer.length == 0) {
                    return false;
                }

                if (this.candidateList != null) {
                    if(this.candidateList.totalPages() > 1) {
                        this.candidateList.next();
                        this.updateCandidates(this.input_buffer);
                        return true;
                    }
                }

                break;

            case 'Escape':
                if (this.input_buffer.length == 0) {
                    return false;
                }

                this.reset();
                return true;
        }

        if (keyname.length == 1) {
            let keyval = keyname.charAt(0);
            if (keyval >= "0" && keyval <= "9") {
                if (this.input_buffer.length == 0) {
                    return false;
                }

                if (this.input_buffer.length == 1 &&
                    this.input_buffer.charAt(0) === 'w') {
                    this.symbol_lookup = true;
                    this.input_buffer += keyval;
                    this.update(this.input_buffer);
                    return true;
                }

                let index = this.selectkeys.indexOf(keyval);
                if (this.candidateList != null) {
                    if (index >= 0 && index < this.candidateList.getLength()) {
                        let candidatewords = this.candidateList.getCandidates().slice();
                        this.commitString(candidatewords[index]);
                        this.reset();
                    }
                }

                return true;
            }


            if ((keyval >= "a" && keyval <= "z") ||
                keyval === ";" || keyval === "," ||
                keyval === "." || keyval === "/") {

                if (this.space_count == 1) {
                    let candidatewords = this.candidateList.getCandidates().slice();
                    if (this.candidateList.getLength() > 0) {
                        this.commitString(candidatewords[0]);
                        this.reset();
                    }
                }

                if (this.input_buffer.length >= 5) {
                    return true;
                }

                this.input_buffer += keyval;

                this.update(this.input_buffer);
                return true;
            }
        }

        return false;
    }
}