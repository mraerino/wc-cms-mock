import KeyMixin from './key-mixin';
import ValueMixin from './value-mixin';
import isChildClass from './prototypeChain';
import { tagName as providerTagName } from '../wcms-provider';

/**
 * @param {HTMLElement} superClass
 * @returns {ContentValueMixin}
 */
export default function(superClass) {
    if(!isChildClass(superClass, HTMLElement)) {
        throw new TypeError("This mixin needs to be used with a super class based on HTMLElement.");
    }

    class ContentValueMixin extends ValueMixin(KeyMixin(superClass)) {
        constructor() {
            super();

            this._global = false;
            this._provider = null;
            this._shadowRoot = null;
        }

        connectedCallback() {
            if(super.connectedCallback) {
                super.connectedCallback();
            }

            // determine provider
            this._provider = document.body.querySelector(providerTagName);
            if(!!this._provider) {
                this._setupListeners();
                this.fetchValue();
                return;
            }

            // create provider within shadow dom
            this._shadowRoot = this.attachShadow({mode: 'open'});
            // slot for light dom
            this._shadowRoot.appendChild(document.createElement('slot'));
            this._provider = document.createElement(providerTagName);
            this._setupListeners();
            this._shadowRoot.appendChild(this._provider);
            this.fetchValue();
        }

        _setupListeners() {
            this._provider.addEventListener('data-changed', () => !this.global && this.fetchValue());
            this._provider.addEventListener('site-changed', () => this.global && this.fetchValue());
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
            if(!this._provider || !this.key || this.key === "") {
                return;
            }

            const value = !this.global
                ? this._provider.getPageValue(this.key)
                : this._provider.getGlobalValue(this.key);
            this.value = value === undefined ? "" : value;
            this.dispatchEvent(new CustomEvent('value-changed', { detail: { value: this.value } }));
        }
    }

    return ContentValueMixin;
}
