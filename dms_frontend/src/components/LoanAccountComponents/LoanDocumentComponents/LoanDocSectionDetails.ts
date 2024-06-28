import { CovenantTypeList, CovenantCategoryList, FrequencyList, TransactionCategoryList, ComplianceCategoryList, ConditionPrecedentCategoryList, ConditionSubsequentCategoryList } from "../../../../Constants";
import { DocumentSectionDetails, FieldAttributesList } from "../../../../DataTypes";
import { PriorityList } from "../../../../Constants";

const setSection = (label:string): (DocumentSectionDetails & {fieldList:FieldAttributesList}) =>{
  if (label=="Transaction Documents")
    return {sectionName: "TD", sectionType:"doc", fieldList: documentFieldList(TransactionCategoryList) }
  else if (label=="Compliance Documents")
    return { sectionName: "CD", sectionType:"doc", fieldList: documentFieldList(ComplianceCategoryList) }
  else if (label=="Covenants")
    return { sectionName: "C", sectionType:"cov", fieldList: covenantFieldList() }
  else if (label=="Condition Precedent")
    return { sectionName: "CP", sectionType:"con", fieldList: conditionsFieldList(ConditionPrecedentCategoryList) };
  else
    return { sectionName: "CS", sectionType:"con",fieldList: conditionsFieldList(ConditionSubsequentCategoryList) };
}

const documentFieldList= (documentOptions:string[]):FieldAttributesList =>{
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

const covenantFieldList = ():FieldAttributesList => {
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
      { id:"PL", name:"Physical Location", type:"text" },
      { id:"EL", name:"Execution Location", type:"text" },
    ]},
    { category:"single", id:"D", name:"Description", type:"textarea" },
  ];
}

const conditionsFieldList = (documentOptions:string[]):FieldAttributesList => {
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

export default setSection;