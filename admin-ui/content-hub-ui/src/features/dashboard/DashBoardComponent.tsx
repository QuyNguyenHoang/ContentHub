import { useEffect, useState } from "react";
import type { UserDto } from "../../api/system/user.api";
import analyticApi, { TimeRange } from "../../api/content/analytic.api";
import TopUser from "../../pages/dashboard/TopUser";
import DashBoard from "../../pages/dashboard/DashBoard";
import HeaderKpiCard from "../../pages/dashboard/HeaderKpiCard";

export default function DashBoardComponent() {
  //Top user

  const [topUser, setTopUser] = useState<UserDto[]>([]);
  //Total posts

  const [totalPostFilter,setTotalPostFilter] = useState<TimeRange>(TimeRange.All);
  const [growth, setGrowth] = useState(0);
  const [totalPost, setTotalPost] = useState(0);
  const loadTotalPostCount = async () => {
    try {
      setLoading(true);
      const res = await analyticApi.getTotalPosts(totalPostFilter);
      const data = res.data
      setTotalPost(data.totalPost);
      setGrowth(data.growth);
      console.log(totalPost);
    } catch (error) {
      console.error("Load total posts failed:", error);
      return 0;
    }
    finally{
      setLoading(false);
    }
  };
  useEffect(()=>{
    loadTotalPostCount();
  },[totalPostFilter])
  //total user
  const [totalUser, setTotalUser] = useState(0);
    const [growthUser, setGrowthUser] = useState(0);
  const [totalUserFilter,setTotalUserFilter] = useState<TimeRange>(TimeRange.All);
    const loadTotalUserCount = async () => {
    try {
      setLoading(true);
      const res = await analyticApi.getTotalUsers(totalUserFilter);
      const data = res.data
      setTotalUser(data.totalUser);
      setGrowthUser(data.growth);
      console.log(totalUser);
    } catch (error) {
      console.error("Load total user failed:", error);
      return 0;
    }
    finally{
      setLoading(false);
    }
  };
  useEffect(()=>{
    loadTotalUserCount();
  },[totalUserFilter])
  const [loading, setLoading] = useState(false);
  const loadTopUser = async () => {
    try {
      setLoading(true);
      const res = await analyticApi.getTopUserByPost();
      const data = res.data;
      setTopUser(data);
    } catch (error) {
      console.log(error, "Load top user faild!!!");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadTopUser();
  }, []);
  if (loading)
    return <div className="spinner-border text-primary text-center"></div>;
  return (
    <>
      {/* Kpi Card */}
      <HeaderKpiCard
        totalPost={totalPost}
        growth={growth}
        totalPostFilter={totalPostFilter}
        setTotalPostFilter={setTotalPostFilter}
        //Total user
        totalUser={totalUser}
        growthUser={growthUser}
        totalUserFilter={totalUserFilter}
        setTotalUserFilter={setTotalUserFilter}
      />
      {/* Main chart */}
      <DashBoard />
      {/* ===== Users Table ===== */}
      <TopUser topUser={topUser} />
    </>
  );
}
