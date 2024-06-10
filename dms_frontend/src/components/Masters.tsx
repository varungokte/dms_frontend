import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FormDialog from './FormComponents/FormDialog';
import { useState } from 'react';
import { CreateButtonStyling } from './BasicComponents/PurpleButtonStyling';

function Masters(){

  const [fieldList] = useState([
    { category: "single", id:"N", name: "Category Name", type:"text" },
    { category: "single", id:"V", name: "Values", type:"multitext"}
  ]);

  const [fieldValues,setFieldValues] = useState<any>({});
  
  const createMaster = () =>{
  }
  return(
    <div>
      <p className="text-3xl font-bold m-7">Masters</p>
    
    <div className="flex flex-row">
      <div className="flex-auto"></div>
      <FormDialog key={-1} index={-1} type="cont"
        triggerText="Add" triggerClassName={CreateButtonStyling} formSize="medium"
        formTitle="Add To Masters" formSubmit={createMaster} submitButton="Add" 
        form={fieldList} fieldValues={fieldValues} setter={setFieldValues} currentFields={{}}
      />
    </div>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>Zones</AccordionSummary>
        <AccordionDetails>The zones</AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>Loan Products</AccordionSummary>
        <AccordionDetails>The loan producs</AccordionDetails>
      </Accordion>
    </div>
  )
}

export default Masters;