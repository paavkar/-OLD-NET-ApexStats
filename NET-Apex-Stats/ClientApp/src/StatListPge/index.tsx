import React from "react";
import axios from "axios";
import { Box, Table, Button, TableHead, Typography } from "@mui/material";

import { EntryFormValues } from "../AddEntryModal/AddEntryForm";
import AddEntryModal from "../AddEntryModal";
import { Entry } from "../types";
import { apiBaseUrl } from "../constants";
import { useStateValue } from "../state";
import { TableCell } from "@mui/material";
import { TableRow } from "@mui/material";
import { TableBody } from "@mui/material";


const StatListPage = () => {
  const [{ entries, user }, dispatch] = useStateValue();

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      const { data: newEntry } = await axios.post<Entry>(
        `${apiBaseUrl}/br`,
        values, { headers: { Authorization: `bearer ${user.token}` },}
      );
      dispatch({ type: "ADD_ENTRY", payload: newEntry });
      closeModal();
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.error(e?.response?.data || "Unrecognized axios error");
        setError(String(e?.response?.data?.error) || "Unrecognized axios error");
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

  return (
    <div className="App">
      <Box>
        <Typography align="center" variant="h6">
          Entry list
        </Typography>
      </Box>
      <Table style={{ marginBottom: "1em" }}>
        <TableHead>
          <TableRow>
            <TableCell>Season</TableCell>
            <TableCell>Games Played</TableCell>
            <TableCell>Wins</TableCell>
            <TableCell>Kills</TableCell>
            <TableCell>KD/R</TableCell>
            <TableCell>Average Damage</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.values(entries).map((entry: Entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.season}</TableCell>
              <TableCell>{entry.games}</TableCell>
              <TableCell>{entry.wins}</TableCell>
              <TableCell>{entry.kills}</TableCell>
              <TableCell>{entry.kdr}</TableCell>
              <TableCell>{entry.avgDamage}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />
      <Button variant="contained" onClick={() => openModal()}>
        Add New Entry
      </Button>
    </div>
  );
};


export default StatListPage;