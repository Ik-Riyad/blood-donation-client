import { useEffect, useState } from "react";
import useAxios from "./useAxios";

export default function useRole() {
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxios();

  useEffect(() => {
    axiosSecure("/get-user-role").then((res) => {
      
      setRole(res.data.role);
      setStatus(res.data.status);
      setLoading(false);
    });
  });
  return { role,status, loading };
}