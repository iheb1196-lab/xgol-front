import RouterLink from "../../../routes/components/router-link";
import React, { useEffect, useState } from "react";
import { Breadcrumbs, Typography, Box } from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../components/Loader";
import StatCard from "../../../components/adminComponents/StatCard";
import { getCorporateLicensesAdmin } from "../../../features/admin/adminSlice";
import { useRouter } from "../../../routes/hooks";

const LicensesView = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { response, loading } = useSelector((state) => state.admin);
  useEffect(() => {
    dispatch(getCorporateLicensesAdmin());
  }, []);
  const breadcrumbs = [
    <RouterLink href="/" className="link" key="1">
      <img src="/assets/icons/breadcrumbs/home.svg" alt="" />
    </RouterLink>,
    <Typography key="2" color="text.primary" className="active_breadcrumb">
      Admin Licenses
    </Typography>,
  ];

  if (loading ) {
    return (
   
        <div className="view-container admin_dashboard">
      <div className="view_header">
        <Breadcrumbs separator=">" aria-label="breadcrumb">
          {breadcrumbs}
        </Breadcrumbs>
        <div className="second_header">
          <div>
            <h2>Admin Licenses</h2>
          </div>
        </div>
      </div>
        <Loader style={{ marginTop: 20 }} />
      </div>
    );
  }
if(response && response.licenses) {


  return (
    <div className="view-container admin_dashboard">
      <div className="view_header">
        <Breadcrumbs separator=">" aria-label="breadcrumb">
          {breadcrumbs}
        </Breadcrumbs>
        <div className="second_header">
          <div>
            <h2>Admin Licenses</h2>
          </div>
        </div>
      </div>
    
          <Box
            display={"flex"}
            flexDirection={"column"}
            gap={3}
            overflow={"auto"}
          >
            {response.licenses.map((el) => (
              <StatCard key={el._id} icon={"users"} stat={el.name} onClick={()=>router.push(`${el._id}`)}/>
            ))}
          </Box>
        
      
    </div>
  );}
};

export default LicensesView;
