import KeyMixin from './util/key-mixin.js';
import ContentMixin from './util/content-mixin.js';
import get from '../node_modules/lodash-es/get.js';

export class WcmsRepeat extends ContentMixin(KeyMixin(HTMLElement)) {
    constructor() {
        super();

        this.addEventListener('content-changed', () => this.renderContent());
    }

    connectedCallback() {
        this._template = this.querySelector('template');
        if(!this._template || !('content' in this._template)) {
            console.warn("wcms-repeat elements need to be initialized with a template element");
            return;
        }
        this.renderContent();
    }

    set key(val) {
        super.key = val;
        this.renderContent();
    }

    get key() {
        return super.key;
    }

    renderContent() {
        if(!this._template || !('content' in this._template)) {
            return;
        }

        const value = this.getMetaValue(this.key);
        if(!(value instanceof Array)) {
            return;
        }

        this.textContent = "";
        value.forEach(item => {
            const clone = document.importNode(this._template.content, true);
            clone.querySelectorAll('wcms-value[item-key]').forEach(elem => {
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