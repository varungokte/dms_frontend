//DOCUMENT SECTIONS
const documentSectionNames= [
  { fullname: "Transaction Documents", shortname: "transaction", keyname:"TD", type: "document" },
  { fullname: "Compliance Documents", shortname: "compliance", keyname:"CD", type: "document" },
  { fullname: "Covenants", shortname: "covenants", keyname:"C", type: "covenant" },
  { fullname: "Condition Precedent", shortname: "precedent", keyname:"CP", type: "condition" },
  { fullname: "Condition Subsequent", shortname: "subsequent", keyname:"CS", type: "condition" },
  { fullname: "Payment Schedule", shortname: "payment", keyname:"PD", type: "payment" }
];

type DocumentNameAttributes = "fullname"|"shortname"|"keyname"|"type";

const getDocSecName = (data:{inputName:string, inputType:DocumentNameAttributes, outputType:DocumentNameAttributes}) => {
  for (let i=0; i<documentSectionNames.length; i++){
    const doc = documentSectionNames[i];
    if (doc[data.inputType]==data.inputName)
      return doc[data.outputType];
  }
  return "";
};

const getDocSecList = (outputType:DocumentNameAttributes) =>{
  const res = documentSectionNames.map(doc=>doc[outputType]);
  return outputType=="type"?[...new Set(res)]:res;
}


//MODULE SECTIONS
const moduleSectionNames = [
  { fullname:"Masters", shortname:"masters",category:"admin" },
  { fullname:"Role Management", shortname:"role",category:"admin" },
  { fullname:"Team Management", shortname:"team",category:"admin" },
  { fullname:"User Management", shortname:"user",category:"admin" },

  { fullname:"Loan Account", shortname:"loan",category:"loan" },
  { fullname:"Contact Details", shortname:"contact",category:"loan" },
  { fullname:"Ratings", shortname:"rating",category:"loan" },
  
  ...documentSectionNames.map(doc=>{return {fullname:doc.fullname, shortname:doc.shortname, category:"documents"}}),
  
  { fullname:"Reminders", shortname:"reminders",category:"reminders" },
  { fullname:"Default Cases", shortname:"default",category:"reminders" },
  { fullname:"Critical Cases", shortname:"critical",category:"reminders" },
  { fullname:"Reports", shortname:"reports",category:"reminders" },
];

type ModueNameAttributes = "fullname"|"shortname"|"category";

const getModSecName = (data:{inputName:string, inputType:ModueNameAttributes, outputType:ModueNameAttributes}) => {
  for (let i=0; i<moduleSectionNames.length; i++){
    const doc = moduleSectionNames[i];
    if (doc[data.inputType]==data.inputName)
      return doc[data.outputType];
  }
  return "";
};

const getModSecList = (outputType:ModueNameAttributes) =>{
  const res = moduleSectionNames.map(doc=>doc[outputType]);
  return outputType=="category"?[...new Set(res)]:res;
};


//PANOPTIC SECTIONS
const panopticSectionNames = [
  { fullname:"Master Default Cases", shortname:"default" },
  { fullname:"Master Critical Cases", shortname:"critical" },
  { fullname:"Master Transaction Documents", shortname:"transaction" },
  { fullname:"Master Compliance Documents", shortname:"compliance" },
  { fullname:"Master Covenants", shortname:"covenants" },
  { fullname:"Master Condition Precedent", shortname:"precedent" },
  { fullname:"Master Condition Subsequent", shortname:"subsequent" },
  { fullname:"Master Payment Schedule", shortname:"payment" },
];

type PanopticNameAttributes = "fullname"|"shortname";

const getPanSecName = (data:{inputName:string, inputType:PanopticNameAttributes, outputType:PanopticNameAttributes}) => {
  for (let i=0; i<panopticSectionNames.length; i++){
    const doc = panopticSectionNames[i];
    if (doc[data.inputType]==data.inputName)
      return doc[data.outputType];
  }
  return "";
};

const getPanSecList = (outputType:PanopticNameAttributes) =>{
  return panopticSectionNames.map(doc=>doc[outputType]);
};

export {
  documentSectionNames, getDocSecName, getDocSecList,
  moduleSectionNames, getModSecName, getModSecList,
  panopticSectionNames, getPanSecName, getPanSecList,
}