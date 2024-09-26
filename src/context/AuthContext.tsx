import axios from 'axios';
import { createContext, useEffect, useState, ReactNode } from 'react';
import { useContext } from 'react';
import { toast } from 'react-toastify';

interface IAuthContext {
  register: (
    userData: IUser,
    navigate: (path: string) => void
  ) => Promise<void>;
  userInfo: ICurrentUser | null; // same as userData +token
  login: (userData: IUser, navigate: (path: string) => void) => Promise<void>;
  logout: (navigate: (path: string) => void) => Promise<void>;
  updateUser: (userData: IUser, message: string) => Promise<void>;
}

interface IAuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

const baseUrl = 'https://33000.fullstack.clarusway.com';

export const AuthProvider = ({ children }: IAuthProviderProps) => {

  // Initialize the state from localStorage if available
  const [userInfo, setUserInfo] = useState<ICurrentUser | null>(() => {

    const storedUser = localStorage.getItem('user');//if ther is user in local  make  it the initialvalue for state storeduser
   /*    if (user) {
      return JSON.parse(user);
    } else {
      return null;
    } */
    return storedUser ? JSON.parse(storedUser) : null;// check  if there is no user in local than make the initialvalue for state  null
  });
  /* --storedUser: This variable likely holds a JSON string representation of a user object that was previously stored in localStorage.
--JSON.parse(storedUser): This method converts the JSON string back into a JavaScript object.
--null: If storedUser is null or undefined, the code returns null. */



  // Effect to update localStorage whenever userInfo changes
  useEffect(() => {
    if (userInfo) {
      // Save user information in localStorage when available
      localStorage.setItem('user', JSON.stringify(userInfo));
    } else {
      // Clear localStorage when userInfo is null (user logged out)
      localStorage.removeItem('user');
    }
  }, [userInfo]);

  // Check authentication when the component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && !userInfo) {
      setUserInfo(JSON.parse(storedUser)); // Restore userInfo from localStorage if available
    }
    // Alternatively, perform an async token validation with the server here
  }, []);

  // function checkAuth() {
  //   if (userInfo) {
  //     // add user information to localStorage
  //     localStorage.setItem('user', JSON.stringify(userInfo));
  //   } else {
  //     // retrieve it from localStorage
  //     const user = localStorage.getItem('user');
  //     if (user) setUserInfo(JSON.parse(user));
  //   }
  // }

  const register = async (
    userData: IUser, //from the form register
    navigate: (path: string) => void
  ) => {
    try {
      const { data } = await axios({
        url: `${baseUrl}/users`,
        method: 'POST',
        data: userData,
      });
      const user = {
        token: data.token,
        ...data.data, //data is an obj ,how i access obj inside obj,in this case i dont need to say data:{and everthing}ineed to copy this obj and put it here,our response is data but weneed just data obj wich inside it  so we use spred operator
      }; //keep the response data as it and mke just copy from data wich inside it here

      setUserInfo(user);//update the state after the getting response
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/');
      toast.success('Registration Successful!');
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) { //for ts tell the type of error
        toast.error(error.response?.data.message);//when i have response but not what i whant , i create user with same name for exampl
      } else if (error instanceof Error) {
        toast.error(error.message);//no response
      }
    }
  };

  const login = async (userData: IUser, navigate: (path: string) => void) => {
    // alternatively here we can get the token from the local storage
    try {
      const { data } = await axios({
        url: `${baseUrl}/auth/login`,
        method: 'POST',
        data: userData,
      });
      //after the response i make destructuring
      const user = {
        token: data.token,
        ...data.data,//i take the obj data :{} with everything inside it
      };
      //after the destructuring the response i update my state
      setUserInfo(user);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/');
      toast.success('Login Successful!');
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);//the error com inside the response in the data.message
      } else if (error instanceof Error) {
        toast.error(error.message);//no response
      }
    }
  };

  const logout = async (navigate: (path: string) => void) => {
       // alternatively here we can get the token from the local storage
    const user = localStorage.getItem('user');
    if (user) {
      const token = JSON.parse(user).token;//convert user from string to obj and give me just the token
      try {
        await axios({
          method: 'get',
          url: `${baseUrl}/auth/logout/`,
          headers: { Authorization: `Token ${token}` },
        /*   headers : { directly from the state
            Authorization: `Token ${userInfo?.token}`,
          } */
  
        });
         //logout to remove the user,
         // clear the state 
        setUserInfo(null);
        localStorage.removeItem('user');//clear the user from local
     
        navigate('/auth/login');
        toast.success('Logged out successfully');
      } catch (error) {
        console.log(error);
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message);
        } else if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    }
  };//when i logout i can just login because i have a account  i ceated an user with register


  //to update somthing like lastName in user
  const updateUser = async (userData: IUser, message: string) => {
    try {
      const { data } = await axios({
        url: `${baseUrl}/users/${userData?._id}`,
        method: 'PATCH',
        data: userData,//what we need to updat,lastname in body
        headers: {
          Authorization: `Token ${userInfo?.token}`,
        }
      });
      const user = {
        ...userInfo,//keep all the old info for current user + new update , we have userdata and keep it as it,lastname will chang here also
        ...data.new,//we have the new respons in data,just for updating part  i chanch her lastname,but here in postman i see everything with updeted part 
      };
      setUserInfo(user);
      localStorage.setItem('user', JSON.stringify(user));
   
      toast.success('Registration Successful!');
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{ register, login, logout, userInfo, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): IAuthContext => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};
