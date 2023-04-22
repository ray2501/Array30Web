export class CandidateList {
    total = 1;
    current = 0;
    candidatewords = [];

    constructor(words) {
        this.candidatewords = words.slice();

        if (words.length <= 10) {
            this.total = 1;
        } else {
            this.total = (Math.floor(words.length / 10));

            if ((words.length % 10) > 0) {
                this.total = this.total + 1;
            }
        }
    }

    getCandidates() {
        if (this.total == 1) {
            return this.candidatewords;
        } else if (this.total > 1) {
            if (this.current == (this.total - 1)) {
                return this.candidatewords.slice(this.current * 10, this.candidatewords.length);
            } else {
                return this.candidatewords.slice(this.current * 10, this.current * 10 + 10);
            }
        }
    }

    getLength() {
        if (this.total == 1) {
            return this.candidatewords.length;
        } else if (this.total > 1) {
            if (this.current == (this.total - 1)) {
                return (this.candidatewords.length - (this.current * 10));
            } else {
                return 10;
            }
        }
    }

    currentPage() {
        return this.current;
    }

    totalPages() {
        return this.total;
    }

    prev() {
        if (this.total > 1) {
            if (this.current == 0) {
                this.current = this.total - 1;
            } else {
                this.current = this.current - 1;
            }
        }
    }

    next() {
        if (this.total > 1) {
            if (this.current == (this.total - 1)) {
                this.current = 0;
            } else {
                this.current = this.current + 1;
            }
        }
    }
}