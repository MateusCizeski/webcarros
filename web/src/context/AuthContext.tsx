import { createContext, ReactNode, useState, useEffect } from "react";
import { destroyCookie, setCookie, parseCookies } from "nookies";
import { useNavigate } from "react-router-dom";
import { setupApiClient } from "../services/api";

interface AuthContextData {
  user: UserProps;
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signUp: (credentials: SignUpProps) => Promise<void>;
  logoutUser: () => Promise<void>;
}

interface UserProps {
  id: string;
  name: string;
  email: string;
}

type AuthProviderProps = {
  children: ReactNode;
};

interface SignInProps {
  email: string;
  password: string;
}

interface SignUpProps {
  name: string;
  email: string;
  password: string;
}

export const authContext = createContext({} as AuthContextData);

export function signOut() {
  const navigate = useNavigate();
  try {
    destroyCookie(null, "@cars.token", { path: "/" });
    navigate("/login");
  } catch (err) {
    console.log("Erro ao sair");
  }
}
