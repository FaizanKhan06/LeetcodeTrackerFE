export interface CheatSheet {
  _id: string
  title: string;
  type: "note" | "snippet";
  content: string;
  favourite: boolean;
}