import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import moment from "moment";

const renderTransactionDate = (transaction) =>
  transaction?.date ? moment(transaction.date).format("DD/MM/YYYY HH:mm") : "—";

const TransactionsTable = ({ transactions }) => {
  return (
    <div className="card">
      <DataTable
        value={transactions}
        paginator
        rows={5}
        stripedRows
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: "50rem" }}
        rowHover
      >
        <Column
          field="type"
          header="Transaction Type"
          sortable
          style={{ flex: 1 }}
        ></Column>
        <Column
          header="Transaction Time"
          sortable
          style={{ width: 200 }}
          body={renderTransactionDate}
        ></Column>

        <Column
          field="cost"
          header="Credits Cost"
          sortable
          style={{ width: 150 }}
        ></Column>
        <Column
          field="remainingBalance"
          header="Credits Remaining"
          sortable
          style={{ width: 150 }}
        ></Column>
      </DataTable>
    </div>
  );
};

export default TransactionsTable;
