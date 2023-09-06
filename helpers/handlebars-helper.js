export default function cardColor(number, options) {
    if (number >= 3) {
        return 'green';
    } else if (number > 0) {
        return 'orange';
    } else {
        return 'red';
    }
}