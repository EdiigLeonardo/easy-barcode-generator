"use client";
import { BarcodeRow } from "@/app/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import Image from "next/image";

interface BarcodeTableProps {
  rows: BarcodeRow[];
  onInputChange: (rowId: number, value: string) => void;
  onGenerate: (value: string, rowId: number) => void;
  onReset: () => void;
}

export function BarcodeTable({
  rows,
  onInputChange,
  onGenerate,
  onReset,
}: BarcodeTableProps) {
  return (
    <>
      <Table
        style={{ tableLayout: "auto", maxHeight: "80%", maxWidth: "100%" }}
      >
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell width="30%">Valor de Entrada</TableCell>
            <TableCell width="30%" align="center">
              Código de Barras
            </TableCell>
            <TableCell width="auto" align="center">
              Nome do Cliente
            </TableCell>
            <TableCell width="auto" align="center">
              Ação
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} style={{ maxHeight: "1rem" }}>
              <TableCell align="center">
                <TextField
                  fullWidth
                  variant="outlined"
                  value={row.inputValue}
                  disabled={row.barcodeData !== null}
                  onChange={(e) =>
                    onInputChange(row.id as number, e.target.value)
                  }
                  placeholder="Digite valores numéricos"
                  inputProps={{
                    pattern: "^[0-9]*$",
                    maxLength: 20,
                  }}
                />
              </TableCell>

              <TableCell align="center">
                {row.barcodeData && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                      padding: "10px",
                    }}
                  >
                    <Image
                      src={row.barcodeData}
                      alt={`Código de barras para ${row.inputValue}`}
                      width={200}
                      height={100}
                      style={{
                        display: "flex",
                        objectFit: "contain",
                        maxWidth: "100%",
                        justifyContent: "center",
                        justifySelf: "center",
                        alignSelf: "center",
                        height: "auto",
                        padding: "1rem",
                      }}
                    />
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div>{row.clientName}</div>
              </TableCell>

              <TableCell align="center">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => onGenerate(row.inputValue, row.id as number)}
                  disabled={
                    row.inputValue?.trim() === "" || row.barcodeData !== null
                  }
                  sx={{ textTransform: "none" }}
                >
                  Gerar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Divider />
      <div style={{ padding: "16px", maxHeight: "10%" }}>
        <Button variant="outlined" onClick={onReset} sx={{ m: 2 }}>
          Limpar Formulário
        </Button>
      </div>
    </>
  );
}
