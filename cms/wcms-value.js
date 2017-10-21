import ContentValueMixin from './util/content-value-mixin.js';

export class WcmsValue extends ContentValueMixin(HTMLElement) {

    set value(val) {
        super.value = val;
        this.textContent = this._value;
    }

    get value() {
        return super.value;
    }

}

customElements.define('wcms-value', WcmsValue);