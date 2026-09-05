import "./mySpeeches.scss";
import React, { useEffect, useState } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import RouterLink from "../../../routes/components/router-link";
import ButtonLink from "../../../components/buttonLink";
import SpeechesTable from "../../../components/speech/SpeechesTable";
import { useDispatch, useSelector } from "react-redux";
import { getSpeeches } from "../../../features/speech/speechSlice";
import _ from "lodash";
import moment from "moment";

const MySpeechesView = () => {
  const { loading, speeches } = useSelector((state) => state.speech);

  const [speechesView, setSpeechesDataView] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSpeeches());
  }, [dispatch]);

  useEffect(() => {
    setSpeechesDataView(
      _.map(speeches ?? [], (it) => ({
        ...it,
        createdAt: moment(it?.createdAt).format("DD/MM/yyyy HH:mm:ss"),
      }))
    );
  }, [speeches]);

  const breadcrumbs = [
    <RouterLink href="/" className="link" key="1">
      <img src="/assets/icons/breadcrumbs/home.svg" alt="" />
    </RouterLink>,
      <RouterLink key="2" href="/my_speeches" className="link">
      Public Speaking
    </RouterLink>,
    <Typography key="2" color="text.primary" className="active_breadcrumb">
    My Speeches
  </Typography>,
  ];
  return (
    <div className="view-container my_speeches">
      <div className="view_header">
        <Breadcrumbs separator=">" aria-label="breadcrumb">
          {breadcrumbs}
        </Breadcrumbs>
        <div className="second_header">
          <div>
            <h2>My speeches</h2>
            <p>Practice your speeches or create a new one</p>
          </div>
          <ButtonLink
            text={"+ Create Speech"}
            primary
            path={"write_speech"}
            className="_speechCreateButton"
          />
        </div>
      </div>
      <div className="my_speeches_body">
        {speeches?.length === 0 ? (
          <div className="no_speeches">
            <img src="\assets\icons\noSpeech.svg" alt="" />
            <h3>No speeches found</h3>
            <p>
              Ready to craft your speeches? Click on <br /> Create Speech!
            </p>
          </div>
        ) : (
          <SpeechesTable speeches={speechesView} loading={loading} />
        )}
      </div>
    </div>
  );
};

export default MySpeechesView;
