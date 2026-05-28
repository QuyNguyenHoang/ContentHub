import { useState, type Dispatch, type SetStateAction } from "react";
import {
  BsArrowDown,
  BsArrowUp,
  BsCalendar,
  BsEye,
  BsNewspaper,
  BsPerson,
  BsPostcard,
} from "react-icons/bs";
import { TimeRange } from "../../api/content/analytic.api";

interface Props {
  setTotalPostFilter: Dispatch<SetStateAction<TimeRange>>;
  totalPost: number;
  growth:number;
  previousTotalPost:number;
  totalPostFilter : TimeRange;
}
export const TIME_OPTIONS = [
  { label: "All time", value: TimeRange.All },
  { label: "Today", value: TimeRange.Today },
  { label: "Last 7 days", value: TimeRange.Last7Days },
  { label: "Last 30 days", value: TimeRange.Last30Days },
  { label: "Last 90 days", value: TimeRange.Last90Days },
  { label: "This month", value: TimeRange.ThisMonth },
  { label: "Last month", value: TimeRange.LastMonth },
  { label: "This year", value: TimeRange.ThisYear },
  { label: "Last year", value: TimeRange.LastYear },
] as const;
export default function HeaderKpiCard({
  setTotalPostFilter,
  totalPost,
  growth,
  totalPostFilter,
  previousTotalPost,
}: Props) {
  const growthRate = 12;
  return (
    <div>
      <div className="row m-0 pb-2">
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card rounded-3 shadow-lg d-flex flex-column p-3">
            <div className="d-flex justify-content-center align-items-center gap-2">
              <BsPostcard color="#06a2fc" width={32} height={32} />
              <h5 className="text-muted">Total Posts</h5>
            </div>
            <h4 className="fw-bold text-center">{totalPost}</h4>
            <div className="d-flex justify-content-center align-items-center gap-2">
              <div className="input-group" style={{ maxWidth: "200px" }}>
                <span className="input-group-text">
                  <BsCalendar />
                </span>
                <select
                  className="form-select-sm"
                  value={totalPostFilter}
                  onChange={(e) => setTotalPostFilter(e.target.value as TimeRange)}
                >
                  {TIME_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pe-4">
                <span
                  className={`d-flex align-items-center fw-bold small text-white rounded-2 ps-2 pe-2${
                    growth > 0 ? " bg-success" : " bg-danger"
                  }`}
                >
                  {growth > 0 ? <BsArrowUp /> : <BsArrowDown />}
                  {growth}%
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card rounded-3 shadow-lg d-flex flex-column p-3">
            <div className="d-flex justify-content-center align-items-center gap-2">
              <BsNewspaper color="#06a2fc" width={32} height={32} />
              <h5 className="text-muted">Total New Posts</h5>
            </div>
            <h4 className="fw-bold text-center">12</h4>
            <div className="d-flex justify-content-center align-items-center gap-2">
              <div className="input-group" style={{ maxWidth: "200px" }}>
                <span className="input-group-text">
                  <BsCalendar />
                </span>
                <select className="form-select-sm" >
                  {TIME_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pe-4">
                <span
                  className={`d-flex align-items-center fw-bold text-white rounded-2 ps-2 pe-2${
                    growthRate > 12 ? " bg-success" : " bg-danger"
                  }`}
                >
                  {growthRate > 12 ? <BsArrowUp /> : <BsArrowDown />}
                  {growthRate}%
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card rounded-3 shadow-lg d-flex flex-column p-3">
            <div className="d-flex justify-content-center align-items-center gap-2">
              <BsEye color="#06a2fc" width={32} height={32} />
              <h5 className="text-muted">Total Views</h5>
            </div>
            <h4 className="fw-bold text-center">12</h4>
            <div className="d-flex justify-content-center align-items-center gap-2">
              <div className="input-group" style={{ maxWidth: "200px" }}>
                <span className="input-group-text">
                  <BsCalendar />
                </span>
                <select className="form-select-sm" >
                  {TIME_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pe-4">
                <span
                  className={`d-flex align-items-center fw-bold text-white rounded-2 ps-2 pe-2${
                    growthRate > 12 ? " bg-success" : " bg-danger"
                  }`}
                >
                  {growthRate > 12 ? <BsArrowUp /> : <BsArrowDown />}
                  {growthRate}%
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card rounded-3 shadow-lg d-flex flex-column p-3">
            <div className="d-flex justify-content-center align-items-center gap-2">
              <BsPerson color="#06a2fc" width={32} height={32} />
              <h5 className="text-muted">Total User Active</h5>
            </div>
            <h4 className="fw-bold text-center">12</h4>
            <div className="d-flex justify-content-center align-items-center gap-2">
              <div className="input-group" style={{ maxWidth: "200px" }}>
                <span className="input-group-text">
                  <BsCalendar />
                </span>
                <select className="form-select-sm" >
                  {TIME_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pe-4">
                <span
                  className={`d-flex align-items-center fw-bold text-white rounded-2 ps-2 pe-2${
                    growthRate > 12 ? " bg-success" : " bg-danger"
                  }`}
                >
                  {growthRate > 12 ? <BsArrowUp /> : <BsArrowDown />}
                  {growthRate}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
