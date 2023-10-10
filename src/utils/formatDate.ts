const months = {
    1: 'STY',
    2: 'LUT',
    3: 'MAR',
    4: 'KWI',
    5: 'MAJ',
    6: 'CZE',
    7: 'LIP',
    8: 'SIE',
    9: 'WRZ',
    10: 'PAŹ',
    11: 'LIS',
    12: 'GRU'
}

export function formatDate(dateStr) {
    let date = new Date(dateStr);
    //   let testDateStr = "2023-09-06T11:55:53.333Z";
    const month = String(date.getMonth() + 1)

    return `${String(date.getDate()).padStart(2, '0')} ${months[month]} ${date.getFullYear()} | ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export function formatDateToObject (dateStr) {
    let date = new Date(dateStr);

    const month = String(date.getMonth() + 1);

    return {
        day: String(date.getDate()).padStart(2, '0'),
        month: months[month],
        year: date.getFullYear(),
        time: `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    };
}