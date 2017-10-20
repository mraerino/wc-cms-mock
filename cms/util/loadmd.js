import matter from 'gray-matter';

export default function loadmd(req) {
    return fetch(req)
        .then(res => res.text())
        .then(content => matter(content));
}