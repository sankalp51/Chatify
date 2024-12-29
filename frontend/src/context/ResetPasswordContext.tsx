import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

interface ResetPasswordContextType {
  resetPassword: boolean;
  setResetPassword: Dispatch<SetStateAction<boolean>>;
}

export const ResetPasswordContext = createContext<ResetPasswordContextType>({
  resetPassword: false,
  setResetPassword: () => {},
});

type Props = {
  children: ReactNode;
};

export default function ResetPasswordProvider({ children }: Props) {
  const [resetPassword, setResetPassword] = useState(false);
  return (
    <ResetPasswordContext.Provider value={{ resetPassword, setResetPassword }}>
      {children}
    </ResetPasswordContext.Provider>
  );
}
