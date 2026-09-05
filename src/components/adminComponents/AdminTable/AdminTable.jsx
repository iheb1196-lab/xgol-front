import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";


export default function AdminTable({ users }) {
  const secondsToMinutesAndSeconds = (rowData) => {
    const minutes = Math.floor(rowData.totalDurationEvaluatedVideos / 60);
    const remainingSeconds = rowData.totalDurationEvaluatedVideos % 60;
    return `${minutes} Min , ${remainingSeconds.toFixed(0)} Sec`;
  };

    
  return (
    <div className="card">
      <DataTable
        value={users}
        paginator
        rows={5}
        stripedRows
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: "50rem" }}
        rowHover
      >
        <Column
          field="userName"
          header="Name"
          sortable
          style={{ width: "25%" }}
        ></Column>

        <Column
          field="email"
          header="Email address"
          sortable
          style={{ width: "25%" }}
        ></Column>
         <Column
          field="active"
          header="Active"
          sortable
          style={{ width: "25%" }}
        ></Column>

        <Column
          field="totalDurationEvaluatedVideos"
          header="Time spent"
          sortable
          style={{ width: "25%" }}
          body={secondsToMinutesAndSeconds}
        ></Column>
        <Column
          field="evaluatedVideosCount"
          header="Expert review"
          style={{ width: "25%" }}
          sortable
        ></Column>
      </DataTable>
    </div>
  );
}
