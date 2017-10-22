import KeyMixin from './key-mixin.js';
import ContentMixin from './content-mixin.js';
import ValueMixin from './value-mixin.js';
import GlobalMixin from './global-mixin.js';

export default function(superClass) {
    class ContentValueMixin extends ValueMixin(GlobalMixin(ContentMixin(KeyMixin(superClass)))) {
        constructor() {
            super();

            this._global = false;

            this.addEventListener('content-changed', () => !this.global && this.fetchValue());
            this.addEventListener('global-changed', () => this.global && this.fetchValue());
        }

        static get observedAttributes() {
            return (super.observedAttributes || []).concat(['global']);
        }

        attributeChangedCallback(attrName, oldVal, newVal) {
            if(attrName === 'global') {
                this[attrName] = newVal !== null;
                return;
            }

            return super.attributeChangedCallback(attrName, oldVal, newVal);
        }

        set global(val) {
            this._setGlobal(val);
        }

        _setGlobal(val) {
            if(super._setGlobal) {
                super._setGlobal(val);
            }
            if(this._global === !!val) {
                return;
            }

            this._global = !!val;
            this.fetchValue();
        }

        get global() {
            return this._global;
        }

        _setKey(val) {
            if(super.key === val) {
                return;
            }
            super._setKey(val);

            this.fetchValue();
        }

        fetchValue() {
            const value = !this.global
                ? this.getMetaValue(this.key)
                : this.getGlobalValue(this.key);
            if(value === undefined) {
                return;
            }
            this.value = value;
            this.dispatchEvent(new CustomEvent('value-changed', { detail: { value: this.value } }));
        }
    }

    return ContentValueMixin;
}