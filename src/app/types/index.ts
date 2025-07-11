export interface BarcodeRow {
  id: number;
  inputValue: string;
  barcodeData: string | null;
}

export const initialRows: BarcodeRow[] = [
  {
    id: Math.floor(Math.random() * 1000000),
    inputValue: "",
    barcodeData: null,
  },
];
