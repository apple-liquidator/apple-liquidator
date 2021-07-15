import React from "react";

import ReactTable from "react-table";
import AccountsTableHeader from "../AccountsTableHeader/AccountsTableHeader.js";

import "react-table/react-table.css";

import "./AccountsTable.css";

let app;

function InspectAddress(address, state) {
  app.setState({
    inspected_address: address,
    inspected_address_state: state,
  });
}

function AccountsTable(props) {
  app = props.app;

  const data = [];

  props.accounts.forEach((account) => {
    var supplyAmount = (account.totalEthSupply / 10 ** 18).toFixed(6);
    var borrowAmount = (account.totalEthBorrow / 10 ** 18).toFixed(6);

    var state = "";
    var health = account.health;
    // if (health < 1) {
    //   state = "unsafe";
    // } else if (health <= 1.05) {
    //   state = "risky";
    // } else {
    //   state = "safe";
    // }
    if (borrowAmount > 0) {
      state = "unsafe";
    } else if (supplyAmount <= 100) {
      state = "risky";
    } else {
      state = "safe";
    }

    var accountObj = {
      address: account.address,
      supply: Number(supplyAmount),
      borrow: Number(borrowAmount),
      health: account.health,
      state: state,
      block: Number(account.blockUpdated),
    };
    data.push(accountObj);
  });

  var etherScanPrefix = app.state.ETHERSCAN_PREFIX;

  const columns = [
    {
      Header: "Address",
      accessor: "address",
      maxWidth: 500,
      Cell: (row) => (
        <a
          href={etherScanPrefix + "address/" + row.value}
          target="_blank"
          rel="noopener noreferrer"
        >
          {row.value}
        </a>
      ),
    },
    {
      Header: "Last Updated",
      accessor: "block",
      maxWidth: 200,
      className: "right",
      Cell: (row) => (
        <a
          href={etherScanPrefix + "block/" + row.value}
          target="_blank"
          rel="noopener noreferrer"
        >
          {row.value}
        </a>
      ),
    },
    {
      Header: "Liquidity",
      accessor: "supply",
      maxWidth: 150,
      className: "right",
    },
    {
      Header: "Shortfall",
      accessor: "borrow",
      maxWidth: 150,
      className: "right",
    },
    {
      Header: "Health",
      accessor: "health",
      maxWidth: 150,
      className: "right",
    },
    {
      Header: "State",
      accessor: "state",
      maxWidth: 200,
      Cell: (row) => (
        <span>
          <span
            style={{
              color:
                row.value === "safe"
                  ? "#57d500"
                  : row.value === "risky"
                  ? "#ffbf00"
                  : "#ff2e00",

              transition: "all .3s ease",
            }}
          >
            &#x25cf;
          </span>{" "}
          {row.value === "safe"
            ? "Safe"
            : row.value === "risky"
            ? "Risky"
            : "Unsafe"}
        </span>
      ),
    },
    {
      Header: "",
      accessor: "liquidate",
      maxWidth: 200,
      Cell: (row) => (
        <button
          className="InspectButton"
          onClick={() => InspectAddress(row.row.address, row.original.state)}
        >
          Inspect
        </button>
      ),
    },
  ];

  var showPageSizeOptions = false;
  var defaultPageSize = 15;

  // var minRows = defaultPageSize;

  return (
    <div className="AccountsTable">
      <AccountsTableHeader currentBlock={props.currentBlock} app={app} />
      <br />

      <ReactTable
        data={data}
        columns={columns}
        defaultPageSize={defaultPageSize}
        showPageSizeOptions={showPageSizeOptions}
        className="-striped"
      />
      <p>
        <a
          href="https://github.com/apple-liquidator/apple-liquidator"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </a>{" "}
        |{" "}
        <a
          href="https://github.com/apple-liquidator/apple-liquidator/blob/master/README.md"
          target="_blank"
          rel="noopener noreferrer"
        >
          README (mini-guide)
        </a>{" "}
        |{" "}
        <a
          href="https://www.applefinance.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Apple Finance
        </a>{" "}
        |{" "}
        <a
          href="https://apple-finance.gitbook.io/applefinance-doc"
          target="_blank"
          rel="noopener noreferrer"
        >
          Documentation
        </a>{" "}
        | Use at your own{" "}
        <b>
          <font color="red">risk!</font>
        </b>
      </p>
    </div>
  );
}

export default AccountsTable;
