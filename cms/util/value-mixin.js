export default function(superClass) {
    class ValueMixin extends superClass {
        constructor() {
            super();

            this._value = "";
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
            super.value = val;
            this._value = val;
        }

        get value() {
            return this._value;
        }

    }

    return ValueMixin;
}