import loadmd from './loadmd.js';
import trimStart from '../../node_modules/lodash-es/trimStart.js';
import get from '../../node_modules/lodash-es/get.js';

/**
 * @param superClass
 * @returns {ContentMixin}
 */
export default function(superClass) {
    class ContentMixin extends superClass {
        constructor() {
            super();

            //init
            this._content = undefined;
            this._data = {};
        }

        connectedCallback() {
            super.connectedCallback();

            const pageName = (location.pathname.endsWith('/')
                    ? 'index.html'
                    : trimStart(location.pathname, '/')
            ).replace('.html', '.md');
            const contentPath = '/content/' + pageName;
            loadmd(contentPath)
                .then(res => {
                    this._content = res.content;
                    this._data = res.data;
                    this.dispatchEvent(new CustomEvent('content-changed'));
                });
        }

        getMetaValue(key) {
            if(key === 'content') {
                return this._content;
            }
            return get(this._data, key);
        }
    }

    return ContentMixin;
}