import ContentValueMixin from './util/content-value-mixin';
import get from '../node_modules/lodash-es/get';

export class WcmsRepeat extends ContentValueMixin(HTMLElement) {
    constructor() {
        super();

        this.addEventListener('content-changed', () => this.renderContent());
    }

    connectedCallback() {
        super.connectedCallback();

        this._template = this.querySelector('template');
        if(!this._template || !('content' in this._template)) {
            console.warn("wcms-repeat elements need to be initialized with a template element");
            return;
        }
        this.renderContent();
    }

    _setValue(val) {
        if(super.value === val) {
            return;
        }
        super._setValue(val);

        this.renderContent();
    }

    renderContent() {
        if(!this._template || !('content' in this._template)) {
            return;
        }

        if(!(this.value instanceof Array)) {
            return;
        }

        this.textContent = "";
        this.value.forEach(item => {
            const clone = document.importNode(this._template.content, true);
            clone.querySelectorAll('[item-key]').forEach(elem => {
                const value = get(item, elem.getAttribute('item-key'));
                if(value !== undefined) {
                    elem.value = value;
                }
            });
            this.appendChild(clone);
        });
    }
}

customElements.define('wcms-repeat', WcmsRepeat);
