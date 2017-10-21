import KeyMixin from './key-mixin.js';
import ContentMixin from './content-mixin.js';
import ValueMixin from './value-mixin.js';

export default function(superClass) {
    class ContentValueMixin extends ValueMixin(ContentMixin(KeyMixin(superClass))) {
        constructor() {
            super();

            this.addEventListener('content-changed', () => this.fetchValue());
        }

        set key(val) {
            if(super.key !== val) {
                this.fetchValue();
            }
            super.key = val;
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

    return ContentValueMixin;
}