import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchUserAccounts } from "@/store/account/accountSlice";
import { useEffect } from "react";

interface Props {
  onSelect: (accountNumber: string) => void;
}

// interface Account {
//   // Define account properties
// }

const SourceAccountSelector: React.FC<Props> = ({ onSelect }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { accounts, loading } = useSelector(
    (state: RootState) => state.account
  );

  useEffect(() => {
    dispatch(fetchUserAccounts());
  }, [dispatch]);

  // const handleAccountSelect = (account: Account) => {
  //   // Your implementation
  // };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Source Account</label>
      <select
        onChange={(e) => onSelect(e.target.value)}
        className="w-full p-2 border rounded"
        disabled={loading}
      >
        <option value="">Select account</option>
        {accounts.map((account) => (
          <option key={account._id} value={account.accountNumber}>
            {account.accountNumber} - Balance: $
            {new Intl.NumberFormat().format(account.balance)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SourceAccountSelector;
