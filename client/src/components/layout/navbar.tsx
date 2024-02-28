import { useAppDispatch } from "@/redux/hooks";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Container from "./container";
import { TbCoinTakaFilled } from "react-icons/tb";
import { logOut } from "@/redux/features/auth/authSlice";
import { useLogoutMutation } from "@/redux/features/auth/authApi";
import { toast } from "sonner";
import { useGetBalanceQuery } from "@/redux/features/user/userApi";
import { useState } from "react";

const Navbar = () => {
  const [skip, setSkip] = useState(true);

  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();
  const { data } = useGetBalanceQuery(undefined, { skip });

  console.log(data);

  const balance = data?.data?.balance;
  // handle logout
  const handleLogout = async () => {
    const toastId = toast.loading("Logging out.", { duration: 2000 });
    try {
      const response = await logout(undefined).unwrap();
      if (response?.success) {
        dispatch(logOut());
        toast.success("Logged out successfully.", { id: toastId });
      }
    } catch (error) {
      toast.error("Failed to logout.", { id: toastId });
    }
  };

  // handle view balance
  const handleViewBalance = async () => {
    setSkip((preVal) => !preVal);
  };
  return (
    <div className="h-16  bg-primary ">
      <Container className="flex items-center justify-between h-full">
        <div className="text-background flex gap-2 items-center">
          <p>Balance</p>
          <Badge
            onClick={handleViewBalance}
            variant="secondary"
            className="text-lg w-26 flex gap-2 items-center cursor-pointer"
          >
            <TbCoinTakaFilled size={20} />
            <span className={balance || "blur-sm"}>
              {balance || "0000000"}{" "}
            </span>
          </Badge>
        </div>

        <div className="text-background">
          <Button onClick={handleLogout} type="button" variant={"destructive"}>
            logout
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
