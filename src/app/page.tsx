"use client";
import { useState, useEffect } from "react";
import JsBarcode from "jsbarcode";
import { Box, Paper } from "@mui/material";
import { BarcodeTable } from "@/components/BarcodeTable";
import { initialRows, BarcodeRow } from "@/app/types";

export default function InterleavedBarcodeGenerator() {
  const [rows, setRows] = useState<BarcodeRow[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
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
    <Box sx={{ p: 3, maxWidth: 900, mx: "auto" }}>
      <Paper elevation={3}>
        <BarcodeTable
          rows={rows}
          onInputChange={handleInputChange}
          onGenerate={generateBarcode}
          onReset={() => setRows(initialRows)}
        />
      </Paper>
    </Box>
  );
}
