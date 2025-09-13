import React, { useEffect, useRef, useState } from "react";
import { FaTrash } from "react-icons/fa";

export default function ExpenseCard({ expense,onDelete }) {
  async function handleDelete(e) {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8000/expense/${expense.exp_id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        onDelete(expense.exp_id)
      } else {
        console.log("Failed to delete expense:", data.message);
      }
    } catch (err) {
      console.error("Something went wrong while deleteing:", err);
    }
  }
  return (
    <div className="w-64 py-3 gap-3 border-b border-b-gray-400 flex items-center justify-between">
      <div>
        <div className="text-md font-medium capitalize">{expense.cat_name}</div>
        <div className="text-xs">{expense.exp_date}</div>
        <div className="font-light captitalize">{expense.exp_description}</div>
      </div>

      <div className="flex items-end">
        <div className="text-xl text-teal-800 mb-8 ">₹{expense.exp_amount}</div>
        <div onClick={handleDelete}>
          <FaTrash className="text-gray-700 cursor-pointer " />
        </div>
      </div>
    </div>
  );
}
