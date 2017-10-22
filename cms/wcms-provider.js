import jsYaml from 'js-yaml';
import get from '../node_modules/lodash-es/get.js';
import trimStart from '../node_modules/lodash-es/trimStart.js';
import loadmd from './util/loadmd.js';

/**
 * Fetches data needed to render a preview for a single site
 */
export class WcmsProvider extends HTMLElement {
    constructor() {
        super();

        this._site = {};
        this._siteConfigPath = '/site.yml';
        this._content = undefined;
        this._data = {};
        this._pageName = "";
    }

    connectedCallback() {
        // fetch site config
        fetch(this._siteConfigPath)
            .then(res => res.text())
            .then(text => this._site = jsYaml.safeLoad(text))
            .then(() => this.dispatchEvent(new CustomEvent('site-changed')));

        // fetch page data
        this._pageName = (location.pathname.endsWith('/')
                ? 'index.html'
                : trimStart(location.pathname, '/')
        ).replace('.html', '.md');

        const contentPath = '/content/' + this._pageName;
        loadmd(contentPath)
            .then(res => {
                this._content = res.content;
                this._data = res.data;
                this.dispatchEvent(new CustomEvent('data-changed'));
            });
    }

    get pageName() {
        return this._pageName;
    }

    getGlobalValue(key) {
        return get(this._site, key);
    }

    getPageValue(key) {
        if(key === 'content') {
            return this._content;
        }
        return get(this._data, key);
    }
}

export const tagName = "wcms-provider";

customElements.define(tagName, WcmsProvider);
