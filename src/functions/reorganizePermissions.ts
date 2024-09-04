import { FieldValues } from "@/types/DataTypes";
import { getModSecList, moduleSectionNames } from "./sectionNameAttributes";

const incoming = (permissionPreset:FieldValues) => {
  if (!permissionPreset)
    return;

  const obj:FieldValues= {};

  /* const permissionLabels = {
    access:"Page Access",
    add: "Add New",
    edit:"Edit",
    view: "View",
    delete:"delete",
    select: "Select Team",
  }

  const filePermissionLabels = {
    add: "Upload File",
    view: "View File",
    edit: "Edit Details",
    delete: "Delete file"
  } */

  //console.log("Start", permissionPreset);

  const categories = getModSecList("category");

  for (let i=0; i<moduleSectionNames.length; i++){
    const sectionDetails = moduleSectionNames[i];
    if (!obj[sectionDetails.category])
      obj[sectionDetails.category] = {};
    obj[sectionDetails.category][sectionDetails.shortname] = [];
  }
  //console.log("OBJ",{...obj})

  for (let i=0; i<categories.length; i++){
    const sectionList = obj[categories[i]];
    for (let j=0; j<Object.keys(sectionList).length; j++){
      const sectionName = Object.keys(sectionList)[j];
      const sectionPermissions = permissionPreset[sectionName];
      if (sectionPermissions)
        sectionList[sectionName] = sectionPermissions;
    }
  }

  //rename labels
  //reorganize documents
  //move team

  //console.log("END",obj);
  
  return obj; 
}

const outgoing = (permissionSet:FieldValues) => {
  console.log("permissionset given to outgoing",{...permissionSet});
  const categories = getModSecList("category");
  const obj:FieldValues = {};

  for (let i=0; i<categories.length; i++){
    const sections = permissionSet[categories[i]];

    for (let j=0; j<Object.keys(sections).length; j++){
      const sectionName = Object.keys(sections)[j];
      const sectionPermissions = sections[sectionName];
      
      //adding neccesary permissions
      if (sectionName=="team" && sectionPermissions.includes("edit"))
        sectionPermissions.push("view");
      if (sectionName=="masters" && !sectionPermissions.includes("access"))
        sectionPermissions.push("access");
      if (sectionName=="user" && !sectionPermissions.includes("view"))
        sectionPermissions.push("view");
      
      obj[sectionName] = sectionPermissions;
    }
  }

  console.log("reorganized",obj);

  return obj;
}

export default {incoming, outgoing}