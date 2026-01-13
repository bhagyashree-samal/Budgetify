
export const validateEmail=(email)=>{
    const regex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
export const getInitials=(name)=>{
    if(!name) return "";
    const words=name.split(" ");
    let initials="";
    for(let i=0;i<Math.min(words.length,2);i++){
        initials+=words[i][0];
    }
    return initials.toUpperCase();
}

export const addThousandsSeparator = (num = 0) => {
  const number = Number(num);
  if (isNaN(number)) return "0";

  const [integerPart, fractionalPart] = number.toString().split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return fractionalPart
    ? `${formattedInteger}.${fractionalPart}`
    : formattedInteger;
};


export const prepareExpenseBarChartData=(data=[])=>{
    const ChartData=data.map((item)=>({
        category:item?.category,
        amount:item?.amount
    }));

    return ChartData;
}


import moment from 'moment';

export const prepareIncomeBarChartData = (data = []) => {
  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
  const chartData = sortedData.map((item) => ({
    month: moment(item?.date).format('DD MMM'),
    amount: item?.amount,
    source: item?.source,
  }));
  return chartData;
};

