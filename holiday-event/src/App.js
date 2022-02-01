import axios from 'axios'
import './index.css'
import React, { useEffect, useState } from 'react'

export default function App() {
  const [data, setData] = useState(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [tableArr, setTableArr] = useState([])
  useEffect(async () => {
    const response = await axios.get('https://www.gov.uk/bank-holidays.json')
    setData(response.data)
  }, [])

  useEffect(() => {
    const tableJSX = filteredData.map((data, i) => {
      const { title, date, country } = data
      return (
        <tr key={i}> 
          <td>{country}</td>
          <td>{title}</td>
          <td>{date}</td>
        </tr>
      )
    })

    setTableArr(tableJSX)
  }, [filteredData])

  const handleStartChange = (e) => {
    setStartDate(e.target.value)
  }

  const handleEndChange = (e) => {
    setEndDate(e.target.value)
  }
  console.log(startDate, endDate)
  const handleSearch = () => {
    const filterHolidays = []
    for (let [key, value] of Object.entries(data)) {
      for (let [key2, value2] of Object.entries(value)) {
        if (value2 && typeof value2 === 'object') {
          value2.forEach((data) => {
            const { date } = data
            if (startDate < date && endDate > date) {
              filterHolidays.push({ ...data, country: key })
            }
          })
        }
      }
    }
    setFilteredData(filterHolidays)
  }

  const checkButtonDisabled = () => {
    if (!startDate) return true
    if (!endDate) return true
    return false
  }
  return (
    <div className='App'>
      <input type='date' value={startDate} onChange={handleStartChange} />
      <input type='date' value={endDate} onChange={handleEndChange} />
      <button disabled={checkButtonDisabled()} onClick={handleSearch}>
        Submit
      </button>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }} >  
        {tableArr?.length ? (
          <table>
            <tr>
              <th>Country</th>
              <th>Holiday</th>
              <th>Date</th>
            </tr>
            <tbody>{tableArr}</tbody>
          </table>
        ) : null}
      </div>
    </div>
  )
}
