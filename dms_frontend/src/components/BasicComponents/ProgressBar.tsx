function ProgressBar(props:any){
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5" style={{width: "70%"}}>
      <div className="bg-green-600 h-2.5 rounded-full" style={{width:`${props.value}%`}}></div>
      {props.value}%
    </div>
  )
}

export default ProgressBar;