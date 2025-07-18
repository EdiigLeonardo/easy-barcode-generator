export interface BarcodeRow {
  id: number | string;
  inputValue: string;
  barcodeData: string | null;
  clientName?: string;
}

export const initialRows: BarcodeRow[] = [
  {
    id: Math.floor(Math.random() * 1000000),
    inputValue: "",
    barcodeData: null,
  },
];
