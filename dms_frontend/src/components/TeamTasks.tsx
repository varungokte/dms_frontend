import { useState } from "react";
import { Table } from "@/components/ui/table";

import { BodyRowsMapping, HeaderRows } from "./BasicComponents/Table";
import FormDialog from "./BasicComponents/FormDialog";
import Search from "./BasicComponents/Search";
import Filter from "./BasicComponents/Filter";

import { CreateButtonStyling } from "./BasicComponents/PurpleButtonStyling";
import { PriorityValues, EnumIteratorKeys, EnumIteratorValues } from "./BasicComponents/Constants";
import useGlobalContext from "./../../GlobalContext";

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
  };

	const {useTitle} = useGlobalContext();

	useTitle("Team Tasks");

  return (
    <div>
			<p className="text-3xl font-bold m-7">Team Tasks</p>
			<div className="flex flex-row">
        <div className=''>
          <Search setter={setSearchString} label="Search"/>
        </div>
        
        <div className="flex-auto"> 
          <Filter setter={setPriority} listsAreSame={false} 
            valueList={EnumIteratorKeys(PriorityValues)} labelList={EnumIteratorValues(PriorityValues)}
            setPlaceholder={true} placeholderValue={[-1, "All Priorities"]} 
          />
        </div>

        <div>
          <FormDialog
            triggerClassName={CreateButtonStyling} triggerText="Add Task" formSize="medium"
            formTitle="Add Team Task" formSubmit={createTask} submitButton="Add Task"
            form={[
              { category: "single", type: "text", label: "Task", setter: setNewTask },
              { category: "single", type: "select", label: "Assigned To", setter: setNewAssignee, options: ["Select a Team Member"].concat( taskList.map((task:any)=>task[1])) },
              { category: "grid", row:2, fields:[
                { type: "select", label: "Priority", setter: setNewPriority, options: ["Select a Priority"].concat(EnumIteratorKeys(PriorityValues).map(val=>PriorityValues[Number(val)])) },
                { type: "date", label: "Due Date", setter: setNewDate }
              ]}
            ]}
          />
        </div>  
      </div>

      <div className="m-7">
        <Table className="rounded-2xl bg-white">
          <HeaderRows headingRows={[["Task"],["Assign To"], ["Due Date"], ["Priority"], ["Status"]]} />        
          <BodyRowsMapping 
            list={taskList} dataType={["text", "text", "text", "priority", "docStatus"]} 
            searchRows={searchString==""?[]:[searchString,0,1]} filterRows={priority==-1?[]:[priority,3]} 
          />
        </Table>
      </div>
    </div>
  )
}

export default TeamTasks;