import { createContext, ReactNode, useState, useEffect } from "react";
import { destroyCookie, setCookie, parseCookies } from "nookies";
import { useNavigate } from "react-router-dom";
import { api } from "../services/apiClient";

interface AuthContextData {
  user: UserProps | undefined;
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

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>();
  const isAuthenticated = !!user;

  useEffect(() => {
    const { "@cars.token": token } = parseCookies();

    if (token) {
      api
        .get("/me")
        .then((response) => {
          const { id, name, email } = response.data;
          setUser({
            id,
            name,
            email,
          });
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

  async function signIn({ email, password }: SignInProps) {
    try {
      const navigate = useNavigate();
      const response = await api.post("/session", {
        email,
        password,
      });

      const { id, name, token } = response.data;

      setCookie(undefined, "@cars.token", token, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });

      setUser({
        id,
        name,
        email,
      });

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      navigate("/dashboard");
    } catch (err) {
      console.log("erro ao fazer login", err);
    }
  }

  async function signUp({ name, email, password }: SignUpProps) {
    try {
      const navigate = useNavigate();
      const response = await api.post("/users", {
        name,
        email,
        password,
      });

      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  }

  async function logoutUser() {
    try {
      const navigate = useNavigate();
      destroyCookie(null, "@barber.token", { path: "/" });

      navigate("/login");

      setUser(null);
    } catch (err) {
      console.log("ERRO AO SAIR", err);
    }
  }

  return (
    <authContext.Provider
      value={{
        user,
        isAuthenticated,
        signIn,
        signUp,
        logoutUser,
      }}
    >
      {children}
    </authContext.Provider>
  );
}
