import { useCallback, useEffect, useState } from "react"
import {postApi, type PostResponse} from "./../../api/content/post.api"
import PostTable from "../../pages/content/PostUI/PostTable";
export default function PostManagement() {
    const [post, setPost] = useState<PostResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPagesize] = useState(5);
    const filter = "";

    const loadPosts = useCallback(async ()=> {
        try{
            setLoading(true)
            const res = await postApi.getPostByAdmin(keyword, filter, page, pageSize, true);
            const data = res.data.results || [];
            console.log("fetch data successful!")
            setPost(data);    
            
        }
        catch(erorr)
        {
            console.log("Fetch post faild", erorr)
        }
        finally{
            setLoading(false);
        }
    },[keyword, page, pageSize, filter]);
    useEffect(()=>{
        loadPosts();
    },[keyword, filter, page, pageSize]);
    return (
        <div className="container">
            <PostTable
            post = {post}
            />
        </div>
    )
    

}