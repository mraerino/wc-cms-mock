import jsYaml from 'js-yaml';
import KeyMixin from './util/key-mixin.js'

export class WcmsGlobal extends KeyMixin(HTMLElement) {

    constructor() {
        super();

        // load global settings
        this._config = {};
        this._configPath = '/site.yml';
        fetch(this._configPath)
            .then(res => res.text())
            .then(text => this._config = jsYaml.safeLoad(text))
            .then(() => this.insertValue());
    }

    set key(val) {
        super.key = val;
        this.insertValue();
    }

    get key() {
        return super.key;
    }

    insertValue() {
        this.textContent = (this._key in this._config) ? this._config[this._key] : "";
    }
}

customElements.define('wcms-global', WcmsGlobal);