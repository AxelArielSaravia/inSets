/**
* @returns {string}
*/
function createId() {
    const values = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_";
    let str = Date.now() + "";
    for (let i = 0; i < 8; i++) {
        const indexValue = Math.floor(Math.random() * values.length);
        const indexPosition = Math.floor(Math.random() * str.length);
        str = str.slice(0, indexPosition) + values[indexValue] + str.slice(indexPosition);
    }
    return str;
}

export default createId;