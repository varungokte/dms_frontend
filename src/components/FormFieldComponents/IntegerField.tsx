import {  useEffect, useState } from "react";
import FieldLabel from "./FieldLabel";
import { FieldValues } from "@/types/DataTypes";
import { FormFieldAttributes } from "@/types/FormAttributes";
import { TextField } from "@mui/material";

function IntegerField (props:{index:number|string, type?:"curr"|"rate",fieldData:FormFieldAttributes, prefillValues:any, setPrefillValues:Function, error?:boolean, className?:string, repeatFields?:boolean, formIndex?:number, disabled:boolean, readonly?:boolean }) {
  const [errorMessage, setErrorMessage] = useState(<></>);
  const [wordsMessage, setWordsMessage] = useState(<div className="m-2"></div>);
  const [error, setError] = useState(props.error);

  //useEffect(()=>console.log("props",props),[props])

  const numberFormatter = (num:number) => {
    if (props.fieldData.suppressCommas)
      return num;
    else
      return separateByCommas(num.toString());
  };
  
  useEffect(()=>setError(props.error),[props.error]);

  const [amountFields] = useState(["SA", "HA", "DA", "OA","P","V"]);
  useEffect(()=>{
    if (!props.prefillValues)
      return;
    
    let num;
    if (props.repeatFields && props.formIndex!=undefined)
      num =props.prefillValues[props.formIndex]?props.prefillValues[props.formIndex||0][props.fieldData.id]:undefined;
    else
      num = props.prefillValues[props.fieldData.id];
    
    if (amountFields.includes(props.fieldData.id) && num!=undefined){
      if (num==0)
        num=0
      else if (!num)
        num=-1
      else if (num=="00")
        num=0;
      numberToWords(Number(num),setWordsMessage,props.index);
    }
  },[props])
  
  return(
    <div key={props.index} className="mb-5 mx-2">
      <FieldLabel key={props.index+"t_1"} index={props.index} id={props.fieldData.id} name={props.fieldData.name} required={props.fieldData.required} disabled={props.disabled} />
      <TextField key={props.index+props.fieldData.id+"t_2"} id={props.fieldData.id} type="text" error={error}
        size="medium" color="secondary"
        className={props.className || `border rounded-if w-full p-3 ${props.fieldData.name==""?"mt-7":""}`}
        disabled={props.disabled} required={props.fieldData.required}

        value={props.repeatFields && props.formIndex!=undefined
          ?props.prefillValues[props.formIndex]&&props.prefillValues[props.formIndex||0][props.fieldData.id]
            ?numberFormatter(Number(props.prefillValues[props.formIndex||0][props.fieldData.id]))
            :""
          :props.prefillValues[props.fieldData.id]?numberFormatter(Number(props.prefillValues[props.fieldData.id])):""
        }

        sx={props.readonly?{"& .MuiOutlinedInput-input.Mui-disabled":{WebkitTextFillColor:"black"}}:{}}

        onChange={props.repeatFields && props.formIndex!=null
          ?(e)=>{
            setError(false);
            const val_w_commas = e.target.value;
            let val="";
            for (let i=0; i<val_w_commas.length; i++)
              if (!isNaN(Number(val_w_commas[i])))
                val+=val_w_commas[i];

            if (isNaN(Number(val)))
              return;

            props.setPrefillValues((curr:any)=>{
              curr[props.formIndex||0][props.fieldData.id]=val;
              return [...curr];
            })
          }
          :(e)=>{
            setError(false);
            const val_w_commas = e.target.value;
            let val="";
            for (let i=0; i<val_w_commas.length; i++){
              if (val_w_commas[i]==".")
                val+=".";
              else if (!isNaN(Number(val_w_commas[i])))
                val+=val_w_commas[i];
            }

            if (isNaN(Number(val)))
              return;
            const downsell_amount = validateDownsellAmount(Number(val),props.fieldData.id,props.prefillValues,setErrorMessage);
          
            props.setPrefillValues((curr:any)=>{
              curr[props.fieldData.id]=val; 
              if (downsell_amount!=="NO")
                curr["DA"]=downsell_amount;
              return {...curr};
            })
          }
        } />
    
      {wordsMessage}
      {errorMessage}
    </div>
  )
};

const separateByCommas = (num:string) =>{
  let decimalLocation=-1;
  let decimalValue="", numberValue="";
  let res="";
  for (let i=0; i<num.length; i++){
    if (num[i]==".")
      decimalLocation=i;
    else if (decimalLocation>-1 && i>decimalLocation)
      decimalValue+=num[i];
    else
      numberValue+=num[i];
  }
  const len = numberValue.length;

  let val="";
  for (let i=len-1; i>=0; i--){
    const digit = numberValue[i];
    const reverseIndex = len-i-1
    if (reverseIndex==3)
      val+=",";
    if (reverseIndex<3)
      val+=digit;
    else{
      val+=digit;
      if (reverseIndex%2==0 && i!=0)
        val+=","
    }
  }
  for (let i=0; i<val.length; i++)
    res+=val.charAt(val.length-i-1);
  res+=/* "."+ */decimalValue;
  return res;
}

const numberToWords = (num:number, setMessage:Function, index:number|string):void => {
  if (num==-1 || num==0){
    setMessage(<></>);
    return;
  }
  
  const wordsClassName = "mx-2 text-blue-700 text-sm mt-1";
  
  const words_1to19 = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const words_20to100 = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  const words_bigger = ["","thousand","lakh","crore"];

  const two_digit_number = (num:number,div:number) => {
    if (num<20)
      return (div==1?" and ":"" )+words_1to19[num]
    else{
      const tens_place = words_20to100[Math.floor((num)/10)];
      const units_place = words_1to19[Math.floor((num)%10)];
      return tens_place+" "+units_place;
    }
  }

  const three_digit_number = (num:number,div:number) => {
    if (num<100)
      return two_digit_number(num%100,div);
    else{
      const hundreds_place = words_1to19[Math.floor(num/100)];
      const tens_and_units_place = two_digit_number(num%100,div);
      return hundreds_place+" hundred and "+tens_and_units_place+" ";
    }
  }

  const seven_digit_number = (num:number,div:number,curr_len:number) => {
    const arr = [];
    for (let i=0; i<div; i++){
      if (i==0)
        arr.push(three_digit_number(num%Math.pow(10,i+3),div))
      else{
        const step1 = num%Math.pow(10,curr_len+2);
        const step2 = step1/Math.pow(10,curr_len);
        const step3 = Math.floor(step2);
        const n = three_digit_number(step3,div);
        let val=n;
        if (n!="")
          val+=" "+words_bigger[i];
        arr.push(val);
        curr_len+=2;
      }
    }
    if (!words_bigger.includes(arr[0]))
      arr[0] = " "+arr[0]
    let res="";
    for (let i=arr.length-1; i>=0; i--)
      res+=" "+arr[i];
      res=res.trim();
      while(res.substring(0,3)==="and" || res.substring(0,3)==="And"){
        if (res.substring(0,3)==="and"||res.substring(0,3)==="And")
          res = res.substring(3);
        res=res.trim();
      }
      while (res.substring(res.length-4)===" and"){
        if (res.substring(res.length-4)===" and")
          res = res.substring(0,res.length-3);
        res=res.trim();
      }
    return res;
  }

  if (num==-1){
    setMessage(<div className="m-1 text-white">_</div>);
    return;
  }
  if (num == 0) {
    setMessage(<p key={index} className={wordsClassName}>Zero</p>);
    return;
  }
  
  const len = num.toString().length;
  let div;

  if (len<3)
    div=1;
  else if (len<8)
    div=Math.ceil((len-3)/2)+1;
  else
    div=Math.ceil((len-7)/3)+Math.ceil((7-3)/2)+1;
  let res="";
  let curr_len=3;

  if (div<=3)
    res=seven_digit_number(num,div,curr_len);
  else{
    const res1 = seven_digit_number(num%Math.pow(10,7),3,curr_len);
    const res2 = seven_digit_number(Math.floor(num/Math.pow(10,7)),div-3,curr_len);
    res+=res2+" Crore "+ res1
  }

  res = res.charAt(0).toUpperCase()+res.toLowerCase().slice(1);
  setMessage(<p key={index} className={wordsClassName}>{res}</p>);  
}

const validateDownsellAmount = (value:number, id:string, prefillValues:FieldValues, setMessage:Function) => {
  let downsell_amount:number|"NO"="NO";
  if (id=="SA"){
    if (!prefillValues["HA"])
      downsell_amount = value;
    else{
      const num = value-Number(prefillValues["HA"]);
      if (num<0)
        setMessage(<p className="text-red-600 mx-2 text-sm">This cannot be less than Hold Amount.</p>)
      else{
        setMessage(<></>);
        downsell_amount=num;
      }
    }
  }
  else if (id=="HA"){
    if (prefillValues["SA"]){
      const num = Number(prefillValues["SA"])-value;
      if (num<0)
        setMessage(<p className="text-red-600 mx-2 text-sm">This cannot be greater than Sanctioned Amount.</p>)
      else{
        setMessage();
        downsell_amount=num;
      }
    }
  }
  return downsell_amount;
}


export default IntegerField;