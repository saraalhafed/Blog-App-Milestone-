import { Route, Routes } from 'react-router-dom';
import {
  AddOrEditBlog,
  Details,
  Home,
  Login,
  Profile,
  Register,
} from '../pages';
import PrivateRouter from './PrivateRoute';
import Layout from '../components/Layout';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/"
element={
          // <Layout> 
          <Home />
          // </Layout>
        }
      />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/" element={<PrivateRouter />}>
        {/* <Route path="/" element={<Layout />}> */}
        <Route path="/blog/add" element={<AddOrEditBlog />} />
        <Route path="/blog/edit/:id" element={<AddOrEditBlog />} />
        <Route path="/blog/details/:id" element={<Details />} />
        <Route path="/blog/profile" element={<Profile />} />
        {/* </Route> */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
