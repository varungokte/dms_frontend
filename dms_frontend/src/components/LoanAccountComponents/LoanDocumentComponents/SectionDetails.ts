import { CovenantTypeList, CovenantCategoryList, FrequencyList, TransactionCategoryList, ComplianceCategoryList, ConditionPrecedentCategoryList, ConditionSubsequentCategoryList } from "../../../../Constants";
import { PriorityList } from "../../../../Constants";
import { FormDialogDocumentSections, FormDialogDocumentTypes, FormFieldDetails } from "../../../../DataTypes";

type SectionDetails = {
  sectionName: FormDialogDocumentSections,
  type:FormDialogDocumentTypes,
  fieldList:FormFieldDetails
}

const setSection = (label:string): SectionDetails =>{
  const documentFieldList= (documentOptions:string[]):FormFieldDetails =>{
    return [
      { category:"single", id:"N", name:"Document Name", type:"text", required:true },
      { category:"grid", row:2, fields:[
        { id:"C", name:"Document Category", type:"select", options:documentOptions, required:false, immutable:true },
        { id:"P", name:"Priority", type:"select", options:PriorityList, required:true },
        { id:"SD", name:"Start Date", type:"date", required:true },
        { id:"ED", name:"End Date", type:"date", required:true },
        { id:"PL", name:"Physical Location", type:"text" },
        { id:"EL", name:"Execution Location", type:"text" },
      ]},    
    ]
  }
  
  const covenantFieldList = ():FormFieldDetails => {
    return [
      { category:"grid", row:2, fields:[
        { id:"N", name:"Covenant Name", type:"text", required:true },
        { id:"T", name:"Covenant Type", type:"select", options:CovenantTypeList, required:true },
        { id:"C", name:"Category Type", type:"select", options:CovenantCategoryList, required:true},
        { id:"P", name:"Priority", type:"select", options:PriorityList, required:true},
      ]},
      { category:"single", id:"F", name:"Frequency", type:"select", options:FrequencyList },
      { category:"grid", row:2, fields:[  
        { id:"SD", name:"Start Date", type:"date", required:true },
        { id:"ED", name:"End Date", type:"date", required:true },
        { id:"EL", name:"Execution Location", type:"text" },
        { id:"PL", name:"Physical Location", type:"text" },
      ]},
      { category:"single", id:"D", name:"Description", type:"textarea" },
    ];
  }

  const conditionsFieldList = (documentOptions:string[]):FormFieldDetails => {
    return [
      { category:"single", id:"N", name:"Condition Name", type:"text" },
      { category:"grid", row:2, fields:[
        { id:"C", name:"Condition Category", type:"select", options:documentOptions },
        { id:"P", name: "Priority", type:"select", options:PriorityList},
        { id:"SD", name:"Start Date", type:"date", required:true },
        { id:"ED", name:"End Date", type:"date", required:true },
        { id:"PL", name:"Physical Location", type:"text" },
        { id:"EL", name:"Execution Location", type:"text" },
      ]},
      { category:"single", id:"D", name:"Description", type:"textarea" },
    ]
  }

  if (label=="Transaction Documents")
    return { sectionName: "TD", type:"doc", fieldList: documentFieldList(TransactionCategoryList) }
  
  else if (label=="Compliance Documents")
    return { sectionName: "CD", type:"doc", fieldList: documentFieldList(ComplianceCategoryList) }
  
  else if (label=="Covenants")
    return { sectionName: "C", type:"cov", fieldList: covenantFieldList() }
  
  else if (label=="Condition Precedent")
    return { sectionName: "CP", type:"con", fieldList: conditionsFieldList(ConditionPrecedentCategoryList) }
  
  else if (label=="Condition Subsequent")
    return { sectionName: "CS", type:"con",fieldList: conditionsFieldList(ConditionSubsequentCategoryList) }
  
  else 
    return { sectionName: "undefined", type:"undefined", fieldList: [] }
}

export default setSection