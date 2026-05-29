import { useCallback, useState } from "react";
import type { UserDto } from "../../api/system/user.api";

interface Props {}

export default function UserManagement({}: Props) {
  const [user, setUser] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;
  const [filter, setFilter] = useState("");
  const [keyword, setKeyWord] = useState("");
  const loadUser = useCallback(async () => {
    try{
            setLoading(true);
            const res = await
        }
        catch(error)
        {
            console.log(error,"load user failed!!!")
        }
  },
  []);  
}
