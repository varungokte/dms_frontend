import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";

import { PriorityValues, PriorityStyling, PriorityIterate } from "./BasicComponents/Priority";
import { StatusValues, StatusStyling } from "./BasicComponents/Status";
import PurpleButtonStyling from "./BasicComponents/PurpleButtonStyling";
import Search from "./BasicComponents/Search";
import DialogForm from "./BasicComponents/DialogForm";

function TeamTasks() {
  //An array which contains many tasks; each task is an array
  //Task array has: [task_name, person_to_whom_it_is_assigned, due_date, priority, status]
  //priority has 3 values: Low, Medium, High
  //Status has 3 values: Complete, In Progress, Overdue
  //Each can be represented by a Number (0,1,2)
  const [taskList, setTaskList] = useState([
    ["Lender Agent Agreement", "Bruce Wayne", "01/01/01", 2, 0],
    ["Power Purchase Agreement", "Kal-El", "02/02/02", 1, 2],
    ["Lender Agent Agreement", "Kara Zor-El", "03/03/03", 2, 0 ],
    ["Escrow Agreement", "Oliver Queen", "04/4/05", 1,1],
    ["Substitution Agreement", "Diana Prince", "05/05/06", 0,1],
    ["Pledge Agreement", "Barry Allen", "06/06/07", 2, 0],
  ]);

  const [searchString, setSearchString] = useState("");
  const [priority, setPriority] = useState(-1);

  const [newTask, setNewTask] = useState("");
  const [newAssignee, setNewAssignee] = useState("");
  const [newPriority, setNewPriority] = useState(-1);
  const [newDate, setNewDate] = useState("");
  const [data, setData] = useState("DAT")
  const createTask = () => {
    setData("TASK"+" " +newTask+" " +newAssignee+" " +newPriority+" " +newDate)
  }

  return (
    <div>
			<p className="text-3xl font-bold m-7">Team Tasks</p>
			<div className="flex flex-row">
        <div className=''>
          <Search setter={setSearchString} label="Search"/>
        </div>
        
        <div className="flex-auto"> 
          <select className="bg-white p-6 m-2 rounded-xl" onChange={(e:any)=>setPriority(e.target.value)}>
            <option value={-1}>All Priorities</option>
            {PriorityIterate().map((num:any)=>{
              return <option value={num}>{PriorityValues[Number(num)]}</option>
            })}
          </select>
        </div>

        <div>
          <Dialog>
            <DialogTrigger className={PurpleButtonStyling}>Add Task</DialogTrigger>
            <DialogForm
              title="Add Team Task"
              formSubmit={createTask}
              submitButton="Add Task"
              form={[
                {
                  category: "single",
                  type: "text",
                  label: "Task",
                  setter: setNewTask
                },
                {
                  category: "single",
                  type: "select",
                  label: "Assigned To",
                  setter: setNewAssignee,
                  //@ts-ignore
                  options: ["Select a Team Member"].concat( taskList.map(task=>task[1]))
                },
                {
                  category: "grid", 
                  number:2, 
                  fields:[
                    {
                      type: "select",
                      label: "Priority",
                      setter: setNewPriority,
                      options: ["Select a Priority"].concat(PriorityIterate().map(val=>PriorityValues[Number(val)]))
                    },
                    {
                      type: "date",
                      label: "Due Date",
                      setter: setNewDate
                    }
                  ]
                }
              ]}
            />
          </Dialog>
        </div>  
      </div>

    <div className="m-7">
      <Table className="rounded-3xl bg-white">
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead>Assign To</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>

          {taskList.map((task)=>{
            const regEx = new RegExp(searchString, "i");
            if ((priority==-1 || task[3]==priority) && (searchString=="" || (task[0]+"").search(regEx)!==-1 || (task[1]+"").search(regEx)!==-1))
              return (
              <TableRow>
                <TableCell>{task[0]}</TableCell>
                <TableCell>{task[1]}</TableCell>
                <TableCell>{task[2]}</TableCell>
                <TableCell>
                  <div className={`${PriorityStyling[Number(task[3])]} rounded-lg text-center`}>
                    {PriorityValues[Number(task[3])]}
                  </div>
                </TableCell>
                <TableCell className={`${StatusStyling[Number(task[4])]}`}>{StatusValues[Number(task[4])]}</TableCell>
              </TableRow>)
            else  
              return(<></>)
          })}
          
        </TableBody>
      </Table>
    </div>
  </div>
  )
}

export default TeamTasks;