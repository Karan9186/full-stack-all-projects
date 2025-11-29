export const getLocalStorage=(data)=>{
  const dataFromStorage=localStorage.getItem(data);
  return dataFromStorage
}

export const storeLocalStorage=(key,value)=>{
  localStorage.setItem(key,value)
}

export const clearLocalStorage=(key)=>{
  localStorage.removeItem(key)
}