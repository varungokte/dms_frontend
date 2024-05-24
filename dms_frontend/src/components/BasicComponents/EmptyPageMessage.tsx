function EmptyPageMessage(props:{sectionName:string}){
  return <p className="text-center m-auto font-medium text-xl text-gray-500">No {props.sectionName} here.</p>
}

export default EmptyPageMessage;