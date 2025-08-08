// import axios from "axios";

// const axiosInstance = axios.create({
//     baseURL: `http://localhost:5000`
// })

// const useAxios = () => {
//     return axiosInstance;
// };

// export default useAxios;

import axios from 'axios';
import React from 'react';
import useAuth from './useAuth';
import { useNavigate } from 'react-router';

const useAxios = () => {
    const { user, logOut } = useAuth();
    const navigate = useNavigate();

    const axiosSecure = axios.create({
        
        baseURL: `https://blood-donation-a12-server.vercel.app`
        // baseURL: `http://localhost:5000`
    });

    axiosSecure.interceptors.request.use(config => {
        config.headers.Authorization = `Bearer ${user?.accessToken}`
        return config;
    }, error => {
        return Promise.reject(error);
    })

    axiosSecure.interceptors.response.use(res => {
        return res;
    }, error => {
        const status = error.status;
        if (status === 403) {
            navigate('/forbidden');
        }
        else if (status === 401) {
            logOut()
                .then(() => {
                    navigate('/login')
                })
                .catch(() => { })
        }

        return Promise.reject(error);
    })


    return axiosSecure;
};

export default useAxios;



// import axios from 'axios';
// import { useContext, useEffect, useMemo } from 'react';
// import { toast } from 'react-toastify';
// import { AuthContext } from '../Context/AuthContext';

// const useAxiosSecure = () => {
//     const { user, signout, loading } = useContext(AuthContext);
//     const errorNotify = () =>
//         toast.error('Unauthorized or Forbiden access logout status 401/403', {
//             theme: "colored",
//         });
//     const axiosInstance = useMemo(() => {
//         return axios.create({ baseURL: 'https://blood-buddies-sarver.vercel.app', });
//     }, []);

//     //   request interceptors =======================
//     useEffect(() => {
//         if (!loading && user?.accessToken) {
//             // Add request interceptor
//             const requestInterceptor = axiosInstance.interceptors.request.use(
//                 (config) => {
//                     config.headers.Authorization = `Bearer ${user.accessToken}`;
//                     return config;
//                 }
//             );
//             // Add response interceptor
//             const responseInterceptor = axiosInstance.interceptors.response.use(
//                 (res) => res,
//                 err => {
//                     if (err.status === 401 || err.status === 403) {
//                         signout().then(() => {
//                             errorNotify()
//                         }).catch((err) => {
//                             console.log(err)
//                         })
//                     }
//                 }
//             );
//             // Cleanup to prevent multiple interceptors on re-renders
//             return () => {
//                 axiosInstance.interceptors.request.eject(requestInterceptor);
//                 axiosInstance.interceptors.response.eject(responseInterceptor);
//             };
//         }
//     }, [user, loading]);

//     return axiosInstance;
// };

// export default useAxiosSecure