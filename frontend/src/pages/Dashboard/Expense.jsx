import React, { useEffect, useState } from 'react'
import { useUserAuth } from "../../hooks/useUserAuth";
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosinstance';
import Modal from "../../components/layouts/Modal";
import toast from 'react-hot-toast';
import ExpenseOverview from '../../components/expense/ExpenseOverview';
import AddExpenseForm from '../../components/expense/AddExpenseForm';
import ExpenseList from '../../components/expense/ExpenseList';
import DeleteAlert from '../../components/DeleteAlert';

const Expense = () => {
  useUserAuth();
    const [expenseData, setExpenseData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
      show: false,
      data: null,
    });
    const [openAddExpenseModel, setOpenAddExpenseModel] = useState(false);

    //Get all expense details
  const fetchexpenseDetails = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`
      );
      if (response.data) {
        setExpenseData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong .Please try again", error);
    } finally {
      setLoading(false);
    }
  };
  //handle add expense
  const handleAddexpense= async (expense) => {
    const { category, amount, date, icon } = expense;

    //validation check
    if (!category.trim()) {
      toast.error("Category is required");
      return;
    }
    const numericAmount = Number(amount);

    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      toast.error("Amount should be a valid number greater than 0.");
      return;
    }

    if (!date) {
      toast.error("Date is Required");
      return;
    }
    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon,
      });
      setOpenAddExpenseModel(false);
      toast.success("Expense added successfully");
      fetchexpenseDetails();
    } catch (error) {
      console.error(
        "Error adding income",
        error.response?.data?.message || error.message
      );
    }
  };
  //delete expense
  const deleteexpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
      // Close delete modal
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("expense deleted successfully");

      // Refresh list after delete
      fetchexpenseDetails();
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  //handle download expense details
  const handleDownloadexpenseDetails = async () => {
    try{
      const response=await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,{
responseType:"blob",
      })
      //create a URL for the blob
      const url=window.URL.createObjectURL(new Blob([response.data]));
      const link=document.createElement("a");
      link.href=url;
      link.setAttribute("download","Expense_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    }catch(error){
      console.error("Error downloading Expense details ",error);
      toast.error("Failed to download Expense details.Please try again.");
    }
  };

  useEffect(() => {
    fetchexpenseDetails();
    return () => {};
  }, []);
  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div className="">
            <ExpenseOverview transactions={expenseData} onExpenseIncome={()=>setOpenAddExpenseModel(true)}/>
          </div>
<ExpenseList 
            transactions={expenseData}
            onDelete={(id) => {
              setOpenDeleteAlert({ show: true, data: id });
            }}
            onDownload={handleDownloadexpenseDetails}
          />

        </div>
        <Modal isOpen={openAddExpenseModel} onClose={()=>setOpenAddExpenseModel(false)}
          title="Add Expense">
            <AddExpenseForm onAddExpense={handleAddexpense}/>

        </Modal>
        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Expense"
        >
          <DeleteAlert
            content="Are you sure you want to delete this expense detail?"
            onDelete={() => deleteexpense(openDeleteAlert.data)}
          />
        </Modal>
        </div>
        </DashboardLayout>
  )
}

export default Expense