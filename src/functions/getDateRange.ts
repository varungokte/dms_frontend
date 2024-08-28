const getPeriodicList = (intervalType:string,startDate:Date, endDate:Date) => {
  let start = intervalType=="monthly"?startDate.getMonth():startDate.getFullYear();
  let end = intervalType=="monthly"?endDate.getMonth():endDate.getFullYear();
  
  const values = [];
  if (end<start)
    end+=11;
  for (let i=start; i<=end; i++){
    let month="";
    if (intervalType=="monthly"){
      const num = i>11?i-12:i;
      month = new Date(`${num+1}/01/89`).toLocaleString("default",{month:"short"});
    }
    else
      month = new Date(`2/01/${i}`).toLocaleString("default",{year:"numeric"});
    values.push(month);
  }
  return values;
}

export default getPeriodicList;