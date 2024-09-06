import { FieldValues } from "@/types/DataTypes";
import { getDocSecList, getModSecList } from "./sectionNameAttributes";
import { allSectionPermissions } from "./Constants";

const giveAllPermissions = () => {
  const permissions:FieldValues = {};
  
  const moduleSections = getModSecList("shortname");
  const documentSections = getDocSecList("shortname");

  for (let i=0; i<moduleSections.length; i++){
    const section = moduleSections[i];
    if (documentSections.includes(section))
      permissions[section] = {
        docs: allSectionPermissions["docs"],
        file: allSectionPermissions["file"]
      }
    else
      permissions[section]=allSectionPermissions[section];
  }

  permissions["user"].push("view");
  if (permissions["team"].includes("edit"))
    permissions["team"].push("view");

  return permissions;
};

export default giveAllPermissions;