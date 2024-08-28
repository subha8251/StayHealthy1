import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Col, Row } from "antd";
import Doctor from "../components/Doctor";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { SearchOutlined } from "@ant-design/icons";

function Home() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/user/get-all-approved-doctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setDoctors(response.data.data);
        setFilteredDoctors(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSearch = (value) => {
    const filtered = doctors.filter((doctor) => {
      const name = doctor.firstName?.toLowerCase() || "";
      const specialization = doctor.specialization?.toLowerCase() || "";
  
      return (
        name.includes(value.toLowerCase()) ||
        specialization.includes(value.toLowerCase())
      );
    });
    setFilteredDoctors(filtered);
  };

  return (
    <Layout>
      <div style={{ margin: "30px" }}>
        <div
          style={{
            display: "flex",
            width: "40%",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            border: "1px solid #dcdcdc",
            paddingLeft: "12px",
            borderRadius: "50px",
            alignItems: "center",
            gap: "10px",
            margin: "0 auto",
          }}
        >
          <input
            type="text"
            placeholder="Search using name or specialization"
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              outline: "none",
              border: "none",
              width: "100%",
              padding: "10px",
            }}
          />
          <button
            style={{
              borderRadius: "50px",
              backgroundColor: "#6A38C2",
              padding: "8px 12px",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <SearchOutlined style={{ fontSize: "16px" }} />
          </button>
        </div>
      </div>
      <Row gutter={20}>
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <Col key={doctor._id} span={8} xs={24} sm={24} lg={8}>
              <Doctor doctor={doctor} />
            </Col>
          ))
        ) : (
          <Col span={24}>
            <div>No doctors found</div>
          </Col>
        )}
      </Row>
    </Layout>
  );
}

export default Home;
