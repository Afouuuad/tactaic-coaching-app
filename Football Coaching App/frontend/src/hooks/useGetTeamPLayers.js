import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setCustomers } from '@/redux/playerSlice'; 

const useGetAllCustomers = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get('/api/users')
      .then(res => {
        dispatch(setCustomers(res.data));
      })
      .catch(err => console.error("Error fetching customers:", err));
  }, [dispatch]);
};

export default useGetAllCustomers;
