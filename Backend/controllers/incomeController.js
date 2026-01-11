const xlsx=require('xlsx');
const Income=require("../models/Income");
const { isValidObjectId } = require("mongoose");

//Add Income Source
exports.addIncome=async(req,res)=>{
    try{
const userId=req.user._id;
    const{icon,source,amount,date}=req.body;
    //validation : check for missing fields
    console.log(icon,source,amount,date);
    if(!source || !amount || !date ){
        return res.status(400).json({ message: "All fields are required" });
    }
const newIncome = new Income({ userId, icon: icon || '', source, amount, date: new Date(date) });
    await newIncome.save();
    res.status(200).json(newIncome);
}catch(err){
    res.status(500).json({message:"Server Error"});
}
}

//get All Income Source
exports.getAllIncome=async(req,res)=>{
    try{
    const userId=req.user._id;
        const income=await Income.find({userId}).sort({date:-1});
        res.json(income);
    }catch(error){
        res.status(500).json({message:"Server Error"});
    }
};

//delete Income Source
exports.deleteIncome = async (req, res) => {
  try {
    const userId = req.user._id;
    const incomeId = req.params.id;

    if (!isValidObjectId(incomeId)) {
      return res.status(400).json({ message: "Invalid income ID" });
    }

    const income = await Income.findOneAndDelete({
      _id: incomeId,
      userId,
    });

    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }

    res.json({ message: "Income deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


//download Income Excel
exports.downloadIncomeExcel = async (req, res) => {
  try {
    const userId = req.user._id;

    const income = await Income.find({ userId }).sort({ date: -1 });

    const data = income.map(item => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date.toISOString().split("T")[0],
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Income");

    const filePath = `Income_${userId}.xlsx`;
    xlsx.writeFile(wb, filePath);

    res.download(filePath);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};