import get from '../node_modules/lodash-es/get.js';
import KeyMixin from './util/key-mixin.js';
import ContentMixin from './util/content-mixin.js';

export class WcmsValue extends ContentMixin(KeyMixin(HTMLElement)) {

    constructor() {
        super();

        this._value = "";

        this.addEventListener('content-changed', () => this.fetchValue());
    }

    static get observedAttributes() {
        return (super.observedAttributes || []).concat(['value']);
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if(attrName === 'value') {
            this[attrName] = newVal;
            return;
        }

        return super.attributeChangedCallback(attrName, oldVal, newVal);
    }

    set value(val) {
        this._value = val;
        this.textContent = this._value;
    }

    get value() {
        return this._value;
    }

    set key(val) {
        super.key = val;
        this.fetchValue();
    }

    fetchValue() {
        const value = this.getMetaValue(this._key);
        if(value === undefined) {
            return;
        }
        this.value = value;
        this.dispatchEvent(new CustomEvent('value-changed', { detail: { value: this.value } }));
    }
}

customElements.define('wcms-value', WcmsValue);