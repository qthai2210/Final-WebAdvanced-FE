import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getReconciliation, getBankOptions } from "@/store/admin/adminSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ReconciliationQueryDto } from "@/types/transaction.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Reconciliation() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.admin.reconciliation
  );
  const { data: bankOptions, loading: loadingBanks } = useSelector(
    (state: RootState) => state.admin.bankOptions
  );

  const [filters, setFilters] = useState<ReconciliationQueryDto>({
    fromDate: undefined,
    toDate: undefined,
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    dispatch(getBankOptions());
  }, [dispatch]);

  useEffect(() => {
    const validatedFilters = {
      ...filters,
      page: filters.page ? Math.max(1, Math.floor(filters.page)) : 1,
      limit: filters.limit ? Math.max(1, Math.floor(filters.limit)) : 10,
    };

    if (
      validatedFilters.page !== filters.page ||
      validatedFilters.limit !== filters.limit
    ) {
      setFilters(validatedFilters);
      return;
    }

    dispatch(getReconciliation(validatedFilters));
  }, [dispatch, filters]);

  useEffect(() => {
    if (bankOptions?.length > 0) {
      console.log("Available bank options:", bankOptions);
    }
  }, [bankOptions]);

  const handlePageChange = (page: number) => {
    const validPage = Math.max(1, Math.floor(page));
    if (validPage !== filters.page) {
      setFilters((prev) => ({
        ...prev,
        page: validPage,
      }));
    }
  };

  const handleFilterChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validatedFilters = {
      ...filters,
      page: 1, // Reset to first page when applying new filters
      limit: 10,
    };
    setFilters(validatedFilters);
  };

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Bank Reconciliation Report</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleFilterChange}
            className="grid grid-cols-4 gap-4 mb-6"
          >
            <div className="space-y-2">
              <Label htmlFor="fromDate">From Date</Label>
              <Input
                id="fromDate"
                type="date"
                value={filters.fromDate || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    fromDate: e.target.value || undefined,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="toDate">To Date</Label>
              <Input
                id="toDate"
                type="date"
                value={filters.toDate || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    toDate: e.target.value || undefined,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bank">Select Bank</Label>
              <Select
                value={filters.bankId || "all"}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    bankId: value === "all" ? undefined : value,
                  }))
                }
              >
                <SelectTrigger id="bank" className="bg-white">
                  <SelectValue placeholder="All Banks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Banks</SelectItem>
                  {loadingBanks ? (
                    <SelectItem value="loading" disabled>
                      Loading banks...
                    </SelectItem>
                  ) : (
                    bankOptions?.map((bank) => (
                      <SelectItem key={bank.id} value={bank.id}>
                        {bank.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button type="submit">Generate Report</Button>
            </div>
          </form>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : data ? (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {data.totalTransactions}
                    </div>
                    <div className="text-sm text-gray-500">
                      Total Transactions
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      ${data.totalAmount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">Total Amount</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {data.banks.length}
                    </div>
                    <div className="text-sm text-gray-500">Partner Banks</div>
                  </CardContent>
                </Card>
              </div>

              {data.banks.map((bank) => (
                <Card key={bank.bankId || "unknown"}>
                  <CardHeader>
                    <CardTitle className="text-lg">{bank.bankName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-sm">
                        <div className="font-medium">Total Sent</div>
                        <div className="text-green-600">
                          ${bank.totalSent.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">Total Received</div>
                        <div className="text-blue-600">
                          ${bank.totalReceived.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">Transaction Count</div>
                        <div>{bank.transactionCount}</div>
                      </div>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>From</TableHead>
                          <TableHead>To</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bank.transactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>
                              {format(
                                new Date(transaction.createdAt),
                                "dd/MM/yyyy HH:mm"
                              )}
                            </TableCell>
                            <TableCell className="capitalize">
                              {transaction.type}
                            </TableCell>
                            <TableCell>
                              ${transaction.amount.toLocaleString()}
                            </TableCell>
                            <TableCell>{transaction.fromAccount}</TableCell>
                            <TableCell>{transaction.toAccount}</TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  transaction.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {transaction.status}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ))}

              {data.metadata && (
                <div className="flex justify-end">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            handlePageChange(data.metadata.page - 1)
                          }
                          disabled={data.metadata.page <= 1} // Add proper disabled state
                        />
                      </PaginationItem>
                      {Array.from(
                        { length: data.metadata.lastPage },
                        (_, i) => i + 1
                      ).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            isActive={data.metadata.page === page}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            handlePageChange(data.metadata.page + 1)
                          }
                          disabled={
                            data.metadata.page >= (data.metadata.lastPage || 1)
                          } // Add proper disabled state
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">No data available</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
