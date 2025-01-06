import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  getExternalAccountInfo,
  clearExternalAccountInfo,
} from "@/store/transaction/transactionSlice";
import { debounce } from "lodash";
import {
  ArrowPathIcon,
  UserCircleIcon,
  IdentificationIcon,
  EnvelopeIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

interface AccountInfo {
  accountNumber: string;
  username: string;
  fullName: string;
  email: string;
}

interface ExternalRecipientSelectorProps {
  bankId: string;
  onSelect: (accountInfo: AccountInfo) => void;
}

const ExternalRecipientSelector = ({
  bankId,
  onSelect,
}: ExternalRecipientSelectorProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [accountNumber, setAccountNumber] = useState("");
  const { externalAccountInfo, loadingExternalInfo } = useSelector(
    (state: RootState) => state.transaction
  );

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearExternalAccountInfo());
    };
  }, [dispatch]);

  // Debounced function to lookup account info
  const debouncedLookup = debounce(async (accNumber: string) => {
    if (accNumber.length >= 8 && bankId) {
      dispatch(getExternalAccountInfo({ accountNumber: accNumber, bankId }));
    }
  }, 500);

  const handleAccountNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    setAccountNumber(value);

    if (value.length >= 10) {
      debouncedLookup(value);
    } else {
      dispatch(clearExternalAccountInfo());
    }
  };

  useEffect(() => {
    if (externalAccountInfo) {
      onSelect({
        accountNumber: externalAccountInfo.accountNumber,
        username: externalAccountInfo.username,
        fullName: externalAccountInfo.fullName,
        email: externalAccountInfo.email,
      });
    }
  }, [externalAccountInfo, onSelect]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Recipient Account Number
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <BanknotesIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={accountNumber}
            onChange={handleAccountNumberChange}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter account number"
            maxLength={14}
          />
        </div>
      </div>

      {loadingExternalInfo && (
        <div className="flex items-center gap-2 text-gray-500 bg-gray-50 p-3 rounded-md">
          <ArrowPathIcon className="h-5 w-5 animate-spin text-blue-500" />
          <span className="text-sm">Looking up account information...</span>
        </div>
      )}

      {externalAccountInfo && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md space-y-3">
          <div className="flex items-center gap-3">
            <UserCircleIcon className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-xs text-gray-500">Account Name</p>
              <p className="font-medium text-gray-900">
                {externalAccountInfo.fullName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <IdentificationIcon className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-xs text-gray-500">Username</p>
              <p className="font-medium text-gray-900">
                {externalAccountInfo.username}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <EnvelopeIcon className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-medium text-gray-900">
                {externalAccountInfo.email}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExternalRecipientSelector;
