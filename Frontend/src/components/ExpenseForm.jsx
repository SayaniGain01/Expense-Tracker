import React, { useRef } from "react";
import { toast } from "react-toastify";

export default function ExpenseForm({ expenses, setExpenses, cat }) {
  const amountRef = useRef();
  const dateRef = useRef();
  const typeRef = useRef();
  const descRef = useRef();

  async function handleSubmit(e) {
    e.preventDefault();

    const amount = parseFloat(amountRef.current.value);
    const date = dateRef.current.value;
    const type = typeRef.current.value;
    const desc = descRef.current.value;

    const payload = {
      exp_amount: amount,
      exp_date: date,
      exp_type: type,
      exp_des: desc,
    };


    const expensePromise = new Promise(async (resolve, reject) => {
      try {
        const response = await fetch("http://localhost:8000/expense", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          credentials: "include",
        });

        const data = await response.json();

        if (response.status === 200) {
          const newData = {
            exp_id: data.data.last_insert_id,
            cat_name: cat.find((el) => el.cat_id == type).cat_name,
            exp_description: desc,
            exp_amount: amount,
            exp_date: date,
          };

          setExpenses((prevData) => [...prevData, newData]);
          resolve(data);
        } else {
          reject(data.message || "Failed to add expense");
        }
      } catch (err) {
        reject("Something went wrong. Please try again.");
      }
    });


    toast.promise(
      expensePromise,
      {
        pending: "Adding expense...",
        success: "Expense added.",
        error: {
          render({ data }) {
            return data || "Failed to add expense";
          },
        },
      },
      {
        position: "top-right",
        autoClose: 2000,
        pauseOnHover: true,
        draggable: true,
      }
    );


    amountRef.current.value = "";
    dateRef.current.value = "";
    typeRef.current.value = cat.length > 0 ? cat[0].cat_id : "";
    descRef.current.value = "";
  }

  return (
    <div className="bg-white h-105 py-10 rounded-2xl">
      <form className="flex flex-col">
        <select
          className="border border-gray-500 rounded-sm mb-6 p-1.5 text-sm w-64 mx-6"
          ref={typeRef}
        >
          {cat.map((el) => (
            <option key={el.cat_name} value={el.cat_id}>
              {el.cat_name}
            </option>
          ))}
        </select>

        <input
          className="border border-gray-500 rounded-sm mb-6 p-1.5 text-sm w-64 mx-6"
          type="text"
          placeholder="Description"
          ref={descRef}
        />
        <input
          className="border border-gray-500 rounded-sm mb-6 p-1.5 text-sm w-64 mx-6"
          type="date"
          ref={dateRef}
        />
        <input
          className="border border-gray-500 rounded-sm mb-20 p-1.5 text-sm w-64 mx-6"
          type="number"
          placeholder="Amount"
          ref={amountRef}
        />
        <button
          className="w-64 mx-6 bg-teal-700 shadow-lg shadow-gray-500/50 text-sm text-white rounded-sm py-2 mb-1.5 hover:bg-teal-600 transition cursor-pointer"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
