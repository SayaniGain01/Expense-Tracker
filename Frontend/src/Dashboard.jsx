import React, { useEffect, useState, useContext } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import ExpenseCard from "./components/ExpenseCard";
import ExpenseForm from "./components/ExpenseForm";
import { fetchUserInfo } from "./service/profile";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import AppContextProvider, { AppContext } from "./context/AppContext";

export default function Dashboard() {
  const [cat, setCat] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [piechartData, setPiechartData] = useState([]);
  const [barchartData, setBarchartData] = useState(null);
  const { setUser, user, setLoginStatus } = useContext(AppContext);

  async function getCategory() {
    const response = await fetch("http://localhost:8000/category", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setCat(data.data);
    console.log(data);
  }

  async function getExpenses() {
    try {
      const response = await fetch("http://localhost:8000/expense", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      console.log(data.data);
      setExpenses(data.data);
    } catch (err) {
      console.log("Something went wrong.");
    }
  }

  function calculateAmount() {
    const total = expenses.reduce((acc, curr) => {
      return acc + curr.exp_amount;
    }, 0);
    return total;
  }

   async function getPieChart() {
    const result = await fetch("http://localhost:8000/charts/piechart", {
      credentials: "include",
    });
    const data = await result.json();
    setPiechartData(data.dataset);
  }

  async function getBarChart() {
    const result = await fetch("http://localhost:8000/charts/barchart", {
      credentials: "include",
    });
    const data = await result.json();
    setBarchartData(data);
  }
  
  useEffect(() => {
    getCategory();
    setLoginStatus(true);
    getExpenses();
    getPieChart();
    getBarChart();
  }, []);


  return (
    <div className="bg-gray-200 h-screen w-screen">
      <Navbar />
      <div className="flex justify-between">
        <div className="flex flex-col p-5 gap-7 px-20">
          <div className=" flex flex-col justify-center py-2 rounded-2xl bg-white text-center">
            <p className="text-gray-500 font-medium">Total Amount</p>
            <span className="text-4xl text-teal-700">₹{calculateAmount()}</span>
          </div>
          <div className="bg-white rounded-2xl p-5 h-80 overflow-y-scroll">
            <h1 className="text-md font-medium text-gray-600">
              Recent Expenses
            </h1>
            {expenses.map((expense) => (
              <ExpenseCard key={expense.exp_id} expense={expense} />
            ))}
          </div>
        </div>
        <div className="flex flex-col py-5 gap-7">
          <div className="px-7 py-2 bg-white flex items-center rounded-2xl">
            <PieChart
              colors={["#004c4c", "#66b2b2", "#b2d8d8"]}
              series={[
                {
                  data: piechartData,
                },
              ]}
              width={200}
              height={200}
            />
          </div>
          <div className="px-7 py-2 bg-white flex items-center rounded-2xl">
            {barchartData && <BarChart
              colors={["#004c4c","#b2d8d8", "#66b2b2"]}
              dataset={barchartData.dataset}
              xAxis={[{ dataKey: "month_" }]}
              series={barchartData.series}
              height={250}
            />}
          </div>
        </div>
        <div className="flex flex-col p-5 gap-7 px-20">
          <ExpenseForm
            expenses={expenses}
            setExpenses={setExpenses}
            cat={cat}
          />
        </div>
      </div>
    </div>
  );
}
