import { useState } from "react";
import Search from "./BasicComponents/Search";

function Reminders() {

  const [reminders, setReminders] = useState([
    ["Lender Agent Agreement", "Bruce Wayne", "01/01/01", 2, 0],
    ["Power Purchase Agreement", "Kal-El", "02/02/02", 1, 2],
    ["Lender Agent Agreement", "Kara Zor-El", "03/03/03", 2, 0 ],
    ["Escrow Agreement", "Oliver Queen", "04/4/05", 1,1],
    ["Substitution Agreement", "Diana Prince", "05/05/06", 0,1],
    ["Pledge Agreement", "Barry Allen", "06/06/07", 2, 0],
  ])

  const [searchString, setSearchString] = useState("");
  return (
    <div>
      <p className="text-3xl font-bold m-7">Reminders</p>
      <div className="flex flex-row m-3">
        <div className=''>
          <Search setter={setSearchString} label="Search"/>
        </div>
        
        <div className="flex-auto"> 
            Date filter
        </div>

        <div>
          <button>All{`(${reminders.length})`}</button>
          <button>All{`(${reminders.filter})`}</button>
        </div>
      </div>
    </div>
  )
}

export default Reminders;