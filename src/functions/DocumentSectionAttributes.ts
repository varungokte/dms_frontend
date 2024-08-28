
const documentSectionNames= [
  { fullname: "Transaction Documents", shortname: "transaction", keyname:"TD", type: "document" },
  { fullname: "Compliance Documents", shortname: "compliance", keyname:"CD", type: "document" },
  { fullname: "Covenants", shortname: "covenants", keyname:"C", type: "covenant" },
  { fullname: "Condition Precedent", shortname: "precedent", keyname:"CP", type: "condition" },
  { fullname: "Condition Subsequent", shortname: "subsequent", keyname:"CS", type: "condition" },
  { fullname: "Payment Schedule", shortname: "payment", keyname:"PD", type: "payment" }
];

const getDocSecName = (inputName:string, inputType:"fullname"|"keyname"|"shortname"|"type", outputType:"fullname"|"keyname"|"shortname"|"type") => {
  for (let i=0; i<documentSectionNames.length; i++){
    const doc = documentSectionNames[i];
    if (doc[inputType]==inputName)
      return doc[outputType];
  }
  return "";
};

const getDocSecList = (outputType:"fullname"|"keyname"|"shortname"|"type") =>{
  return documentSectionNames.map(doc=>doc[outputType]);
}

/* const docSecTypes = documentSectionNames.map(doc=>doc.type);
const docSecKeys = documentSectionNames.map(doc=>doc.keyname);

type DocumentSectionTypes = typeof docSecTypes[number];
type DocumentSectionKeys = typeof docSecKeys[number]; */

type DocumentSectionTypes = "document"|"covenant"|"condition"|"payment"|"undefined";
type DocumentSectionKeys = "TD"|"CD"|"C"|"CP"|"CS"|"PD";
type DocumentSectionDetails = { sectionKeyName:DocumentSectionKeys, sectionType:DocumentSectionTypes };

export {
  documentSectionNames, 
  getDocSecName, getDocSecList,
  type DocumentSectionTypes, type DocumentSectionKeys, type DocumentSectionDetails
}