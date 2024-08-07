import { ReactElement, useEffect, useState } from "react";
import Slider from '@mui/material/Slider';
import TableSelect from "./BasicComponents/TableSelect";
import { DataTable } from "./BasicComponents/Table";
import { FieldValues } from "DataTypes";

function Reminders(props:{label:string}) {
  useEffect(()=>{
		document.title=props.label+" | Beacon DMS"
	},[]);

  const dates:{value:number,label:string|ReactElement, agreements:string[], docs:FieldValues[][]}[] = [
    {
      value: 0,
      label: "02/07/2024",
      agreements: ["AGMT001","AGMT002","AGMT003"],
      docs: [
        [{N:"001 Doc1", C:"cat1", S:"Verified", D:"2/3/4",}],
        [{N:"002 Doc1", C:"cat1", S:"Verified", D:"2/3/4",}, {N:"002 Doc2", C:"cat2", S:"Pending", D:"4/5/6",}],
        []
      ]
    },
    {
      value: 1,
      label: "09/07/2024",
      agreements: ["AGMT004","AGMT005","AGMT006"],
      docs: [
        [{N:"004 Doc2", C:"cat2", S:"Verified", D:"2/3/4",}, {N:"004 Doc3", C:"cat3", S:"Pending", D:"4/5/6",}],
        [],
        [] 
      ]
    },
    {
      value: 2,
      label: "16/07/2024",
      agreements: ["AGMT007","AGMT008","AGMT009"],
      docs: [
        [{N:"007 Doc4", C:"cat4", S:"Overdue", D:"2/3/4",}],
        [{N:"008 Doc5", C:"cat5", S:"Pending", D:"4/5/6",}],
        [{N:"009 Doc6", C:"cat6", S:"Verifed", D:"2/7/12",}],
      ]
    },
    {
      value: 3,
      label: "23/07/2024",
      agreements: ["AGMT010","AGMT011","AGMT012"],
      docs: [
        [{N:"Doc2", C:"cat2", S:"Verified", D:"22/3/90",}, {N:"Doc3", C:"cat3", S:"Pending", D:"4/5/6",}],
        [],
        []
      ]
    },
    {
      value: 4,
      label: "20/07/2024",
      agreements: ["AGMT013","AGMT014","AGMT015"],
      docs: [
        [{N:"Doc2", C:"cat2", S:"In progress", D:"2/3/4",}, {N:"Doc3", C:"cat3", S:"Pending", D:"4/5/6",}],
        [],
        []
      ]
    }
  ];

  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedAID, setSelectedAID] = useState(0);

  useEffect(()=>{
    setSelectedAID(0)
  },[selectedDate]);

  //useEffect(()=>console.log("date",selectedDate,"AID",selectedAID,"data",dates[selectedDate],dates[selectedDate].docs[selectedAID]),[selectedAID,selectedDate])

  return (
    <div>
      <p className="text-3xl font-bold m-7">{props.label}</p>
      <div className="flex flex-row m-3">
        <div className=''>
        </div>
      </div>
      <div className="flex flex-row m-3">
        <div className="bg-stone-200 p-10 flex flex-row">
          <div className="h-[300px] min-w-[200px] align-middle">
            <Slider
              value={selectedDate} 
              onChange={(_,num)=>setSelectedDate(num as number)}
              orientation="vertical" max={4} track={false}
              color="secondary"
              marks={dates.map((date,index:number)=>{
                date.label = <p className={selectedDate==index?"text-xl text-custom-1":""}>{(date.label).toString()}</p>
                return date;
              })}
            />
          </div>
          <TableSelect 
            tableHeading="Agreement IDs" 
            tableValues={dates[selectedDate].agreements} 
            selected={selectedAID} setSelected={setSelectedAID} 
            className={"min-w-[250px] rounded-2xl bg-white"} 
            textSize="medium" 
          />
        </div>
        <div className="mx-3">
        </div>
        <div className="float-right">
          <DataTable
            headingRows={["Document Name","Document Category", "Status","Date"]}
            tableData={dates[selectedDate].docs[selectedAID]} columnIDs={["N","C","S","D"]}
            dataTypes={["text","text","doc-status","text"]}
          />
        </div>
      </div>
    </div>
  )
}

export default Reminders;