export interface Item {
  id: number;
  title: string;
  image: string;
}

export interface Section {
  title: string;
  items: Item[];
  table: string;
}
