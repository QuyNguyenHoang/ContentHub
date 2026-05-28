import { useEffect, useMemo, useState } from "react";

import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCol,
  CProgress,
  CRow,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";
import {
  cibCcMastercard,
  cibCcVisa,
  cilCloudDownload,
  cifBr,
  cifUs,
} from "@coreui/icons";

import MainChart from "./MainChart";

import TopUser from "./TopUser";

const Dashboard = () => {
  // ===== Progress cards =====
  const progressExample = useMemo(
    () => [
      { title: "Visits", value: "29.703 Users", percent: 40, color: "success" },
      { title: "Unique", value: "24.093 Users", percent: 20, color: "info" },
      {
        title: "Pageviews",
        value: "78.706 Views",
        percent: 60,
        color: "warning",
      },
      {
        title: "New Users",
        value: "22.123 Users",
        percent: 80,
        color: "danger",
      },
      {
        title: "Bounce Rate",
        value: "Average Rate",
        percent: 40.15,
        color: "primary",
      },
    ],
    [],
  );

  // ===== Table data =====
  const tableExample = useMemo(
    () => [
      {
        user: { name: "John Doe", registered: "Jan 1, 2025" },
        country: { flag: cifUs },
        usage: { value: 50 },
        payment: { icon: cibCcVisa },
        activity: "10 sec ago",
      },
      {
        user: { name: "Maria Silva", registered: "Dec 12, 2024" },
        country: { flag: cifBr },
        usage: { value: 72 },
        payment: { icon: cibCcMastercard },
        activity: "1 hour ago",
      },
    ],
    [],
  );

  return (
    <>
      {/* ===== Traffic Chart ===== */}
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 className="card-title mb-0">Traffic</h4>
              <div className="small text-body-secondary">
                January – July 2025
              </div>
            </CCol>

            <CCol sm={7} className="d-none d-md-block">
              <CButton color="primary" className="float-end">
                <CIcon icon={cilCloudDownload} />
              </CButton>

              <CButtonGroup className="float-end me-3">
                {["Day", "Month", "Year"].map((value) => (
                  <CButton
                    key={value}
                    color="outline-secondary"
                    active={value === "Month"}
                  >
                    {value}
                  </CButton>
                ))}
              </CButtonGroup>
            </CCol>
          </CRow>

          <MainChart />
        </CCardBody>

        <CCardFooter>
          <CRow className="text-center">
            {progressExample.map((item, index) => (
              <CCol
                key={index}
                className={
                  index + 1 === progressExample.length
                    ? "d-none d-xl-block"
                    : ""
                }
              >
                <div className="text-body-secondary">{item.title}</div>
                <div className="fw-semibold">
                  {item.value} ({item.percent}%)
                </div>
                <CProgress thin color={item.color} value={item.percent} />
              </CCol>
            ))}
          </CRow>
        </CCardFooter>
      </CCard>
    </>
  );
};

export default Dashboard;
