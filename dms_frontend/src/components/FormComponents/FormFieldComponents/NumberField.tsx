import {  useEffect, useState } from "react";
import FieldLabel from "./FieldLabel";
import { FieldValues } from "DataTypes";

const numberToWords = (num:number, setMessage:Function, index:number|string):void => {
  const wordsClassName = "mx-2 text-amber-800 text-sm";
  
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
    console.log("ARR",arr)
    if (!words_bigger.includes(arr[0]))
      arr[0] = " "+arr[0]
    console.log("ARR",arr)
    let res="";
    for (let i=arr.length-1; i>=0; i--)
      res+=" "+arr[i];
    console.log("curr res",res)
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
    setMessage(<></>);
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
    res+=res2+" Crore"+ res1
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
        setMessage(<></>);
        downsell_amount=num;
      }
    }
  }
  return downsell_amount;
}

function NumberField (props:{index:number|string, id:string, name: string, required:boolean, disabled:boolean, prefillValues:any, setPrefillValues:Function, repeatFields?:boolean, formIndex?:number }) {
  const [errorMessage, setErrorMessage] = useState(<></>);
  const [wordsMessage, setWordsMessage] = useState(<></>);

  const [numberFormatter] = useState(new Intl.NumberFormat("en-IN"));

  const [amountFields] = useState(["SA", "HA", "DA", "OA"]);

  useEffect(()=>{
    if (props.id=="SA")
    if (amountFields.includes(props.id)){
      let num = props.prefillValues[props.id];
      if (!num)
        num=-1
      else if (num=="00")
        num=0;
      numberToWords(Number(num),setWordsMessage,props.index);
    }
  },[props])
  
  return(
    <div key={props.index} className="mb-5 mx-2">
      <FieldLabel key={props.index+"t_1"} index={props.index} id={props.id} name={props.name} required={props.required} disabled={props.disabled} />
      <input key={props.index+props.id+"t_2"} autoComplete="new-password" 
        id={props.id} 
        type="text"
        min={0.000001}
        disabled={props.disabled} 
        required={props.required}
        className={`border rounded-if w-full p-4 ${props.name==""?"mt-7":""}`}
        value={props.repeatFields
          ?props.prefillValues[props.formIndex||0][props.id]||""
          :props.prefillValues[props.id]!==undefined?numberFormatter.format(Number(props.prefillValues[props.id]))||"":""
        }
        onChange={props.repeatFields && props.formIndex!=null
          ?(e)=>{
            const val = e.target.value;
            if (isNaN(Number(val)))
              return;
            props.setPrefillValues((curr:any)=>{
              curr[props.formIndex||0][props.id]=e.target.value; 
              return [...curr];
            })
          }
          :(e)=>{
            const val_w_commas = e.target.value;
            let val="";
            for (let i=0; i<val_w_commas.length; i++)
              if (!isNaN(Number(val_w_commas[i])))
                val+=val_w_commas[i];

            if (isNaN(Number(val)))
              return;
            const downsell_amount = validateDownsellAmount(Number(val),props.id,props.prefillValues,setErrorMessage);
          
            props.setPrefillValues((curr:any)=>{
              curr[props.id]=val; 
              if (downsell_amount!=="NO")
                curr["DA"]=downsell_amount;
              return {...curr};
            })
          }
        }
      />
      {wordsMessage}
      {errorMessage}
    </div>
  )
};

export default NumberField;