import { useState, useEffect } from 'react';
import axios from 'axios';

const useGetCustomerById = (customerId) => {
  const [customer, setCustomer] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!customerId) return;
    axios.get(`/api/customers/${customerId}`)
      .then(res => setCustomer(res.data))
      .catch(err => setError(err));
  }, [customerId]);

  return { customer, error };
};

export default useGetCustomerById;
