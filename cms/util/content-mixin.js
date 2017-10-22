import loadmd from './loadmd';
import trimStart from '../../node_modules/lodash-es/trimStart';
import get from '../../node_modules/lodash-es/get';

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
            if(super.connectedCallback) {
                super.connectedCallback();
            }

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
