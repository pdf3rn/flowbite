declare global {
    interface Window {
        Collapse: typeof Collapse;
    }
}

type CollapseOptions = {
    onCollapse: (collapse: Collapse) => void,
    onExpand: (collapse: Collapse) => void,
    onToggle: (collapse: Collapse) => void
}

const Default: CollapseOptions = {
    onCollapse: () => { },
    onExpand: () => { },
    onToggle: () => { },
};

class Collapse {
    private _targetEl: HTMLElement | null;
    private _triggerEl: HTMLElement | null;
    private _options: CollapseOptions;
    private _visible: boolean;

    constructor(targetEl: HTMLElement | null = null, triggerEl: HTMLElement | null = null, options: object = {}) {
        this._targetEl = targetEl;
        this._triggerEl = triggerEl;
        this._options = { ...Default, ...options };
        this._visible = false;
        this._init();
    }

    private _init() {
        if (this._triggerEl) {
            if (this._triggerEl.hasAttribute("aria-expanded")) {
                this._visible =
                    this._triggerEl.getAttribute("aria-expanded") === "true";
            } else {
                // fix until v2 not to break previous single collapses which became dismiss
                this._visible = !this._targetEl.classList.contains("hidden");
            }

            this._triggerEl.addEventListener("click", () => {
                this._visible ? this.collapse() : this.expand();
            });
        }
    }

    collapse() {
        this._targetEl.classList.add("hidden");
        if (this._triggerEl) {
            this._triggerEl.setAttribute("aria-expanded", "false");
        }
        this._visible = false;

        // callback function
        this._options.onCollapse(this);
    }


    expand() {
        this._targetEl.
            classList.remove("hidden");
        if (this._triggerEl) {
            this._triggerEl.setAttribute("aria-expanded", "true");
        }
        this._visible = true;

        // callback function
        this._options.onExpand(this);
    }

    toggle() {
        if (this._visible) {
            this.collapse();
        } else {
            this.expand();
        }
    }
}

window.Collapse = Collapse;

export function initCollapses() {
    document
        .querySelectorAll("[data-collapse-toggle]")
        .forEach((triggerEl) => {
            const targetEl = document.getElementById(
                triggerEl.getAttribute("data-collapse-toggle")
            );

            // check if the target element exists
            if (!targetEl) {
                return;
            }

            new Collapse(targetEl, triggerEl as HTMLElement);
        });
}

export default Collapse;