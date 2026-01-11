const xlsx=require('xlsx');
const Expense=require("../models/Expense");
const { isValidObjectId } = require("mongoose");


//Add Expense Source
exports.addExpense=async(req,res)=>{
    try{
const userId=req.user._id;
    const{icon,category,amount,date}=req.body;
    //validation : check for missing fields
    if(!category || !amount || !date){
        return res.status(400).json({ message: "All fields are required" });
    }
    const newExpense=new Expense({userId,icon,category,amount,date:new Date(date)});
    await newExpense.save();
    res.status(201).json(newExpense);
}catch(err){
    res.status(500).json({message:"Server Error"});
}
}

//get All Expense Source
exports.getAllExpense=async(req,res)=>{
       try{
    const userId=req.user._id;
          const expenses=await Expense.find({userId}).sort({date:-1});
          res.json(expenses);
      }catch(error){
          res.status(500).json({message:"Server Error"});
      }
};

//delete Expense Source
exports.deleteExpense=async(req,res)=>{
       try{
      const userId=req.user._id;
      const expenseId = req.params.id;

    if (!isValidObjectId(expenseId)) {
      return res.status(400).json({ message: "Invalid expense ID" });
    }
             const expense = await Expense.findOneAndDelete({
      _id: expenseId,
      userId,
    });
     if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
            res.json({message:"Expense deleted successfully"});
         }catch(error){
            res.status(500).json({message:"Server Error"});
        }
}
//download Expense Excel
exports.downloadExpenseExcel=async(req,res)=>{
     try{
         const userId=req.user._id;
                const expenses=await Expense.find({userId}).sort({date:-1});
                //prepare data for excel
                const data=expenses.map((item)=>({
                    Category:item.category,
                    Amount:item.amount,
                     Date: item.date.toISOString().split("T")[0],
                }));
                const wb=xlsx.utils.book_new();
                const ws=xlsx.utils.json_to_sheet(data);
                xlsx.utils.book_append_sheet(wb,ws,"Expenses");
                const filePath = `Expense_${userId}.xlsx`;
    xlsx.writeFile(wb, filePath);
    res.download(filePath);
            }catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}
    
 