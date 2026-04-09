export function formatMessageTime(date) {
    return new Date(date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}

export function mergeSort(arr, key = "createdAt") {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid), key);
    const right = mergeSort(arr.slice(mid), key);
    return merge(left, right, key);
}

function merge(left, right, key) {
    const result = [];
    let i = 0, j = 0;
    while (i < left.length && j < right.length) {
        if (new Date(left[i][key]) < new Date(right[j][key])) {
            result.push(left[i++]);
        } else {
            result.push(right[j++]);
        }
    }
    return result.concat(left.slice(i)).concat(right.slice(j));
}