const fs = require('fs')
const csv = require('csv-parser')
var result = []

fs.createReadStream('./data/transactions.csv')
  .pipe(csv({}))
  .on('data', data => {
    result.push(data)
  })
  .on('end', function () {
    getData(result)
  })

const getData = data => {
  const value = data
  const unique = [...new Set(value.map(item => item.token))]
  for (let i = 0; i < unique.length; i++) {
    filterToken(value, unique[i])
  }
}

const filterToken = (value, i) => {
  const filteredItem = value.filter(item => item.token === i)
  const depositValue = filteredItem.filter(
    item => item.transaction_type === 'DEPOSIT'
  )
  const withdrawalValue = filteredItem.filter(
    item => item.transaction_type === 'WITHDRAWAL'
  )
  calculateAmount(depositValue, withdrawalValue, i)
}

function calculateSum (array, property) {
  const total = array.reduce((accumulator, object) => {
    return accumulator + parseFloat(object[property])
  }, 0)

  return total
}

const calculateAmount = (depositValue, withdrawalValue, i) => {
  const depositSum = calculateSum(depositValue, 'amount')
  const withdrawalSum = calculateSum(withdrawalValue, 'amount')
  const currentStatus = depositSum - withdrawalSum
  console.log('Current Portfolio(Balance)', i, currentStatus + 'USD')
}
