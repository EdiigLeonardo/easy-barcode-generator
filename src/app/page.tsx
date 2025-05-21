"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import JsBarcode from "jsbarcode";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Button,
  Paper,
  Box,
  Divider,
} from "@mui/material";

interface BarcodeRow {
  id: number;
  inputValue: string;
  barcodeData: string | null;
}

const initialRows: BarcodeRow[] = [
  {
    id: Math.floor(Math.random() * 1000000),
    inputValue: "",
    barcodeData: null,
  },
];

export default function InterleavedBarcodeGenerator() {
  const [rows, setRows] = useState<BarcodeRow[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Garantir que o código só execute no cliente
  useEffect(() => {
    setIsMounted(true);
    // Inicializar com uma linha vazia apenas no cliente
    if (rows.length === 0) {
      setRows(initialRows);
    }
  }, []);

  const generateBarcode = (value: string, rowId: number) => {
    if (!value.trim() || !isMounted) return;

    const canvas = document.createElement("canvas");

    try {
      JsBarcode(canvas, value, {
        format: "CODE128",
        displayValue: true,
        fontSize: 12,
        margin: 10,
        height: 40,
        width: 2,
      });

      const dataUrl = canvas.toDataURL("image/png");

      setRows((prev) => {
        const newRows = prev.map((row) =>
          row.id === rowId ? { ...row, barcodeData: dataUrl } : row
        );

        return [
          ...newRows,
          {
            id: Math.floor(Math.random() * 1000000),
            inputValue: "",
            barcodeData: null,
          },
        ];
      });
    } catch (error) {
      console.error("Erro ao gerar código de barras:", error);
    }
  };

  const handleInputChange = (rowId: number, value: string) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === rowId ? { ...row, inputValue: value } : row
      )
    );
  };

  if (!isMounted) return null;

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Paper elevation={3}>
        <Table style={{ tableLayout: "fixed", maxHeight: "80%" }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell width="40%">Valor de Entrada</TableCell>
              <TableCell width="40%" align="center">
                Código de Barras
              </TableCell>
              <TableCell width="20%" align="center">
                Ação
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                style={{
                  maxHeight: "1rem",
                }}
              >
                <TableCell align="center">
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={row.inputValue}
                    disabled={row.barcodeData !== null}
                    onChange={(e) => handleInputChange(row.id, e.target.value)}
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
                        height={60}
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

                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => generateBarcode(row.inputValue, row.id)}
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
          <Button
            variant="outlined"
            onClick={() => setRows(initialRows)}
            sx={{ m: 2 }}
          >
            Limpar Formulário
          </Button>
        </div>
      </Paper>
    </Box>
  );
}
