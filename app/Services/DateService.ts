import moment from 'moment'

const startDateLastMonth = () => {
  const currentDate = moment()
  const FIRST_DAY = 1
  const lastMonth = moment()
    .locale('pt-br')
    .year(currentDate.year())
    .month(currentDate.month())
    .date(FIRST_DAY)
  return lastMonth.format('YYYY-MM-DD')
}

export default startDateLastMonth
