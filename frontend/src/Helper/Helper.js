export const URL_PREFIX = `http://localhost:5500/api/v1`;
export const SOCKET_URL = `http://localhost:5500`;

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //example@example.com
    return regex.test(email);
};

export const checkPropExist = (arr,prop,val)=>{
    for(let element of arr){
        if(element[prop]===val)return true;
    };
    return false;
}

export const normalizeTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    return timeString;
}