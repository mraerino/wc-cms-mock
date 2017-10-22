export default function(superClass) {

    /**
     * @param {String} key
     */
    class KeyMixin extends superClass {
        constructor() {
            super();
            this._key = "";
        }

        static get observedAttributes() {
            return (super.observedAttributes || []).concat(['key']);
        }

        attributeChangedCallback(attrName, oldVal, newVal) {
            if(attrName === 'key') {
                this[attrName] = newVal;
                return;
            }

            return super.attributeChangedCallback(attrName, oldVal, newVal);
        }

        set key(val) {
            this._setKey(val);
        }

        _setKey(val) {
            if(super._setKey) {
                super._setKey(val);
            }

            if(this._key === val) {
                return;
            }

            this._key = val;
        }

        get key() {
            return this._key;
        }
    }

    return KeyMixin;
}