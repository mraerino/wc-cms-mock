import get from '../node_modules/lodash-es/get.js';
import KeyMixin from './util/key-mixin.js';
import ContentMixin from './util/content-mixin.js';
import ValueMixin from './util/value-mixin.js';

export class WcmsValue extends ValueMixin(ContentMixin(KeyMixin(HTMLElement))) {

    constructor() {
        super();

        this.addEventListener('content-changed', () => this.fetchValue());
    }

    set value(val) {
        super.value = val;
        this.textContent = this._value;
    }

    get value() {
        return super.value;
    }

    set key(val) {
        super.key = val;
        this.fetchValue();
    }

    get key() {
        return super.key;
    }

    fetchValue() {
        const value = this.getMetaValue(this.key);
        if(value === undefined) {
            return;
        }
        this.value = value;
        this.dispatchEvent(new CustomEvent('value-changed', { detail: { value: this.value } }));
    }
}

customElements.define('wcms-value', WcmsValue);