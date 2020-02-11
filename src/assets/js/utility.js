import moment from 'moment'

export function formatDate() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

export function getTimeCategory(stime) {
    let timeCategory = '';
    const timeFormat = 'HH:mm:ss';
    let time = moment(stime,timeFormat)
    if (
        time.isBetween(moment('00:00:00', timeFormat), moment('04:59:59', timeFormat)) ||
        time.isSame(moment('00:00:00', timeFormat)) ||
        time.isSame(moment('04:59:59', timeFormat))
      ) {
        timeCategory = 'nuit';
      }else if (
      time.isBetween(moment('05:00:00', timeFormat), moment('11:59:59', timeFormat)) ||
      time.isSame(moment('05:00:00', timeFormat)) ||
      time.isSame(moment('11:59:59', timeFormat))
    ) {
      timeCategory = 'matin';
    } else if (
      time.isBetween(moment('12:00:00', timeFormat), moment('16:59:59', timeFormat)) ||
      time.isSame(moment('12:00:00', timeFormat)) ||
      time.isSame(moment('16:59:59', timeFormat))
    ) {
      timeCategory = 'après-midi';
    } else if (
      time.isBetween(moment('17:00:00', timeFormat), moment('23:59:59', timeFormat)) ||
      time.isSame(moment('17:00:00', timeFormat)) ||
      time.isSame(moment('23:59:59', timeFormat))
    ) {
      timeCategory = 'soir';
    }
  
    return timeCategory;
  }

export function getschedule(date){
    let d = new Date(date);
    let time = d.toTimeString().split(' ')[0];
    return getTimeCategory(time);
}
export function getTime(date){
  let d = new Date(date);
    return d.toTimeString().split(' ')[0];
}