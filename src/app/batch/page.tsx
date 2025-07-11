"use client";
import { useState, useEffect } from "react";
import JsBarcode from "jsbarcode";
import { Box, Paper, TextareaAutosize, Button } from "@mui/material";
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
    console.log("[screen][batch]Processed input values:", {
      inputList: inputList.split("\n"),
    });
    // const values = inputList
    //   .split("\n")
    //   .map((v) => v.trim())
    //   .filter((v) => v.length > 0);

    // const newRows = values.map((value) => ({
    //   id: Math.floor(Math.random() * 1000000),
    //   inputValue: value,
    //   barcodeData: null,
    // }));

    // setRows(newRows);
  };

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

      setRows((prev) =>
        prev.map((row) =>
          row.id === rowId ? { ...row, barcodeData: dataUrl } : row
        )
      );
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
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <TextareaAutosize
          minRows={3}
          placeholder="Insira os valores separados por linha"
          value={inputList}
          onChange={(e) => setInputList(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />
        <Button
          variant="contained"
          onClick={processList}
          sx={{ mt: 2 }}
          disabled={!inputList.trim()}
        >
          Processar Lista
        </Button>
      </Paper>

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
