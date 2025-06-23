// This file used to give a function that support others file operation

export const ValidateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const getInitials = (name: string)=>{

    if(!name) return "";
    const words= name.split(" ");
    let initials= "";

    for(let i=0; i<Math.min(words.length, 2); i++){
        initials += words[i][0];
    }
    return initials.toUpperCase();
}
