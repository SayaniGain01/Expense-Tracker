import React from "react";

export default function ExpenseCard({ expense }) {
  return (
    <div className="w-64 py-3 gap-3 border-b border-b-gray-400 flex items-center justify-between">
      <div>
        <div className="text-md font-medium capitalize">{expense.cat_name}</div>
        <div className="text-xs">{expense.exp_date}</div>
        <div className="font-light captitalize">{expense.exp_description}</div>
      </div>

      <div className="text-xl text-teal-800">₹{expense.exp_amount}</div>
    </div>
  );
}
