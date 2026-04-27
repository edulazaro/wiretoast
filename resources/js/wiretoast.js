(function () {
    if (window.__wiretoastInitialized) return;
    window.__wiretoastInitialized = true;

    const POSITIONS = [
        'top-left', 'top-center', 'top-right',
        'bottom-left', 'bottom-center', 'bottom-right',
        'center'
    ];

    const ICONS = {
        success: '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>',
        error:   '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>',
        warning: '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>',
        info:    '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/></svg>',
        neutral: '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 1h6v2H7V6zm0 4h6v2H7v-2z" clip-rule="evenodd"/></svg>',
    };

    const CLOSE_ICON = '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/></svg>';

    function ensureRoot() {
        let root = document.getElementById('wt-root');
        if (!root) {
            root = document.createElement('div');
            root.id = 'wt-root';
            document.body.appendChild(root);
        }
        POSITIONS.forEach(pos => {
            if (!root.querySelector(`.wt-container[data-wt-position="${pos}"]`)) {
                const el = document.createElement('div');
                el.className = 'wt-container';
                el.dataset.wtPosition = pos;
                root.appendChild(el);
            }
        });
        return root;
    }

    function notify(input, type, third) {
        type = type || 'info';
        const root = ensureRoot();

        let title = null;
        let message = '';

        if (input && typeof input === 'object' && !Array.isArray(input)) {
            title = input.title || null;
            message = input.message || '';
        } else {
            message = input;
        }

        let opts = {};
        if (typeof third === 'boolean') {
            opts.group = third;
        } else if (third && typeof third === 'object') {
            opts = { ...third };
        }

        if (input && typeof input === 'object' && !Array.isArray(input)) {
            if (input.position && opts.position === undefined) opts.position = input.position;
            if (input.timeout !== undefined && opts.timeout === undefined) opts.timeout = input.timeout;
            if (input.progress !== undefined && opts.progress === undefined) opts.progress = input.progress;
            if (input.group !== undefined && opts.group === undefined) opts.group = input.group;
        }

        const position = opts.position
            || root.dataset.wtDefaultPosition
            || document.body.dataset.wtDefaultPosition
            || 'top-right';
        const timeout = opts.timeout ?? 5000;
        const progress = opts.progress ?? false;
        const group = opts.group ?? false;

        const container = root.querySelector(`.wt-container[data-wt-position="${position}"]`);
        if (!container) return;

        if (group) {
            const existing = container.querySelector(`.wt-toast[data-wt-type="${type}"][data-wt-group="true"]`);
            if (existing) {
                const body = existing.querySelector('.wt-body');
                body.textContent = body.textContent + '\n' + message;
                return;
            }
        }

        const toast = document.createElement('div');
        toast.className = 'wt-toast';
        toast.dataset.wtType = type;
        if (group) toast.dataset.wtGroup = 'true';

        const titleHtml = title ? '<div class="wt-title"></div>' : '';
        toast.innerHTML =
            '<div class="wt-icon">' + (ICONS[type] || ICONS.info) + '</div>' +
            '<div class="wt-stack">' + titleHtml + '<div class="wt-body"></div></div>' +
            '<button class="wt-close" aria-label="Close">' + CLOSE_ICON + '</button>';

        if (title) toast.querySelector('.wt-title').textContent = title;
        toast.querySelector('.wt-body').textContent = message;

        container.appendChild(toast);

        const remove = () => {
            toast.classList.add('wt-leaving');
            setTimeout(() => toast.remove(), 200);
        };

        toast.querySelector('.wt-close').addEventListener('click', remove);

        if (timeout > 0) {
            if (progress) {
                toast.dataset.wtProgress = 'true';
                toast.style.setProperty('--wt-progress-duration', timeout + 'ms');
                toast.addEventListener('animationend', e => {
                    if (e.animationName === 'wt-progress') remove();
                });
            } else {
                setTimeout(remove, timeout);
            }
        }
    }

    window.notify = notify;

    /* Bridge: $this->dispatch('notify', ...) (Livewire) and $dispatch('notify', ...) (Alpine)
       both fire a window 'notify' CustomEvent with { message, type, title, position, timeout, progress, group } */
    window.addEventListener('notify', e => {
        const d = e.detail || {};
        const payload = d.title ? { title: d.title, message: d.message } : d.message;
        notify(payload, d.type || 'info', {
            position: d.position,
            timeout: d.timeout,
            progress: d.progress,
            group: d.group,
        });
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ensureRoot);
    } else {
        ensureRoot();
    }
})();
