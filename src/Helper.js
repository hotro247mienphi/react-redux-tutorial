const uid = () => {
    return Math.random().toString(36).substring(2);
}

const rand = (arr) => {
    return arr[Math.floor(arr.length * Math.random())];
}

const addZeroBeforeNumberLessThanTen = (number) => {
    return (number >= 0 && number <= 9 ? '0' : '') + number;
}

const getDate = (string = '') => {
    if (string.length) {
        const data = string.split(' ');
        return data[0];
    }

    const today = new Date();
    const arr = [
        today.getFullYear(),
        addZeroBeforeNumberLessThanTen(today.getMonth() + 1),
        addZeroBeforeNumberLessThanTen(today.getDate()),
    ];
    return arr.join('-');
}

const getTime = (string = '') => {
    if (string.length) {
        const data = string.split(' ');
        return data[1];
    }

    const today = new Date();
    const arr = [
        addZeroBeforeNumberLessThanTen(today.getHours()),
        addZeroBeforeNumberLessThanTen(today.getMinutes()),
        addZeroBeforeNumberLessThanTen(today.getSeconds()),
    ];
    return arr.join(':');
}

const now = () => {
    return getDate() + ' ' + getTime();
}

const switchDateFormat = (date = '', searchWith = '-', replaceWith = '/') => {
    return date.replace(searchWith, replaceWith);
}

const strToTime = (str) => new Date(switchDateFormat(str));

export default {
    uid,
    addZeroBeforeNumberLessThanTen,
    rand,
    getDate,
    getTime,
    now,
    switchDateFormat,
    strToTime
};