import React from "react";
import TransactionItem from "@/components/dashboard/TransactionItem";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { CircularProgress, Pagination } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const TransactionHistoryPage = () => {
  const [transactionType, setTransactionType] = React.useState("all");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  const { transactions, loading } = useSelector(
    (state: RootState) => state.transaction
  );

  const filteredTransactions = transactions
    .filter((transaction) =>
      transactionType === "all" ? true : transaction.type === transactionType
    )
    .filter((transaction) =>
      searchTerm === ""
        ? true
        : transaction.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  if (loading)
    return (
      <div>
        <CircularProgress /> Loading History...
      </div>
    );

  return (
    <div className="text-center">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Transactions History
        </h2>
        <div className="flex items-center gap-10">
          <div className="relative flex items-center">
            <label htmlFor="search" className="absolute left-2">
              <SearchIcon className="text-gray-400 cursor-pointer" />
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by content"
              className="p-2 pl-9 border border-gray-300 rounded-full w-full"
            />
          </div>
          <div>
            <label className="mr-4 text-gray-600" htmlFor="filter">
              Filter by type
            </label>
            <select
              id="filter"
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              className="p-2 border border-gray-300 rounded cursor-pointer"
            >
              <option value="all">All</option>
              <option value="receiver">Receiver</option>
              <option value="sender">Sender</option>
              <option value="debit">Debit</option>
            </select>
          </div>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <i className="text-xl text-gray-600">No transaction found</i>
      ) : (
        <>
          {paginatedTransactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
          <div className="mt-6">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              variant="outlined"
              shape="rounded"
              className="cursor-pointer"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionHistoryPage;
