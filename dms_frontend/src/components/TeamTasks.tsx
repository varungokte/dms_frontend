import { useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"


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

  enum PriorityValues {
    "Low",
    "Medium",
    "High"
  };

  enum PriorityStyling {
    "text-green-600 bg-green-100",
    "text-yellow-600 bg-yellow-50",
    "text-red-600 bg-red-100",
  };

  enum StatusValues {
    "Complete",
    "In Progress",
    "Overdue"
  };

  enum StatusStyling {
    "text-green-600",
    "text-yellow-600",
    "text-red-600",
  };

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
          <input type="text" className="border-2 mx-10 p-5 rounded-xl my-2" onChange={(e)=>setSearchString(e.target.value)} placeholder="Search"/>
        </div>
        
        <div className="flex-auto"> 
          <select className="bg-white p-6 m-2 rounded-xl" onChange={(e:any)=>setPriority(e.target.value)}>
            <option value={-1}>All Priorities</option>
            <option value={2}>High</option>
            <option value={1}>Medium</option>
            <option value={0}>Low</option>
          </select>
        </div>

        <div>
          <Dialog>
            <DialogTrigger className="mx-10 my-3 text-white p-3 rounded-xl" style={{backgroundColor:"slateblue"}}>Add Task</DialogTrigger>
            <DialogContent className="bg-white min-w-[600px] min-h-[400px]">
              <DialogHeader>
                <DialogTitle className="text-2xl">Add Team Task</DialogTitle>
                <hr/>
                <DialogDescription>
                  <form onSubmit={createTask}>
                    <label htmlFor="task" className="text-lg">Task</label>
                    <br/>
                    <input id="task" onChange={(e)=>setNewTask(e.target.value)} className="border w-5/6 h-10 rounded-lg p-3"/>
                    <br/>
                    <br/>

                    <label htmlFor="assignto" className="text-lg">Assigned To</label>
                    <br/>
                    <select id="assignto" required className="border-2 w-5/6 h-10 bg-white" onChange={(e)=>{setNewAssignee(e.target.value)}}>
                      <option value={""}>Select a team member</option>
                    {taskList.map((task,index)=>{
                      return(
                        <option value={index}>{task[1]}</option>
                      )
                    })}
                    </select>
                    <br/>
                    <br/>

                    <div className="grid grid-rows-2 grid-flow-col">
                      <div>
                        <label htmlFor="priority" className="text-lg">Priority</label>
                      </div>

                      <div>
                        <select id="priority" required className="border-2  w-4/5 h-10 bg-white" onChange={(e:any)=>{setNewPriority(e.target.value)}}>
                          <option value={""}>Select a priority</option>
                          <option value={0}>Low</option>
                          <option value={1}>Medium</option>
                          <option value={2}>High</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="date" className="text-lg" onChange={(e:any)=>{setNewAssignee(e.target.value+"")}}>Due Date</label>
                      </div>                      

                      <div>
                        <input type="date" className="w-4/5 h-10 bg-white border p-3"/>
                      </div>
                    </div>
                    <button type="submit" className="float-right mr-16 h-12 p-4 rounded-lg mt-9" style={{backgroundColor:"slateblue", color:"white"}}>Add Task</button>
                  </form>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
      </div>  
      </div>

    <div className="m-7">
    <Table className="border-2 rounded-3xl">
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