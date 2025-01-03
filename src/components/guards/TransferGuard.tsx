import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { toast } from "react-toastify";
import { setNavigationPath } from "@/store/auth/authSlice";

interface TransferGuardProps {
  children: React.ReactNode;
}

const TransferGuard: React.FC<TransferGuardProps> = ({ children }) => {
  const { status } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  if (status === "nottansfer") {
    toast.error("Your account is locked and cannot perform any transfer.");
    dispatch(setNavigationPath("/dashboard"));
    return null;
  }

  return <>{children}</>;
};

export default TransferGuard;
