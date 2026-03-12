class LightsOutGame {
    constructor(size = 3, maxAttempts = 10, timeout = 5) {
        this.SIZE = size;
        this.maxAttempts = maxAttempts;
        this.board = [];
        this.moves = 0;
        this.gameOver = false;

        this._onWon = null;
        this._onLost = null;
        this._onCellClick = null;

        this._audio = new Audio('sounds/countdown.ogg');
        this._audio.loop = true;

        this.timeout = 5;
    }

    won(callback) {
        this._onWon = callback;
        return this;
    }

    lost(callback) {
        this._onLost = callback;
        return this;
    }

    cellClick(callback) {
        this._onCellClick = callback;
        return this;
    }

    start() {
        this._renderHTML();

        this._startTimeout();

        this.moves = 0;
        this.gameOver = false;

        this.board = Array(this.SIZE * this.SIZE).fill(1);
        const shuffleMoves = 10 + Math.floor(Math.random() * 10);
        for (let i = 0; i < shuffleMoves; i++) {
            const idx = Math.floor(Math.random() * this.SIZE * this.SIZE);
            this._applyToggle(idx, false);
        }

        if (this.board.every(v => v === 1)) this._applyToggle(4, false);

        this.hideOverlay();
        this._renderGrid();
        this._updateProgress();
        this._audio.currentTime = 0;
        this._audio.play();

        return this;
    }

    setVolume(volume) {
        this._audio.volume = volume == 0 ? 0 : volume / 4;
        return this;
    }

    handleClick(idx) {
        if (this.gameOver) return;

        this._startTimeout();

        const cells = document.querySelectorAll('.cell');
        const row = Math.floor(idx / this.SIZE);
        const col = idx % this.SIZE;
        const neighbors = [
            [row, col],
            [row - 1, col], [row + 1, col],
            [row, col - 1], [row, col + 1],
        ];

        for (const [r, c] of neighbors) {
            if (r >= 0 && r < this.SIZE && c >= 0 && c < this.SIZE) {
                const cell = cells[r * this.SIZE + c];
                cell.classList.remove('flash');
                void cell.offsetWidth;
                cell.classList.add('flash');
            }
        }

        if (this._onCellClick) this._onCellClick();
        this._applyToggle(idx);
        this.moves++;
        this._updateProgress();
        this._checkWin();
    }

    showOverlay(win) {
        const ov = document.getElementById('overlay');
        const title = document.getElementById('overlayTitle');
        ov.className = `overlay show ${win ? 'win-ov' : 'lose-ov'}`;

        if (win) {
            title.innerHTML = `
                    <svg class="overlay-icon" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                        <circle class="check-circle" cx="40" cy="40" r="34"/>
                        <polyline class="check-tick" points="24,40 35,52 56,28"/>
                    </svg>`;
        } else {
            title.innerHTML = `
                    <svg class="overlay-icon" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                        <rect class="lock-body" x="18" y="36" width="44" height="32" rx="5"/>
                        <path class="lock-shackle" d="M27,36 V26 a13,13 0 0,1 26,0 V36"/>
                        <circle class="lock-keyhole" cx="40" cy="53" r="4"/>
                        <rect class="lock-keyhole" x="37.5" y="53" width="5" height="7" rx="1"/>
                    </svg>`;
        }
    }

    hideOverlay() {
        document.getElementById('overlay').className = 'overlay';
    }

    _renderHTML() {
        if (document.querySelector('.electrical-lock')) return;

        document.body.insertAdjacentHTML('afterbegin', `
                <div class="bg-overlay"></div>
                <div class="electrical-lock">
                    <div class="lock-overlay"></div>
                    <div class="progress">
                        <div class="progress-bar" id="progressBar" style="width:0;"></div>
                    </div>
                    <div class="grid-wrapper">
                        <div class="grid" id="grid" style="grid-template-columns: repeat(${this.SIZE}, 1fr);"></div>
                    </div>
                    <div class="overlay" id="overlay">
                        <div class="overlay-title" id="overlayTitle"></div>
                    </div>
                </div>
            `);
    }

    _applyToggle(idx, render = true) {
        const row = Math.floor(idx / this.SIZE);
        const col = idx % this.SIZE;
        const neighbors = [
            [row, col],
            [row - 1, col], [row + 1, col],
            [row, col - 1], [row, col + 1],
        ];
        for (const [r, c] of neighbors) {
            if (r >= 0 && r < this.SIZE && c >= 0 && c < this.SIZE) {
                this.board[r * this.SIZE + c] ^= 1;
            }
        }
        if (render) this._renderGrid();
    }

    _checkWin() {
        const lit = this.board.filter(v => v === 1).length;

        if (lit === this.SIZE * this.SIZE) {
            this.gameOver = true;
            this.showOverlay(true);
            this._audio.pause();
            if (this._onWon) this._onWon();
            setTimeout(() => {
                this._destroyHTML();
            }, 1500);
            return;
        }

        if (this.moves >= this.maxAttempts) {
            this.gameOver = true;
            this.showOverlay(false);
            this._audio.pause();
            if (this._onLost) this._onLost();
            setTimeout(() => {
                this._destroyHTML();
            }, 1500);
        }
    }

    _startTimeout() {
        clearTimeout(this._timeout);
        this._timeout = setTimeout(() => {
            if (this.gameOver) return;
            this.gameOver = true;
            this.showOverlay(false);
            this._audio.pause();
            if (this._onLost) this._onLost();
            setTimeout(() => {
                this._destroyHTML();
            }, 1500);
        }, this.timeout * 1000);
    }

    _destroyHTML() {
        clearTimeout(this._timeout);
        clearInterval(this._progressInterval);
        this._audio.pause();
        this._audio.currentTime = 0;
        document.querySelector('.bg-overlay')?.remove();
        document.querySelector('.electrical-lock')?.remove();
    }

    _renderGrid() {
        const grid = document.getElementById('grid');
        grid.innerHTML = '';
        this.board.forEach((state, i) => {
            const cell = document.createElement('div');
            cell.className = `cell ${state === 1 ? 'on' : 'off'}`;
            cell.innerHTML = '<div class="cell-inner"></div>';
            cell.addEventListener('click', () => this.handleClick(i));
            grid.appendChild(cell);
        });
    }

    _updateProgress() {
        const bar = document.getElementById('progressBar');

        clearInterval(this._progressInterval);
        const start = Date.now();
        const duration = this.timeout * 1000;

        this._progressInterval = setInterval(() => {
            const elapsed = Date.now() - start;
            const remaining = Math.max(0, duration - elapsed);
            const percent = (remaining / duration) * 100;
            bar.style.width = percent + '%';
            if (remaining === 0) clearInterval(this._progressInterval);
        }, 50);
    }
}