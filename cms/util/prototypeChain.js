export default function isChildClass(child, superClass) {
    while(child !== Object) {
        if(child.prototype === superClass.prototype) {
            return true;
        }
        child = child.prototype;
    }
    return false;
}
