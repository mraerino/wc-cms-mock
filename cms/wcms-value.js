import ContentValueMixin from './util/content-value-mixin.js';

export class WcmsValue extends ContentValueMixin(HTMLElement) {

    _setValue(val) {
        super._setValue(val);
        this.textContent = this.value;
    }

}

customElements.define('wcms-value', WcmsValue);