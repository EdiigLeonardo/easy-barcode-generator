"use client";
import { useState, useEffect } from "react";
import JsBarcode from "jsbarcode";
import { Box, Paper, TextareaAutosize, Button, Divider } from "@mui/material";
import { BarcodeTable } from "@/components/BarcodeTable";
import { BarcodeRow } from "@/app/types";

export default function BatchBarcodeGenerator() {
  const [rows, setRows] = useState<BarcodeRow[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [inputList, setInputList] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const processList = () => {
    interface InputStop {
      volumeCode: string;
      [key: string]: unknown;
    }

    JSON.parse(inputList)?.forEach((stops: InputStop) => {
      const volumeCode = stops?.volumeCode;
      if (volumeCode) {
        generateBarcode(volumeCode, Math.floor(Math.random() * 1000000));
      } else {
        alert(
          "Erro: O volumeCode está ausente ou os dados estão em formato inválido. Verifique o JSON inserido."
        );
        console.error(
          "processList: volumeCode ausente ou dados inválidos para o item:",
          stops
        );
      }
    });
  };

  const generateBarcode = (value: string, rowId: number) => {
    console.info(`Generating barcode for value: ${value}, rowId: ${rowId}`);
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
      setRows((prevRows) => [
        ...prevRows,
        {
          id: Math.floor(Math.random() * 1000000),
          inputValue: value,
          barcodeData: dataUrl,
        },
      ]);
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
    <Box
      sx={{
        p: 3,
        maxWidth: 800,
        mx: "auto",
      }}
    >
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <TextareaAutosize
          minRows={3}
          placeholder="Insira os valores separados por linha"
          value={inputList}
          onChange={(e) => setInputList(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
          }}
        />
        <Button
          variant="contained"
          onClick={processList}
          sx={{ mt: 2 }}
          disabled={!inputList.trim()}
        >
          Gerar Barcodes
        </Button>
      </Paper>
      <Divider />
      <Paper elevation={3}>
        <BarcodeTable
          rows={rows}
          onInputChange={handleInputChange}
          onGenerate={generateBarcode}
          onReset={() => setRows([])}
        />
      </Paper>
    </Box>
  );
}
