import ContentValueMixin from './util/content-value-mixin';

export class WcmsAttribute extends ContentValueMixin(HTMLElement) {
    constructor() {
        super();

        this._name = "";
        this._appliedClass = [];
    }

    connectedCallback() {
        super.connectedCallback();

        this.applyAttribute();
    }

    static get observedAttributes() {
        return (super.observedAttributes || []).concat(['name']);
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if(attrName === 'name') {
            this[attrName] = newVal;
            return;
        }

        return super.attributeChangedCallback(attrName, oldVal, newVal);
    }

    _setValue(val) {
        if(super.value === val) {
            return;
        }
        super._setValue(val);

        this.applyAttribute();
    }

    set name(val) {
        if(this._name === val) {
            return;
        }

        this._name = val;
        this.applyAttribute();
    }

    get name() {
        return this._name;
    }

    applyAttribute() {
        if(!this.name || this.name === "") {
            return;
        }

        const applyNode = this.parentElement;

        if(this.name === 'class') {
            if(!!this.value && this.value !== "") {
                const tokens = this.value.split(' ');
                tokens.forEach(token => applyNode.classList.add(token));
                this._appliedClass = tokens;
            } else if(this._appliedClass !== "") {
                this._appliedClass.forEach(token => applyNode.classList.remove(token));
                this._appliedClass = [];
            }
            return;
        }

        if(typeof(this.value) !== "boolean") {
            applyNode.setAttribute(this.name, this.value);
            return;
        }

        // is boolean
        if(this.value) {
            applyNode.setAttribute(this.name, true);
        } else {
            applyNode.removeAttribute(this.name);
        }
    }

}

customElements.define('wcms-attribute', WcmsAttribute);
