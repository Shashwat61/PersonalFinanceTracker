import  { useState } from 'react'

function useFilters() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  return {
    selectedDate,
    setSelectedDate
  }
}

export default useFilters