import { CovenantTypeList, CovenantCategoryList, FrequencyList, TransactionCategoryList, ComplianceCategoryList, ConditionPrecedentCategoryList, ConditionSubsequentCategoryList } from "../../../functions/Constants";
import { FieldAttributesList } from "@/types/FormAttributes";
import { DocumentSectionDetails, DocumentSectionKeys, DocumentSectionTypes, getDocSecName } from "@/functions/DocumentSectionAttributes";
import { PriorityList } from "@/functions/Constants";

const setSection = (label:string): (DocumentSectionDetails & {fieldList:FieldAttributesList}) =>{
  let fieldList;
  const sectionKey = getDocSecName(label,"fullname","keyname");
  const sectionType = getDocSecName(label, "fullname","type");

  if (sectionKey=="TD")
    fieldList = documentFieldList(TransactionCategoryList);
  else if (sectionKey=="CD")
    fieldList = documentFieldList(ComplianceCategoryList)
  else if (sectionKey=="C")
    fieldList = covenantFieldList();
  else if (sectionKey=="CP")
    fieldList = conditionsFieldList(ConditionPrecedentCategoryList);
  else
    fieldList = conditionsFieldList(ConditionSubsequentCategoryList);

  return {
    sectionKeyName: sectionKey as DocumentSectionKeys,
    sectionType: sectionType as DocumentSectionTypes,
    fieldList: fieldList as FieldAttributesList,
  }

  /* if (label=="Transaction Documents")
    return {sectionName: "TD", sectionType:"document", fieldList: documentFieldList(TransactionCategoryList) }
  else if (label=="Compliance Documents")
    return { sectionName: "CD", sectionType:"document", fieldList: documentFieldList(ComplianceCategoryList) }
  else if (label=="Covenants")
    return { sectionName: "C", sectionType:"covenant", fieldList: covenantFieldList() }
  else if (label=="Condition Precedent")
    return { sectionName: "CP", sectionType:"condition", fieldList: conditionsFieldList(ConditionPrecedentCategoryList) };
  else
    return { sectionName: "CS", sectionType:"condition",fieldList: conditionsFieldList(ConditionSubsequentCategoryList) }; */
}

const documentFieldList= (documentOptions:string[]):FieldAttributesList =>{
  return [
    { category:"single", id:"N", name:"Document Name", type:"text", required:true },
    { category:"grid", row:2, fields:[
      { id:"C", name:"Document Category", type:"select", options:documentOptions, required:true, immutable:true },
      { id:"P", name:"Priority", type:"select", options:PriorityList, required:true },
      { id:"SD", name:"Start Date", type:"date", required:true },
      { id:"ED", name:"End Date", type:"date", required:true },
      { id:"PL", name:"Physical Location", type:"text", required:true },
      { id:"EL", name:"Execution Location", type:"text", required:true },
    ]},    
  ]
}

const covenantFieldList = ():FieldAttributesList => {
  return [
    { category:"grid", row:2, fields:[
      { id:"N", name:"Covenant Name", type:"text", required:true },
      { id:"C", name:"Category Type", type:"select", options:CovenantCategoryList, required:true},
      { id:"T", name:"Covenant Type", type:"select", options:CovenantTypeList, required:true },
      { id:"P", name:"Priority", type:"select", options:PriorityList, required:true},
    ]},
    { category:"single", id:"F", name:"Frequency", type:"select", options:FrequencyList },
    { category:"grid", row:2, fields:[  
      { id:"SD", name:"Start Date", type:"date", required:true },
      { id:"ED", name:"End Date", type:"date", required:true },
      { id:"PL", name:"Physical Location", type:"text", required:true },
      { id:"EL", name:"Execution Location", type:"text", required:true },
    ]},
    { category:"single", id:"D", name:"Description", type:"textarea" },
  ];
}

const conditionsFieldList = (documentOptions:string[]):FieldAttributesList => {
  return [
    { category:"single", id:"N", name:"Condition Name", type:"text", required:true },
    { category:"grid", row:2, fields:[
      { id:"C", name:"Condition Category", type:"select", options:documentOptions, required:true },
      { id:"P", name: "Priority", type:"select", options:PriorityList, required:true},
      { id:"SD", name:"Start Date", type:"date", required:true },
      { id:"ED", name:"End Date", type:"date", required:true },
      { id:"PL", name:"Physical Location", type:"text", required:true },
      { id:"EL", name:"Execution Location", type:"text", required:true },
    ]},
    { category:"single", id:"D", name:"Description", type:"textarea" },
  ]
}

export default setSection;