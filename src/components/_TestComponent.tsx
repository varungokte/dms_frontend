import { Skeleton } from "@mui/material";
import { useEffect } from "react";
//import { useEffect, useState } from "react";

function _TestComponent(){
  const testPermissions = (
  {
    "masters": ["access","add","edit","view","delete"],
    "role": ["access","add","edit","view","delete"],
    "team": ["access","add","edit","view","delete","select"],
    "user": ["access","add","edit","view","delete"],
    "loan": ["access","add","edit","view","delete"],
    "contact": ["add","edit","view","delete","access"],
    "rating": ["add","edit","view","delete"],
    "transaction": {
      "docs": ["access","view","add","edit","delete"],
      "file": ["access","view","add","edit","delete"]
    },
    "compliance": {
      "docs": ["access","view","add","edit","delete"],
      "file": ["access","view","add","edit","delete"]
    },
    "covenants": {
      "docs": ["access","view","add","edit","delete"],
      "file": ["access","view","add","edit","delete"]
    },
    "precedent": {
      "docs": ["access","view","add","edit","delete"],
      "file": ["access","view","add","edit","delete"]
    },
    "subsequent": {
      "docs": ["access","view","add","edit","delete"],
      "file": ["access","view","add","edit","delete"]
    },
    "payment": {
      "docs": ["access","view","add","edit","delete"],
      "file": ["access","view","add","edit","delete"]
    },
    "reminders": ["access","add","edit","view","delete"],
    "default": ["access","add","edit","view","delete"],
    "critical": ["access","add","edit","view","delete"],
    "reports": ["access","add","edit","view","delete"]
  });







  return (
    <div className="m-9">
      <div>
        {testPermissions["masters"][0]}
      </div>
      <br /> 
      <div>
        <div className="flex flex-row">
          <div className="mx-3">
            <Skeleton variant="rectangular" width={150} height={200} />
          </div>
          <div className="mx-3">
            <Skeleton variant="rectangular" width={300} height={200} />
          </div>
        </div>
      </div>
      <br />
    </div>
  );

}

export default _TestComponent;