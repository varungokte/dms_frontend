enum PriorityValues {
  "Low",
  "Medium",
  "High"
};

enum PriorityStyling {
  "text-green-600 bg-green-100",
  "text-yellow-600 bg-yellow-50",
  "text-red-600 bg-red-100",
};
const PriorityIterate = () => {
  return Object.keys(PriorityValues).filter(v=>!isNaN(Number(v)))
}
export {PriorityValues, PriorityStyling, PriorityIterate}