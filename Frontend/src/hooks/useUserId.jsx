import { useParams } from "react-router-dom";

export default function useUserId() {
  const { id } = useParams();
  return id || localStorage.getItem("userId");
}
