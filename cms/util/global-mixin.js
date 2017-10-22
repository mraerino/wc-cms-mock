import jsYaml from 'js-yaml';
import get from '../../node_modules/lodash-es/get.js';

export default function(superClass) {
    class GlobalMixin extends superClass {

        constructor() {
            super();

            // load global settings
            this._config = {};
            this._configPath = '/site.yml';
        }

        connectedCallback() {
            if(super.connectedCallback) {
                super.connectedCallback();
            }

            fetch(this._configPath)
                .then(res => res.text())
                .then(text => this._config = jsYaml.safeLoad(text))
                .then(() => this.dispatchEvent(new CustomEvent('global-changed')));
        }

        getGlobalValue(key) {
            return get(this._config, key);
        }
    }

    return GlobalMixin;
}